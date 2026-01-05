"use client"
import { NumberContext } from "@/app/(Frontend)/Context/NumberContext";
import { useState,useContext } from "react";
const page = () => {
  const { formData, updateField } = useContext(NumberContext); // getting data to store in db 
    const handleSubmit = ()=>{
       console.log(formData)
       
    }
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
        <h1 className='text-3xl font-semibold'>Finish Sign up</h1>
        <p className='text-gray-700 m-5'>You are created Your Account Please Enter your Name to completed Your profile</p>
        <div className='flex flex-col gap-5 justify-center  '>
            <input type="text" placeholder=' First Name' className='border h-12 p-2 w-80 rounded-lg  placeholder:font-medium  text-lg' 
             onChange={(e) => updateField("FirstName",e.target.value)}
             />
            <input type="text" placeholder=' Last Name'className='h-12 border p-2 w-80 rounded-lg    placeholder:font-medium text-lg'
              onChange={(e) => updateField("LastName",e.target.value)}
            />
           <button className='w-80 bg-black text-white font-medium h-12 rounded-lg' onClick={handleSubmit}>Complete Profile</button>
        </div>
    </div>
  )
}

export default page