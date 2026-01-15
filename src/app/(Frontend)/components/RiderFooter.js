"use client";

import Link from "next/link";
import { Home, DollarSign, User } from "lucide-react";

const RiderFooter = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-50">
            <div className="flex justify-around items-center py-3">
                {/* Home / Rides */}
                <Link href="/Rider" className="flex flex-col items-center text-gray-700 hover:text-black transition-colors">
                    <Home className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">Rides</span>
                </Link>

                {/* Earnings */}
                <button className="flex flex-col items-center text-gray-400 hover:text-gray-600 transition-colors pointer-events-none">
                    <DollarSign className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">Earnings</span>
                </button>

                {/* Profile */}
                <button className="flex flex-col items-center text-gray-400 hover:text-gray-600 transition-colors pointer-events-none">
                    <User className="w-6 h-6 mb-1" />
                    <span className="text-xs font-medium">Profile</span>
                </button>
            </div>
        </div>
    );
};

export default RiderFooter;
