import { getServerSession } from "next-auth";
import { prisma } from "@/lib/api/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import dayjs from "@/lib/dayjs";
import * as XLSX from "xlsx";
import { generateDateRange } from "@/lib/utils/dateRange";

function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

export async function GET(request: Request) {
  console.log("GET request received excel");
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Get users with optional userId filter
    const users = await prisma.user.findMany({
      where: {
        ...(userId ? { id: userId } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        position: true,
        role: true,
        timeLogs: {
          where: {
            clockIn: {
              gte: dayjs(startDate).startOf("day").toDate(),
              lte: dayjs(endDate).endOf("day").toDate(),
            },
          },
          include: {
            tasks: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Generate all dates in the range
    const dateRange = generateDateRange(
      dayjs(startDate).startOf("day").toDate(),
      dayjs(endDate).endOf("day").toDate()
    );

    // Transform data for Excel with user information and daily entries
    const excelData = users.flatMap((user) => {
      // Create a map of existing time logs by date
      const timeLogsByDate = new Map(
        user.timeLogs.map((log) => [
          dayjs(log.clockIn).format("YYYY-MM-DD"),
          log,
        ])
      );

      // Generate a row for each date in the range
      return dateRange.map((date) => {
        const dateStr = dayjs(date).format("YYYY-MM-DD");
        const log = timeLogsByDate.get(dateStr);

        return {
          "Employee Name": user.name,
          "Employee ID": user.id,
          Email: user.email,
          Department: user.department,
          Position: user.position,
          Role: user.role,
          Date: dateStr,
          "Clock In": log ? dayjs(log.clockIn).format("HH:mm:ss") : "-",
          "Clock Out": log?.clockOut
            ? dayjs(log.clockOut).format("HH:mm:ss")
            : "-",
          "Work Duration (hours)": log
            ? ((log.duration || 0) / 60).toFixed(2)
            : "0.00",
          "Break Duration (hours)": log
            ? ((log.breakDuration || 0) / 60).toFixed(2)
            : "0.00",
          Tasks:
            log?.tasks
              ?.map((task) => stripHtmlTags(task.description))
              .join("; ") || "-",
          Status: log?.status || "no data",
        };
      });
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Add column widths
    const colWidths = [
      { wch: 20 }, // Employee Name
      { wch: 15 }, // Employee ID
      { wch: 25 }, // Email
      { wch: 15 }, // Department
      { wch: 15 }, // Position
      { wch: 10 }, // Role
      { wch: 12 }, // Date
      { wch: 10 }, // Clock In
      { wch: 10 }, // Clock Out
      { wch: 15 }, // Work Duration
      { wch: 15 }, // Break Duration
      { wch: 40 }, // Tasks
      { wch: 10 }, // Status
    ];
    ws["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Time Tracking");

    // Generate buffer
    const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="time-tracking-${
          userId ? `user-${userId}` : "all-users"
        }-${dayjs(startDate).format("YYYY-MM-DD")}-to-${dayjs(endDate).format(
          "YYYY-MM-DD"
        )}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Error generating Excel report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
