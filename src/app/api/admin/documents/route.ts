import { NextResponse } from "next/server";
import { prisma } from "@/lib/api/prisma";
import { adminAuth } from "@/middleware/adminAuth";
import { uploadToGCS } from "@/lib/gcs";

export async function POST(request: Request) {
  try {
    const authError = await adminAuth();
    if (authError) return authError;

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const tags = JSON.parse((formData.get("tags") as string) || "[]");

    if (!file || !title || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileUrl = await uploadToGCS(buffer, file.name, file.type);

    const document = await prisma.document.create({
      data: {
        title,
        description,
        fileUrl,
        fileName: file.name,
        fileType: file.type,
        fileSize: buffer.length,
        category,
        tags,
        uploadedBy: session.user.id,
      },
    });

    return NextResponse.json(document);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const documents = await prisma.document.findMany({
      where: {
        category: category || undefined,
        isPublic: true,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
