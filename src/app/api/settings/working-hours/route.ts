import { getServerSession } from "next-auth";
import { prisma } from "@/lib/api/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { startTime, endTime, breakTime, workDays } = body;

    const workingHours = await prisma.workingHours.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        startTime,
        endTime,
        breakTime,
        workDays,
      },
      create: {
        userId: session.user.id,
        startTime,
        endTime,
        breakTime,
        workDays,
      },
    });

    return NextResponse.json(workingHours);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
