import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { SUPER_ADMIN_USER } from "@/constants";

export async function superAdminAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if the user is a super admin
  if (session.user.role !== SUPER_ADMIN_USER) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}
