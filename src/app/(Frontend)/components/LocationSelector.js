"use client";
import React, { useState, useEffect, useCallback } from "react";
import MapComponent from "@/app/(Frontend)/components/MapComponent";
import { MapPin, Navigation } from "lucide-react";

const LocationSelector = ({ isOpen, onClose, onSelectLocation }) => {
    const [source, setSource] = useState("");
    const [destination, setDestination] = useState("");
    const [sourceCoords, setSourceCoords] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [activeInput, setActiveInput] = useState("source");
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [markerPosition, setMarkerPosition] = useState([51.505, -0.09]);
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]);

    // Debounce timer
    const [debounceTimer, setDebounceTimer] = useState(null);

    const fetchSuggestions = async (query) => {
        if (!query || query.length < 3) {
            setSuggestions([]);
            return;
        }

        setLoadingSuggestions(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
            );
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
        } finally {
            setLoadingSuggestions(false);
        }
    };

    const handleInputChange = (value, inputType) => {
        if (inputType === "source") {
            setSource(value);
        } else {
            setDestination(value);
        }

        // Clear previous timer
        if (debounceTimer) clearTimeout(debounceTimer);

        // Set new timer
        const timer = setTimeout(() => {
            fetchSuggestions(value);
        }, 500);

        setDebounceTimer(timer);
    };

    const handleSuggestionClick = (suggestion) => {
        const { lat, lon, display_name } = suggestion;
        const coords = { lat: parseFloat(lat), lng: parseFloat(lon) };

        console.log(`Selected ${activeInput}:`, coords);

        if (activeInput === "source") {
            setSource(display_name);
            setSourceCoords(coords);
        } else {
            setDestination(display_name);
            setDestinationCoords(coords);
        }

        setMarkerPosition([coords.lat, coords.lng]);
        setMapCenter([coords.lat, coords.lng]);
        setSuggestions([]);
    };

    const handleMapClick = async (latlng) => {
        const { lat, lng } = latlng;
        console.log(`Map Clicked for ${activeInput}:`, { lat, lng });

        setMarkerPosition([lat, lng]);

        // Reverse Geocode
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const data = await response.json();
            const address = data.display_name;

            if (activeInput === "source") {
                setSource(address);
                setSourceCoords({ lat, lng });
                setActiveInput("destination");
            } else {
                setDestination(address);
                setDestinationCoords({ lat, lng });
            }
        } catch (error) {
            console.error("Error fetching address:", error);
        }
    };

    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const coords = { lat: latitude, lng: longitude };

                console.log("Current Location:", coords);

                setMarkerPosition([latitude, longitude]);
                setMapCenter([latitude, longitude]);

                // Reverse geocode
                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await response.json();
                    const address = data.display_name || "Your Current Location";

                    if (activeInput === "source") {
                        setSource(address);
                        setSourceCoords(coords);
                    } else {
                        setDestination(address);
                        setDestinationCoords(coords);
                    }
                } catch (error) {
                    console.error("Error fetching address:", error);
                    if (activeInput === "source") {
                        setSource("Your Current Location");
                        setSourceCoords(coords);
                    } else {
                        setDestination("Your Current Location");
                        setDestinationCoords(coords);
                    }
                }
            },
            (error) => {
                console.error("Error getting location:", error);
                alert("Unable to retrieve your location");
            }
        );
    };

    if (!isOpen) return null;

    return (
        <div className="h-screen flex flex-col bg-white">
            <div className="p-4 shadow-md z-10 bg-white">
                <button
                    onClick={onClose}
                    className="mb-4 text-sm font-semibold text-gray-600 hover:text-black"
                >
                    &larr; Back
                </button>

                <div className="space-y-3">
                    {/* Source Input */}
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-500 uppercase">
                            Current Location
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Select Current Location"
                                value={source}
                                onChange={(e) => handleInputChange(e.target.value, "source")}
                                onFocus={() => setActiveInput("source")}
                                className={`flex-1 p-3 bg-gray-100 rounded-lg outline-none border-2 ${activeInput === "source"
                                        ? "border-[#95CB33]"
                                        : "border-transparent"
                                    }`}
                            />
                            <button
                                onClick={handleUseCurrentLocation}
                                className="p-3 bg-[#95CB33] rounded-lg hover:bg-[#7fb028] transition-colors"
                                title="Use Current Location"
                            >
                                <Navigation size={20} />
                            </button>
                        </div>

                        {/* Suggestions Dropdown */}
                        {activeInput === "source" && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="flex items-start gap-2">
                                            <MapPin size={16} className="mt-1 text-gray-400" />
                                            <span className="text-sm">{suggestion.display_name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Destination Input */}
                    <div className="relative">
                        <label className="text-xs font-bold text-gray-500 uppercase">
                            Destination
                        </label>
                        <input
                            type="text"
                            placeholder="Where to go?"
                            value={destination}
                            onChange={(e) => handleInputChange(e.target.value, "destination")}
                            onFocus={() => setActiveInput("destination")}
                            className={`w-full p-3 bg-gray-100 rounded-lg outline-none border-2 ${activeInput === "destination"
                                    ? "border-[#95CB33]"
                                    : "border-transparent"
                                }`}
                        />

                        {/* Suggestions Dropdown */}
                        {activeInput === "destination" && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="flex items-start gap-2">
                                            <MapPin size={16} className="mt-1 text-gray-400" />
                                            <span className="text-sm">{suggestion.display_name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 relative z-0">
                <MapComponent
                    onMapClick={handleMapClick}
                    markerPosition={markerPosition}
                    center={mapCenter}
                />
            </div>
        </div>
    );
};

export default LocationSelector;
