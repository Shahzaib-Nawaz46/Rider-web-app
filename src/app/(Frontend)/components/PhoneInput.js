"use client";
import React, { useState, useEffect,  useContext } from "react";
import Link from "next/link";
import { NumberContext } from "../Context/NumberContext";
import countries from "@/app/(Frontend)/components/Country.json"

const defaultCountries = [
    { callingCode: ["+92"], dial: "+92", flag: "https://flagsapi.com/PK/flat/64.png" },
];

export default function PhoneInput({
    onContinue,
    title = "Welcome aboard or back",
    subtitle = "Enter your phone number",
    showCreateAccountLine = false,
    createAccountLink = "/Verification"
}) {
    const [selected, setSelected] = useState(defaultCountries[0]); //its tells  the selected country code
    const [open, setOpen] = useState(false); // its tell the dropdown open or not 
    const [datas, setData] = useState([]); // store the whole data 
    const [Error, setError] = useState("")
    const { formData, updateField } = useContext(NumberContext); // getting data to store in db 
    

    useEffect(() => {
        // Initial setup if needed
        setSelected(defaultCountries[0]);
    }, []);

    useEffect(() => {
        const fetchdata = async () => {
            try {
                setData(countries);
                 
            } catch (err) {
                console.log(err);
                setData(defaultCountries);
            }
        };
        fetchdata();
    }, []);

   
    

    const handleSubmit = () => {
        if (formData.phoneNumber.length>=10 && formData.phoneNumber.length<=16) {
            setError("")
            onContinue()
        } else{
         setError("Enter your Correct Phone number")
        }
    };

    return (
        <div className="flex flex-col items-center w-full">
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="mt-2 text-gray-600">{subtitle}</p>

            {/* Input Box */}
            <div className="flex items-center border h-12 w-full max-w-sm rounded-xl px-3 mt-6 gap-3 relative">
                {/* Flag selector */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setOpen(!open)}>
                    <img src={selected?.flag} className="w-6 h-6 rounded-full" alt="flag" />
                    <span>{selected?.callingCode}</span>
                </div>

                {/* Phone input */}
                <input
                    type="number"
                    placeholder="000000000"
                    className="outline-none flex-1"
                    onChange={(e) => updateField("phoneNumber",`${selected?.callingCode}${e.target.value}`)}
                />

                {/* Dropdown */}
                {open && (
                    <div className="absolute top-14 left-3 bg-white border shadow-md rounded-lg w-40 z-50 h-80 overflow-auto">
                        {datas.length > 0 ? datas.map((c, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setSelected(c);
                                    setOpen(false);
                                }}
                            >
                                <img src={c.flag} className="w-6 h-6 rounded-full" alt={c.name} />
                                <span>{c.name}</span>
                            </div>
                        )) : (
                            <div className="p-2 text-sm text-gray-500">Loading...</div>
                        )}
                    </div>
                )}
            </div>

            <button
                onClick={handleSubmit}
                className="bg-black text-white py-3 mt-5 w-full max-w-sm rounded-xl text-center block cursor-pointer"
            >
                Continue
            </button>
            {Error && (
                <p className="m-3 text-red-600 font-bold text-xs">{Error}</p>
            )}

            {showCreateAccountLine && (
                <div className="mt-6 text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link href={createAccountLink} className="text-black font-bold underline">
                        Create new account
                    </Link>
                </div>
            )}
        </div>
    );
}
