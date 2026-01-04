"use client"
import {  createContext,useState } from "react";

export const NumberContext = createContext(null);


export const NumberProvider = ({children}) => {
    const [phoneNumber, setPhoneNumber] = useState([""])
  return (
    <NumberContext.Provider value={{phoneNumber,setPhoneNumber}}>
        {children}
    </NumberContext.Provider>
    
  )
}

