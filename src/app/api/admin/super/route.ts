import { superAdminAuth } from "@/middleware/superAdminAuth";
import { NextResponse } from "next/server";

export async function GET() {
  const authError = await superAdminAuth();
  if (authError) return authError;

  // Super admin only functionality here
  return NextResponse.json({ message: "Super admin access granted" });
} 