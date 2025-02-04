import { getServerSession } from "next-auth";
import { prisma } from "@/lib/api/prisma";
import { NextResponse } from "next/server";
// Use an absolute import if possible – adjust this path to match your project structure.
import { authOptions } from "@/lib/auth";
import { differenceInMinutes } from "date-fns";

export async function POST(request: Request) {
  try {
    // Retrieve the session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse the request body and ensure 'action' is provided
    const { action } = await request.json();
    if (!action) {
      return NextResponse.json(
        { error: "No action provided" },
        { status: 400 }
      );
    }
    console.log("action", action);
    // Find the active time log for the user (that has not been clocked out and is marked as active)
    const activeTimeLog = await prisma.timeLog.findFirst({
      where: {
        userId: session.user.id,
        clockOut: null,
      },
      include: {
        tasks: true,
      },
    });

    if (!activeTimeLog) {
      return NextResponse.json(
        { error: "No active time log found" },
        { status: 400 }
      );
    }

    // Handle the "start" action: start a break.
    if (action === "start") {
      // If a break is already in progress, return an error.
      if (activeTimeLog.breakStart && !activeTimeLog.breakEnd) {
        return NextResponse.json(
          { error: "Break already in progress" },
          { status: 400 }
        );
      }

      const updatedTimeLog = await prisma.timeLog.update({
        where: { id: activeTimeLog.id },
        data: {
          breakStart: new Date(),
          status: "break",
        },
        include: {
          tasks: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: updatedTimeLog,
      });
    }

    // Handle the "end" action: end a break.
    if (action === "end") {
      // If no break is in progress, return an error.
      if (!activeTimeLog.breakStart || activeTimeLog.breakEnd) {
        return NextResponse.json(
          { error: "No break in progress" },
          { status: 400 }
        );
      }

      const now = new Date();

      // Calculate break duration (in minutes) by using date-fns' differenceInMinutes.
      // Ensure that activeTimeLog.breakStart is a valid Date.
      const breakDuration =
        differenceInMinutes(now, activeTimeLog.breakStart) +
        (activeTimeLog.breakDuration || 0);

      const updatedTimeLog = await prisma.timeLog.update({
        where: { id: activeTimeLog.id },
        data: {
          breakEnd: now,
          breakDuration,
          status: "active",
        },
        include: {
          tasks: true,
        },
      });

      return NextResponse.json({
        success: true,
        data: updatedTimeLog,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Error managing break:", error);
    // Return the error message in development (remove details in production)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error.message || error.toString(),
      },
      { status: 500 }
    );
  }
}
