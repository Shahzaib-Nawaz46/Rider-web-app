"use client"
import React from 'react'
import { useSession } from 'next-auth/react'
const page = () => {
  const { data: session, status } = useSession();
  return (
    <div>
    {console.log(session)}
    </div>
    
  )
}

export default page