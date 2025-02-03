import ExcelJS from "exceljs";
import { format } from "date-fns";

interface ReportData {
  title: string;
  dateRange: { start: Date; end: Date };
  data: any[];
  type: "timesheet" | "attendance" | "performance" | "project";
}

export const generateExcel = async (
  reportData: ReportData
): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(reportData.type);

  // Add title and date range
  worksheet.mergeCells("A1:E1");
  worksheet.getCell("A1").value = reportData.title;
  worksheet.getCell("A1").alignment = { horizontal: "center" };
  worksheet.getCell("A1").font = { bold: true, size: 14 };

  worksheet.mergeCells("A2:E2");
  worksheet.getCell("A2").value = `Period: ${format(
    reportData.dateRange.start,
    "PPP"
  )} - ${format(reportData.dateRange.end, "PPP")}`;
  worksheet.getCell("A2").alignment = { horizontal: "center" };

  // Generate report based on type
  switch (reportData.type) {
    case "timesheet":
      await generateTimesheetExcel(worksheet, reportData.data);
      break;
    case "attendance":
      await generateAttendanceExcel(worksheet, reportData.data);
      break;
    case "performance":
      await generatePerformanceExcel(worksheet, reportData.data);
      break;
    case "project":
      await generateProjectExcel(worksheet, reportData.data);
      break;
  }

  return workbook.xlsx.writeBuffer() as unknown as Promise<Buffer>;
};

const generateTimesheetExcel = async (
  worksheet: ExcelJS.Worksheet,
  data: any[]
) => {
  // Add headers
  worksheet.addRow([
    "Date",
    "Employee",
    "Clock In",
    "Clock Out",
    "Total Hours",
  ]);
  worksheet.getRow(3).font = { bold: true };

  // Add data
  data.forEach((row) => {
    worksheet.addRow([
      format(new Date(row.date), "PP"),
      row.employeeName,
      format(new Date(row.clockIn), "p"),
      format(new Date(row.clockOut), "p"),
      row.totalHours,
    ]);
  });

  // Style the worksheet
  worksheet.columns.forEach((column) => {
    column.width = 20;
  });
};

// Similar functions for other report types...
const generateAttendanceExcel = async (
  worksheet: ExcelJS.Worksheet,
  data: any[]
) => {
  // Add headers
  worksheet.addRow([
    "Date",
    "Employee",
    "Clock In",
    "Clock Out",
    "Total Hours",
  ]);
  worksheet.getRow(3).font = { bold: true };

  // Add data
  data.forEach((row) => {
    worksheet.addRow([
      row.date,
      row.employeeName,
      row.clockIn,
      row.clockOut,
      row.totalHours,
    ]);
  });

  // Style the worksheet
  worksheet.columns.forEach((column) => {
    column.width = 20;
  });
};

const generatePerformanceExcel = async (
  worksheet: ExcelJS.Worksheet,
  data: any[]
) => {
  // Add headers
  worksheet.addRow([
    "Date",
    "Employee",
    "Clock In",
    "Clock Out",
    "Total Hours",
  ]);
  worksheet.getRow(3).font = { bold: true };

  // Add data
  data.forEach((row) => {
    worksheet.addRow([
      row.date,
      row.employeeName,
      row.clockIn,
      row.clockOut,
      row.totalHours,
    ]);
  });

  // Style the worksheet
  worksheet.columns.forEach((column) => {
    column.width = 20;
  });
};

const generateProjectExcel = async (
  worksheet: ExcelJS.Worksheet,
  data: any[]
) => {
  // Add headers
  worksheet.addRow([
    "Date",
    "Employee",
    "Clock In",
    "Clock Out",
    "Total Hours",
  ]);
  worksheet.getRow(3).font = { bold: true };

  // Add data
  data.forEach((row) => {
    worksheet.addRow([
      row.date,
      row.employeeName,
      row.clockIn,
      row.clockOut,
      row.totalHours,
    ]);
  });

  // Style the worksheet
  worksheet.columns.forEach((column) => {
    column.width = 20;
  });
};
