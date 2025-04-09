"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import PageLayout from "@/components/PageLayout";
import { useTimeTracking } from "@/hooks/useTimeTracking";
import { useSession } from "next-auth/react";
import {
  ClockIcon,
  PauseIcon,
  PlayIcon,
  StopIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { Button, CircularProgress } from "@mui/material";
import { formatDistanceToNow, format, differenceInMinutes } from "date-fns";
import ConfirmDialog from "@/components/ConfirmDialog";
import TaskEditor from "@/components/TaskEditor";

interface Task {
  id: string;
  description: string;
  duration: number; // in minutes
  createdAt: string;
}

interface TimeAudit {
  clockIn: string;
  clockOut: string | null;
  breaks: {
    start: string;
    end: string | null;
    duration: number;
  }[];
  tasks: Task[];
  totalWorkTime: number;
  totalBreakTime: number;
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
    tasks: Task[];
  } | null;
  todaysSummary: TimeAudit | null;
}

interface ClockedInUser {
  id: string;
  name: string;
  position: string;
  isActive: boolean;
  isOnBreak: boolean;
  lastClockIn: string;
  lastBreakStart: string | null;
  breakDuration: number;
  status: "active" | "on_break" | "inactive";
}

interface ClockOutOptions {
  actualHours: number;
  standardHours: number;
  displayTime: {
    hours: number;
    minutes: number;
  };
}

