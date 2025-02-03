import { getServerSession } from "next-auth";
import { prisma } from "@/lib/api/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import dayjs from "@/lib/dayjs";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "week";
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");
    const includeAdmins = searchParams.get("includeAdmins") === "true";

    let startDate: Date, endDate: Date;

    if (startDateParam && endDateParam) {
      startDate = dayjs(startDateParam).startOf("day").toDate();
      endDate = dayjs(endDateParam).endOf("day").toDate();
    } else {
      const now = dayjs();
      switch (timeRange) {
        case "day":
          startDate = now.startOf("day").toDate();
          endDate = now.endOf("day").toDate();
          break;
        case "week":
          startDate = now.startOf("week").toDate();
          endDate = now.endOf("week").toDate();
          break;
        case "month":
          startDate = now.startOf("month").toDate();
          endDate = now.endOf("month").toDate();
          break;
        default:
          startDate = now.startOf("day").toDate();
          endDate = now.endOf("day").toDate();
      }
    }

    const users = await prisma.user.findMany({
      where: {
        ...(includeAdmins ? {} : { NOT: { role: "ADMIN" } }),
      },
      include: {
        timeLogs: {
          where: {
            clockIn: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
    });

    const timeTrackingData = users.map((user) => {
      const totalMinutes = user.timeLogs.reduce((acc, log) => {
        let duration = 0;
        if (log.clockOut) {
          duration =
            log.duration ||
            dayjs(log.clockOut).diff(dayjs(log.clockIn), "minute");
        } else if (log.clockIn) {
          duration = dayjs().diff(dayjs(log.clockIn), "minute");
        }
        return acc + (duration - (log.breakDuration || 0));
      }, 0);

      const totalBreakMinutes = user.timeLogs.reduce((acc, log) => {
        return acc + (log.breakDuration || 0);
      }, 0);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        department: user.department,
        position: user.position,
        totalHours: Math.round((totalMinutes / 60) * 100) / 100,
        totalBreakHours: Math.round((totalBreakMinutes / 60) * 100) / 100,
        timeLogs: user.timeLogs.map((log) => ({
          id: log.id,
          date: log.clockIn,
          clockIn: log.clockIn,
          clockOut: log.clockOut,
          duration: log.duration,
          breakDuration: log.breakDuration,
          status: log.status,
        })),
      };
    });

    return NextResponse.json({
      success: true,
      data: timeTrackingData,
      dateRange: {
        start: startDate,
        end: endDate,
      },
    });
  } catch (error) {
    console.error("Error fetching time tracking data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
