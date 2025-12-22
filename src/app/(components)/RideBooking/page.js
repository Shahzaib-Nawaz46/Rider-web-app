"use client"
import Image from "next/image"
import { CiSearch } from "react-icons/ci";
import {  FaChevronDown } from "react-icons/fa";
import { RxStopwatch } from "react-icons/rx";

import { GoHome } from "react-icons/go";
import { RiHomeOfficeLine } from "react-icons/ri";
import { LuMapPin } from "react-icons/lu";
import Vehicles from "@/app/VehicleSwiper/page";
import Footer from '@/app/(components)/Footer/page';

const page = () => {
    return (
        <>
       
        <div className="bg-[#1A1A1A] h-80"> 
            <div className="flex justify-between p-5"> {/* For Top section*/}

                <div> {/* left section*/}
                    <h1 className="text-2xl font-bold text-[#95CB33]">Hello Mohit</h1>
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
            <div className="flex h-15 items-center p-2 justify-between bg-white rounded-lg mx-4">
                <CiSearch size={25} className="font-bold"/>
                <div className=" mx-1 w-45">
                <input type="text" placeholder="Where are you going" className="outline-none font-semibold" />

                </div>
                <div className="flex  rounded-lg p-2 px-3  items-center bg-[#95CB33] gap-1">
                    <RxStopwatch size={18} />
                     <span className="font-semibold"> Later</span>
                      <FaChevronDown size={15}/>
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
           
         <Vehicles /> {/* for Vehicle select*/}
            
        </div>
      <Footer />
        
   </>
    )
}

export default page