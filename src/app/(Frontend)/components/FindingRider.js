"use client";
import React, { useState, useEffect } from "react";
import MapComponent from "@/app/(Frontend)/components/MapComponent";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

const FindingRider = ({ isOpen, rideId, sourceCoords, destinationCoords, sourceName, destinationName, vehicleType, onClose, onRetry }) => {
    const [dots, setDots] = useState("");
    const [status, setStatus] = useState("PENDING");
    const [offers, setOffers] = useState([]);
    const [counterPrice, setCounterPrice] = useState("");
    const [isExpired, setIsExpired] = useState(false);
    const [negotiatingOfferId, setNegotiatingOfferId] = useState(null);
    const [sentCounters, setSentCounters] = useState(new Set());
    const { data: session } = useSession();

    const [riderId, setRiderId] = useState(null);
    const [riderLocation, setRiderLocation] = useState(null);
    const [riderDetails, setRiderDetails] = useState(null);
    const [lastLocationReceived, setLastLocationReceived] = useState(null);
    const [routePath, setRoutePath] = useState([]);

    // Calculate Route based on status (Rider -> Pickup OR Rider -> Dropoff)
    useEffect(() => {
        if (!riderLocation || !status) return;
        if (status !== 'ACCEPTED' && status !== 'IN_PROGRESS') return;

        const targetLat = status === 'ACCEPTED' ? sourceCoords.lat : destinationCoords.lat;
        const targetLng = status === 'ACCEPTED' ? sourceCoords.lng : destinationCoords.lng;

        const fetchRoute = async () => {
            try {
                const response = await fetch(
                    `https://router.project-osrm.org/route/v1/driving/${riderLocation.lng},${riderLocation.lat};${targetLng},${targetLat}?overview=full&geometries=geojson`
                );
                const data = await response.json();
                if (data.routes && data.routes.length > 0) {
                    const coords = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
                    setRoutePath(coords);
                }
            } catch (error) {
                console.error("Route fetch error:", error);
            }
        };

        // Fetch route initially and maybe on significant movement? 
        // For now, let's just fetch when riderLocation updates (throttled by effect)
        fetchRoute();
    }, [riderLocation, status, sourceCoords, destinationCoords]);

    // Reset state when rideId changes or modal opens
    useEffect(() => {
        if (rideId) {
            setStatus("PENDING");
            setIsExpired(false);
            setOffers([]);
            setSentCounters(new Set());
            setNegotiatingOfferId(null);
            setCounterPrice("");
            setRiderId(null);
            setRiderLocation(null);
            setRiderDetails(null);
        }
    }, [rideId, isOpen]);

    // Animated dots effect
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    // Polling for ride status AND OFFERS AND LOCATION
    useEffect(() => {
        if (!isOpen || !rideId) return;

        console.log(`Starting poll for Ride ID: ${rideId}`);

        const pollInterval = setInterval(async () => {
            try {
                // 1. Check Status
                const statusRes = await fetch(`/api/rides/status/${rideId}`);
                if (statusRes.ok) {
                    const statusData = await statusRes.json();

                    // Update Status Check
                    if (statusData.status !== status) {
                        console.log(`Status changed: ${status} -> ${statusData.status}`);
                        setStatus(statusData.status);
                    }

                    let currentRiderId = riderId; // Default to state

                    // If rider is assigned, update state and local variable for immediate use
                    if (statusData.rider_id) {
                        if (statusData.rider_id !== riderId) {
                            console.log("Rider found/changed:", statusData.rider_id);
                            setRiderId(statusData.rider_id);
                        }
                        currentRiderId = statusData.rider_id;

                        // Save full rider details if present and not already set
                        if (statusData.FirstName) {
                            // Only update if something changed to avoid re-renders? 
                            // For simplicity, just setting it is fine as React handles equality check on objects poorly but we need the data.
                            setRiderDetails({
                                name: `${statusData.FirstName} ${statusData.LastName || ""}`,
                                phone: statusData.phoneNumber,
                                vehicle: statusData.vehicleType,
                                lat: statusData.current_lat,
                                lng: statusData.current_lng
                            });
                        }
                    }

                    // Check for expiration
                    if (statusData.status === 'PENDING') {
                        if (statusData.is_expired_now === 1) {
                            setIsExpired(true);
                            clearInterval(pollInterval);
                            return;
                        }
                    }

                    if (statusData.status === 'COMPLETED') {
                        setStatus('COMPLETED');
                        clearInterval(pollInterval);
                        return;
                    }

                    // 2. Poll Rider Location if Accepted/In Progress
                    // CRITICAL FIX: Use currentRiderId (from this poll cycle), not the stale state 'riderId'
                    if ((statusData.status === 'ACCEPTED' || statusData.status === 'IN_PROGRESS') && currentRiderId) {
                        try {
                            const locRes = await fetch(`/api/riders/location?riderId=${currentRiderId}`);
                            if (locRes.ok) {
                                const locData = await locRes.json();
                                if (locData.lat && locData.lng) {
                                    const newLat = parseFloat(locData.lat);
                                    const newLng = parseFloat(locData.lng);

                                    // Only update if valid numbers
                                    if (!isNaN(newLat) && !isNaN(newLng)) {
                                        setRiderLocation({ lat: newLat, lng: newLng });
                                        setLastLocationReceived(Date.now());
                                    }
                                }
                            }
                        } catch (e) {
                            console.error("Location poll error:", e);
                        }
                    }
                }

                // 3. Check Offers (Only if pending)
                if (status === 'PENDING' && !isExpired) {
                    const offersRes = await fetch(`/api/rides/offers/${rideId}`);
                    if (offersRes.ok) {
                        const offersData = await offersRes.json();
                        setOffers(offersData);

                        setSentCounters(prev => {
                            const newSet = new Set(prev);
                            offersData.forEach(offer => {
                                if (offer.counter_by === 'rider') {
                                    newSet.delete(offer.id);
                                }
                            });
                            return newSet;
                        });
                    }
                }

            } catch (error) {
                console.error("Polling error:", error);
            }
        }, 3000); // Check every 3 seconds

        return () => clearInterval(pollInterval);
    }, [isOpen, rideId, status, isExpired, riderId]);

    const handleAcceptOffer = async (riderId, price) => {
        try {
            // Calling the same accept API, but as a User
            const res = await fetch('/api/rides/accept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rideId,
                    riderId,
                    price // We agree to this price
                })
            });

            if (res.ok) {
                setStatus('ACCEPTED');
            } else {
                alert("Failed to accept offer. It might be gone.");
            }
        } catch (error) {
            console.error("Error accepting offer:", error);
        }
    };

    const handleUpdatePrice = async (offerId, price) => {
        if (!price) return;
        try {
            const res = await fetch('/api/rides/counter-offer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rideId,
                    offerId,
                    price: price,
                    userId: session?.user?.id
                })
            });

            if (res.ok) {
                // Counter offer sent successfully - mark it as sent
                setSentCounters(prev => new Set([...prev, offerId]));
                setCounterPrice("");
                setNegotiatingOfferId(null);
                // The offer will update in the next poll cycle
            } else {
                const err = await res.json();
                console.error("Counter offer error:", err);
            }
        } catch (error) {
            console.error("Error updating price:", error);
        }
    };

    if (!isOpen) return null;

    // ... (Coords calculation remains same)
    const centerLat = sourceCoords && destinationCoords
        ? (sourceCoords.lat + destinationCoords.lat) / 2
        : sourceCoords?.lat || 51.505;
    const centerLng = sourceCoords && destinationCoords
        ? (sourceCoords.lng + destinationCoords.lng) / 2
        : sourceCoords?.lng || -0.09;

    return (
        <div className="fixed inset-0 z-50 bg-white">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-6">
                <button
                    onClick={onClose}
                    className="text-white text-sm font-semibold hover:text-gray-200 transition-colors"
                >
                    ← Cancel
                </button>
            </div>

            {/* Map */}
            <div className="w-full h-full">
                <MapComponent
                    center={[centerLat, centerLng]}
                    zoom={12}
                    markerPosition={sourceCoords ? [sourceCoords.lat, sourceCoords.lng] : null}
                />
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-20 max-h-[60vh] overflow-hidden flex flex-col">

                {status === 'ACCEPTED' || status === 'IN_PROGRESS' ? (
                    <div className="flex-1 relative w-full h-full min-h-[50vh]">
                        <MapComponent
                            center={riderLocation ? [riderLocation.lat, riderLocation.lng] : [sourceCoords.lat, sourceCoords.lng]}
                            zoom={riderLocation ? 15 : 13}
                            markerPosition={status === 'ACCEPTED' ? [sourceCoords.lat, sourceCoords.lng] : [destinationCoords.lat, destinationCoords.lng]}
                            riderLocation={riderLocation || (riderDetails ? { lat: riderDetails.lat, lng: riderDetails.lng } : null)}
                            routePath={routePath}
                            markerType={status === 'ACCEPTED' ? 'pickup' : 'dropoff'}
                            vehicleType={riderDetails?.vehicle || vehicleType}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-white p-6 rounded-t-3xl shadow-lg z-20">
                            {/* Rider Info Card */}
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden border-2 border-green-500 shadow-md">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${riderDetails?.name || "Rider"}`}
                                        alt="Rider"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl font-bold text-gray-900">{riderDetails?.name || "Rider Found"}</h2>
                                    <p className="text-gray-500 text-sm font-medium">{riderDetails?.vehicle || "Vehicle"} • {status === 'IN_PROGRESS' ? 'Heading to Destination' : 'Coming to Pickup'}</p>
                                    <div className="flex items-center mt-1 space-x-2">
                                        <span className={`px-2 py-0.5 text-xs font-bold rounded-md ${status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                            {status === 'IN_PROGRESS' ? 'RIDE STARTED' : 'ON THE WAY'}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    {riderDetails?.phone && (
                                        <a
                                            href={`tel:${riderDetails.phone}`}
                                            className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors shadow-lg"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                                        </a>
                                    )}
                                </div>
                            </div>

                            <hr className="border-gray-100 mb-4" />

                            <div className="flex justify-between items-center column">
                                <p className="text-center text-gray-500 text-sm w-full">
                                    {riderLocation ? "Live location sharing active" : "Connecting to rider GPS..."}
                                    <br />
                                    <span className="text-[10px] text-gray-300">
                                        Received: {lastLocationReceived ? new Date(lastLocationReceived).toLocaleTimeString() : 'Waiting...'}
                                    </span>
                                </p>
                            </div>


                        </div>
                    </div>
                ) : status === 'COMPLETED' ? (
                    <div className="p-8 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Ride Completed!</h2>
                        <p className="text-gray-500 mt-2">Thank you for riding with us.</p>
                        <button
                            onClick={onClose}
                            className="mt-6 bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg"
                        >
                            Close
                        </button>
                    </div>
                ) : isExpired ? (
                    <div className="p-8 text-center animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <div className="w-8 h-8 bg-red-500 rounded-full"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            We cannot find a rider for you
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Please try again.
                        </p>
                        <button
                            onClick={() => {
                                console.log("Try Again clicked. props:", { onRetry, sourceCoords, destinationCoords });
                                if (onRetry) {
                                    onRetry({
                                        source: sourceCoords,
                                        destination: destinationCoords,
                                        sourceName,
                                        destinationName,
                                        vehicleType
                                    });
                                } else {
                                    console.error("onRetry prop is missing!");
                                    onClose();
                                }
                            }}
                            className="mt-6 bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg"
                        >
                            Try Again
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-30">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Finding Drivers{dots}</h2>
                                    <p className="text-sm text-gray-500">{offers.length} offers received</p>
                                </div>
                                <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full"></div>
                            </div>

                            {/* Removed top update section */}
                        </div>

                        {/* Pickup/Drop Condensed */}
                        <div className="px-6 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-1 max-w-[45%] truncate">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="truncate">{sourceName || "Pickup"}</span>
                            </div>
                            <span>→</span>
                            <div className="flex items-center space-x-1 max-w-[45%] truncate">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="truncate">{destinationName || "Dropoff"}</span>
                            </div>
                        </div>

                        {/* Offers List */}
                        <div className="overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-[200px]">
                            {offers.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                    <Loader2 className="w-8 h-8 mb-2 animate-spin text-gray-300" />
                                    <p>Waiting for offers doesn't mean wait forever...</p>
                                </div>
                            ) : (
                                offers.map((offer) => {
                                    const justCountered = sentCounters.has(offer.id);
                                    // User can accept if counter_by is NOT 'user' (meaning rider sent it or initial offer)
                                    const canAccept = offer.counter_by !== 'user' && !justCountered;
                                    return (
                                        <div key={offer.id} className={`p-4 rounded-xl shadow-sm border flex flex-col animate-in slide-in-from-bottom-2 ${justCountered ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'
                                            }`}>
                                            <div className="flex justify-between items-center w-full">
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900">${offer.amount}</h3>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                                                            {offer.FirstName?.[0]}
                                                        </div>
                                                        <p className="text-sm text-gray-600">
                                                            {offer.FirstName} • {offer.vehicleType}
                                                            {offer.counter_by === 'user' && <span className="text-blue-500 ml-2 text-xs font-semibold">(Your Counter)</span>}
                                                        </p>
                                                    </div>
                                                    {justCountered && (
                                                        <p className="text-xs text-blue-600 mt-1 font-semibold">✓ Counter sent! Waiting for rider...</p>
                                                    )}
                                                    {!canAccept && !justCountered && offer.counter_by === 'user' && (
                                                        <p className="text-xs text-orange-600 mt-1 font-semibold">⏳ Waiting for rider's response...</p>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    {canAccept && negotiatingOfferId !== offer.id && (
                                                        <button
                                                            onClick={() => setNegotiatingOfferId(offer.id)}
                                                            className="bg-gray-100 text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 border border-gray-200"
                                                        >
                                                            Counter
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleAcceptOffer(offer.rider_id, offer.amount)}
                                                        disabled={!canAccept}
                                                        className={`px-5 py-2 rounded-lg font-bold shadow-md transition-all ${canAccept
                                                            ? 'bg-black text-white hover:bg-gray-800'
                                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        Accept
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Negotiation Area */}
                                            {negotiatingOfferId === offer.id && (
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                    <div className="mb-2 text-xs font-semibold text-gray-500 uppercase">Suggest Counter</div>
                                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                                        {/* Suggested Values: Current -5, +5, +10, +15 */}
                                                        {[Number(offer.amount) - 5, Number(offer.amount) + 5, Number(offer.amount) + 10, Number(offer.amount) + 15]
                                                            .filter(p => p > 0)
                                                            .map((p) => (
                                                                <button
                                                                    key={p}
                                                                    onClick={() => handleUpdatePrice(offer.id, p)}
                                                                    className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium hover:bg-black hover:text-white transition-colors whitespace-nowrap"
                                                                >
                                                                    ${p.toFixed(2)}
                                                                </button>
                                                            ))}
                                                    </div>

                                                    <div className="flex gap-2 mt-2">
                                                        <input
                                                            type="number"
                                                            placeholder="Custom Price"
                                                            className="flex-1 border rounded-lg px-3 py-2 text-sm"
                                                            value={counterPrice}
                                                            onChange={(e) => setCounterPrice(e.target.value)}
                                                        />
                                                        <button
                                                            onClick={() => handleUpdatePrice(offer.id, counterPrice)}
                                                            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold"
                                                        >
                                                            Send
                                                        </button>
                                                        <button
                                                            onClick={() => { setNegotiatingOfferId(null); setCounterPrice(""); }}
                                                            className="text-gray-400 px-3 hover:text-gray-600"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </>
                )}
            </div>
        </div >
    );
};

export default FindingRider;
