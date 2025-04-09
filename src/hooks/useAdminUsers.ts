import { useState } from "react";

interface CreateUserData {
  email: string;
  password: string;
  name: string;
  role?: string;
  department?: string;
  position?: string;
  employeeId?: string;
  timezone?: string;
}

export const useAdminUsers = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUsers = async (filters?: {
    role?: string;
    department?: string;
    clockedInToday?: boolean;
  }): Promise<any> => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams(filters as Record<string, string>);
      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: CreateUserData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getUsers,
    createUser,
    isLoading,
    error,
  };
};
