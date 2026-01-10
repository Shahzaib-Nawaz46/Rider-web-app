"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import PhoneInput from "@/app/(Frontend)/components/PhoneInput";
import PinInput from "@/app/(Frontend)/components/PinInput";
import { NumberContext } from "@/app/(Frontend)/Context/NumberContext";


export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: phonenumber, 2: PIN
    const [mobile, setMobile] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { formData, updateField } = useContext(NumberContext); // getting data to verify in db 



    // phonenumber Step Handler
    const handleMobileSubmit = () => {
        if (formData.phoneNumber.length >= 10 && formData.phoneNumber.length <= 16) {
            setStep(2);
        }
    };

    // PIN Step Handler
    const handlePinSubmit = async (pin) => {
        if (!pin || pin.length !== 4) return;

        setIsLoading(true);
        setError("");

        try {
            const res = await axios.post("/Backend/api/LoginVerify", {
                phoneNumber: formData.phoneNumber,
                pin: pin,
            });

            if (res.status === 200) {
                // Login successful
                if (res.data.user) {
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                }
                router.push("/User");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(error.response?.data?.error || "Login failed");
        } finally {
            setIsLoading(false);
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
                        isLoading={isLoading}
                        error={error}
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
