"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PhoneInput from "@/app/components/PhoneInput";

export default function Verification() {
  const router = useRouter();

  const handleContinue = (phoneNumber, country) => {
    // Logic to handle phone number submission
    // For now, mirroring original behavior which was just a Link to Createpin
    // But since it's a function now, we route manually
    console.log("Phone submitted:", phoneNumber, country);
    router.push("/Verification/Createpin");
  };

  return (
    <div className="flex flex-col items-center h-screen pt-32 px-4">
      <PhoneInput
        onContinue={handleContinue}
        title="Welcome aboard or back"
        subtitle="Enter your phone number"
      />
    </div>
  );
}
