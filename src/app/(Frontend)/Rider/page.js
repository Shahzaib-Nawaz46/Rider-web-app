"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import MapComponent from "../components/MapComponent";
import RiderFooter from "../components/RiderFooter";
import { Search, User, Menu } from "lucide-react"; // Added icons

export default function RiderPage() {
  const { data: session } = useSession(); // Get Rider ID
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState("active"); // 'active' | 'missed'
  const [rides, setRides] = useState([]);
  const [currentRide, setCurrentRide] = useState(null); // Track active ride

  // Poll for rides when Online & No active ride
  useEffect(() => {
    let interval;
    if (isOnline && !currentRide) {
      const fetchRides = async () => {
        try {
          const res = await fetch('/api/rides/available');
          if (res.ok) {
            const data = await res.json();
            setRides(data);
          }
        } catch (error) {
          console.error("Error fetching rides:", error);
        }
      };

      fetchRides(); // Initial fetch
      interval = setInterval(fetchRides, 3000); // 3s polling
    } else {
      if (!currentRide) setRides([]); // Clear rides when offline only if no active ride
    }
    return () => clearInterval(interval);
  }, [isOnline, currentRide]);

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  const handleAcceptRide = async (rideId) => {
    try {
      const res = await fetch('/api/rides/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rideId,
          riderId: session?.user?.id || 999 // Fallback
        })
      });

      if (res.ok) {
        // Find the ride details before removing it
        const ride = rides.find(r => r.id === rideId);
        setCurrentRide(ride);

        // Remove from list
        const updatedRides = rides.filter(r => r.id !== rideId);
        setRides(updatedRides);

        // Simulating "Ride Started" state locally for now
        // alert("Ride Started! Navigate to pickup...");
        // Ideally we would set a state `currentRide` and show a different view
      } else {
        const err = await res.json();
        alert(`Error: ${err.error || "Failed to accept"}`);
      }
    } catch (error) {
      console.error("Accept error:", error);
    }
  };

  // Filter rides
  const availableActiveRides = rides.filter(r => r.seconds_elapsed <= 20);
  const availableMissedRides = rides.filter(r => r.seconds_elapsed > 20);

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden relative">

      {/* RIDE IN PROGRESS OVERLAY */}
      {currentRide && (
        <div className="absolute inset-0 z-50 bg-white flex flex-col">
          <div className="flex-1 relative">
            <MapComponent />
            <div className="absolute bottom-0 left-0 right-0 bg-white p-6 rounded-t-3xl shadow-lg z-20">
              <h2 className="text-2xl font-bold mb-2">Ride Started</h2>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Pickup</p>
                  <p className="font-semibold">{currentRide.pickup_name || `Lat: ${currentRide.pickup_lat}`}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm">Dropoff</p>
                  <p className="font-semibold">{currentRide.drop_name || `Lat: ${currentRide.drop_lat}`}</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentRide(null)}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg"
              >
                Complete Ride
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 
        Custom Header - Designed to overlap map in offline mode, 
        or sit at top in online mode.
      */}
      <div className={`absolute top-0 left-0 right-0 z-30 px-4 py-4 transition-all duration-300 ${isOnline
        ? 'bg-white shadow-sm'
        : 'bg-white shadow-md' // White background for Offline/Map mode as requested
        }`}>
        <div className="flex justify-between items-center">

          {/* Left: Profile / Avatar */}
          <div className="pointer-events-auto">
            <div className="h-12 w-12 rounded-full bg-white shadow-md flex items-center justify-center border border-gray-100 overflow-hidden cursor-pointer hover:scale-105 transition-transform">
              {/* Placeholder Image or Icon */}
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Center: Status Toggle */}
          <div className={`pointer-events-auto flex items-center space-x-3 px-5 py-2 rounded-full shadow-inner border transition-colors ${isOnline ? 'bg-white border-green-100' : 'bg-gray-100 border-gray-200'
            }`}>
            <span className={`text-sm font-bold ${isOnline ? 'text-green-600' : 'text-gray-500'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
            <button
              onClick={toggleOnlineStatus}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${isOnline ? "bg-black" : "bg-gray-300"
                }`}
            >
              <span className="sr-only">Toggle Status</span>
              <span
                className={`${isOnline ? "translate-x-6" : "translate-x-1"
                  } inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-sm`}
              />
            </button>
          </div>

          {/* Right: Search Button */}
          <div className="pointer-events-auto">
            <button className={`h-10 w-10 rounded-full flex items-center justify-center border transition-colors bg-white shadow-md hover:bg-gray-50 ${isOnline
              ? 'border-gray-100 text-gray-700'
              : 'border-gray-200 text-gray-600'
              }`}>
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative">
        {/* 
            Scenario 1: OFFLINE 
            Show Map covering the full screen.
        */}
        {!isOnline && (
          <div className="absolute inset-0 z-10">
            <MapComponent />
            {/* Overlay Message for Offline State */}
            <div className="absolute bottom-24 left-0 right-0 flex justify-center z-[20] pointer-events-none">
              <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-md text-center flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                <p className="text-sm font-semibold text-gray-600">You're offline</p>
              </div>
            </div>
          </div>
        )}

        {/* 
            Scenario 2: ONLINE
            Show Rides List. Map disappears.
            Added padding-top to account for header space in online mode.
        */}
        {isOnline && (
          <div className="h-full flex flex-col animate-in fade-in duration-300 bg-gray-50 pt-20">
            {/* Tabs for Active / Missed Rides */}
            <div className="flex border-b border-gray-200 bg-white">
              <button
                onClick={() => setActiveTab("active")}
                className={`flex-1 py-3 text-sm font-medium text-center transition-colors relative ${activeTab === "active" ? "text-black" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Active Rides
                {activeTab === "active" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black mx-4 rounded-t-full" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("missed")}
                className={`flex-1 py-3 text-sm font-medium text-center transition-colors relative ${activeTab === "missed" ? "text-red-500" : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Missed Rides
                {activeTab === "missed" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500 mx-4 rounded-t-full" />
                )}
              </button>
            </div>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24"> {/* pb-24 for footer clearance */}

              {activeTab === "active" ? (
                availableActiveRides.length > 0 ? (
                  availableActiveRides.map((ride) => (
                    <div key={ride.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center active:scale-[0.99] transition-transform">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <p className="font-semibold text-gray-900">{ride.pickup_name || `Lat: ${ride.pickup_lat}`}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          <p className="font-semibold text-gray-900">{ride.drop_name || `Lat: ${ride.drop_lat}`}</p>
                        </div>
                        <p className="text-xs text-blue-600 mt-2 font-medium bg-blue-50 inline-block px-2 py-1 rounded-md">
                          {ride.seconds_elapsed}s ago
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">${ride.price}</p>
                        <button
                          onClick={() => handleAcceptRide(ride.id)}
                          className="mt-2 bg-black text-white text-xs px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    <p>No active rides currently.</p>
                  </div>
                )
              ) : (
                // Missed Rides Content
                availableMissedRides.length > 0 ? (
                  availableMissedRides.map((ride) => (
                    <div key={ride.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 opacity-75">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800">Ride Request</h3>
                        <span className="text-xs text-gray-400">{ride.seconds_elapsed}s ago</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        From <span className="font-medium text-gray-900">{ride.pickup_name || ride.pickup_lat}</span> to <span className="font-medium text-gray-900">{ride.drop_name || ride.drop_lat}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-red-500 text-xs font-medium">Missed request</span>
                        <button
                          onClick={() => handleAcceptRide(ride.id)}
                          className="bg-red-50 text-red-600 border border-red-100 text-xs px-3 py-1 rounded-lg font-medium hover:bg-red-100 transition-colors"
                        >
                          Recover & Accept
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-400">
                    <p>No missed rides.</p>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="z-50">
        <RiderFooter />
      </div>
    </div>
  );
}
