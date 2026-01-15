"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import LoginComponent from "@/app/(Frontend)/components/LoginComponent";

export default function LoginPage() {
    const router = useRouter();

    const handleUserLogin = async (phoneNumber, pin) => {
        try {
            const result = await signIn("credentials", {
                redirect: false,
                phoneNumber: phoneNumber,
                pin: pin,
                loginType: "user",
            });

            if (result.error) {
                // Return error to be displayed by component
                throw new Error("Invalid Phone Number or PIN");
            } else {
                router.push("/User");
            }
        } catch (error) {
            console.error("Login error:", error);
            throw error; // Propagate error to update UI state
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-md">
                <LoginComponent
                    title="User Login"
                    subtitle="Welcome back, please login"
                    onSubmit={handleUserLogin}
                    registerLink="/User/Verification"
                    registerText="New User?"
                    registerLinkText="Create Account"
                />
            </div>
        </div>
    );
}
