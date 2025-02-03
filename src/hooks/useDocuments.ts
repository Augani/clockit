import { useState } from "react";

interface UploadDocumentData {
  file: File;
  title: string;
  description?: string;
  category: string;
  tags?: string[];
}

export const useDocuments = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadDocument = async (data: UploadDocumentData) => {
    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("title", data.title);
      if (data.description) formData.append("description", data.description);
      formData.append("category", data.category);
      if (data.tags) formData.append("tags", JSON.stringify(data.tags));

      const response = await fetch("/api/admin/documents", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error);
      }

      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getDocuments = async (category?: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (category) params.append("category", category);

      const response = await fetch(`/api/admin/documents?${params}`);
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
    uploadDocument,
    getDocuments,
    isLoading,
    error,
  };
};
