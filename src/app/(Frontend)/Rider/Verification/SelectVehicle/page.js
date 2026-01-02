"use client"
import React from 'react'
import Vehicle from '@/app/(Frontend)/components/Vehicle'

const selectVehicle = (selection) => {
  return (
    <>
         <div className=' justify-center items-center'>
            <h1 className='text-3xl text-center m-10 mt-56 font-semibold'>Select Your Vehicle</h1>

         <div className=''>
            <div className=''>

             <Vehicle selection={"Select"} />
            </div>
         </div>
         </div>
    
    </>
    
  )
}

export default selectVehicle