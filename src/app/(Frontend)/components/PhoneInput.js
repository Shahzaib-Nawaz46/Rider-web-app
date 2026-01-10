"use client";
import React, { useState, useEffect, useContext } from "react";
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
    createAccountLink = "/Verification",
    isLoading = false,
    error = ""
}) {
    const [selected, setSelected] = useState(defaultCountries[0]); //its tells  the selected country code
    const [open, setOpen] = useState(false); // its tell the dropdown open or not 
    const [datas, setData] = useState([]); // store the whole data 
    const [internalError, setInternalError] = useState("")
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
        if (formData.phoneNumber.length >= 10 && formData.phoneNumber.length <= 16) {
            setInternalError("")
            onContinue()
        } else {
            setInternalError("Enter your Correct Phone number")
        }
    };

    const displayError = internalError || error;

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-center tracking-tight">{title}</h1>
            <p className="mt-3 text-gray-500 text-center text-sm font-medium">{subtitle}</p>

            {/* Input Box */}
            <div
                className={`flex items-center border h-14 w-full rounded-2xl px-4 mt-8 gap-3 relative transition-all duration-200 ease-in-out bg-white ${open ? 'border-black ring-1 ring-black shadow-lg' : 'border-gray-200 hover:border-gray-400 hover:shadow-sm'
                    }`}
            >
                {/* Flag selector */}
                <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
                    onClick={() => setOpen(!open)}
                >
                    <img src={selected?.flag} className="w-6 h-6 rounded-full border border-gray-100 object-cover" alt="flag" />
                    <span className="font-semibold text-gray-700 text-sm">{selected?.callingCode}</span>
                </div>

                <div className="w-px h-6 bg-gray-200 mx-1"></div>

                {/* Phone input */}
                <input
                    type="number"
                    placeholder="000 0000000"
                    className="outline-none flex-1 text-lg font-medium placeholder-gray-300 bg-transparent w-full"
                    onChange={(e) => updateField("phoneNumber", `${selected?.callingCode}${e.target.value}`)}
                />

                {/* Dropdown */}
                {open && (
                    <div className="absolute top-16 left-0 bg-white border border-gray-100 shadow-xl rounded-2xl w-full z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                        {datas.length > 0 ? datas.map((c, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer first:rounded-t-2xl last:rounded-b-2xl transition-colors"
                                onClick={() => {
                                    setSelected(c);
                                    setOpen(false);
                                }}
                            >
                                <img src={c.flag} className="w-6 h-6 rounded-full border border-gray-100" alt={c.name} />
                                <span className="text-sm font-medium text-gray-700">{c.name}</span>
                                <span className="ml-auto text-xs text-gray-400 font-medium">{c.callingCode}</span>
                            </div>
                        )) : (
                            <div className="p-4 text-sm text-gray-500 text-center">Loading...</div>
                        )}
                    </div>
                )}
            </div>

            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`
                    relative overflow-hidden
                    bg-black text-white py-4 mt-6 w-full rounded-2xl text-center font-semibold text-lg
                    transition-all duration-300 ease-out
                    hover:bg-gray-900 hover:shadow-lg hover:shadow-gray-200
                    active:scale-[0.98]
                    disabled:opacity-70 disabled:cursor-not-allowed
                    flex justify-center items-center gap-2 cursor-pointer
                `}
            >
                {isLoading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Checking...</span>
                    </>
                ) : (
                    "Continue"
                )}
            </button>

            {displayError && (
                <div className="mt-4 flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-xl animate-in slide-in-from-top-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                    <p className="font-medium text-xs">{displayError}</p>
                </div>
            )}

            {showCreateAccountLine && (
                <div className="mt-8 text-sm text-gray-500 font-medium">
                    Don't have an account?{" "}
                    <Link href={createAccountLink} className="text-black font-bold hover:underline decoration-2 underline-offset-4">
                        Create new account
                    </Link>
                </div>
            )}
        </div>
    );
}
