"use client"
import { createContext, useState } from "react";

// Create context
export const NumberContext = createContext(null);

// Provider component
export const NumberProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    phoneNumber: "",
    pin: null,
    name: "",
    policyAccepted: false,
    FirstName: "",
    LastName:""
  });

  // Function to update any field dynamically
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <NumberContext.Provider value={{ formData, updateField }}>
      {children}
    </NumberContext.Provider>
  );
};
