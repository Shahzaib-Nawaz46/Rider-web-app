"use client";
import React from "react";
import { useState,useEffect } from "react";
import axios from 'axios';



const countries = [
  { callingCodes: ["+92"] , dial: "+92", flag: "https://flagsapi.com/PK/flat/64.png" },
 
];

export default function Verification() {


  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [datas,setData] = useState([])
     
  useEffect(() => {
    console.log(selected)
    setSelected(countries[0])
   
  }, [])


  useEffect(() => {
    const fetchdata = async() =>{
      try{
        
        const res = await fetch("/api/countries");
        const data = await res.json()
        setData(data)
      } catch(err){
        console.log(err)
      }
    }
    fetchdata()
   
  }, [])
    
  
  
  
  return (
    <div className="flex flex-col items-center h-screen pt-32 px-4">

      <h1 className="text-3xl font-bold">Welcome aboard or back</h1>
      <p className="mt-2 text-gray-600">Enter your phone number</p>

      {/* Input Box */}
      <div className="flex items-center border h-12 w-full max-w-sm rounded-xl px-3 mt-6 gap-3 relative">

        {/* Flag selector */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setOpen(!open)}>
          <img src={selected.flag} className="w-6 h-6 rounded-full" />
          <span>{selected.callingCodes}</span>
        </div>

        {/* Phone input */}
        <input
          type="number"
          placeholder="000000000"
          className="outline-none flex-1"
        />

        {/* <input type="text" /> */}

        {/* Dropdown */}
        {open && (
          <div className="absolute top-14 left-3 bg-white border shadow-md rounded-lg w-40 z-50 h-80 overflow-auto">
            {datas.map((c,i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelected(c);
                  setOpen(false);
                }}
              >
                <img src={c.flag} className="w-6 h-6 rounded-full" />
                <span>{c.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
     
      <button className="bg-black text-white py-3 mt-5 w-full max-w-sm rounded-xl">
        Continue With Phone
      </button>
    </div>
  );
}
