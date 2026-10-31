import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("aniimo_admin_session")?.value;
  const session = verifySessionToken(token);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const aniimosPath = path.join(process.cwd(), "src", "data", "aniimos.json");
    const heldItemsPath = path.join(process.cwd(), "src", "data", "held_items.json");

    const aniimos = JSON.parse(fs.readFileSync(aniimosPath, "utf-8"));
    const heldItems = JSON.parse(fs.readFileSync(heldItemsPath, "utf-8"));

    return NextResponse.json({
      aniimos,
      heldItems,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

