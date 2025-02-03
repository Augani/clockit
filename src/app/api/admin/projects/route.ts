import { prisma } from "@/lib/api/prisma";
import { NextResponse } from "next/server";
import { adminAuth } from "@/middleware/adminAuth";

export async function GET(request: Request) {
  try {
    const authError = await adminAuth();
    if (authError) return authError;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");

    const projects = await prisma.project.findMany({
      where: {
        status: status || undefined,
        priority: priority || undefined,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
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
      title,
      description,
      ownerId,
      members,
      startDate,
      endDate,
      budget,
      priority,
      tags,
    } = body;

    if (!title || !ownerId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify owner exists
    const owner = await prisma.user.findUnique({
      where: { id: ownerId },
    });

    if (!owner) {
      return NextResponse.json({ error: "Invalid owner ID" }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        ownerId,
        members: members || [],
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        budget: budget ? parseFloat(budget) : null,
        priority: priority || "medium",
        tags: tags || [],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
