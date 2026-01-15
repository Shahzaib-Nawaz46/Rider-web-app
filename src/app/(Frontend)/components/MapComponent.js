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
// We need useMap to control zoom from custom buttons
const useMap = dynamic(
    () => import("react-leaflet").then((mod) => mod.useMap),
    { ssr: false }
);

// Inner component to handle zoom logic because styling needs access to map context
// However, since we are dynamically importing useMap, we might face issues if we try to use it directly in the main component body before it's loaded.
// A safer pattern with Next.js dynamic imports for libraries like this is ensuring the child component is also dynamic or checking availability.
// Actually, `useMap` returns a hook. We need a component that calls this hook.
// Let's create a standard component but we need to ensure react-leaflet is loaded.
// The easiest way with dynamic imports is to define this "ZoomController" inside the dynamic block or importa it from a file.
// But to keep it single-file, we can use a trick: pass the map instance or just assume this component renders inside MapContainer which is dynamic.

const ZoomController = () => {
    // We need to import useMap inside here or ensure it's available. 
    // Since 'dynamic' returns a component, we can't use it as a hook directly.
    // We have to import the hook from the module.
    // Let's accept that we might need to modify how we import things slightly.
    // Standard pattern:
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


const MapComponent = ({
    center = [51.505, -0.09],
    zoom = 13,
    className = "w-full h-full",
    style = { height: "100%", width: "100%" },
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        (async () => {
            const L = (await import('leaflet')).default;
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
            });
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
                zoomControl={false} // Disable default zoom control
                style={{ height: "100%", width: "100%" }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center}>
                    <Popup>
                        You are here.
                    </Popup>
                </Marker>

                {/* Render Custom Controls */}
                <CustomZoomControl />

            </MapContainer>
        </div>
    );
};

export default MapComponent;
