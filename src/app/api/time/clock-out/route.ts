import { getServerSession } from "next-auth";
import { prisma } from "@/lib/api/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { differenceInMinutes } from "date-fns";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find active time log
    const activeTimeLog = await prisma.timeLog.findFirst({
      where: {
        userId: session.user.id,
        clockOut: null,
        status: "active",
      },
      include: {
        tasks: true,
      },
    });

    if (!activeTimeLog) {
      return NextResponse.json(
        { error: "No active time log found" },
        { status: 400 }
      );
    }

    // Calculate total duration
    const now = new Date();
    const totalDuration = differenceInMinutes(now, activeTimeLog.clockIn);

    // Calculate break duration
    let breakDuration = activeTimeLog.breakDuration || 0;
    if (activeTimeLog.breakStart && !activeTimeLog.breakEnd) {
      // If on break, add current break duration
      breakDuration += differenceInMinutes(now, activeTimeLog.breakStart);
    }

    // Calculate work duration (total - breaks)
    const workDuration = totalDuration - breakDuration;

    // Update time log
    const updatedTimeLog = await prisma.timeLog.update({
      where: {
        id: activeTimeLog.id,
      },
      data: {
        clockOut: now,
        duration: workDuration,
        breakDuration,
        status: "completed",
        breakEnd: activeTimeLog.breakStart ? now : undefined, // End break if active
      },
      include: {
        tasks: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updatedTimeLog,
        totalDuration,
        workDuration,
        breakDuration,
      },
    });
  } catch (error) {
    console.error("Error clocking out:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
