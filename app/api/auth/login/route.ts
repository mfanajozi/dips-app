import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function POST(request: Request) {
  const { email, password } = await request.json()

  // In a real app, you would validate the credentials against a database
  if (email === "admin@example.com" && password === "password") {
    const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET || "fallback_secret")
    return NextResponse.json({ token })
  } else {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }
}

