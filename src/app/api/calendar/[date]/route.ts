import { getServerSession } from "next-auth";
import { prisma } from "@/lib/api/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { startOfDay, endOfDay } from "date-fns";
import dayjs from "@/lib/dayjs";

export async function GET(
  request: Request,
  { params }: { params: { date: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || session.user.id;
    const date = dayjs(params.date);

    // Get time logs for the specific day
    const timeLogs = await prisma.timeLog.findMany({
      where: {
        userId,
        clockIn: {
          gte: startOfDay(date.toDate()),
          lte: endOfDay(date.toDate()),
        },
      },
      include: {
        tasks: {
          select: {
            id: true,
            description: true,
            duration: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        clockIn: "asc",
      },
    });

    // Calculate daily summary
    const summary = timeLogs.reduce(
      (acc, log) => {
        // Calculate work duration
        const workDuration = log.duration || 0;
        const breakDuration = log.breakDuration || 0;

        return {
          totalWorkHours: acc.totalWorkHours + workDuration / 60,
          totalBreakHours: acc.totalBreakHours + breakDuration / 60,
          taskCount: acc.taskCount + log.tasks.length,
          status: log.clockOut ? "completed" : "active",
        };
      },
      { totalWorkHours: 0, totalBreakHours: 0, taskCount: 0, status: "no-data" }
    );

    return NextResponse.json({
      success: true,
      data: {
        date: date.format("YYYY-MM-DD"),
        timeLogs: timeLogs.map((log) => ({
          id: log.id,
          clockIn: log.clockIn,
          clockOut: log.clockOut,
          duration: log.duration,
          breakDuration: log.breakDuration,
          status: log.status,
          tasks: log.tasks,
        })),
        summary,
      },
    });
  } catch (error) {
    console.error("Error fetching day data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
