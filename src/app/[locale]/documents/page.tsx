"use client";

import React, { useState } from "react";
import SideBar from "@/components/SideBar";
import TopBar from "@/components/TopBar";
import { useTranslations } from "next-intl";
import {
  MagnifyingGlassIcon,
  FolderIcon,
  DocumentIcon,
  TableCellsIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import {
  Card,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

function DocumentsPage() {
  const DocumentsTranslations = useTranslations("documents");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Sample data for document categories
  const categories = [
    { id: 1, name: "Company Policies", count: 12 },
    { id: 2, name: "HR Documents", count: 8 },
    { id: 3, name: "Project Templates", count: 15 },
    { id: 4, name: "Training Materials", count: 10 },
  ];

  // Sample data for documents
  const documents = [
    {
      id: 1,
      name: "Employee Handbook 2024",
      category: "Company Policies",
      updatedAt: "2024-01-15",
      size: "2.4 MB",
      type: "PDF",
    },
    {
      id: 2,
      name: "Vacation Policy",
      category: "HR Documents",
      updatedAt: "2024-01-10",
      size: "1.1 MB",
      type: "DOC",
    },
    {
      id: 3,
      name: "Project Timeline Template",
      category: "Project Templates",
      updatedAt: "2024-01-08",
      size: "500 KB",
      type: "XLS",
    },
    {
      id: 4,
      name: "Onboarding Guide",
      category: "Training Materials",
      updatedAt: "2024-01-05",
      size: "3.2 MB",
      type: "PDF",
    },
  ];

  const handleViewModeChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: "grid" | "list" | null
  ) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen w-screen grid grid-cols-12 bg-gray-50">
      <aside className="col-span-2">
        <SideBar />
      </aside>
      <div className="flex flex-col col-span-10">
        <div className="w-full h-16">
          <TopBar pageName="Documents" />
        </div>
        <div className="p-6 w-full space-y-6">
          {/* Search and View Toggle */}
          <div className="flex justify-between items-center">
            <TextField
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-96"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                  </InputAdornment>
                ),
              }}
            />
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleViewModeChange}
              aria-label="view mode"
            >
              <ToggleButton value="grid" aria-label="grid view">
                <Squares2X2Icon className="w-5 h-5" />
              </ToggleButton>
              <ToggleButton value="list" aria-label="list view">
                <TableCellsIcon className="w-5 h-5" />
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <FolderIcon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-gray-600">
                      {category.count} documents
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Documents Grid/List */}
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-3 gap-4" : "space-y-4"
            }
          >
            {filteredDocuments.map((doc) => (
              <Card
                key={doc.id}
                className={`hover:shadow-md transition-shadow cursor-pointer ${
                  viewMode === "list" ? "p-4" : "p-6"
                }`}
              >
                <div
                  className={`${
                    viewMode === "list"
                      ? "flex items-center justify-between"
                      : "space-y-4"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <DocumentIcon className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{doc.name}</h3>
                      <p className="text-sm text-gray-600">{doc.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {new Date(doc.updatedAt).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">
                          {doc.size}
                        </span>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {doc.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DocumentsPage;
