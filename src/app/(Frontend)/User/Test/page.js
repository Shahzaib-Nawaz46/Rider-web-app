"use client"
import React, { useEffect, useState } from 'react'

import axios from "axios";
const page = () => {
  const [response, setResponse] = useState(null);

  useEffect(() => {
    async function registerUser() {
      try {
        const res = await axios.post("/Backend/api/UserRegistration", {
          phoneNumber: "03001234567",
          pin: 1234,
          policyAccepted: true,   // 👈 MUST be boolean true
          FirstName: "Ayan",
          LastName: "Khan",
        });

        console.log(res.data);
        setResponse(res.data);
      } catch (error) {
        console.error(error.response?.data || error.message);
      }
    }
    registerUser()
  }, [])

  return (
    <div>
      <h1>Test Page</h1>
      {response ? (
        <pre>{JSON.stringify(response, null, 2)}</pre>
      ) : (
        <p>Loading or checking console...</p>
      )}
    </div>
  )
}

export default page