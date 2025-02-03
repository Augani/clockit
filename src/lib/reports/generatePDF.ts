import PDFDocument from "pdfkit-next";
import { format } from "date-fns";
import { Readable } from "stream";

interface ReportData {
  title: string;
  dateRange: { start: Date; end: Date };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  type: "timesheet" | "attendance" | "performance" | "project";
}

export async function generatePDF(doc: typeof PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const chunks: Uint8Array[] = [];

      doc.on("data", (chunk: Uint8Array) => chunks.push(chunk));
      doc.on("end", () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });
      doc.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
}

const generateTimesheetReport = (doc: PDFKit.PDFDocument, data: any[]) => {
  const headers = ["Date", "Employee", "Clock In", "Clock Out", "Total Hours"];
  const tableTop = doc.y;

  // Draw headers
  headers.forEach((header, i) => {
    doc.text(header, 50 + i * 100, tableTop);
  });

  doc.moveDown();

  // Draw data rows
  data.forEach((row, rowIndex) => {
    const rowTop = tableTop + 25 + rowIndex * 20;
    doc.text(format(new Date(row.date), "PP"), 50, rowTop);
    doc.text(row.employeeName, 150, rowTop);
    doc.text(format(new Date(row.clockIn), "p"), 250, rowTop);
    doc.text(format(new Date(row.clockOut), "p"), 350, rowTop);
    doc.text(row.totalHours.toString(), 450, rowTop);
  });
};

const generateAttendanceReport = (doc: PDFKit.PDFDocument, data: any[]) => {
  const headers = ["Date", "Employee", "Status", "Notes"];
  const tableTop = doc.y;

  // Draw headers
  headers.forEach((header, i) => {
    doc.text(header, 50 + i * 125, tableTop);
  });

  doc.moveDown();

  // Draw data rows
  data.forEach((row, rowIndex) => {
    const rowTop = tableTop + 25 + rowIndex * 20;
    doc.text(format(new Date(row.date), "PP"), 50, rowTop);
    doc.text(row.employeeName, 175, rowTop);
    doc.text(row.status, 300, rowTop);
    doc.text(row.notes || "", 425, rowTop);
  });
};

const generatePerformanceReport = (doc: PDFKit.PDFDocument, data: any[]) => {
  const headers = ["Employee", "Metric", "Score", "Comments"];
  const tableTop = doc.y;

  // Draw headers
  headers.forEach((header, i) => {
    doc.text(header, 50 + i * 125, tableTop);
  });

  doc.moveDown();

  // Draw data rows
  data.forEach((row, rowIndex) => {
    const rowTop = tableTop + 25 + rowIndex * 20;
    doc.text(row.employeeName, 50, rowTop);
    doc.text(row.metric, 175, rowTop);
    doc.text(row.score.toString(), 300, rowTop);
    doc.text(row.comments || "", 425, rowTop);
  });
};

const generateProjectReport = (doc: PDFKit.PDFDocument, data: any[]) => {
  const headers = ["Project", "Status", "Hours Spent", "Completion %", "Notes"];
  const tableTop = doc.y;

  // Draw headers
  headers.forEach((header, i) => {
    doc.text(header, 50 + i * 100, tableTop);
  });

  doc.moveDown();

  // Draw data rows
  data.forEach((row, rowIndex) => {
    const rowTop = tableTop + 25 + rowIndex * 20;
    doc.text(row.projectName, 50, rowTop);
    doc.text(row.status, 150, rowTop);
    doc.text(row.hoursSpent.toString(), 250, rowTop);
    doc.text(`${row.completionPercentage}%`, 350, rowTop);
    doc.text(row.notes || "", 450, rowTop);
  });
};
