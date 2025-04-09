import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/api/prisma";
import dayjs from "@/lib/dayjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { generateDateRange } from "@/lib/utils/dateRange";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

interface TimeTrackingExportRequest {
  userId?: string;
  startDate: string;
  endDate: string;
}

// Update color constants to match Tailwind theme
const COLORS = {
  primary: rgb(0.31, 0.27, 0.9), // Tailwind primary
  secondary: rgb(0.13, 0.77, 0.37), // Tailwind secondary
  accent: rgb(0.98, 0.45, 0.09), // Tailwind accent
  background: rgb(0.98, 0.98, 0.98), // Tailwind background
  surface: rgb(1, 1, 1), // Tailwind surface
  muted: rgb(0.39, 0.45, 0.55), // Tailwind muted
  border: rgb(0.9, 0.9, 0.9), // Lighter border
  text: rgb(0.25, 0.25, 0.25), // Softer text
};

/**
 * Helper function that strips HTML tags from a string.
 */
function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Loads and embeds the logo image.
 * Here we convert an SVG logo to PNG using sharp.
 */
async function embedLogo(pdfDoc: PDFDocument) {
  const logoPath = path.join(process.cwd(), "public", "logo.svg");
  const svgBuffer = await fs.readFile(logoPath);
  const pngBuffer = await sharp(svgBuffer).png().toBuffer();
  const logoImage = await pdfDoc.embedPng(pngBuffer);
  return logoImage;
}

/**
 * Draws a header on the given page including the logo and title.
 */
function drawHeader(page: any, font: any, logoImage: any) {
  const margin = 50;
  const pageWidth = page.getWidth();
  const headerHeight = 130;

  if (logoImage) {
    const logoWidth = 80;
    const logoHeight = 80;
    page.drawImage(logoImage, {
      x: margin,
      y: page.getHeight() - margin - logoHeight + 10,
      width: logoWidth,
      height: logoHeight,
    });
  }

  page.drawText("Time Tracking Report", {
    x: pageWidth / 2 - 140,
    y: page.getHeight() - margin - 45,
    size: 36,
    font,
    color: COLORS.primary,
  });

  page.drawLine({
    start: { x: margin, y: page.getHeight() - margin - headerHeight },
    end: { x: pageWidth - margin, y: page.getHeight() - margin - headerHeight },
    thickness: 1,
    color: COLORS.border,
  });

  return headerHeight;
}

/**
 * Draws a footer on the given page with a horizontal line and page number.
 */
function drawFooter(
  page: any,
  font: any,
  pageNumber: number,
  totalPages: number
) {
  const margin = 50;
  const footerHeight = 40;
  page.drawLine({
    start: { x: margin, y: margin + footerHeight },
    end: { x: page.getWidth() - margin, y: margin + footerHeight },
    thickness: 1,
    color: COLORS.muted,
  });

  const text = `Page ${pageNumber} of ${totalPages}`;
  page.drawText(text, {
    x: page.getWidth() / 2 - 50,
    y: margin + 10,
    size: 10,
    font,
    color: COLORS.text,
  });
}

/**
 * Draws a table header row with a light gray background.
 */
function drawTableHeader(
  page: any,
  font: any,
  yPosition: number,
  margin: number
): { y: number; colPositions: number[] } {
  const tableHeaders = [
    "Date",
    "Clock In",
    "Clock Out",
    "Work Hours",
    "Break Hours",
    "Status",
  ];
  const colPositions = [
    margin,
    margin + 100,
    margin + 180,
    margin + 260,
    margin + 340,
    margin + 420,
  ];
  const tableWidth = page.getWidth() - 2 * margin;

  page.drawText("Time Records", {
    x: margin,
    y: yPosition + 35,
    size: 20,
    font,
    color: COLORS.primary,
  });

  page.drawRectangle({
    x: margin,
    y: yPosition - 5,
    width: tableWidth,
    height: 35,
    color: COLORS.primary,
    borderRadius: 6,
  });

  tableHeaders.forEach((header, i) => {
    page.drawText(header, {
      x: colPositions[i] + 10,
      y: yPosition + 8,
      size: 12,
      font,
      color: rgb(1, 1, 1),
    });
  });

  return { y: yPosition - 40, colPositions };
}

/**
 * Draws a single table row with the provided values.
 */
