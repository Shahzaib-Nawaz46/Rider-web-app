"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import LoginComponent from "@/app/(Frontend)/components/LoginComponent";

const RiderLogin = () => {
    const router = useRouter();

    const handleRiderLogin = async (phoneNumber, pin) => {
        try {
            const result = await signIn("credentials", {
                redirect: false,
                phoneNumber: phoneNumber,
                pin: pin,
                loginType: "rider",
            });

            if (result.error) {
                // Return error to be displayed by component
                throw new Error("Invalid Phone Number, PIN or not registered as Rider");
            } else {
                router.push("/");
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-md">
                <LoginComponent
                    title="Rider Login"
                    subtitle="Enter your phone and PIN to continue"
                    onSubmit={handleRiderLogin}
                    registerLink="/Rider/Verification"
                    registerText="New Rider?"
                    registerLinkText="Register here"
                />
            </div>
        </div>
    );
};

export default RiderLogin;
