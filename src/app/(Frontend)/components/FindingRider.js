"use client";
import React, { useState, useEffect } from "react";
import MapComponent from "@/app/(Frontend)/components/MapComponent";
import { Loader2 } from "lucide-react";

const FindingRider = ({ isOpen, rideId, sourceCoords, destinationCoords, sourceName, destinationName, onClose }) => {
    const [dots, setDots] = useState("");
    const [status, setStatus] = useState("PENDING");
    const [offers, setOffers] = useState([]);

    // Animated dots effect
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    // Polling for ride status AND OFFERS
    useEffect(() => {
        if (!isOpen || !rideId) return;

        const pollInterval = setInterval(async () => {
            try {
                // 1. Check Status
                const statusRes = await fetch(`/api/rides/status/${rideId}`);
                if (statusRes.ok) {
                    const statusData = await statusRes.json();
                    setStatus(statusData.status);

                    if (statusData.status === 'ACCEPTED') {
                        clearInterval(pollInterval);
                        return; // Stop polling if accepted
                    }
                }

                // 2. Check Offers (Only if pending)
                const offersRes = await fetch(`/api/rides/offers/${rideId}`);
                if (offersRes.ok) {
                    const offersData = await offersRes.json();
                    setOffers(offersData);
                }

            } catch (error) {
                console.error("Polling error:", error);
            }
        }, 3000); // Check every 3 seconds

        return () => clearInterval(pollInterval);
    }, [isOpen, rideId]);

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

                {status === 'ACCEPTED' ? (
                    <div className="p-8 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <div className="w-8 h-8 bg-green-500 rounded-full animate-ping"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Ride Started!</h2>
                        <p className="text-gray-500 mt-2">Your driver is on the way.</p>
                    </div>
                ) : (
                    <>
                        <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-30">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Finding Drivers{dots}</h2>
                                    <p className="text-sm text-gray-500">{offers.length} offers received</p>
                                </div>
                                <div className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full"></div>
                            </div>
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
                                    <p>Waiting for offers...</p>
                                </div>
                            ) : (
                                offers.map((offer) => (
                                    <div key={offer.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center animate-in slide-in-from-bottom-2">
                                        <div>
                                            <h3 className="font-bold text-lg text-gray-900">${offer.amount}</h3>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                                                    {offer.FirstName?.[0]}
                                                </div>
                                                <p className="text-sm text-gray-600">{offer.FirstName} • {offer.vehicleType}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleAcceptOffer(offer.rider_id, offer.amount)}
                                            className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                                        >
                                            Accept
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FindingRider;
