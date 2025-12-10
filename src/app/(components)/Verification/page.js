"use client";
import { useState } from "react";

const countries = [
  { code: "PK", dial: "+92", flag: "https://flagsapi.com/PK/flat/64.png" },
  { code: "IN", dial: "+91", flag: "https://flagsapi.com/IN/flat/64.png" },
  { code: "BD", dial: "+880", flag: "https://flagsapi.com/BD/flat/64.png" },
];

export default function Verification() {
  const [selected, setSelected] = useState(countries[0]);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center h-screen pt-32 px-4">

      <h1 className="text-3xl font-bold">Welcome aboard or back</h1>
      <p className="mt-2 text-gray-600">Enter your phone number</p>

      {/* Input Box */}
      <div className="flex items-center border h-12 w-full max-w-sm rounded-xl px-3 mt-6 gap-3 relative">

        {/* Flag selector */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setOpen(!open)}>
          <img src={selected.flag} className="w-6 h-6 rounded-full" />
          <span>{selected.dial}</span>
        </div>

        {/* Phone input */}
        <input
          type="text"
          placeholder="000000000"
          className="outline-none flex-1"
        />

        {/* Dropdown */}
        {open && (
          <div className="absolute top-14 left-3 bg-white border shadow-md rounded-lg w-40 z-50">
            {countries.map((c) => (
              <div
                key={c.code}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSelected(c);
                  setOpen(false);
                }}
              >
                <img src={c.flag} className="w-6 h-6 rounded-full" />
                <span>{c.dial}</span>
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
