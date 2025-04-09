import { useState } from "react";

interface GenerateReportParams {
  type: "timesheet" | "attendance" | "performance" | "project";
  format: "pdf" | "excel";
  startDate: Date;
  endDate: Date;
  employeeId?: string;
}

export const useReports = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async (params: GenerateReportParams) => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        type: params.type,
        format: params.format,
        startDate: params.startDate.toISOString(),
        endDate: params.endDate.toISOString(),
        ...(params.employeeId && { employeeId: params.employeeId }),
      });

      const response = await fetch(`/api/admin/reports?${queryParams}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download =
        response.headers
          .get("Content-Disposition")
          ?.split("filename=")[1]
          .replace(/"/g, "") || "report";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateReport,
    isLoading,
    error,
  };
};
