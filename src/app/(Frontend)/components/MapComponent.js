"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { Plus, Minus } from "lucide-react"; // Custom icons


// Dynamically import MapContainer and other Leaflet components
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import("react-leaflet").then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import("react-leaflet").then((mod) => mod.Popup),
    { ssr: false }
);
const Polyline = dynamic(
    () => import("react-leaflet").then((mod) => mod.Polyline),
    { ssr: false }
);
const CircleMarker = dynamic(
    () => import("react-leaflet").then((mod) => mod.CircleMarker),
    { ssr: false }
);
// We need useMap to control zoom from custom buttons
const useMap = dynamic(
    () => import("react-leaflet").then((mod) => mod.useMap),
    { ssr: false }
);


const ZoomController = () => {
    const { useMap } = require('react-leaflet');

    const map = useMap();

    return (
        <div className="absolute bottom-24 right-4 flex flex-col gap-2 z-[400]">
            <button
                onClick={() => map.zoomIn()}
                className="bg-white p-2 rounded-full shadow-lg border border-gray-100 text-gray-700 hover:bg-gray-50 focus:outline-none active:scale-95 transition-transform"
                aria-label="Zoom In"
            >
                <Plus size={20} />
            </button>
            <button
                onClick={() => map.zoomOut()}
                className="bg-white p-2 rounded-full shadow-lg border border-gray-100 text-gray-700 hover:bg-gray-50 focus:outline-none active:scale-95 transition-transform"
                aria-label="Zoom Out"
            >
                <Minus size={20} />
            </button>
        </div>
    );
};

// Wrapper for the controller to handle the require inside MapContainer context
const CustomZoomControl = () => {
    // This component will be rendered inside MapContainer
    // We can use a try-catch or just rely on the fact that MapContainer loads the library
    try {
        return <ZoomController />;
    } catch (e) {
        return null;
    }
};


const MapEvents = ({ onMapClick }) => {
    const { useMapEvents } = require('react-leaflet');
    useMapEvents({
        click(e) {
            if (onMapClick) onMapClick(e.latlng);
        },
    });
    return null;
};

const CustomMapEvents = ({ onMapClick }) => {
    try {
        return <MapEvents onMapClick={onMapClick} />;
    } catch (e) {
        return null;
    }
};

const RecenterControl = ({ center, zoom }) => {
    const { useMap } = require('react-leaflet');
    const map = useMap();

    // Initial center on mount only
    useEffect(() => {
        if (center && map) {
            map.setView(center, zoom);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run ONCE on mount

    return (
        <button
            onClick={() => {
                if (center) map.flyTo(center, Math.max(map.getZoom(), 15));
            }}
            className="absolute bottom-36 right-4 bg-white p-3 rounded-full shadow-lg border border-gray-100 text-gray-700 z-[400] hover:bg-gray-50 active:scale-95 transition-all"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
        </button>
    );
};

const CustomRecenterControl = ({ center, zoom }) => {
    try {
        return <RecenterControl center={center} zoom={zoom} />;
    } catch { return null; }
};

const MapComponent = ({
    center = [51.505, -0.09],
    zoom = 13,
    className = "w-full h-full",
    style = { height: "100%", width: "100%" },
    onMapClick,
    markerPosition,
    riderLocation, // New prop: { lat, lng }
    routePath      // New prop: Array of [lat, lng]
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [carIcon, setCarIcon] = useState(null);

    useEffect(() => {
        setIsMounted(true);

        (async () => {
            const L = (await import('leaflet')).default;

            // Fix default icons
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });

            // Create Custom Car Icon using DivIcon + SVG for reliability
            const carSvg = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 40px; height: 40px; filter: drop-shadow(0 4px 4px rgba(0,0,0,0.3));">
                    <path fill="#2563EB" d="M112.5 256c-19.6 0-38.8 3.3-56.9 9.5c-3.2-9.6-5.6-19.6-5.6-31.5c0-10.6 8.6-19.2 19.2-19.2l39 0c51.9 0 95.8-33.8 111.9-80.8L234.3 93.6c4.6-13.4 17.2-22.6 31.4-22.6l103.5 0c15 0 28.2 10.3 32.2 24.9l20.4 73.9c-10 2.2-20.4 3.4-31 3.4l-1.9 0c-10.6 0-19.2 8.6-19.2 19.2l0 6.6c-49.8 1.8-93.5 29.8-115.1 69.8c-15.1 27.2-24.3 58-25.5 90.7l-94.7 0c-15 0-28.2-10.3-32.2-24.9l-20.4-73.9c10-2.2 20.4-3.4 31-3.4l1.9 0c10.6 0 19.2-8.6 19.2-19.2l0-6.6c0-10.6-8.6-19.2-19.2-19.2l-39 0c-10.6 0-19.2 8.6-19.2 19.2c0 11.9 2.5 22 5.6 31.5c18.1-6.1 37.3-9.5 56.9-9.5zM416 288c53 0 96 43 96 96s-43 96-96 96s-96-43-96-96s43-96 96-96z"/>
                    <circle cx="128" cy="384" r="48" fill="#333" />
                    <circle cx="384" cy="384" r="48" fill="#333" />
                </svg>
            `;

            const car = L.divIcon({
                html: carSvg,
                className: 'bg-transparent',
                iconSize: [40, 40],
                iconAnchor: [20, 20],
            });
            setCarIcon(car);

        })();

    }, []);

    if (!isMounted) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 ${className}`} style={style}>
                <span className="text-gray-500">Loading Map...</span>
            </div>
        );
    }

    return (
        <div className={className} style={style}>
            <MapContainer
                center={center}
                zoom={zoom}
                zoomControl={false}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Destination/Pickup Marker */}
                {markerPosition && <Marker position={markerPosition} />}

                {/* Rider Live Location (Car Icon) */}
                {riderLocation && carIcon && (
                    <Marker
                        position={[riderLocation.lat, riderLocation.lng]}
                        icon={carIcon}
                        zIndexOffset={100}
                    />
                )}
                {/* Fallback if icon not loaded yet */}
                {riderLocation && !carIcon && (
                    <CircleMarker
                        center={[riderLocation.lat, riderLocation.lng]}
                        radius={8}
                        pathOptions={{ color: 'white', fillColor: '#3b82f6', fillOpacity: 1, weight: 2 }}
                    />
                )}

                {/* Route Path */}
                {routePath && routePath.length > 0 && (
                    <Polyline
                        positions={routePath}
                        pathOptions={{ color: '#3b82f6', weight: 5, opacity: 0.7 }}
                    />
                )}

                {/* Render Custom Controls */}
                <CustomZoomControl />
                <CustomMapEvents onMapClick={onMapClick} />
                <CustomRecenterControl center={center} zoom={zoom} />

            </MapContainer>
        </div>
    );
};

export default MapComponent;
