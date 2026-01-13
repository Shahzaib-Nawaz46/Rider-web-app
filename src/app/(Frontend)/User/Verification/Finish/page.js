"use client";
import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { NumberContext } from "@/app/(Frontend)/Context/NumberContext";
import axios from "axios";

export default function FinishProfile() {
  const router = useRouter();
  const { formData, updateField } = useContext(NumberContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!formData.FirstName || !formData.LastName) {
      setError("Please enter your first and last name");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/UserRegistration", {
        phoneNumber: formData.phoneNumber,
        pin: formData.pin,
        policyAccepted: formData.policyAccepted,
        FirstName: formData.FirstName,
        LastName: formData.LastName
      });

      if (res.status === 200 || res.status === 201) {
        // Success: Show popup instead of auto-redirect
        setShowSuccess(true);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white relative overflow-hidden">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <h1 className="text-4xl font-extrabold text-center tracking-tight mb-3 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Finish Sign Up
        </h1>
        <p className="text-gray-500 text-center mb-10 text-lg">
          Your account is almost ready. Please enter your name to complete your profile.
        </p>

        <div className="space-y-5">
          <div className="group">
            <input
              type="text"
              placeholder="First Name"
              className="w-full h-14 px-5 rounded-2xl border border-gray-200 outline-none text-lg placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 bg-gray-50/50 group-hover:bg-white group-hover:shadow-md"
              onChange={(e) => updateField("FirstName", e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="group">
            <input
              type="text"
              placeholder="Last Name"
              className="w-full h-14 px-5 rounded-2xl border border-gray-200 outline-none text-lg placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-all duration-300 bg-gray-50/50 group-hover:bg-white group-hover:shadow-md"
              onChange={(e) => updateField("LastName", e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`
              relative w-full h-14 mt-8 rounded-2xl font-bold text-lg text-white
              bg-black hover:bg-gray-900 
              hover:scale-[1.02] hover:shadow-xl hover:shadow-black/20
              active:scale-[0.98] active:shadow-none
              transition-all duration-300 ease-out
              disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none
              flex justify-center items-center gap-3 overflow-hidden cursor-pointer
            `}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin " />
                <span>Creating Account...</span>
              </>
            ) : (
              "Complete Profile"
            )}
            {!isLoading && (
              <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
            )}
          </button>

          {error && (
            <div className="flex items-center gap-3 text-red-500 bg-red-50 px-5 py-4 rounded-2xl animate-in slide-in-from-top-2 duration-300 mt-4 border border-red-100 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-semibold">{error}</p>
            </div>
          )}
        </div>
      </div>

      {/* Success Popup/Modal */}
      {showSuccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl flex flex-col items-center animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-10 h-10 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
            <p className="text-gray-500 mb-8 font-medium">Your account has been successfully verified and created.</p>

            <button
              onClick={() => router.push("/User/Login")}
              className="w-full h-14 bg-black text-white rounded-2xl font-bold text-lg hover:bg-gray-800 hover:scale-[1.02] hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}