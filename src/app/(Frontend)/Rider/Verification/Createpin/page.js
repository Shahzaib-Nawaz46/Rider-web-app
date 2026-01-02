"use client";
import React from "react";
import PinInput from "@/app/(Frontend)/components/PinInput";
import { useRouter } from "next/navigation";

const Page = () => {
    const router = useRouter();
  
  const handlePinSubmit = (pin) => {
    console.log("PIN Created:", pin);
    router.push("/Rider/Verification/Policy")
    // Add logic for what happens after PIN creation
  };

  return (
    <div className="flex items-center flex-col h-screen justify-center">
      <PinInput
        onContinue={handlePinSubmit}
        title="Create Your Pin"
        subtitle="Create a 4-digit PIN to secure your account"
        footerText="You’ll use this PIN to login next time"
      />
    </div>
  );
};

export default Page;