function drawTableRow(
  page: any,
  font: any,
  yPosition: number,
  margin: number,
  colPositions: number[],
  rowValues: string[]
): number {
  const isEvenRow = Math.floor(yPosition) % 50 === 0;
  if (isEvenRow) {
    page.drawRectangle({
      x: margin,
      y: yPosition - 5,
      width: page.getWidth() - 2 * margin,
      height: 25,
      color: COLORS.background,
      borderRadius: 4,
    });
  }

  rowValues.forEach((value, i) => {
    page.drawText(value, {
      x: colPositions[i] + 5,
      y: yPosition + 5,
      size: 10,
      font,
      color: COLORS.text,
    });
  });

  return yPosition - 30;
}

/**
 * Draws the summary table for a user.
 */
function drawSummary(
  page: any,
  font: any,
  yPosition: number,
  margin: number,
  totalWorkHours: number,
  totalBreakHours: number
) {
  const summaryWidth = 400;
  const summaryHeight = 100;

  page.drawText("Summary Report", {
    x: margin,
    y: yPosition + 20,
    size: 20,
    font,
    color: COLORS.primary,
  });
  yPosition -= 20;

  page.drawRectangle({
    x: margin,
    y: yPosition - summaryHeight + 15,
    width: summaryWidth,
    height: summaryHeight,
    color: COLORS.surface,
    borderRadius: 8,
    borderColor: COLORS.border,
    borderWidth: 1,
  });

  const labels = ["Total Work Hours:", "Total Break Hours:"];
  const values = [totalWorkHours.toFixed(2), totalBreakHours.toFixed(2)];

  labels.forEach((label, i) => {
    page.drawText(label, {
      x: margin + 20,
      y: yPosition - i * 35,
      size: 12,
      font,
      color: COLORS.muted,
    });
    page.drawText(values[i], {
      x: margin + 150,
      y: yPosition - i * 35,
      size: 14,
      font,
      color: COLORS.text,
    });
  });

  return yPosition - summaryHeight - 30;
}

