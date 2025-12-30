"use client";
import React from "react";
import PinInput from "@/app/components/PinInput";

const Page = () => {
  const handlePinSubmit = (pin) => {
    console.log("PIN Created:", pin);
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
