import { getServerSession } from "next-auth";
import { prisma } from "@/lib/api/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { startOfDay, endOfDay } from "date-fns";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user already has an active time log today
    const existingTimeLog = await prisma.timeLog.findFirst({
      where: {
        userId: session.user.id,
        clockIn: {
          gte: startOfDay(new Date()),
          lte: endOfDay(new Date()),
        },
        clockOut: null,
      },
    });

    if (existingTimeLog) {
      return NextResponse.json(
        { error: "Already clocked in today" },
        { status: 400 }
      );
    }

    // Create new time log
    const timeLog = await prisma.timeLog.create({
      data: {
        userId: session.user.id,
        clockIn: new Date(),
        status: "active",
      },
    });

    return NextResponse.json({
      success: true,
      data: timeLog,
    });
  } catch (error) {
    console.error("Error clocking in:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
