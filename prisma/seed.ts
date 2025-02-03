import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.timeLog.deleteMany();
  await prisma.document.deleteMany();
  await prisma.project.deleteMany();
  await prisma.emergencyContact.deleteMany();
  await prisma.workingHours.deleteMany();
  await prisma.notificationSettings.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned up the database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@clockit.com",
      password: adminPassword,
      role: "admin",
      department: "IT",
      position: "System Administrator",
      employeeId: "EMP001",
      timezone: "UTC",
      phone: "+1234567890",
      address: "123 Admin Street, Tech City",
      workingHours: {
        create: {
          startTime: "09:00",
          endTime: "17:00",
          breakTime: 60,
          workDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
          maxDailyHours: 12,
        },
      },
      notificationSettings: {
        create: {
          emailEnabled: true,
          pushEnabled: true,
          weeklySummary: true,
        },
      },
      emergencyContact: {
        create: {
          name: "John Doe",
          phone: "+1987654321",
          relationship: "Spouse",
        },
      },
    },
  });

  console.log("👑 Created admin user");

  // Create regular users with different roles
  const userPassword = await bcrypt.hash("user123", 12);
  const userData = [
    {
      role: "manager",
      department: "IT",
      position: "Software Engineering Manager",
    },
    {
      role: "user",
      department: "HR",
      position: "HR Manager",
    },
    {
      role: "user",
      department: "Finance",
      position: "Accountant",
    },
    {
      role: "user",
      department: "Marketing",
      position: "Marketing Specialist",
    },
    {
      role: "user",
      department: "Sales",
      position: "Sales Representative",
    },
  ];

  for (let i = 0; i < userData.length; i++) {
    const { role, department, position } = userData[i];
    await prisma.user.create({
      data: {
        name: `Test User ${i + 1}`,
        email: `user${i + 1}@clockit.com`,
        password: userPassword,
        role,
        department,
        position,
        employeeId: `EMP00${i + 2}`,
        timezone: "UTC",
        phone: `+1234567${i.toString().padStart(3, "0")}`,
        address: `${i + 1} User Street, Work City`,
        workingHours: {
          create: {
            startTime: "09:00",
            endTime: "17:00",
            breakTime: 60,
            workDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
            maxDailyHours: 8,
          },
        },
        notificationSettings: {
          create: {
            emailEnabled: true,
            pushEnabled: true,
            weeklySummary: false,
          },
        },
        emergencyContact: {
          create: {
            name: `Emergency Contact ${i + 1}`,
            phone: `+1987654${i.toString().padStart(3, "0")}`,
            relationship: i % 2 === 0 ? "Spouse" : "Parent",
          },
        },
      },
    });

    console.log(`👤 Created user: user${i + 1}@clockit.com`);
  }

  // Create a sample project
  await prisma.project.create({
    data: {
      title: "Sample Project",
      description: "A sample project for testing purposes",
      status: "active",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      budget: 10000,
      priority: "medium",
      members: ["EMP001", "EMP002"],
      tags: ["development", "testing"],
      ownerId:
        (await prisma.user.findFirst({ where: { role: "admin" } }))?.id || "",
    },
  });

  console.log("📋 Created sample project");

  // Create a sample document
  await prisma.document.create({
    data: {
      title: "Employee Handbook",
      description: "Company policies and guidelines",
      fileUrl: "https://example.com/handbook.pdf",
      fileName: "handbook.pdf",
      fileType: "application/pdf",
      fileSize: 1024 * 1024, // 1MB
      category: "COMPANY_POLICIES",
      uploadedBy:
        (await prisma.user.findFirst({ where: { role: "admin" } }))?.id || "",
      tags: ["policies", "guidelines"],
      isPublic: true,
      viewCount: 0,
    },
  });

  console.log("📄 Created sample document");

  console.log(`\n✅ Database has been seeded successfully!`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
