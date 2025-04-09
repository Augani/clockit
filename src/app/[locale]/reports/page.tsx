"use client";

import React, { useState, useEffect } from "react";
import SideBar from "@/components/SideBar";
import TopBar from "@/components/TopBar";
import { useTranslations } from "next-intl";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  ButtonGroup,
} from "@mui/material";

import FileDownloadIcon from "@mui/icons-material/FileDownload";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import dayjs from "@/lib/dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

interface ReportData {
  totalUsers: number;
  activeUsers: number;
  totalHours: number;
  totalTasks: number;
  averageBreakTime: number;
  departmentStats: Array<{
    department: string;
    totalHours: number;
    employeeCount: number;
  }>;
  topPerformers: Array<{
    user: {
      name: string;
      position: string;
    };
    totalHours: number;
    taskCount: number;
  }>;
  taskDistribution: Array<{
    name: string;
    value: number;
  }>;
}

function TimeTrackingTab() {
  const t = useTranslations("reports");
  const [timeRange, setTimeRange] = useState("week");
  const [startDate, setStartDate] = useState<dayjs.Dayjs | null>(null);
  const [endDate, setEndDate] = useState<dayjs.Dayjs | null>(null);
  const [timeTrackingData, setTimeTrackingData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTimeTrackingData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (startDate && endDate) {
        params.append("startDate", startDate.toISOString());
        params.append("endDate", endDate.toISOString());
      } else {
        params.append("timeRange", timeRange);
      }
      params.append("includeAdmins", "true");

      const response = await fetch(`/api/reports/time-tracking?${params}`);
      const data = await response.json();
      if (data.success) {
        setTimeTrackingData(data.data);
      }
    } catch (error) {
      console.error("Error fetching time tracking data:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTimeTrackingData();
  }, [timeRange, startDate, endDate]);

  const handleExportAllExcel = async () => {
    try {
      const params = new URLSearchParams({
        startDate: startDate
          ? startDate.toISOString()
          : dayjs()
              .startOf(timeRange as any)
              .toISOString(),
        endDate: endDate
          ? endDate.toISOString()
          : dayjs()
              .endOf(timeRange as any)
              .toISOString(),
      });

      const response = await fetch(
        `/api/reports/time-tracking/export/excel?${params}`
      );

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `time-tracking-all-users-${dayjs().format("YYYY-MM-DD")}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting Excel:", error);
    }
  };

  const handleExportAllPDF = async () => {
    try {
      const body = {
        startDate: startDate
          ? startDate.toISOString()
          : dayjs()
              .startOf(timeRange as any)
              .toISOString(),
        endDate: endDate
          ? endDate.toISOString()
          : dayjs()
              .endOf(timeRange as any)
              .toISOString(),
      };

      const response = await fetch("/api/reports/time-tracking/export/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("PDF export failed:", errorData);
        throw new Error(errorData.error || "PDF export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `time-tracking-all-${dayjs().format("YYYY-MM-DD")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  const handleExportUserExcel = async (userId: string) => {
    try {
      const params = new URLSearchParams({
        userId,
        startDate: startDate
          ? startDate.toISOString()
          : dayjs()
              .startOf(timeRange as any)
              .toISOString(),
        endDate: endDate
          ? endDate.toISOString()
          : dayjs()
              .endOf(timeRange as any)
              .toISOString(),
      });

      const response = await fetch(
        `/api/reports/time-tracking/export/excel?${params}`
      );

      if (!response.ok) {
        throw new Error("Excel export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `time-tracking-${userId}-${dayjs().format("YYYY-MM-DD")}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting Excel:", error);
    }
  };

  const handleExportUserPDF = async (userId: string) => {
    try {
      const body = {
        userId,
        startDate: startDate
          ? startDate.toISOString()
          : dayjs()
              .startOf(timeRange as any)
              .toISOString(),
        endDate: endDate
          ? endDate.toISOString()
          : dayjs()
              .endOf(timeRange as any)
              .toISOString(),
      };

      const response = await fetch("/api/reports/time-tracking/export/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("PDF export failed:", errorData);
        throw new Error(errorData.error || "PDF export failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `time-tracking-${userId}-${dayjs().format("YYYY-MM-DD")}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex lg:justify-end mb-4 gap-2 md:flex-row flex-col mx-auto">
        <Button
          variant="contained"
          onClick={handleExportAllExcel}
          startIcon={<FileDownloadIcon />}
        >
          {t("timeTracking.actions.exportAllExcel")}
        </Button>
        <Button
          variant="contained"
          onClick={handleExportAllPDF}
          startIcon={<PictureAsPdfIcon />}
        >
          {t("timeTracking.actions.exportAllPDF")}
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>{t("timeRange.label")}</InputLabel>
          <Select
            value={timeRange}
            label={t("timeRange.label")}
            onChange={(e) => {
              setTimeRange(e.target.value);
              setStartDate(null);
              setEndDate(null);
            }}
          >
            <MenuItem value="day">{t("timeRange.day")}</MenuItem>
            <MenuItem value="week">{t("timeRange.week")}</MenuItem>
            <MenuItem value="month">{t("timeRange.month")}</MenuItem>
            <MenuItem value="custom">{t("timeRange.custom")}</MenuItem>
          </Select>
        </FormControl>

        {timeRange === "custom" && (
          <div className="flex gap-4">
            <DatePicker
              label={t("timeRange.startDate")}
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              slotProps={{ textField: { size: "small" } }}
            />
            <DatePicker
              label={t("timeRange.endDate")}
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              slotProps={{ textField: { size: "small" } }}
            />
          </div>
        )}
      </div>

      <TableContainer className="w-full" component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("timeTracking.employee")}</TableCell>
              <TableCell>{t("timeTracking.department")}</TableCell>
              <TableCell>{t("timeTracking.position")}</TableCell>
              <TableCell align="right">
                {t("timeTracking.totalHours")}
              </TableCell>
              <TableCell align="right">
                {t("timeTracking.breakHours")}
              </TableCell>
              <TableCell align="center">
                {t("timeTracking.actions.title")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timeTrackingData.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell>{user.position}</TableCell>
                <TableCell align="right">{user.totalHours}</TableCell>
                <TableCell align="right">{user.totalBreakHours}</TableCell>
                <TableCell align="center">
                  <IconButton
                    size="small"
                    onClick={() => handleExportUserExcel(user.id)}
                    title={t("timeTracking.actions.exportExcel")}
                  >
                    <FileDownloadIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleExportUserPDF(user.id)}
                    title={t("timeTracking.actions.exportPDF")}
                  >
                    <PictureAsPdfIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

function ReportsPage() {
  const t = useTranslations("reports");
  const [timeRange, setTimeRange] = useState("week");
  const [currentTab, setCurrentTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/reports?timeRange=${timeRange}`);
      if (!response.ok) throw new Error("Failed to fetch report data");
      const { data } = await response.json();
      setReportData(data);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen grid grid-cols-12 bg-gray-50">
      <aside className="col-span-2 hidden md:block">
        <SideBar />
      </aside>
      <div className="flex flex-col col-span-12 lg:col-span-10">
        <div className="w-full h-16">
          <TopBar pageName={t("title")} />
        </div>
        <div className="p-6 w-full space-y-6">
          {/* Controls */}
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label={t("tabs.overview")} />
            <Tab label={t("tabs.timeTracking")} />
            {/* <Tab label={t("tabs.projects")} /> */}
          </Tabs>
          {/* Overview Tab */}
          {currentTab === 0 && reportData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <div className="flex justify-between items-center">
                  <FormControl size="small" className="w-48">
                    <InputLabel>{t("timeRange.label")}</InputLabel>
                    <Select
                      value={timeRange}
                      label={t("timeRange.label")}
                      onChange={handleTimeRangeChange}
                    >
                      <MenuItem value="week">{t("timeRange.week")}</MenuItem>
                      <MenuItem value="month">{t("timeRange.month")}</MenuItem>
                      <MenuItem value="quarter">
                        {t("timeRange.quarter")}
                      </MenuItem>
                      <MenuItem value="year">{t("timeRange.year")}</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
              {/* Summary Cards */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {t("overview.summary")}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">{t("overview.totalUsers")}</p>
                    <p className="text-2xl font-bold">
                      {reportData.totalUsers}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t("overview.activeUsers")}</p>
                    <p className="text-2xl font-bold">
                      {reportData.activeUsers}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t("overview.totalHours")}</p>
                    <p className="text-2xl font-bold">
                      {reportData.totalHours.toFixed(1)}h
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t("overview.totalTasks")}</p>
                    <p className="text-2xl font-bold">
                      {reportData.totalTasks}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Department Stats */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {t("overview.departmentStats")}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData.departmentStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="totalHours"
                      fill="#4F46E5"
                      name={t("overview.hours")}
                    />
                    <Bar
                      dataKey="employeeCount"
                      fill="#E5E7EB"
                      name={t("overview.employees")}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* Top Performers */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {t("overview.topPerformers")}
                </h3>
                <div className="space-y-4">
                  {reportData.topPerformers.map((performer, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{performer.user.name}</p>
                        <p className="text-sm text-gray-600">
                          {performer.user.position}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {performer.totalHours.toFixed(1)}h
                        </p>
                        <p className="text-sm text-gray-600">
                          {performer.taskCount} {t("overview.tasks")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Task Distribution */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {t("overview.taskDistribution")}
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.taskDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        percent,
                        name,
                      }) => {
                        const radius =
                          innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x =
                          cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                        const y =
                          cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                        return (
                          <text
                            x={x}
                            y={y}
                            fill="white"
                            textAnchor="middle"
                            dominantBaseline="central"
                          >
                            {`${name} ${(percent * 100).toFixed(0)}%`}
                          </text>
                        );
                      }}
                      dataKey="value"
                    >
                      {reportData.taskDistribution.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            </div>
          )}

          {/* Time Tracking Tab */}
          {currentTab === 1 && <TimeTrackingTab />}

          {/* Add Projects tab here */}
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;
