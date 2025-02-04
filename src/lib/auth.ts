import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/api/prisma";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  // Copy the entire configuration here
  adapter: PrismaAdapter(prisma),
  providers: [
    // ... existing providers configuration ...
  ],
  callbacks: {
    // ... existing callbacks configuration ...
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
