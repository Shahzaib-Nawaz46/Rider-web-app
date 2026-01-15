"use client";
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from "@/app/(Frontend)/components/PhoneInput";
import { NumberContext } from "@/app/(Frontend)/Context/NumberContext";

export default function Verification() {
  const router = useRouter();
  const { formData, updateField } = useContext(NumberContext);

  const handleContinue = () => {
    // Validation is already done in PhoneInput partially, but we can double check
    if (!formData.phoneNumber || formData.phoneNumber.length < 10) return;

    // Proceed to next step
    router.push("/Rider/Verification/Createpin");
  };

  return (
    <div className="flex flex-col items-center h-screen pt-32 px-4">
      <PhoneInput
        onContinue={handleContinue}
        title="Welcome Rider"
        subtitle="Enter your phone number to start earning"
      />
    </div>
  );
}
