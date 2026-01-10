"use client";
import React, { useState, useContext } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PhoneInput from "@/app/(Frontend)/components/PhoneInput";
import { NumberContext } from "@/app/(Frontend)/Context/NumberContext";
import axios from "axios";

export default function Verification() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { formData } = useContext(NumberContext);

  const handleContinue = async () => {
    // Validate length before sending
    if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
      setError("Enter a valid phone number");
      return;
    }

    setIsLoading(true);
    setError(""); // Clear previous errors

    try {
      const res = await axios.post("/Backend/api/checkphone", {
        phoneNumber: formData.phoneNumber
      });

      console.log("Phone check result:", res.data);

      if (res.data.exists) {
        // If number exists, do NOT go to next page. Show error.
        setError("This number is already registered, try another one");
      } else {
        // If number does NOT exist, proceed (assuming this is registration flow for new users)
        router.push("/User/Verification/Createpin");
      }
    } catch (err) {
      console.error("Error checking phone:", err);
      setError("Try again");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen pt-32 px-4 bg-white">
      <PhoneInput
        onContinue={handleContinue}
        title="Welcome aboard or back"
        subtitle="Enter your phone number"
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
