"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslations } from "next-intl";
import { CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const { logout } = useAuth();
  const t = useTranslations("auth");
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      logout();
    }
  }, [status, logout, router]);

  // Show loading only when actually logging out
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center space-y-4">
        <CircularProgress size={40} className="text-primary" />
        <p className="text-gray-600">{t("loggingOut")}</p>
      </div>
    </div>
  );
}
