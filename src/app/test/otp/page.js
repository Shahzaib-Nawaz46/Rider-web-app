"use client";

import { useState } from "react";
import { auth } from "@/app/test/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function TestOTP() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const sendOTP = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha",
        { size: "invisible" }
      );
    }

    signInWithPhoneNumber(auth, phone, window.recaptchaVerifier)
      .then((res) => {
        window.confirmationResult = res;
        alert("OTP sent");
      })
      .catch((err) => {
        console.log(err);
        alert(err.message);
      });
  };

  const verifyOTP = () => {
    window.confirmationResult
      .confirm(otp)
      .then(() => alert("Phone Verified ✅"))
      .catch(() => alert("Wrong OTP ❌"));
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Firebase OTP Test</h2>

      <input
        placeholder="+923001234567"
        onChange={(e) => setPhone(e.target.value)}
      />
      <br /><br />

      <button onClick={sendOTP}>Send OTP</button>
      <br /><br />

      <input
        placeholder="Enter OTP"
        onChange={(e) => setOtp(e.target.value)}
      />
      <br /><br />

      <button onClick={verifyOTP}>Verify OTP</button>

      <div id="recaptcha"></div>
    </div>
  );
}
