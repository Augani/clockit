import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useLocale from "@/hooks/useLocale";

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (status === "unauthenticated") {
      const currentPath = window.location.pathname;
      if (!currentPath.includes("/login") && !currentPath.endsWith("/")) {
        router.push(`/${locale}/login`);
      }
    }
  }, [status, router, locale]);

  const login = async ({ email, password }: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        return false;
      }

      if (result?.ok) {
        router.push(`/${locale}/dashboard`);
        return true;
      }

      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut({
        redirect: false,
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === "loading" || isLoading,
    error,
    login,
    logout,
  };
};
