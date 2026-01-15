"use client";

import { useState } from "react";
import MapComponent from "../components/MapComponent";
import RiderFooter from "../components/RiderFooter";
import { Search, User, Menu } from "lucide-react"; // Added icons

export default function RiderPage() {
  const [isOnline, setIsOnline] = useState(false);
  const [activeTab, setActiveTab] = useState("active"); // 'active' | 'missed'

  // Mock data for rides
  const activeRides = [
    { id: 1, from: "Central Park", to: "Times Square", status: "Pending", price: "$15.00" },
    { id: 2, from: "Brooklyn Bridge", to: "Wall St", status: "Pending", price: "$22.50" },
  ];

  const missedRides = [
    { id: 101, from: "JFK Airport", to: "Manhattan", time: "10 mins ago" },
    { id: 102, from: "Queens", to: "Brooklyn", time: "25 mins ago" },
  ];

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden relative">

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
                activeRides.length > 0 ? (
                  activeRides.map((ride) => (
                    <div key={ride.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center active:scale-[0.99] transition-transform">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          <p className="font-semibold text-gray-900">{ride.from}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          <p className="font-semibold text-gray-900">{ride.to}</p>
                        </div>
                        <p className="text-xs text-blue-600 mt-2 font-medium bg-blue-50 inline-block px-2 py-1 rounded-md">{ride.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{ride.price}</p>
                        <button className="mt-2 bg-black text-white text-xs px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
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
                missedRides.length > 0 ? (
                  missedRides.map((ride) => (
                    <div key={ride.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 opacity-75">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800">Ride Request</h3>
                        <span className="text-xs text-gray-400">{ride.time}</span>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        From <span className="font-medium text-gray-900">{ride.from}</span> to <span className="font-medium text-gray-900">{ride.to}</span>
                      </div>
                      <div className="flex items-center text-red-500 text-xs font-medium">
                        <span>Missed request</span>
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
