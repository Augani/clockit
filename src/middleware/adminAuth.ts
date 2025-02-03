import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/api/prisma";
import { SUPER_ADMIN_USER } from "@/constants";
import { ADMIN_USER } from "@/constants";

export async function adminAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (user?.role !== ADMIN_USER && user?.role !== SUPER_ADMIN_USER) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null; // Auth successful
}
