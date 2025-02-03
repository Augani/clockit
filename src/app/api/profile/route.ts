import { NextResponse } from "next/server";
import { prisma } from "@/lib/api/prisma";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

// GET /api/profile - Get current user's profile
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    console.log("Token:", token); // Debug token

    if (!token?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First try to find the user
    const user = await prisma.user.findUnique({
      where: {
        email: token.email,
      },
      include: {
        // Using include instead of select for better type safety
        emergencyContact: true,
        workingHours: true,
        notificationSettings: true,
      },
    });

    console.log("Found user:", user); // Debug user data

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove sensitive data before sending response
    const { password, emailVerified, ...safeUser } = user;

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("Error in GET /api/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/profile - Update current user's profile
export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req });
    console.log("Update Token:", token);

    if (!token?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    console.log("Update Data:", data);

    // Validate the update data
    const { name, position, phone, address, timezone, emergencyContact } = data;

    // First get the user to check if they have an emergency contact
    const currentUser = await prisma.user.findUnique({
      where: { email: token.email },
      include: { emergencyContact: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare the update data
    const updateData: any = {
      name,
      position,
      phone,
      address,
      timezone,
    };

    // Handle emergency contact update
    if (emergencyContact) {
      if (currentUser.emergencyContact) {
        // Update existing emergency contact
        updateData.emergencyContact = {
          update: {
            name: emergencyContact.name,
            phone: emergencyContact.phone,
            relationship: emergencyContact.relationship,
          },
        };
      } else {
        // Create new emergency contact
        updateData.emergencyContact = {
          create: {
            name: emergencyContact.name,
            phone: emergencyContact.phone,
            relationship: emergencyContact.relationship,
          },
        };
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: {
        email: token.email,
      },
      data: updateData,
      include: {
        emergencyContact: true,
        workingHours: true,
        notificationSettings: true,
      },
    });

    console.log("Updated User:", updatedUser);

    const { password, emailVerified, ...safeUpdatedUser } = updatedUser;
    return NextResponse.json(safeUpdatedUser);
  } catch (error) {
    console.error("Error in PATCH /api/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