export async function POST(request: Request) {
  console.log("POST request received for styled PDF generation");
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate the request body.
    const body = (await request.json()) as TimeTrackingExportRequest;
    const { userId, startDate, endDate } = body;
    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }
    console.log("PDF Generation params:", { userId, startDate, endDate });

    // Retrieve users and their time logs.
    const users = await prisma.user.findMany({
      where: { ...(userId ? { id: userId } : {}) },
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
          include: { tasks: true },
        },
      },
      orderBy: { name: "asc" },
    });
    console.log(`Found ${users.length} users`);

    // Generate the date range for the report.
    const dateRange = generateDateRange(
      dayjs(startDate).startOf("day").toDate(),
      dayjs(endDate).endOf("day").toDate()
    );

    // Create a new PDF document.
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const logoImage = await embedLogo(pdfDoc);

    // Define page dimensions.
    const pageWidth = 595;
    const pageHeight = 842;
    const margin = 50;

    // Process each user.
    for (const user of users) {
      // Start a new page for each user
      let page = pdfDoc.addPage([pageWidth, pageHeight]);
      const headerHeight = drawHeader(page, font, logoImage);
      let yPosition = page.getHeight() - margin - headerHeight - 40; // More space after header

      // User section with enhanced spacing
      page.drawText(`User Profile`, {
        x: margin,
        y: yPosition,
        size: 18,
        font,
        color: COLORS.primary,
      });
      yPosition -= 35; // Increased spacing after section title

      // Enhanced user info box
      const infoBoxWidth = 400;
      const infoBoxHeight = 130;
      page.drawRectangle({
        x: margin,
        y: yPosition - infoBoxHeight + 15,
        width: infoBoxWidth,
        height: infoBoxHeight,
        color: COLORS.background,
        borderColor: COLORS.border,
        borderWidth: 1,
      });

      // User name with prominence
      page.drawText(user.name || "", {
        x: margin + 15,
        y: yPosition - 5,
        size: 14,
        font,
        color: COLORS.primary,
      });
      yPosition -= 30;

      // User details with improved layout
      const userDetails = [
        [`Email:`, user.email],
        [`Department:`, user.department],
        [`Position:`, user.position],
        [`Role:`, user.role],
      ];

      userDetails.forEach(([label, value]) => {
        page.drawText(label || "", {
          x: margin + 15,
          y: yPosition,
          size: 10,
          font,
          color: COLORS.secondary,
        });
        page.drawText(value || "-", {
          x: margin + 100,
          y: yPosition,
          size: 10,
          font,
          color: COLORS.text,
        });
        yPosition -= 20; // Increased line spacing
      });
      yPosition -= 70; // More space before table

      // --- Table Header for Time Logs ---
      const tableInfo = drawTableHeader(page, font, yPosition, margin);
      yPosition = tableInfo.y;
      const colPositions = tableInfo.colPositions;

      // Map logs by date for quick lookup.
      const timeLogsByDate = new Map(
        user.timeLogs.map((log) => [
          dayjs(log.clockIn).format("YYYY-MM-DD"),
          log,
        ])
      );

      // --- Table Rows for each date in the range ---
      for (const date of dateRange) {
        // If near the bottom, add a new page without a header.
        if (yPosition < margin + 100) {
          const currentPageNumber = pdfDoc.getPageCount();
          drawFooter(page, font, currentPageNumber, currentPageNumber);
          page = pdfDoc.addPage([pageWidth, pageHeight]);
          yPosition = page.getHeight() - margin - 80;
        }

        const dateKey = dayjs(date).format("YYYY-MM-DD");
        const displayDate = dayjs(date).format("MMM D, YYYY");
        const log = timeLogsByDate.get(dateKey);
        const clockIn = log ? dayjs(log.clockIn).format("HH:mm") : "-";
        const clockOut =
          log && log.clockOut ? dayjs(log.clockOut).format("HH:mm") : "-";

        // Calculate work hours using the difference between clockIn and clockOut if available.
        let workHoursDisplay = "0.00";
        if (log && log.clockIn && log.clockOut) {
          const startTime = new Date(log.clockIn).getTime();
          const endTime = new Date(log.clockOut).getTime();
          const diffMinutes = (endTime - startTime) / 60000;
          workHoursDisplay = (diffMinutes / 60).toFixed(2);
        } else if (log && log.duration) {
          workHoursDisplay = ((log.duration || 0) / 60).toFixed(2);
        }

        // Assume breakDuration is stored in minutes.
        const breakHoursDisplay = log
          ? ((log.breakDuration || 0) / 60).toFixed(2)
          : "0.00";
        const status = log?.status || "no data";

        const rowValues = [
          displayDate,
          clockIn,
          clockOut,
          workHoursDisplay,
          breakHoursDisplay,
          status,
        ];
        yPosition = drawTableRow(
          page,
          font,
          yPosition,
          margin,
          colPositions,
          rowValues
        );

        // If there are tasks, list them.
        if (log && log.tasks && log.tasks.length > 0) {
          page.drawText("Tasks:", {
            x: margin + 10,
            y: yPosition,
            size: 10,
            font,
          });
          yPosition -= 15;
          for (const task of log.tasks) {
            if (yPosition < margin + 100) {
              const currentPageNumber = pdfDoc.getPageCount();
              drawFooter(page, font, currentPageNumber, currentPageNumber);
              page = pdfDoc.addPage([pageWidth, pageHeight]);
              yPosition = page.getHeight() - margin - 80;
            }
            // Strip HTML tags from the task description before drawing.
            const cleanTaskDescription = stripHtmlTags(task.description);
            page.drawText(`- ${cleanTaskDescription}`, {
              x: margin + 20,
              y: yPosition,
              size: 10,
              font,
            });
            yPosition -= 15;
          }
          yPosition -= 5;
        }
      }

      // --- Summary Table for the User ---
      yPosition -= 50; // More space before summary
      page.drawText(``, {
        x: margin,
        y: yPosition,
        size: 16,
        font,
        color: COLORS.primary,
      });
      yPosition -= 30;

      // Compute total work minutes using clockIn and clockOut differences.
      const totalWorkMinutes = user.timeLogs.reduce((sum, log) => {
        if (log.clockIn && log.clockOut) {
          const startTime = new Date(log.clockIn).getTime();
          const endTime = new Date(log.clockOut).getTime();
          return sum + (endTime - startTime) / 60000;
        }
        return sum;
      }, 0);
      const totalWorkHours = totalWorkMinutes / 60;

      // Compute total break minutes (assuming breakDuration is in minutes).
      const totalBreakMinutes = user.timeLogs.reduce(
        (sum, log) => sum + (log.breakDuration || 0),
        0
      );
      const totalBreakHours = totalBreakMinutes / 60;

      // Draw a simple summary table.
      yPosition = drawSummary(
        page,
        font,
        yPosition,
        margin,
        totalWorkHours,
        totalBreakHours
      );

      // Draw footer on the current page.
      const currentPageNumber = pdfDoc.getPageCount();
      drawFooter(page, font, currentPageNumber, currentPageNumber);
    }

    // Serialize and return the PDF.
    const pdfBytes = await pdfDoc.save();
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="time-tracking-${
          userId ? `user-${userId}` : "all"
        }-${dayjs(startDate).format("YYYY-MM-DD")}-to-${dayjs(endDate).format("YYYY-MM-DD")}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating styled PDF report:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
