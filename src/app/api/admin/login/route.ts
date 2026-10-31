import { NextRequest, NextResponse } from "next/server";
import { createSessionToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    const expectedUser = (process.env.ADMIN_USERNAME || "admin").trim();
    const expectedPass = (process.env.ADMIN_PASSWORD || "").trim();

    if (!expectedPass) {
      return NextResponse.json(
        {
          error:
            "Authentication not configured: ADMIN_PASSWORD environment variable is missing. Please set it in Vercel or .env.local",
        },
        { status: 500 }
      );
    }

    const isUserValid =
      username?.trim().toLowerCase() === expectedUser.toLowerCase() ||
      username?.trim() === expectedPass; // Allow login if username is the given credential
    const isPassValid = password?.trim() === expectedPass;

    if (!isUserValid || !isPassValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = createSessionToken(expectedUser);

    const response = NextResponse.json({
      success: true,
      user: { username: expectedUser },
    });

    response.cookies.set("aniimo_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

