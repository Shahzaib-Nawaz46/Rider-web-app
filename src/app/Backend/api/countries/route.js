import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://www.apicountries.com/countries");
     const data = await res.json()
     console.log(data)
     return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch countries" }, { status: 500 });
  }
}
