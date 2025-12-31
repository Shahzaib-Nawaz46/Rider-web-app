
import { FaUser, FaCar } from "react-icons/fa";
import Link from "next/link";


const Select = () => {
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      
      {/* User */}
      <Link href="/User/Verification">
      <div className="flex flex-col items-center gap-2 cursor-pointer">
        <div className="bg-[#66CC33] p-8 rounded-lg flex justify-center items-center w-24 h-24">
          <FaUser size={40} />
        </div>
        <h1 className="text-2xl">User</h1>
      </div>

      </Link>

      {/* Spacer */}
      <div className="w-8" />

      {/* Rider */}
      <Link href="/Rider/Verification">
      <div className="flex flex-col items-center gap-2 cursor-pointer">
        <div className="bg-[#66CC33] p-8 rounded-lg flex justify-center items-center w-24 h-24">
          <FaCar size={40} />
        </div>
        <h1 className="text-2xl">Driver</h1>
      </div>

      </Link>

    </div>
  );
};

export default Select;
