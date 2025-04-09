"use client";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const weeklyData = [
  { name: "John Doe", hours: 32, overtime: 2, projects: 4 },
  { name: "Jane Smith", hours: 28, overtime: 0, projects: 3 },
  { name: "Mike Johnson", hours: 25, overtime: 1, projects: 2 },
  { name: "Sarah Williams", hours: 35, overtime: 5, projects: 5 },
  { name: "Tom Brown", hours: 30, overtime: 0, projects: 3 },
];

const monthlyTrend = [
  { month: "Jan", efficiency: 85, tasks: 45 },
  { month: "Feb", efficiency: 88, tasks: 52 },
  { month: "Mar", efficiency: 90, tasks: 48 },
  { month: "Apr", efficiency: 87, tasks: 55 },
  { month: "May", efficiency: 92, tasks: 60 },
];

const projectDistribution = [
  { name: "Development", value: 45 },
  { name: "Design", value: 25 },
  { name: "Testing", value: 20 },
  { name: "Documentation", value: 10 },
];

const Sample1: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 } }}>
      <Grid container spacing={{ xs: 2, md: 3 }}>
        <Grid item xs={12}>
          <Typography variant="h4" component="div" gutterBottom>
            Employee Performance Dashboard
          </Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Weekly Hours by Employee
              </Typography>
              <Box sx={{ width: "100%", height: 300, overflowX: "auto" }}>
                <BarChart
                  width={500}
                  height={300}
                  data={weeklyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hours" fill="#8884d8" />
                  <Bar dataKey="overtime" fill="#82ca9d" />
                </BarChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Efficiency Trends
              </Typography>
              <Box sx={{ width: "100%", height: 300, overflowX: "auto" }}>
                <LineChart
                  width={500}
                  height={300}
                  data={monthlyTrend}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="efficiency" stroke="#8884d8" />
                  <Line type="monotone" dataKey="tasks" stroke="#82ca9d" />
                </LineChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Distribution
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: 300,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <PieChart width={500} height={300}>
                  <Pie
                    data={projectDistribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  />
                  <Tooltip />
                  <Legend />
                </PieChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Projects per Employee
              </Typography>
              <Box sx={{ width: "100%", height: 300, overflowX: "auto" }}>
                <BarChart
                  width={500}
                  height={300}
                  data={weeklyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="projects" fill="#ffc658" />
                </BarChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Sample1;
