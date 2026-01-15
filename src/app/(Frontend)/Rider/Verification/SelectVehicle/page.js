"use client"
import React, { useContext } from 'react'
import Vehicle from '@/app/(Frontend)/components/Vehicle'
import { useRouter } from 'next/navigation'
import { NumberContext } from "@/app/(Frontend)/Context/NumberContext";

const SelectVehicle = () => {
  const router = useRouter();
  const { formData, updateField } = useContext(NumberContext);

  const handleSelect = (selection) => {
    // Map the selection string from the component to our internal types
    // The component returns "Book Now" or similar button text currently, 
    // OR we need to modify the component to return the type.
    // Let's look at Vehicle.js:
    // It renders buttons with {selection} prop. 
    // It doesn't seem to have an onClick handler that passes back the vehicle type.
    // It just displays the UI. 

    // Wait, looking at Vehicle.js again:
    // It accepts `oncontiue` (typo in prop name) but doesn't seem to call it on specific vehicle selection.
    // It's a Swiper.
    // The user said "yahan se vehcile lo".
    // The component hardcodes the slides.
    // I need to wrap it or modify it to be interactive if I can't effectively use it as is.
    // HOWEVER, since I can't easily modify the complex component without risk of breaking other things,
    // and the user wants THIS design.

    // Let's look at how I can hook into it.
    // The buttons inside `Vehicle.js` don't have onClick handlers attached to a specific type.
    // I might need to make a small edit to `Vehicle.js` to support selection, 
    // or just render it and overlay my own controls? No that's messy.

    // Best approach: Enhance `Vehicle.js` slightly to pass back the type, OR
    // reimplement the Swiper here if the user permits, BUT user said "design q change krdiya", implying they want the Swiper.

    // actually looking at the code provided in Vehicle.js:
    // <button className='my-3 p-2 rounded-lg bg-black text-white'>{selection}</button>
    // Use `selection` prop to set button text.

    // I will MODIFY Vehicle.js slightly to accept an onSelect callback.
    // But first, let's just make the page work with the existing one if possible? No, it's static.

    // Okay, I will try to use the component, but I need to modify it to handle clicks.
    // BUT, since I cannot modify it effectively without potentially breaking usage elsewhere (if any), 
    // I will just Import it and Wrap it? No, that won't work for inner buttons.

    // User said: "yahan se vehcile lo" (take vehicle from here).
    // So I must use it.

    // I will modify `Vehicle.js` to accept `onSelect` and call it with the vehicle type.
    // Then I will use it here.
  }

  // RE-READING intent:
  // The user wants the DESIGN of `Vehicle.js`.
  // I will copy the Swiper implementation into this page to ensure I can make it interactive
  // WITHOUT modifying the shared component which might be used elsewhere (like home page).
  // This is safer.

  // ... Actually, the user specifically pointed to the filepath `@[src/app/(Frontend)/components/Vehicle.js]`.
  // "yahan se vehcile lo" -> Take vehicle from here.
  // If I duplicate code, they might complain "why not use component".
  // I'll try to use the component but if it lacks functionality I'll update it.
  // Updating `Vehicle.js` seems correct.

  return (
    <div className='flex flex-col justify-center items-center h-screen bg-white'>
      <h1 className='text-3xl font-bold mb-10 text-center mt-20'>Select Your Vehicle</h1>
      <div className="w-full max-w-4xl">
        <Vehicle
          selection="Select"
          onSelect={(type) => {
            updateField('vehicleType', type);
            router.push('/Rider/Verification/Finish');
          }}
        />
      </div>
    </div>
  )
}

export default SelectVehicle