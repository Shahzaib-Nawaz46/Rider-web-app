"use client"
import { LuMapPin } from "react-icons/lu";
import { GoArrowRight } from "react-icons/go";

const rides = [
  {
    id: 1,
    from: "Gulshan Block 5",
    to: "Saddar",
    time: "Today • 10:30 AM",
    vehicle: "Bike",
  },
  {
    id: 2,
    from: "University Road",
    to: "Clifton",
    time: "Yesterday • 6:15 PM",
    vehicle: "Car",
  },
];

const RecentRides = () => {
  return (
    <div className="mx-4 mt-50 mb-30 text-white">
      <h3 className=" text-black font-semibold text-xl mb-3">
        Recent Rides
      </h3>

      <div className="space-y-3">
        {rides.map((ride) => (
          <div
            key={ride.id}
            className="bg-[#2A2A2A] rounded-xl p-4 flex justify-between items-center"
          >
            {/* Left */}
            <div>
              <div className="flex items-center gap-2 text-sm">
                <LuMapPin />
                <span>{ride.from}</span>
                <GoArrowRight />
                <span>{ride.to}</span>
              </div>

              <p className="text-xs text-[#B5B5B5] mt-1">
                {ride.time} • {ride.vehicle}
              </p>
            </div>

            {/* Right */}
            <span className="text-sm text-[#95CB33] font-semibold cursor-pointer">
              Book
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentRides;
