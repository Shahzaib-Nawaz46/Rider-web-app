"use client";
import React, { useState, useEffect } from "react";
import MapComponent from "@/app/(Frontend)/components/MapComponent";
import { Loader2 } from "lucide-react";

const FindingRider = ({ isOpen, rideId, sourceCoords, destinationCoords, sourceName, destinationName, onClose }) => {
    const [dots, setDots] = useState("");
    const [status, setStatus] = useState("PENDING");

    // Animated dots effect
    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    // Polling for ride status
    useEffect(() => {
        if (!isOpen || !rideId) return;

        const pollInterval = setInterval(async () => {
            try {
                const res = await fetch(`/api/rides/status/${rideId}`);
                if (res.ok) {
                    const data = await res.json();
                    setStatus(data.status);

                    if (data.status === 'ACCEPTED') {
                        // Handle success - maybe redirect or show "Rider Found"
                        clearInterval(pollInterval);
                        // alert("Rider Found! Redirecting..."); // REMOVED ALERT
                        // Here you would typically navigate to a "Ride In Progress" page
                    }
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        }, 3000); // Check every 3 seconds

        return () => clearInterval(pollInterval);
    }, [isOpen, rideId]);

    if (!isOpen) return null;

    // Calculate center point between source and destination
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

            {/* Finding Rider Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6 z-20">
                <div className="flex flex-col items-center justify-center space-y-4">
                    {/* Animated Loader */}
                    <div className="relative">
                        <Loader2 className="w-16 h-16 text-[#95CB33] animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 bg-[#95CB33]/20 rounded-full animate-pulse"></div>
                        </div>
                    </div>

                    {/* Text */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">
                            {status === 'ACCEPTED' ? "Ride Started!" : `Finding Rider for you${dots}`}
                        </h2>
                        <p className="text-gray-500 mt-2">
                            {status === 'ACCEPTED'
                                ? "Your driver is on the way."
                                : "Please wait while we connect you with a nearby rider"}
                        </p>
                    </div>

                    {/* Location Info */}
                    <div className="w-full mt-4 space-y-3">
                        {(sourceName || sourceCoords) && (
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-3 h-3 bg-[#95CB33] rounded-full mt-1"></div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Pickup</p>
                                    <p className="text-sm text-gray-800 line-clamp-2">
                                        {sourceName || (sourceCoords ? `${sourceCoords.lat.toFixed(4)}, ${sourceCoords.lng.toFixed(4)}` : "Not selected")}
                                    </p>
                                </div>
                            </div>
                        )}
                        {(destinationName || destinationCoords) && (
                            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="w-3 h-3 bg-red-500 rounded-full mt-1"></div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 font-semibold uppercase">Drop</p>
                                    <p className="text-sm text-gray-800 line-clamp-2">
                                        {destinationName || (destinationCoords ? `${destinationCoords.lat.toFixed(4)}, ${destinationCoords.lng.toFixed(4)}` : "Not selected")}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindingRider;
