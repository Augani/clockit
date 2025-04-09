import { useState } from "react";
import { startOfDay, endOfDay } from "date-fns";

interface TimeLog {
  id: string;
  clockIn: Date;
  clockOut: Date | null;
  breakStart: Date | null;
  breakEnd: Date | null;
  breakDuration: number;
}

interface TimeAudit {
  clockIn: string;
  clockOut: string | null;
  breaks: {
    start: string;
    end: string | null;
    duration: number;
  }[];
  totalWorkTime: number; // in minutes
  totalBreakTime: number; // in minutes
  status: "active" | "completed";
}

interface TimeStatus {
  isClockedIn: boolean;
  isOnBreak: boolean;
  hasTimeLogToday: boolean;
  currentTimeLog: {
    id: string;
    clockIn: string;
    breakStart: string | null;
    breakDuration: number;
  } | null;
  todaysSummary: TimeAudit | null;
}

export const useTimeTracking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatus = async (): Promise<TimeStatus> => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/time/status");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clockIn = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/time/clock-in", {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clockOut = async (hours?: number) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/time/clock-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hours }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBreak = async (action: "start" | "end") => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/time/break", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getStatus,
    clockIn,
    clockOut,
    toggleBreak,
    isLoading,
    error,
  };
};
