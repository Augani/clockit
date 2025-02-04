import { getServerSession } from "next-auth";
import { prisma } from "@/lib/api/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { startOfDay, endOfDay } from "date-fns";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeLogId = searchParams.get("timeLogId");
    const projectId = searchParams.get("projectId");

    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.id,
        timeLogId: timeLogId || undefined,
        projectId: projectId || undefined,
      },
      include: {
        project: true,
        timeLog: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { description, duration } = await request.json();

    // Find active time log
    const activeTimeLog = await prisma.timeLog.findFirst({
      where: {
        userId: session.user.id,
        clockIn: {
          gte: startOfDay(new Date()),
          lte: endOfDay(new Date()),
        },
        clockOut: null,
      },
      orderBy: {
        clockIn: "desc",
      },
    });

    if (!activeTimeLog) {
      return NextResponse.json(
        { error: "No active time log found. Please clock in first." },
        { status: 400 }
      );
    }

    const task = await prisma.task.create({
      data: {
        description,
        duration,
        userId: session.user.id,
        timeLogId: activeTimeLog.id,
      },
    });

    return NextResponse.json({
      id: task.id,
      description: task.description,
      duration: task.duration,
      createdAt: task.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, description, duration } = await request.json();

    const task = await prisma.task.update({
      where: {
        id,
        userId: session.user.id,
      },
      data: {
        description,
        duration,
      },
    });

    return NextResponse.json({
      id: task.id,
      description: task.description,
      duration: task.duration,
      createdAt: task.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("id");

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    await prisma.task.delete({
      where: {
        id: taskId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
