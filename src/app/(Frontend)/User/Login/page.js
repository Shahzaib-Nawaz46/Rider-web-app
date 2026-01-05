"use client";
import React, { useState,useContext } from "react";
import PhoneInput from "@/app/(Frontend)/components/PhoneInput";
import PinInput from "@/app/(Frontend)/components/PinInput";
import { NumberContext } from "@/app/(Frontend)/Context/NumberContext";


export default function LoginPage() {
    const [step, setStep] = useState(1); // 1: phonenumber, 2: PIN
    const [mobile, setMobile] = useState("");
    const { formData, updateField } = useContext(NumberContext); // getting data to verify in db 
    


    // phonenumber Step Handler
    const handleMobileSubmit = () => {
        if (formData.phoneNumber.length>=10  && formData.phoneNumber.length<=16) {
            setStep(2);
        }
    };

    // PIN Step Handler
    const handlePinSubmit = (pin) => {
        console.log(formData)
        if(pin)
            {
            if (formData.pin.length==4) {
            
            console.log(formData)
        } 
        }
      
    };

    return (
        <div className="flex flex-col items-center h-screen pt-32 px-4">
            {step === 1 && (
                <PhoneInput
                    onContinue={handleMobileSubmit}
                    title="Welcome Back"
                    subtitle="Enter your phone number to login"
                    showCreateAccountLine={true}
                    createAccountLink="/Verification"
                />
            )}

            {step === 2 && (
                <>
                    <PinInput
                        onContinue={handlePinSubmit}
                        title="Enter Your Pin"
                        subtitle="Enter your 4-digit PIN to login"
                        footerText=""
                        btnText="Login"
                    />

                    <button
                        onClick={() => setStep(1)}
                        className="mt-4 text-sm text-gray-500 hover:text-black"
                    >
                        Change Phone Number
                    </button>
                </>
            )}
        </div>
    );
}
