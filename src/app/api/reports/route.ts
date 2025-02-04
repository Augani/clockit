import { getServerSession } from "next-auth";
import { prisma } from "@/lib/api/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import dayjs from "@/lib/dayjs"; // Import configured dayjs

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "week";

    // Calculate date range
    const now = dayjs();
    let startDate: Date, endDate: Date;

    switch (timeRange) {
      case "week":
        startDate = now.startOf("week").toDate();
        endDate = now.endOf("week").toDate();
        break;
      case "month":
        startDate = now.startOf("month").toDate();
        endDate = now.endOf("month").toDate();
        break;
      case "quarter":
        startDate = now.subtract(2, "month").startOf("month").toDate();
        endDate = now.endOf("month").toDate();
        break;
      case "year":
        startDate = now.startOf("year").toDate();
        endDate = now.endOf("year").toDate();
        break;
      default:
        startDate = now.startOf("week").toDate();
        endDate = now.endOf("week").toDate();
    }

    console.log("Date Range:", { timeRange, startDate, endDate }); // Debug log

    // Get time logs with tasks and user info
    const timeLogs = await prisma.timeLog.findMany({
      where: {
        clockIn: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            department: true,
            position: true,
          },
        },
        tasks: true,
      },
      orderBy: {
        clockIn: "desc",
      },
    });

    // Calculate total hours properly
    const totalMinutes = timeLogs.reduce((acc, log) => {
      let duration = 0;
      if (log.clockOut) {
        duration =
          log.duration ||
          dayjs(log.clockOut).diff(dayjs(log.clockIn), "minute");
      } else if (log.clockIn) {
        duration = dayjs().diff(dayjs(log.clockIn), "minute");
      }
      return acc + duration;
    }, 0);

    console.log("Found TimeLogs:", timeLogs.length, totalMinutes); // Debug log

    // Calculate overview metrics
    const overview = {
      totalUsers: await prisma.user.count(),
      activeUsers: new Set(timeLogs.map((log) => log.userId)).size,
      totalHours: Math.round((totalMinutes / 60) * 100) / 100, // Round to 2 decimal places
      totalTasks: timeLogs.reduce((acc, log) => acc + log.tasks.length, 0),
      averageBreakTime:
        timeLogs.length > 0
          ? Math.round(
              (timeLogs.reduce(
                (acc, log) => acc + (log.breakDuration || 0),
                0
              ) /
                timeLogs.length /
                60) *
                100
            ) / 100
          : 0,
      departmentStats: await getDepartmentStats(startDate, endDate),
      topPerformers: await getTopPerformers(startDate, endDate),
      taskDistribution: await getTaskDistribution(startDate, endDate),
    };

    return NextResponse.json({
      success: true,
      data: overview,
      debug: {
        // Include debug info in development
        timeRange,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        logsFound: timeLogs.length,
        totalMinutes,
        timeLogs: timeLogs.map((log) => ({
          id: log.id,
          clockIn: log.clockIn,
          clockOut: log.clockOut,
          duration: log.duration,
          breakDuration: log.breakDuration,
          breakStart: log.breakStart,
          breakEnd: log.breakEnd,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getDepartmentStats(startDate: Date, endDate: Date) {
  const timeLogs = await prisma.timeLog.findMany({
    where: {
      clockIn: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      user: {
        select: {
          department: true,
        },
      },
    },
  });

  const now = dayjs();
  const departmentStats = timeLogs.reduce(
    (acc, log) => {
      const dept = log.user.department;
      if (!acc[dept]) {
        acc[dept] = {
          totalDuration: 0,
          userIds: new Set(),
        };
      }

      let duration = 0;
      if (log.clockOut) {
        duration =
          log.duration ||
          dayjs(log.clockOut).diff(dayjs(log.clockIn), "minute");
      } else if (log.clockIn) {
        duration = dayjs().diff(dayjs(log.clockIn), "minute");
      }

      acc[dept].totalDuration += duration;
      acc[dept].userIds.add(log.userId);
      return acc;
    },
    {} as Record<string, { totalDuration: number; userIds: Set<string> }>
  );

  return Object.entries(departmentStats).map(([department, stats]) => ({
    department,
    totalHours: Math.round((stats.totalDuration / 60) * 100) / 100,
    employeeCount: stats.userIds.size,
  }));
}

async function getTopPerformers(startDate: Date, endDate: Date) {
  const timeLogs = await prisma.timeLog.findMany({
    where: {
      clockIn: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          position: true,
        },
      },
      tasks: true,
    },
  });

  const now = dayjs();
  const userStats = timeLogs.reduce(
    (acc: any, log: any) => {
      if (!acc[log.userId]) {
        acc[log.userId] = {
          user: {
            name: log.user.name,
            position: log.user.position,
          },
          totalDuration: 0,
          taskCount: 0,
        };
      }

      let duration = 0;
      if (log.clockOut) {
        duration =
          log.duration ||
          dayjs(log.clockOut).diff(dayjs(log.clockIn), "minute");
      } else if (log.clockIn) {
        duration = dayjs().diff(dayjs(log.clockIn), "minute");
      }

      acc[log.userId].totalDuration += duration;
      acc[log.userId].taskCount += log.tasks.length;
      return acc;
    },
    {} as Record<
      string,
      {
        user: { name: string; position: string };
        totalDuration: number;
        taskCount: number;
      }
    >
  );

  return Object.values(userStats)
    .map((stat: any) => ({
      user: stat.user,
      totalHours: Math.round((stat.totalDuration / 60) * 100) / 100,
      taskCount: stat.taskCount,
    }))
    .sort((a, b) => b.totalHours - a.totalHours)
    .slice(0, 5);
}

async function getTaskDistribution(startDate: Date, endDate: Date) {
  const tasks = await prisma.task.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    },
    include: {
      project: true,
    },
  });

  const projectTasks = tasks.reduce(
    (acc, task) => {
      const projectName = task.project?.title || "No Project";
      acc[projectName] = (acc[projectName] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(projectTasks).map(([name, count]) => ({
    name,
    value: count,
  }));
}
