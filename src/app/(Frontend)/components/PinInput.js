"use client";
import React, { useState, useRef,useContext } from "react";
import { NumberContext } from "../Context/NumberContext";


export default function PinInput({
    onContinue,
    title = "Create Your Pin",
    subtitle = "Create a 4-digit PIN to secure your account",
    footerText = "You’ll use this PIN to login next time",
    btnText = "Continue"
}) {
    const [pin, setPin] = useState(["", "", "", ""]);
    const inputsRef = useRef([]);
    const { formData, updateField } = useContext(NumberContext); // getting data to store in db 
    const [Error, setError] = useState("")

    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value)) return;

        // Handle paste (multiple digits)
        if (value.length > 1) {
            const digits = value.slice(0, 4).split("");
            const newPin = [...pin];

            digits.forEach((d, i) => {
                if (index + i < 4) {
                    newPin[index + i] = d;
                }
            });

            setPin(newPin);

            const nextIndex = Math.min(index + digits.length, 3);
            inputsRef.current[nextIndex]?.focus();
            return;
        }

        // Normal typing
        const newPin = [...pin];
        newPin[index] = value;
        setPin(newPin);

        if (value && index < 3) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && pin[index] === "" && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handleSubmit = async() => {
        if (pin.includes("")) {
             setError("Please enter 4 digit pin");
             return
           
        } else {
            await updateField("pin",pin.join(""))
            setError("");
            onContinue();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full">
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="m-3 text-gray-700 text-sm">{subtitle}</p>

            <div className="flex gap-4 mt-2">
                {pin.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => (inputsRef.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        value={digit}
                        onChange={(e) => handleChange(e.target.value, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="border border-[#ccc] w-12 h-14 rounded-lg text-2xl text-center"
                    />
                ))}
            </div>

            <button
                onClick={handleSubmit}
                className="border p-3 w-80 m-5 rounded-lg bg-black text-white font-semibold cursor-pointer"
            >
                {btnText}
            </button>

          

            {footerText && (
                <p className="text-xs text-gray-700">
                    {footerText}
                </p>
            )}

             {Error && 
           <p className="m-5 text-sm text-red-600 font-semibold ">{Error}</p>
           }
        </div>
    );
}
