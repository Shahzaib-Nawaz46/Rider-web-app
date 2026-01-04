"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PhoneInput from "@/app/(Frontend)/components/PhoneInput";

export default function Verification() {
  const router = useRouter();

  const handleContinue = () => {
    
    router.push("/User/Verification/Createpin");
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