function TimeAuditTrail({ audit }: { audit: TimeAudit }) {
  const t = useTranslations("dashboard");
  console.log("audit", audit);
  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="text-lg font-medium mb-4">
        {t("timeTracking.todaysSummary")}
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t("timeTracking.clockedInAt")}</span>
          <span className="font-medium">
            {format(new Date(audit.clockIn), "h:mm a")}
          </span>
        </div>

        {audit.breaks.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">{t("timeTracking.breaks")}:</p>
            {audit.breaks.map((breakPeriod, index) => (
              <div key={index} className="ml-4 text-sm flex justify-between">
                <span>
                  {format(new Date(breakPeriod.start), "h:mm a")} -{" "}
                  {breakPeriod.end
                    ? format(new Date(breakPeriod.end), "h:mm a")
                    : t("timeTracking.ongoing")}
                </span>
                <span className="text-gray-600">
                  {t("timeTracking.breakDuration", {
                    duration: breakPeriod.duration,
                  })}
                </span>
              </div>
            ))}
          </div>
        )}

        {audit.clockOut && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {t("timeTracking.clockedOutAt")}
            </span>
            <span className="font-medium">
              {format(new Date(audit.clockOut), "h:mm a")}
            </span>
          </div>
        )}

        <div className="mt-4 pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {t("timeTracking.totalWorkTime")}
            </span>
            <span className="font-medium">
              {Math.floor(audit.totalWorkTime / 60)}h {audit.totalWorkTime % 60}
              m
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {t("timeTracking.totalBreakTime")}
            </span>
            <span className="font-medium">
              {Math.floor(audit.totalBreakTime / 60)}h{" "}
              {audit.totalBreakTime % 60}m
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPage() {
  const t = useTranslations("dashboard");
  const { data: session } = useSession();
  const { getStatus, clockIn, clockOut, toggleBreak, isLoading } =
    useTimeTracking();
  const [timeStatus, setTimeStatus] = useState<TimeStatus | null>(null);
  const [clockedInUsers, setClockedInUsers] = useState<ClockedInUser[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [clockOutOptions, setClockOutOptions] =
    useState<ClockOutOptions | null>(null);
  const [hasTimeLogToday, setHasTimeLogToday] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const fetchTimeStatus = async () => {
    try {
      const status = await getStatus();
      console.log("status", status);
      setTimeStatus(status as TimeStatus);
      setHasTimeLogToday(status.hasTimeLogToday);
    } catch (error) {
      console.error("Error fetching time status:", error);
    }
  };

  const fetchClockedInUsers = async () => {
    try {
      const response = await fetch("/api/admin/users?clockedInToday=true");
      const data = await response.json();
      console.log("data", data);
      setClockedInUsers(data);
    } catch (error) {
      console.error("Error fetching clocked in users:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchTimeStatus(), fetchClockedInUsers()]);
    };

    fetchData();

    // Set up polling every minute
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleClockIn = async () => {
    try {
      await clockIn();
      await Promise.all([fetchTimeStatus(), fetchClockedInUsers()]);
    } catch (error) {
      console.error("Error clocking in:", error);
    }
  };

  const handleClockOutClick = () => {
    if (!timeStatus?.currentTimeLog || !tasks.length) return;

    const clockInTime = new Date(timeStatus.currentTimeLog.clockIn);
    const now = new Date();

    // Calculate total minutes worked, excluding breaks
    const totalMinutes =
      differenceInMinutes(now, clockInTime) -
      (timeStatus.currentTimeLog.breakDuration || 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const hoursWorked = totalMinutes / 60;

    setClockOutOptions({
      actualHours: hoursWorked,
      standardHours: Math.min(8, hoursWorked),
      displayTime: {
        hours,
        minutes,
      },
    });
    setShowConfirmDialog(true);
  };

  const handleConfirmClockOut = async (hours?: number) => {
    try {
      await clockOut(hours);
      await Promise.all([fetchTimeStatus(), fetchClockedInUsers()]);
      setShowConfirmDialog(false);
    } catch (error) {
      console.error("Error clocking out:", error);
    }
  };

  const handleBreak = async () => {
    try {
      // Determine the action based on current break status
      const action = timeStatus?.isOnBreak ? "end" : "start";

      await toggleBreak(action);
      await Promise.all([fetchTimeStatus(), fetchClockedInUsers()]);
    } catch (error) {
      console.error("Error toggling break:", error);
    }
  };

  const getStatusColor = (status: ClockedInUser["status"]) => {
    switch (status) {
      case "active":
        return "text-green-600";
      case "on_break":
        return "text-amber-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (user: ClockedInUser) => {
    if (!user.isActive) return t("status.inactive");
    if (user.isOnBreak) {
      console.log("user", user);
      const breakDuration = user.lastBreakStart
        ? formatDistanceToNow(new Date(user.lastBreakStart), {
            addSuffix: false,
          })
        : `${user.breakDuration ? user.breakDuration : user.lastBreakStart ? differenceInMinutes(new Date(), new Date(user.lastBreakStart)) : 0} min`;
      return `${t("onBreak")} (${breakDuration})`;
    }
    return t("working");
  };

  return (
    <PageLayout pageName={t("title")}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Time Tracking Card */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-32 h-32 rounded-full bg-gray-50 flex items-center justify-center">
                <ClockIcon className="w-16 h-16 text-primary" />
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-semibold">
                  {timeStatus?.isClockedIn
                    ? timeStatus.isOnBreak
                      ? t("onBreak")
                      : t("clockedIn")
                    : hasTimeLogToday
                      ? t("clockOut.alreadyClockedOut")
                      : t("notClockedIn")}
                </h2>
                {timeStatus?.currentTimeLog && (
                  <p className="text-gray-600 mt-2">
                    {t("since")}{" "}
                    {format(
                      new Date(timeStatus.currentTimeLog.clockIn),
                      "h:mm a"
                    )}
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                {!timeStatus?.hasTimeLogToday ? (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PlayIcon className="w-5 h-5" />}
                    onClick={handleClockIn}
                    disabled={isLoading}
                    className="w-32"
                  >
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      t("clockIn.title")
                    )}
                  </Button>
                ) : timeStatus?.isClockedIn ? (
                  <>
                    <Button
                      variant="outlined"
                      color={timeStatus.isOnBreak ? "primary" : "warning"}
                      startIcon={
                        timeStatus.isOnBreak ? (
                          <PlayIcon className="w-5 h-5" />
                        ) : (
                          <PauseIcon className="w-5 h-5" />
                        )
                      }
                      onClick={handleBreak}
                      disabled={isLoading}
                      className="w-32"
                    >
                      {isLoading ? (
                        <CircularProgress size={24} />
                      ) : timeStatus.isOnBreak ? (
                        t("resumeWork")
                      ) : (
                        t("startBreak")
                      )}
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<StopIcon className="w-5 h-5" />}
                      onClick={handleClockOutClick}
                      disabled={isLoading || !tasks.length}
                      className="w-32"
                    >
                      {isLoading ? (
                        <CircularProgress size={24} />
                      ) : (
                        t("clockOut.title")
                      )}
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    {t("clockOut.alreadyClockedOut")}
                  </p>
                )}
              </div>

              {timeStatus?.isClockedIn && (
                <div className="w-full max-w-2xl mx-auto mt-6">
                  <TaskEditor
                    tasks={tasks}
                    onTasksUpdate={setTasks}
                    disabled={!timeStatus.isClockedIn || timeStatus.isOnBreak}
                  />
                </div>
              )}
            </div>

            {/* Add Time Audit Trail */}
            {timeStatus?.todaysSummary && (
              <TimeAuditTrail audit={timeStatus.todaysSummary} />
            )}
          </div>

          {/* Clocked In Colleagues */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserGroupIcon className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">
                {t("clockedInColleagues")}
              </h2>
            </div>
            <div className="space-y-4">
              {clockedInUsers.length > 0 &&
                clockedInUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.position}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-medium ${getStatusColor(user.status)}`}
                      >
                        {getStatusText(user)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {t("since")}{" "}
                        {format(new Date(user.lastClockIn), "h:mm a")}
                      </p>
                    </div>
                  </div>
                ))}
              {clockedInUsers.length === 0 && (
                <p className="text-center text-gray-500">{t("noOneClocked")}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Clock Out Confirmation Dialog */}
      <ConfirmDialog
        open={showConfirmDialog}
        title={t("clockOut.confirmTitle")}
        message={
          clockOutOptions ? (
            <div className="space-y-2">
              <p>
                {clockOutOptions.actualHours > 8
                  ? t("clockOut.confirmMessage")
                  : t("clockOut.confirmStandardMessage")}
              </p>
              <p className="text-sm text-gray-600">
                {t("clockOut.timeWorked", {
                  hours: clockOutOptions.displayTime.hours,
                  minutes: clockOutOptions.displayTime.minutes,
                })}
              </p>
              {clockOutOptions.actualHours > 8 && (
                <p className="text-sm text-gray-500">
                  {t("clockOut.standardHoursNote", {
                    hours: "8",
                  })}
                </p>
              )}
            </div>
          ) : null
        }
        options={
          clockOutOptions?.actualHours && clockOutOptions.actualHours > 8
            ? [
                {
                  label: t("clockOut.useStandardHours", {
                    hours: "8",
                    minutes: "0",
                  }),
                  value: 8,
                  color: "primary",
                },
                {
                  label: t("clockOut.useActualHours", {
                    hours: clockOutOptions.displayTime.hours,
                    minutes: clockOutOptions.displayTime.minutes,
                  }),
                  value: clockOutOptions.actualHours,
                  color: "warning",
                },
              ]
            : [
                {
                  label: t("clockOut.confirm"),
                  value: clockOutOptions?.actualHours,
                  color: "primary",
                },
              ]
        }
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmClockOut}
      />
    </PageLayout>
  );
}

export default DashboardPage;
