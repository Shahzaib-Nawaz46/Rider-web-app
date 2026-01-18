"use client";
import React, { useState } from "react";
import { MapPin, Navigation, DollarSign, Clock } from "lucide-react";

/**
 * RideCard Component
 * Displays ride details and allows Rider to Accept or Counter Offer.
 */
const RideCard = ({ ride, onAccept, onOffer }) => {
    const [isOffering, setIsOffering] = useState(false);
    const [offerPrice, setOfferPrice] = useState(ride.price);
    const [offerSent, setOfferSent] = useState(false);

    const handleOfferSubmit = () => {
        onOffer(ride.id, offerPrice);
        setIsOffering(false);
        setOfferSent(true);
    };

    const handleQuickOffer = (price) => {
        onOffer(ride.id, price);
        setOfferSent(true);
    };

    // Check if rider already sent an offer for this ride
    const hasMyOffer = ride.my_offer_amount !== null && ride.my_offer_amount !== undefined;
    const showOfferSent = offerSent || hasMyOffer;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4 transition-all hover:shadow-md">
            {/* Header: Time & Price */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1 rounded-full">
                    <Clock className="w-3 h-3 text-gray-500" />
                    <span className="text-xs font-medium text-gray-600">
                        {ride.seconds_elapsed}s ago
                    </span>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">${ride.price}</p>
                    {showOfferSent && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                            {ride.counter_by === 'user' ? 'User Countered' : 'Offer Sent'}
                        </span>
                    )}
                </div>
            </div>

            {/* Route Details */}
            <div className="space-y-4 mb-6 relative">
                {/* Connector Line */}
                <div className="absolute left-[11px] top-3 bottom-8 w-0.5 bg-gray-200 border-l border-dashed border-gray-300"></div>

                {/* Pickup */}
                <div className="flex items-start space-x-3 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 border border-green-200">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Pickup</p>
                        <p className="text-gray-900 font-medium leading-tight">
                            {ride.pickup_name || `${ride.pickup_lat.toFixed(4)}, ${ride.pickup_lng.toFixed(4)}`}
                        </p>
                    </div>
                </div>

                {/* Dropoff */}
                <div className="flex items-start space-x-3 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 border border-red-200">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">Dropoff</p>
                        <p className="text-gray-900 font-medium leading-tight">
                            {ride.drop_name || `${ride.drop_lat.toFixed(4)}, ${ride.drop_lng.toFixed(4)}`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            {isOffering ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center space-x-2 mb-3">
                        <div className="relative flex-1">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="number"
                                value={offerPrice}
                                onChange={(e) => setOfferPrice(e.target.value)}
                                className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setIsOffering(false)}
                            className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleOfferSubmit}
                            className="flex-1 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                        >
                            Send Offer
                        </button>
                    </div>
                </div>
            ) : showOfferSent ? (
                ride.counter_by === 'user' ? (
                    // User has countered - Rider can Accept or Counter back
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <p className="text-green-700 font-semibold text-center mb-3">
                            User countered with ${ride.my_offer_amount}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsOffering(true)}
                                className="flex-1 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Counter Again
                            </button>
                            <button
                                onClick={() => onAccept(ride.id)}
                                className="flex-[2] py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg"
                            >
                                Accept ${ride.my_offer_amount}
                            </button>
                        </div>
                    </div>
                ) : (
                    // Rider sent offer, waiting for user
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                        <p className="text-blue-700 font-semibold">
                            Your offer of ${ride.my_offer_amount || offerPrice} has been sent
                        </p>
                        <p className="text-blue-600 text-sm mt-1">Waiting for user response...</p>
                    </div>
                )
            ) : (
                <div className="flex flex-col space-y-3">
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {[Number(ride.price) - 5, Number(ride.price) + 5, Number(ride.price) + 10, Number(ride.price) + 15]
                            .filter(p => p > 0)
                            .map((p) => (
                                <button
                                    key={p}
                                    onClick={() => handleQuickOffer(p)}
                                    className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium hover:bg-black hover:text-white transition-colors whitespace-nowrap"
                                >
                                    ${p.toFixed(2)}
                                </button>
                            ))}
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => setIsOffering(true)}
                            className="flex-1 py-3 bg-white border-2 border-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Custom ($)
                        </button>
                        <button
                            onClick={() => onAccept(ride.id)}
                            className="flex-[2] py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                        >
                            Accept Now
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RideCard;
