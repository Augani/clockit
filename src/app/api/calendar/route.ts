import { getServerSession } from "next-auth";
import { prisma } from "@/lib/api/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { startOfMonth, endOfMonth, parseISO } from "date-fns";
import { TimeLog } from "@prisma/client";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const monthDate = searchParams.get("month") || new Date().toISOString();
    const userId = searchParams.get("userId");

    const start = startOfMonth(parseISO(monthDate));
    const end = endOfMonth(parseISO(monthDate));

    // Fetch time logs for the month
    const timeLogs = await prisma.timeLog.findMany({
      where: {
        userId: userId || session.user.id,
        clockIn: {
          gte: start,
          lte: end,
        },
      },
      include: {
        tasks: true,
      },
      orderBy: {
        clockIn: "asc",
      },
    });

    // Group time logs by date
    const calendarData = timeLogs.reduce(
      (acc, log) => {
        const date = log.clockIn.toISOString().split("T")[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push({
          id: log.id,
          clockIn: log.clockIn,
          clockOut: log.clockOut,
          duration: log.duration,
          breakDuration: log.breakDuration,
          status: log.status,
          tasks: log.tasks.map((task) => ({
            id: task.id,
            description: task.description,
          })),
        });
        return acc;
      },
      {} as Record<string, Partial<TimeLog>[]>
    );

    // Calculate daily summaries
    const dailySummaries = Object.entries(calendarData).reduce(
      (acc, [date, logs]) => {
        acc[date] = {
          totalWorkHours: logs.reduce(
            (sum, log) =>
              sum +
              (log.duration || log.clockOut
                ? (log.clockOut ? log.clockOut : new Date()) - log.clockIn
                : 0) /
                60,
            0
          ),
          totalBreakHours:
            logs.reduce((sum, log) => sum + (log.breakDuration || 0), 0) / 60,
          taskCount: logs.reduce(
            (sum, log) => sum + (log.tasks?.length || 0),
            0
          ),
          status: logs[logs.length - 1]?.status || "no-data",
        };
        return acc;
      },
      {} as Record<
        string,
        {
          totalWorkHours: number;
          totalBreakHours: number;
          taskCount: number;
          status: string;
        }
      >
    );

    return NextResponse.json({
      success: true,
      data: {
        timeLogs: calendarData,
        summaries: dailySummaries,
        month: {
          start: start.toISOString(),
          end: end.toISOString(),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
