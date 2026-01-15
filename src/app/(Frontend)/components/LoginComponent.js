"use client";
import React, { useState, useEffect, useContext, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { NumberContext } from "../Context/NumberContext";
import countries from "@/app/(Frontend)/components/Country.json";

const defaultCountries = [
    { callingCode: ["+92"], dial: "+92", flag: "https://flagsapi.com/PK/flat/64.png" },
];

export default function LoginComponent({
    title = "Login",
    subtitle = "Enter your phone and PIN",
    apiEndpoint,      // Optional: For direct API calls (Rider)
    redirectPath,     // Optional: For direct API calls (Rider)
    onSubmit,         // Optional: Custom handler (User/NextAuth) - receives (phone, pin)
    registerLink,
    registerText = "Don't have an account?",
    registerLinkText = "Register here"
}) {
    const router = useRouter();
    // Phone State
    const [selected, setSelected] = useState(defaultCountries[0]);
    const [open, setOpen] = useState(false);
    const [datas, setData] = useState([]);
    const [phoneNumberRaw, setPhoneNumberRaw] = useState("");

    // PIN State
    const [pin, setPin] = useState(["", "", "", ""]);
    const inputsRef = useRef([]);

    // General State
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Context
    const { updateField } = useContext(NumberContext);

    // Fetch Countries
    useEffect(() => {
        setSelected(defaultCountries[0]);
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

    // Phone Handlers
    const handlePhoneChange = (e) => {
        setPhoneNumberRaw(e.target.value);
    };

    // PIN Handlers
    const handlePinChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;
        if (value.length > 1) { // Paste logic
            const digits = value.slice(0, 4).split("");
            const newPin = [...pin];
            digits.forEach((d, i) => {
                if (index + i < 4) newPin[index + i] = d;
            });
            setPin(newPin);
            const nextIndex = Math.min(index + digits.length, 3);
            inputsRef.current[nextIndex]?.focus();
            return;
        }
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);
        if (value && index < 3) inputsRef.current[index + 1].focus();
    };

    const handlePinKeyDown = (e, index) => {
        if (e.key === "Backspace" && pin[index] === "" && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    // Login Handler
    const handleLogin = async () => {
        setError("");

        const fullPhoneNumber = `${selected?.callingCode}${phoneNumberRaw}`;
        const enteredPin = pin.join("");

        if (phoneNumberRaw.length < 7) {
            setError("Please enter a valid phone number");
            return;
        }
        if (enteredPin.length < 4) {
            setError("Please enter your 4-digit PIN");
            return;
        }

        setLoading(true);

        try {
            updateField("phoneNumber", fullPhoneNumber);

            if (onSubmit) {
                // Custom Handler (e.g. NextAuth)
                await onSubmit(fullPhoneNumber, enteredPin);
                // Note: onSubmit is responsible for navigation. 
                // We stop loading only if it returns (meaning no nav or error handled outside)
                // usually we might want to keep loading if navigating.
            } else if (apiEndpoint) {
                // Default Axios Handler
                const res = await axios.post(apiEndpoint, {
                    phoneNumber: fullPhoneNumber,
                    pin: enteredPin
                });

                if (res.status === 200) {
                    router.push(redirectPath);
                }
            }
        } catch (err) {
            console.error("Login Error:", err);
            // If onSubmit threw an error, we catch it here
            setError(err.message || err.response?.data?.error || "Invalid credentials");
            setLoading(false);
        } finally {
            // Only stop loading if we didn't use default nav or if custom handler finished without nav
            if (!apiEndpoint || error) {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-sm mx-auto">
            <h1 className="text-3xl font-extrabold text-center text-gray-900 tracking-tight">{title}</h1>
            <p className="mt-3 text-gray-500 text-center text-base font-medium">{subtitle}</p>

            {/* Phone Input Section */}
            <div
                className={`
                    flex items-center h-14 w-full rounded-2xl px-4 mt-8 gap-3 relative transition-all duration-300 ease-out bg-white
                    border border-gray-300
                    focus-within:border-black focus-within:ring-1 focus-within:ring-black focus-within:shadow-lg
                    hover:border-gray-400 hover:shadow-md
                    ${open ? 'ring-1 ring-black shadow-lg z-20 border-black' : ''}
                `}
            >
                <div
                    className="flex items-center gap-2 cursor-pointer p-1 rounded-lg transition-transform active:scale-95 select-none"
                    onClick={() => setOpen(!open)}
                >
                    <img src={selected?.flag} className="w-6 h-6 rounded-full border border-gray-200 object-cover shadow-sm" alt="flag" />
                    <span className="font-bold text-gray-800 text-sm">{selected?.callingCode}</span>
                    <svg className={`w-3 h-3 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </div>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                <input
                    type="number"
                    placeholder="300 1234567"
                    className="outline-none flex-1 text-lg font-bold placeholder-gray-400 bg-transparent w-full text-gray-900 tracking-wide"
                    onChange={handlePhoneChange}
                    value={phoneNumberRaw}
                />

                {/* Country Dropdown */}
                {open && (
                    <div className="absolute top-16 left-0 bg-white border border-gray-100 shadow-2xl rounded-2xl w-full z-50 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200 custom-scrollbar">
                        {datas.length > 0 ? datas.map((c, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer first:rounded-t-2xl last:rounded-b-2xl transition-colors border-b border-gray-50 last:border-0" onClick={() => { setSelected(c); setOpen(false); }}>
                                <img src={c.flag} className="w-6 h-6 rounded-full border border-gray-100 shadow-sm" alt={c.name} />
                                <span className="text-sm font-semibold text-gray-700">{c.name}</span>
                                <span className="ml-auto text-xs text-gray-500 font-bold bg-gray-100 px-2 py-1 rounded-md">{c.callingCode}</span>
                            </div>
                        )) : <div className="p-4 text-center text-gray-500 font-medium">Loading...</div>}
                    </div>
                )}
            </div>

            {/* PIN Input Section */}
            <div className="mt-8 w-full">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 text-center">Enter PIN Code</label>
                <div className="flex gap-4 justify-center">
                    {pin.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputsRef.current[index] = el)}
                            type="password"
                            inputMode="numeric"
                            maxLength={4}
                            value={digit}
                            onChange={(e) => handlePinChange(e.target.value, index)}
                            onKeyDown={(e) => handlePinKeyDown(e, index)}
                            className={`
                                w-14 h-14 rounded-2xl text-2xl text-center font-bold text-gray-900 
                                outline-none transition-all duration-300 transform
                                bg-white border border-gray-300 shadow-sm
                                focus:border-black focus:border-2 focus:shadow-xl focus:scale-110 focus:z-10
                                hover:border-gray-400 hover:shadow-md
                            `}
                        />
                    ))}
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-6 flex items-center justify-center gap-2 text-red-600 bg-red-50/50 px-4 py-3 rounded-2xl w-full animate-in slide-in-from-top-2 border border-red-100 backdrop-blur-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                    <p className="font-bold text-xs">{error}</p>
                </div>
            )}

            {/* Login Button */}
            <button
                onClick={handleLogin}
                disabled={loading}
                className={`
                    relative overflow-hidden
                    bg-black text-white py-4 mt-8 w-full rounded-2xl text-center font-bold text-lg
                    transition-all duration-300 ease-out
                    hover:bg-gray-800 hover:shadow-xl hover:shadow-black/20 hover:scale-[1.03]
                    active:scale-[0.98] active:shadow-none
                    disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                    flex justify-center items-center gap-3 cursor-pointer shadow-lg group
                `}
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Logging in...</span>
                    </>
                ) : (
                    <>
                        <span>Login</span>
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </>
                )}
            </button>

            {/* Register Link */}
            {registerLink && (
                <div className="mt-8 text-sm text-gray-500 font-medium opacity-80 hover:opacity-100 transition-opacity">
                    {registerText}{" "}
                    <Link href={registerLink} className="text-black font-extrabold hover:underline decoration-2 underline-offset-4 cursor-pointer ml-1">
                        {registerLinkText}
                    </Link>
                </div>
            )}
        </div>
    );
}
