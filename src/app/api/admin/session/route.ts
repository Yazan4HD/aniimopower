import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("aniimo_admin_session")?.value;
  const session = verifySessionToken(token);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      username: session.username,
      role: session.role,
    },
    githubConfigured: Boolean(process.env.GITHUB_TOKEN),
    repo: process.env.GITHUB_REPO || "Yazan4HD/aniimopower",
    branch: process.env.GITHUB_BRANCH || "main",
  });
}

