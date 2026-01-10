"use client";
import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { NumberContext } from "@/app/(Frontend)/Context/NumberContext";
import { FaChevronLeft, FaCamera } from "react-icons/fa";
import Footer from '@/app/(Frontend)/components/user-footer';

export default function ProfilePage() {
    const router = useRouter();
    const { formData } = useContext(NumberContext);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            if (!formData.phoneNumber) {
                setLoading(false);
                return;
            }

            try {
                const res = await axios.post("/Backend/api/UserProfile", {
                    phoneNumber: formData.phoneNumber
                });
                const user = res.data.user;
                if (user) {
                    setFirstName(user.FirstName || "");
                    setLastName(user.LastName || "");
                    setEmail(user.email || "");
                    setPhone(user.phoneNumber || formData.phoneNumber);
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [formData.phoneNumber]);

    const handleSave = async () => {
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const res = await axios.put("/Backend/api/UserProfile", {
                phoneNumber: phone, // Identify user by phone
                name: { firstName, lastName }, // Send object or separate fields depending on API expectation. Backend changes above expect name object for UPDATE? No, wait.
                // Re-checking backend replacement content: "UPDATE users SET FirstName = ?, LastName = ?, email = ? WHERE phoneNumber = ?", [name.firstName, name.lastName, email, phoneNumber]
                // So backend expects `name` to be an object with `firstName` and `lastName`.
                email
            });

            if (res.data.success) {
                setSuccess("Profile updated successfully");
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            setError("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-black flex flex-col items-center">
            <div className="w-full max-w-md flex flex-col justify-between min-h-screen">
                <div className="p-4 pt-4">
                    {/* Header */}
                    <div className="flex items-center mb-4">
                        <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
                            <FaChevronLeft size={18} />
                        </button>
                        <h1 className="text-lg font-bold ml-1">Edit Profile</h1>
                    </div>

                    {/* Avatar Section */}
                    <div className="flex justify-center mb-4">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
                                <Image
                                    src="/image.png"
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <button className="absolute bottom-0 right-0 bg-[#95CB33] p-1.5 rounded-full text-white border-2 border-white shadow-sm hover:bg-[#86b82e] transition-colors">
                                <FaCamera size={10} />
                            </button>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1 ml-1 uppercase tracking-wider">First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Enter First Name"
                                className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1 ml-1 uppercase tracking-wider">Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Enter Last Name"
                                className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1 ml-1 uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter Email"
                                className="w-full border border-gray-200 rounded-xl p-2.5 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-gray-50 focus:bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-500 mb-1 ml-1 uppercase tracking-wider">Phone</label>
                            <div className="flex items-center border border-gray-200 rounded-xl p-2.5 bg-gray-100">
                                <span className="mr-3 text-lg">🇮🇳</span> {/* Static flag for now */}
                                <input
                                    type="text"
                                    value={phone}
                                    readOnly
                                    className="w-full bg-transparent text-sm outline-none text-gray-500 cursor-not-allowed font-medium"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Messages */}
                    {error && <div className="bg-red-50 text-red-500 text-xs p-2 rounded-lg mt-3 text-center">{error}</div>}
                    {success && <div className="bg-green-50 text-green-600 text-xs p-2 rounded-lg mt-3 text-center">{success}</div>}

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full bg-[#1A1A1A] text-white font-bold py-3 rounded-xl mt-4 flex justify-center items-center disabled:opacity-70 shadow-lg hover:bg-black transition-all transform active:scale-[0.98]"
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Save Changes"
                        )}
                    </button>

                </div>

                <div className="w-full mt-auto">
                    <Footer />
                </div>
            </div>
        </div>
    );
}
