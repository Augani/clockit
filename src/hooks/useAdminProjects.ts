import { useState } from "react";

interface CreateProjectData {
  title: string;
  description?: string;
  ownerId: string;
  members?: string[];
  startDate?: Date;
  endDate?: Date;
  budget?: number;
  priority?: string;
  tags?: string[];
}

export const useAdminProjects = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProjects = async (filters?: {
    status?: string;
    priority?: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams(filters);
      const response = await fetch(`/api/admin/projects?${params}`);
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

  const createProject = async (projectData: CreateProjectData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
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
    getProjects,
    createProject,
    isLoading,
    error,
  };
};
