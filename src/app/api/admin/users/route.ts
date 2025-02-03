import { prisma } from "@/lib/api/prisma";
import { NextResponse } from "next/server";
import { adminAuth } from "@/middleware/adminAuth";
import bcrypt from "bcrypt";
import { startOfDay, endOfDay, differenceInMinutes } from "date-fns";

export async function GET(request: Request) {
  try {
    // const authError = await adminAuth();
    // if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const clockedInToday = searchParams.get("clockedInToday") === "true";
    const role = searchParams.get("role");
    const department = searchParams.get("department");

    const today = new Date();
    const baseQuery = {
      where: {
        role: role || undefined,
        department: department || undefined,
        timeLogs: clockedInToday
          ? {
              some: {
                clockIn: {
                  gte: startOfDay(today),
                  lte: endOfDay(today),
                },
              },
            }
          : undefined,
      },
      include: {
        timeLogs: clockedInToday
          ? {
              where: {
                clockIn: {
                  gte: startOfDay(today),
                  lte: endOfDay(today),
                },
              },
              orderBy: {
                clockIn: "desc",
              },
            }
          : false,
      },
    };

    const users = await prisma.user.findMany(baseQuery as any);

    // Transform the data based on whether we're getting clocked in users or all users
    const transformedUsers = users.map((user) => {
      const baseUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        position: user.position,
        joinDate: user.joinDate,
      };

      if (clockedInToday && user.timeLogs?.[0]) {
        const todayTimeLog = user.timeLogs[0];
        const now = new Date();
        const breakDuration =
          todayTimeLog.breakDuration ||
          (todayTimeLog.breakStart && !todayTimeLog.breakEnd
            ? differenceInMinutes(now, new Date(todayTimeLog.breakStart))
            : 0);
        const isActive = !todayTimeLog.clockOut;
        const isOnBreak =
          isActive && todayTimeLog.breakStart && !todayTimeLog.breakEnd;

        // Calculate work duration only for clocked in users
        let totalWorkMinutes = 0;
        if (todayTimeLog.clockOut) {
          totalWorkMinutes =
            differenceInMinutes(todayTimeLog.clockOut, todayTimeLog.clockIn) -
            breakDuration;
        } else {
          totalWorkMinutes =
            differenceInMinutes(now, todayTimeLog.clockIn) - breakDuration;
        }

        return {
          ...baseUser,
          isActive,
          isOnBreak,
          lastClockIn: todayTimeLog.clockIn,
          clockOut: todayTimeLog.clockOut,
          workDuration: totalWorkMinutes,
          breakDuration,
        };
      }

      return baseUser;
    });

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authError = await adminAuth();
    if (authError) return authError;

    const body = await request.json();
    const {
      email,
      password,
      name,
      role,
      department,
      position,
      employeeId,
      timezone,
    } = body;

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with related records
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role || "user",
        department: department || "IT",
        position: position || "Developer",
        employeeId: employeeId || undefined,
        timezone: timezone || "UTC",
        workingHours: {
          create: {}, // Creates with default values
        },
        notificationSettings: {
          create: {}, // Creates with default values
        },
      },
      include: {
        workingHours: true,
        notificationSettings: true,
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
