"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import PinInput from "@/app/(Frontend)/components/PinInput";

const RiderLogin = () => {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (enteredPin) => {
        setError("");
        setLoading(true);

        if (!phoneNumber || phoneNumber.length < 10) {
            setError("Please enter a valid phone number.");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post("/api/RiderLogin", {
                phoneNumber,
                pin: enteredPin
            });

            if (res.status === 200) {
                console.log("Rider Login Success:", res.data);
                router.push("/");
            }
        } catch (err) {
            console.error("Login Erorr:", err);
            setError(err.response?.data?.error || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm">
                <h1 className="text-3xl font-bold text-center mb-8">Rider Login</h1>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            placeholder="Enter phone number"
                            className="w-full h-14 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-lg"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>

                    <div className="w-full">
                        {/* Using the requested PinInput component */}
                        {/* It handles its own state (using context) and calls onContinue with the PIN */}
                        <PinInput
                            title="Enter PIN"
                            subtitle=""
                            footerText=""
                            btnText={loading ? "Logging in..." : "Login"}
                            isLoading={loading}
                            onContinue={handleLogin}
                            error={error} // Passing error to PinInput to display
                        />
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <Link href="/Rider/Verification" className="text-black font-semibold hover:underline cursor-pointer">
                                Register here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiderLogin;
