"use client"
import React, { useState } from "react";
import LocationSelector from "@/app/(Frontend)/components/LocationSelector";
import FindingRider from "@/app/(Frontend)/components/FindingRider";
import { useSession } from "next-auth/react";
import Image from "next/image"
import { CiSearch } from "react-icons/ci";
import { FaChevronDown } from "react-icons/fa";
import { RxStopwatch } from "react-icons/rx";

import { GoHome } from "react-icons/go"; //icon
import { RiHomeOfficeLine } from "react-icons/ri";
import { LuMapPin } from "react-icons/lu";
import Vehicles from "@/app/(Frontend)/components/Vehicle";
import Footer from '@/app/(Frontend)/components/user-footer';
import RecentRides from "@/app/(Frontend)/User/RecentRides/page";
import Loading from "@/app/loading";
const page = () => {
    const { data: session, status } = useSession();
    const [isLocationSelectionOpen, setIsLocationSelectionOpen] = useState(false);
    const [isFindingRider, setIsFindingRider] = useState(false);
    const [selectedLocations, setSelectedLocations] = useState({
        source: null,
        destination: null,
        sourceName: "",
        destinationName: ""
    });



    const [rideId, setRideId] = useState(null);

    const handleVehicleSelect = (vehicleType) => {
        setSelectedLocations(prev => ({ ...prev, vehicleType }));
        setIsLocationSelectionOpen(true);
    };

    const createRideRequest = async (source, destination, sourceName, destinationName, vehicleType) => {
        try {
            console.log("Creating ride request...", { source, destination, vehicleType });
            const response = await fetch('/api/rides/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: session?.user?.id || 1,
                    pickupLat: source.lat,
                    pickupLng: source.lng,
                    pickupName: sourceName,
                    dropLat: destination.lat,
                    dropLng: destination.lng,
                    dropName: destinationName,
                    price: 25.00, // Mock price
                    vehicleType: vehicleType || 'Standard' // Ensure vehicleType is never undefined
                })
            });
            const data = await response.json();
            console.log("Ride creation response:", data);

            if (response.ok && data.rideId) {
                return data.rideId;
            } else {
                console.error("Ride creation failed:", data);
                alert("Failed to create ride. Please try again.");
                return null;
            }
        } catch (error) {
            console.error("Error creating ride:", error);
            alert("An error occurred. Please try again.");
            return null;
        }
    };

    const handleLocationSelect = async (source, destination, sourceName, destinationName) => {
        setSelectedLocations(prev => ({
            ...prev,
            source,
            destination,
            sourceName,
            destinationName
        }));
        setIsLocationSelectionOpen(false);
        setIsFindingRider(true);

        // Use the vehicleType from state (it might not be updated in 'selectedLocations' immediately due to closure, 
        // so we trust it was set before or use the prev value if we could access it, 
        // but here we can just rely on the fact we haven't lost it if we update correctly. 
        // Actually, inside this function 'selectedLocations' is stale (from render).
        // BUT, since we are setting state, the NEXT render will have it.
        // For the IMMEDIATE createRideRequest call, we need the vehicleType.
        // 'selectedLocations.vehicleType' IS available from the current render scope, 
        // AS LONG AS WE DIDN'T OVERWRITE IT YET (we haven't, we just called set).
        // Wait, handleVehicleSelect ran BEFORE this. 
        // So 'selectedLocations.vehicleType' should be correct in this scope.

        const newRideId = await createRideRequest(source, destination, sourceName, destinationName, selectedLocations.vehicleType);
        if (newRideId) {
            setRideId(newRideId);
        } else {
            setIsFindingRider(false);
        }
    };

    const handleRetry = async (rideDetails) => {
        console.log("Retrying ride...", rideDetails);
        // Close the current modal first to reset state
        setIsFindingRider(false);
        setRideId(null);

        // Small delay to ensure unmount/remount
        setTimeout(async () => {
            setIsFindingRider(true);

            // Ensure we have valid coordinates
            if (!rideDetails?.source || !rideDetails?.destination) {
                console.error("Invalid ride details for retry:", rideDetails);
                alert("Cannot retry: Missing location details.");
                setIsFindingRider(false);
                return;
            }

            const newRideId = await createRideRequest(
                rideDetails.source,
                rideDetails.destination,
                rideDetails.sourceName,
                rideDetails.destinationName,
                rideDetails.vehicleType || selectedLocations.vehicleType // Use passed type or fallback to state
            );

            if (newRideId) {
                setRideId(newRideId);
            } else {
                setIsFindingRider(false);
            }
        }, 300);
    };

    return (
        <>
            <LocationSelector
                isOpen={isLocationSelectionOpen}
                onClose={() => setIsLocationSelectionOpen(false)}
                onSelectLocation={handleLocationSelect}
            />

            <FindingRider
                isOpen={isFindingRider}
                rideId={rideId}
                sourceCoords={selectedLocations.source}
                destinationCoords={selectedLocations.destination}
                sourceName={selectedLocations.sourceName}
                destinationName={selectedLocations.destinationName}
                vehicleType={selectedLocations.vehicleType}
                onRetry={handleRetry}
                onClose={() => {
                    setIsFindingRider(false);
                    setRideId(null);
                }}
            />

            {!isLocationSelectionOpen && !isFindingRider && (
                <div className="">
                    <div className="bg-[#1A1A1A] h-75">
                        <div className="flex justify-between p-5"> {/* For Top section*/}

                            <div> {/* left section*/}
                                <h1 className="text-2xl font-bold text-[#95CB33]">Hello {session?.user?.firstName || "Guest"}</h1>
                                <p className="text-white">How are you doing Today</p>
                            </div>

                            <div className=" w-15 h-15 rounded-full relative">     {/* Right Section*/}
                                <Image
                                    src="/image.png"
                                    alt="profile"
                                    fill
                                    className="rounded-full"
                                />
                            </div>

                        </div>
                        {/* search bar */}
                        <div className="flex items-center p-2 justify-between bg-white rounded-lg mx-2 md:mx-20 lg:mx-40">
                            <CiSearch size={25} className="font-bold" />

                            <div className="flex-1 mx-2">
                                <input
                                    type="text"
                                    placeholder="Where are you going"
                                    className="w-full outline-none font-semibold"
                                />
                            </div>

                            <div className="flex rounded-lg p-2 px-3 items-center bg-[#95CB33] gap-1">
                                <RxStopwatch size={18} />
                                <span className="font-semibold">Later</span>
                                <FaChevronDown size={15} />
                            </div>
                        </div>


                        {/* saved address */}
                        <div className="text-white m-4">
                            <h3 className="text-base font-semibold text-[#D1D1D1]">Saved Address</h3>

                            <div className=" flex gap-7 my-3 ">
                                <div>
                                    <div className="w-10 h-10  bg-[#D1D1D1] rounded-full flex flex-col justify-center items-center"><GoHome size={20} className="text-black" />
                                    </div>
                                    <h5 className="text-sm my-1 text-[#d6d4d4]">Home</h5>

                                </div>
                                <div>
                                    <div className="w-10 h-10  bg-[#D1D1D1] rounded-full flex justify-center items-center"><RiHomeOfficeLine size={20} className="text-black" /></div>
                                    <h5 className="text-sm my-1 text-[#d6d4d4]">Office</h5>
                                </div>

                                <div>

                                    <div className="w-10 h-10  bg-[#D1D1D1] rounded-full flex justify-center items-center"> <LuMapPin size={20} className="text-black" /> </div>
                                    <h5 className="text-sm my-1 text-[#d6d4d4]">Other</h5>
                                </div>

                            </div>
                        </div>

                        {/* for Vehicle select*/}

                    </div>
                    <div className=" bg-[#1A1A1A]">
                        <div className=" h-10">

                            <Vehicles onSelect={handleVehicleSelect} />
                        </div>

                    </div>
                    <div>

                        <RecentRides />
                    </div>
                    <Footer />
                </div>
            )}

        </>
    )
}

export default page