"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import PageLayout from "@/components/PageLayout";
import { useTranslations } from "next-intl";
import { TextField, InputAdornment, Button, Tab, Tabs } from "@mui/material";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import UserCreateModal from "@/components/UserCreateModal";
import { useSession } from "next-auth/react";
import Table from "@/components/Table";
import { formatDistanceToNow, formatDuration } from "date-fns";
import { useDebounce } from "@/hooks/useDebounce";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  position: string;
  isActive: boolean;
  isOnBreak: boolean;
  lastClockIn: string;
  clockOut: string | null;
  workDuration: number;
  breakDuration: number;
  joinDate: string;
}

function TeamPage() {
  const t = useTranslations("team");
  const [currentTab, setCurrentTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { data: session } = useSession();
  const { getUsers, isLoading, error } = useAdminUsers();
  const [users, setUsers] = useState<User[]>([]);

  const debouncedSearch = useDebounce(searchQuery, 300);

  const isAdmin =
    session?.user?.role === "admin" || session?.user?.role === "super_admin";

  const fetchUsers = useCallback(
    async (clockedInOnly = false) => {
      try {
        const data = await getUsers({ clockedInToday: clockedInOnly });
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    [getUsers]
  );

  useEffect(() => {
    fetchUsers(currentTab === 1);
  }, [currentTab]);

  const columns = useMemo(() => {
    const baseColumns = [
      { name: t("table.name"), key: "name" },
      { name: t("table.role"), key: "role" },
      { name: t("table.department"), key: "department" },
      { name: t("table.position"), key: "position" },
    ];

    if (currentTab === 1) {
      // Additional columns for clocked in users
      return [
        ...baseColumns,
        { name: t("table.status"), key: "status" },
        { name: t("table.workDuration"), key: "workDuration" },
        { name: t("table.breakDuration"), key: "breakDuration" },
      ];
    }

    return baseColumns;
  }, [t, currentTab]);

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        if (!debouncedSearch) return true;

        const searchTerms = debouncedSearch.toLowerCase().split(" ");

        return searchTerms.every((term) => {
          return (
            user.name?.toLowerCase().includes(term) ||
            user.email?.toLowerCase().includes(term) ||
            user.department?.toLowerCase().includes(term) ||
            user.position?.toLowerCase().includes(term) ||
            t(`roles.${user.role}`).toLowerCase().includes(term)
          );
        });
      })
      .map((user) => {
        const baseUser = {
          ...user,
          role: t(`roles.${user.role}`),
        };

        if (currentTab === 1) {
          // Only add these fields for clocked in users
          return {
            ...baseUser,
            status: user.isActive
              ? user.isOnBreak
                ? t("status.onBreak")
                : t("status.active")
              : t("status.clockedOut"),
            workDuration: user.workDuration
              ? `${Math.floor(user.workDuration / 60)}h ${user.workDuration % 60}m`
              : "-",
            breakDuration: user.breakDuration
              ? `${Math.floor(user.breakDuration / 60)}h ${user.breakDuration % 60}m`
              : "-",
          };
        }

        return baseUser;
      });
  }, [users, debouncedSearch, t, currentTab]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTabChange = (_: any, value: number) => {
    setCurrentTab(value);
  };

  return (
    <PageLayout pageName={t("title")}>
      <div className="space-y-10 md:space-y-6">
        {/* Search and Tabs - Mobile First Layout */}
        <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:justify-between md:items-center">
          {/* Tabs - Full width on mobile */}
          <div className="w-full overflow-x-auto md:w-auto">
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              className="border-b border-gray-200 md:border-0"
            >
              <Tab label={t("tabs.allMembers")} />
              <Tab label={t("tabs.clockedIn")} />
            </Tabs>
          </div>

          {/* Search and Add User - Stack on mobile */}
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:items-center sm:gap-4">
            <TextField
              size="small"
              placeholder={t("search")}
              value={searchQuery}
              onChange={handleSearch}
              className="w-full sm:w-64"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                  </InputAdornment>
                ),
              }}
            />
            {isAdmin && (
              <Button
                variant="contained"
                startIcon={<PlusIcon className="w-5 h-5" />}
                onClick={() => setCreateModalOpen(true)}
                className="w-full sm:w-auto"
              >
                {t("addUser")}
              </Button>
            )}
          </div>
        </div>

        {/* Users Table with Responsive Container */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table
                columns={columns}
                data={filteredUsers}
                className="w-full min-w-[640px]" // Minimum width to prevent squishing
                pagination={true}
                onRowClick={(row) => console.log("Row clicked:", row)}
                onPageChange={(page) => console.log("Page changed:", page)}
                onRowsPerPageChange={(rowsPerPage) =>
                  console.log("Rows per page changed:", rowsPerPage)
                }
                page={0}
                rowsPerPage={10}
                responsive={true} // Add responsive prop
                mobileColumns={[
                  // Specify important columns for mobile view
                  "name",
                  "position",
                  "status",
                ]}
              />
            </div>
          )}
        </div>

        {/* Create User Modal */}
        <UserCreateModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSuccess={() => fetchUsers(currentTab === 1)}
        />
      </div>
    </PageLayout>
  );
}

export default TeamPage;
