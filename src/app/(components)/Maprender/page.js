"use client"
import dynamic from "next/dynamic";

// const Map = dynamic(() => import("@/app/(components)/Map/page"), {
//   ssr: false,
// });

import Map from "@/app/(components)/Map/page"
export default function Home() {
  return (
    <main className="h-70 w-4xl">
      <Map />
    </main>
  );
}
