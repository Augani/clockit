import { NextResponse } from "next/server";
import { prisma } from "@/lib/api/prisma";
import { adminAuth } from "@/middleware/adminAuth";
import { generatePDF } from "@/lib/reports/generatePDF";
import { generateExcel } from "@/lib/reports/generateExcel";
import { startOfDay, endOfDay, parseISO } from "date-fns";

export async function GET(request: Request) {
  try {
    const authError = await adminAuth();
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") as
      | "timesheet"
      | "attendance"
      | "performance"
      | "project";
    const format = searchParams.get("format") as "pdf" | "excel";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const employeeId = searchParams.get("employeeId");

    if (!type || !format || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Get report data based on type
    const data = await getReportData(type, {
      startDate: parseISO(startDate),
      endDate: parseISO(endDate),
      employeeId,
    });

    // Generate report in requested format
    const reportData = {
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
      dateRange: {
        start: parseISO(startDate),
        end: parseISO(endDate),
      },
      data,
      type,
    };

    let buffer: Buffer;
    let fileName: string;
    let contentType: string;

    if (format === "pdf") {
      buffer = await generatePDF(reportData as any);
      fileName = `${type}-report-${startDate}-${endDate}.pdf`;
      contentType = "application/pdf";
    } else {
      buffer = await generateExcel(reportData as any);
      fileName = `${type}-report-${startDate}-${endDate}.xlsx`;
      contentType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function getReportData(
  type: string,
  params: { startDate: Date; endDate: Date; employeeId?: string | null }
) {
  const { startDate, endDate, employeeId } = params;

  switch (type) {
    case "timesheet":
      return await prisma.timeLog.findMany({
        where: {
          clockIn: {
            gte: startOfDay(startDate),
            lte: endOfDay(endDate),
          },
          userId: employeeId || undefined,
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          clockIn: "asc",
        },
      });

    case "attendance":
      // Similar query for attendance data
      break;

    case "performance":
      // Query for performance metrics
      break;

    case "project":
      // Query for project progress
      break;

    default:
      throw new Error("Invalid report type");
  }
}
