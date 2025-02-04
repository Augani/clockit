import { format } from "date-fns";
import { Readable } from "stream";

interface ReportData {
  title: string;
  dateRange: { start: Date; end: Date };
  data: any[];
  type: "timesheet" | "attendance" | "performance" | "project";
}

export async function generatePDF(doc: any): Promise<Buffer> {
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
