import { useState } from "react";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  position: string;
  employeeId: string;
  timezone: string;
  avatar?: string;
  phone?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface UpdateProfileData {
  name?: string;
  position?: string;
  phone?: string;
  address?: string;
  timezone?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/profile");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      return data as ProfileData;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: UpdateProfileData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error);
      }

      return responseData as ProfileData;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getProfile,
    updateProfile,
    isLoading,
    error,
  };
};
