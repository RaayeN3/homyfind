import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import prismaDb from "@/app/libs/prismaDb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body ?? {};

    // Basic validation
    if (!email || !name || !password) {
      return NextResponse.json(
        { message: "Name, email and password are required" },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    // Check if user already exists
    const existing = await prismaDb.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    if (existing) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prismaDb.user.create({
      data: {
        email: normalizedEmail,
        name,
        hashedPassword,
      },
    });

    // Do not send hashedPassword in api response
    const { hashedPassword: _passwordHash, ...userInfo } = user as any;

    return NextResponse.json(userInfo, { status: 201 });
  } catch (error: any) {
    // Handle known Prisma unique constraint errors (just in case)
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
