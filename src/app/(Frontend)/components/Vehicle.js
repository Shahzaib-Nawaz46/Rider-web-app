"use client"
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import { FaUser } from "react-icons/fa";

// Import Swiper styles
import 'swiper/css';

export default () => {
  return (

    <section className='mx-2  h-30 z-10'>
      <Swiper
        spaceBetween={5}
        slidesPerView={1.5}
        breakpoints={{
    640: {   // tablets
      slidesPerView: 2,
      spaceBetween: 10,
    },
    1024: {  // laptops & desktops
      slidesPerView: 3,
      spaceBetween: 12,   // gap kam on big screen
    },
    1280: {  // large screens
      slidesPerView: 3,
      spaceBetween: 16,
    },
  }}
>
      
        <SwiperSlide className='mx-4 '>
          <div className='w-50 h-55 border-2 border-gray-300 rounded-2xl bg-white shadow-md '>
            <div>
              <div className=' w-full h-25 relative'>

                <Image
                  src={"/comfort-removebg-preview.png"}
                  alt='Comfort car'
                  fill
                  unoptimized
                  className='p-2 pb-1 pt-3'
                />
              </div>
            </div>


            <div className='p-3 pt-0'>
              <h1 className='text-xl font-bold font-family-arial'>Comfort</h1>
              <div className='flex items-center gap-1.5'>
                <span className='bg-[#95CB33] rounded-lg w-7 h-6 justify-center flex items-center'>
                  <FaUser className='text-xs' />
                </span>
                <h1 className=''>4 people</h1>

              </div>

              <button className='my-3 p-2 rounded-lg bg-black text-white'>Book Now</button>
            </div>

          </div>
        </SwiperSlide>

        {/* slide for mini car */}
        <SwiperSlide>
          <div className=' w-50 h-55  border-2 border-gray-300 rounded-2xl bg-white shadow-md'>
            <div>
              <Image
                src={"/mini-removebg-preview.png"}
                alt='Mini car'
                width={700}
                height={700}
                unoptimized
                className='p-2 pb-1 pt-3'
              />
            </div>


            <div className='p-3 pt-0 '>
              <h1 className='text-xl font-bold font-family-arial'>Mini </h1>
              <div className='flex items-center gap-1.5'>
                <span className='bg-[#95CB33] rounded-lg w-7 h-6 justify-center flex items-center'>
                  <FaUser className='text-xs' />
                </span>
                <h1>4 people</h1>

              </div>

              <button className='my-3 p-2  rounded-lg bg-black text-white'>Book Now</button>
            </div>

          </div>
        </SwiperSlide>

        {/* slide for Rickhaw */}
        <SwiperSlide>
          <div className='w-55 h-55 border-2 border-gray-300 rounded-2xl bg-white shadow-md'>
            <div className=''>
              <div className=' w-full h-25 relative'>

                <Image
                  src={"/rickshaw-removebg-preview.png"}
                  alt='Comfort car'
                  fill
                  unoptimized
                  className='p-2 pb-1 pt-3'
                />
              </div>
            </div>


            <div className='p-3 pt-0'>
              <h1 className='text-xl font-bold font-family-arial'>Rickshaw</h1>
              <div className='flex items-center gap-1.5'>
                <span className='bg-[#95CB33] rounded-lg w-7 h-6 justify-center flex items-center'>
                  <FaUser className='text-xs' />
                </span>
                <h1>3 people</h1>

              </div>

              <button className='my-3 p-2 rounded-lg bg-black text-white'>Book Now</button>
            </div>

          </div>
        </SwiperSlide>
        {/* slide for bike */}
        <SwiperSlide>
          <div className='w-50 h-55 border-2 border-gray-300 rounded-2xl bg-white shadow-md'>
            <div>
              <div className='w-full h-25 relative'>

                <Image
                  src={"/bike-removebg-preview.png"}
                  alt='Comfort car'
                  fill
                  className='p-2 pb-1 pt-3'
                />
              </div>
            </div>


            <div className='p-3 pt-0 '>
              <h1 className='text-xl font-bold font-family-arial'>Motor Bike </h1>
              <div className='flex items-center gap-1.5'>
                <span className='bg-[#95CB33] rounded-lg w-7 h-6 justify-center flex items-center'>
                  <FaUser className='text-xs' />
                </span>
                <h1>1 people</h1>

              </div>

              <button className='my-3 p-2  rounded-lg bg-black text-white'>Book Now</button>
            </div>

          </div>
        </SwiperSlide>

      </Swiper>
    </section>
  );
};