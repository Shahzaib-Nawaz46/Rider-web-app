"use client"
import Link from "next/link"
import { NumberContext } from "@/app/(Frontend)/Context/NumberContext";
import { useState,useContext } from "react";

export default function TermsAndConditions() {
  const { formData, updateField } = useContext(NumberContext); // getting data to store in db 
  const handleSubmit = ()=>{
     updateField("policyAccepted",true)
     
  }

  console.log(formData)
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-lg p-6">
        
        <h1 className="text-xl font-semibold text-center mb-4">
          Terms & Conditions
        </h1>

        <div className="text-sm text-gray-700 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          
          <p>
            Thank you for choosing our application.
          </p>

          <p>
            This project has been created <strong>strictly for learning,
            educational, and experimental purposes only</strong>. It is not a
            real ride-booking platform and does not provide any commercial
            transportation services.
          </p>

          <h2 className="font-semibold">Purpose of the Project</h2>
          <p>
            This application is a demo project built to understand app
            development, user experience, and system workflows. It is not
            intended for real-world ride booking or transportation services.
          </p>

          <h2 className="font-semibold">User Responsibility</h2>
          <p>
            If you choose to use this application as a rider or passenger in
            real-life situations, you do so entirely at your own risk.
          </p>

          <h2 className="font-semibold">No Liability</h2>
          <p>
            We are not responsible for any accidents, injuries, financial
            losses, disputes, or damages caused by using this application.
          </p>

          <h2 className="font-semibold">No Commercial Use</h2>
          <p>
            This project must not be used for commercial ride booking or
            profit-making activities.
          </p>

          <h2 className="font-semibold">Acceptance of Terms</h2>
          <p>
            By clicking “Accept & Continue”, you acknowledge that this is a
            learning-based project and accept full responsibility for its use.
          </p>
        </div>

     <Link 
     onClick={handleSubmit}
  href="/Rider/Verification/Finish"
  className="mt-6 w-full inline-flex items-center justify-center
             bg-black text-white py-3 rounded-xl font-medium
             hover:opacity-90 transition"
>
  Accept & Continue
</Link>
      </div>
    </div>
  );
}
