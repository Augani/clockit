import { getServerSession } from "next-auth";
import { prisma } from "@/lib/api/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { startOfDay, endOfDay, differenceInMinutes } from "date-fns";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log(session.user.id);
    // Get today's time log
    const timeLog = await prisma.timeLog.findFirst({
      where: {
        userId: session.user.id,
        clockIn: {
          gte: startOfDay(new Date()),
          lte: endOfDay(new Date()),
        },
      },
      include: {
        tasks: true,
      },
      orderBy: {
        clockIn: "desc",
      },
    });
    console.log(timeLog);
    if (!timeLog) {
      return NextResponse.json({
        isClockedIn: false,
        isOnBreak: false,
        hasTimeLogToday: false,
        currentTimeLog: null,
        todaysSummary: null,
      });
    }

    const now = new Date();
    let currentDuration = 0;
    let currentBreakDuration = timeLog.breakDuration || 0;

    if (!timeLog.clockOut) {
      currentDuration = differenceInMinutes(now, timeLog.clockIn);

      // Add current break duration if on break
      if (timeLog.breakStart && !timeLog.breakEnd) {
        currentBreakDuration += differenceInMinutes(now, timeLog.breakStart);
      }
    }

    const status = {
      isClockedIn: !timeLog.clockOut,
      isOnBreak: Boolean(timeLog.breakStart && !timeLog.breakEnd),
      hasTimeLogToday: true,
      currentTimeLog: timeLog.clockOut
        ? null
        : {
            id: timeLog.id,
            clockIn: timeLog.clockIn.toISOString(),
            breakStart: timeLog.breakStart?.toISOString() || null,
            breakDuration: currentBreakDuration,
            tasks: timeLog.tasks,
          },
      todaysSummary: {
        clockIn: timeLog.clockIn.toISOString(),
        clockOut: timeLog.clockOut?.toISOString() || null,
        breaks: timeLog.breakStart
          ? [
              {
                start: timeLog.breakStart.toISOString(),
                end: timeLog.breakEnd?.toISOString() || null,
                duration: currentBreakDuration,
              },
            ]
          : [],
        tasks: timeLog.tasks,
        totalWorkTime: timeLog.clockOut
          ? timeLog.duration || 0
          : currentDuration - currentBreakDuration,
        totalBreakTime: currentBreakDuration,
        status: timeLog.status,
      },
    };

    return NextResponse.json(status);
  } catch (error) {
    console.error("Error fetching time status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
