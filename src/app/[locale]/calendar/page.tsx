"use client";
//
import React, { useState, useEffect } from "react";
import SideBar from "@/components/SideBar";
import TopBar from "@/components/TopBar";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Card, CircularProgress, Badge } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "@/lib/dayjs";

interface TimeLog {
  id: string;
  clockIn: string;
  clockOut: string | null;
  duration: number | null;
  breakDuration: number | null;
  status: string;
  tasks: {
    id: string;
    description: string;
  }[];
}

interface DailySummary {
  totalWorkHours: number;
  totalBreakHours: number;
  taskCount: number;
  status: string;
}

interface CalendarData {
  timeLogs: Record<string, TimeLog[]>;
  summaries: Record<string, DailySummary>;
  month: {
    start: string;
    end: string;
  };
}

function CalendarPage() {
  const t = useTranslations("calendar");
  const { data: session } = useSession();
  const [currentDate, setCurrentDate] = useState<dayjs.Dayjs>(dayjs());
  const [calendarData, setCalendarData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCalendarData = async (date: dayjs.Dayjs) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/calendar?month=${date.toISOString()}&userId=${session?.user?.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch calendar data");
      const data = await response.json();
      setCalendarData(data.data);
      console.log("Fetched calendar data:", data.data);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDayData = async (date: dayjs.Dayjs) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/calendar/${date.format("YYYY-MM-DD")}?userId=${session?.user?.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch day data");
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching day data:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = async (newDate: dayjs.Dayjs | null) => {
    if (newDate) {
      setCurrentDate(newDate);
      const dayData = await fetchDayData(newDate);
      if (dayData) {
        setCalendarData({
          ...calendarData,
          timeLogs: { [dayData.date]: dayData.timeLogs },
          summaries: { [dayData.date]: dayData.summary },
        });
      }
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
      fetchCalendarData(currentDate);
    }
  }, [currentDate, session?.user?.id]);

  const getSelectedDayData = () => {
    if (!calendarData) return null;
    const dateKey = currentDate.format("YYYY-MM-DD");
    return {
      logs: calendarData.timeLogs[dateKey] || [],
      summary: calendarData.summaries[dateKey],
    };
  };

  const selectedDayData = getSelectedDayData();

  return (
    <div className="min-h-screen w-screen grid grid-cols-12 bg-gray-50">
      <aside className="col-span-2 hidden md:block">
        <SideBar />
      </aside>
      <div className="flex flex-col col-span-12 lg:col-span-10">
        <div className="w-full h-16">
          <TopBar pageName={t("title")} />
        </div>
        <div className="p-6 w-full grid grid-cols-4 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-3 col-span-4">
            <Card className="p-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  value={currentDate}
                  onChange={handleDateChange}
                  loading={isLoading}
                  renderLoading={() => <CircularProgress />}
                  slots={{
                    day: (props) => {
                      const dateKey = dayjs(props.day).format("YYYY-MM-DD");
                      const summary = calendarData?.summaries[dateKey];

                      return (
                        <Badge
                          color={
                            summary?.status === "completed"
                              ? "success"
                              : "warning"
                          }
                          variant="dot"
                          invisible={!summary}
                        >
                          <div
                            className={`w-10 h-10 flex items-center justify-center ${
                              props.outsideCurrentMonth
                                ? "text-gray-400"
                                : "text-black"
                            }`}
                          >
                            {dayjs(props.day).date()}
                          </div>
                        </Badge>
                      );
                    },
                  }}
                  sx={{
                    maxWidth: "100%",
                    "& .MuiPickersCalendarHeader-root": {
                      pl: 2,
                      pr: 2,
                      pt: 2,
                    },
                    "& .MuiDayCalendar-weekContainer": {
                      justifyContent: "space-around",
                      margin: "8px 0",
                    },
                    "& .MuiPickersDay-root": {
                      width: 40,
                      height: 40,
                      fontSize: "0.875rem",
                    },
                  }}
                />
              </LocalizationProvider>
            </Card>
          </div>

          {/* Sidebar with Selected Day Details */}
          <div className="col-span-4 lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {currentDate.format("MMMM D, YYYY")}
              </h3>
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <CircularProgress />
                </div>
              ) : selectedDayData?.summary ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">{t("workHours")}</p>
                      <p className="text-xl font-semibold">
                        {selectedDayData.summary.totalWorkHours.toFixed(1)}h
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600">{t("breakHours")}</p>
                      <p className="text-xl font-semibold">
                        {selectedDayData.summary.totalBreakHours.toFixed(1)}h
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">{t("tasks")}</h4>
                    {selectedDayData.logs.map((log: any) =>
                      log.tasks.map((task: any) => (
                        <div
                          key={task.id}
                          className="flex items-start gap-2 p-2 bg-gray-50 rounded"
                        >
                          <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5" />
                          <p
                            className="text-sm"
                            dangerouslySetInnerHTML={{
                              __html: task.description,
                            }}
                          />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">
                  {t("noData")}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarPage;
