"use client"
import { useState,useRef } from "react"
import { useForm } from "react-hook-form"


const page = props => {

    const [pin, setpin] = useState(["","","",""])
    const inputsref = useRef([])

    const handlechange =(value,index)=>{
        if(!/^\d?$/.test(value)) return
        
        const newpin = [...pin];
        newpin[index] = value;
        setpin(newpin)

        if(value && index<3){
            inputsref.current[index+1].focus();
        }
    }

    const handledown =(e,index)=>{
        if(e.key ==="Backspace" && pin[index]==="" && index>0){
            inputsref.current[index-1].focus()
        }
    }
    return (
        <div className="flex items-center flex-col h-screen justify-center">
            <h1 className="text-3xl font-bold">Create Your Pin</h1>
            <p className="m-3  text-gray-700 text-sm">Create a 4-digit PIN to secure your account</p>

            <div className="flex gap-4 mt-2">
                {/* to gen a input fields */}
                {pin.map((digit,index)=>(
                        <input 
                        key={index}
                        ref={(el) => (inputsref.current[index] = el)}

                         type="text"
                          inputMode="numeric"
                           pattern="[0-9]*" 
                           maxLength={1}
                           value={digit}
                           onChange={(e)=> handlechange(e.target.value,index)}
                           onKeyDown={(e)=>{handledown(e,index)}}
                           className="border border-[#ccc] w-12 h-14  rounded-lg text-2xl text-center"/>
                ))}
               
                {/* <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} className="border border-[#ccc] w-12 h-14  rounded-lg text-2xl text-center" />
                <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={1} className="border border-[#ccc] w-12 h-14  rounded-lg text-2xl text-center"/>
                <input type="text" inputMode="numeric"pattern="[0-9]*"maxLength={1} className="border border-[#ccc] w-12 h-14 rounded-lg text-2xl text-center"/> */}

            </div>

            <button className="border p-3 w-80 m-5 rounded-lg bg-black text-white font-semibold">Continue</button>
            <p className="text-xs  text-gray-700">You’ll use this PIN to login next time</p>
        </div>
    )
}


export default page