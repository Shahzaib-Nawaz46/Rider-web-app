"use client";
import React, { useState } from "react";
import PhoneInput from "@/app/(Frontend)/components/PhoneInput";
import PinInput from "@/app/(Frontend)/components/PinInput";

export default function LoginPage() {
    const [step, setStep] = useState(1); // 1: Mobile, 2: PIN
    const [mobile, setMobile] = useState("");

    // Mobile Step Handler
    const handleMobileSubmit = (phoneNumber, country) => {
        if (phoneNumber.length > 0) {
            setMobile(phoneNumber);
            setStep(2);
        }
    };

    // PIN Step Handler
    const handlePinSubmit = (pin) => {
        console.log("Logging in with", mobile, pin);
        alert(`Logging in with Mobile: ${mobile}, PIN: ${pin}`);
        // Add actual login logic here
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
