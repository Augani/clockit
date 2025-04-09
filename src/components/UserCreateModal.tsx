"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { useTranslations } from "next-intl";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface UserCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserCreateModal({
  open,
  onClose,
  onSuccess,
}: UserCreateModalProps) {
  const t = useTranslations("team.createUser");
  const { createUser, isLoading, error } = useAdminUsers();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "user",
    department: "IT",
    position: "Developer",
    employeeId: "",
    timezone: "UTC",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(formData);
      onSuccess();
      onClose();
      setFormData({
        email: "",
        password: "",
        name: "",
        role: "user",
        department: "IT",
        position: "Developer",
        employeeId: "",
        timezone: "UTC",
      });
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      className="backdrop-blur-sm"
      PaperProps={{
        className: "rounded-xl shadow-xl",
      }}
    >
      <div className="border-b border-gray-100">
        <DialogTitle className="flex justify-between items-center p-6">
          <h2 className="text-xl font-semibold text-gray-800">{t("title")}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </DialogTitle>
      </div>

      <form onSubmit={handleSubmit}>
        <DialogContent className="p-6">
          {error && (
            <Alert severity="error" className="mb-6">
              {error}
            </Alert>
          )}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <TextField
                label={t("name")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="col-span-2"
                variant="outlined"
              />
              <TextField
                label={t("email")}
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="col-span-2"
              />
              <TextField
                label={t("password")}
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                className="col-span-2"
              />
              <FormControl className="col-span-2">
                <InputLabel>{t("role")}</InputLabel>
                <Select
                  value={formData.role}
                  label={t("role")}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  <MenuItem value="user">{t("roles.user")}</MenuItem>
                  <MenuItem value="manager">{t("roles.manager")}</MenuItem>
                  <MenuItem value="admin">{t("roles.admin")}</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label={t("department")}
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              />
              <TextField
                label={t("position")}
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
              />
              <TextField
                label={t("employeeId")}
                value={formData.employeeId}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
                required
              />
              <TextField
                label={t("timezone")}
                value={formData.timezone}
                onChange={(e) =>
                  setFormData({ ...formData, timezone: e.target.value })
                }
              />
            </div>
          </div>
        </DialogContent>

        <DialogActions className="p-6 border-t border-gray-100">
          <div className="flex gap-3 w-full justify-end">
            <Button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50"
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white"
            >
              {isLoading ? t("creating") : t("create")}
            </Button>
          </div>
        </DialogActions>
      </form>
    </Dialog>
  );
}
