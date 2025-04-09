"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import PageLayout from "@/components/PageLayout";
import { useProfile } from "@/hooks/useProfile";
import { Button, TextField, Alert, CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { timeZones } from "@/i18n/config";
import { UserCircleIcon } from "@heroicons/react/24/outline";

interface ProfileFormData {
  name: string;
  position: string;
  phone: string;
  address: string;
  timezone: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

function ProfilePage() {
  const t = useTranslations("profile");
  const { data: session } = useSession();
  const { getProfile, updateProfile, isLoading, error } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    position: "",
    phone: "",
    address: "",
    timezone: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setFormData({
          name: data.name || "",
          position: data.position || "",
          phone: data.phone || "",
          address: data.address || "",
          timezone: data.timezone || "",
          emergencyContact: data.emergencyContact || {
            name: "",
            phone: "",
            relationship: "",
          },
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setSuccessMessage(t("updateSuccess"));
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <PageLayout pageName={t("title")}>
      <div className="max-w-4xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white text-3xl font-semibold">
              {formData.name.charAt(0)}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-semibold">{formData.name}</h2>
              <p className="text-gray-600">{formData.position}</p>
              <p className="text-sm text-gray-500">{session?.user?.email}</p>
            </div>
            <Button
              variant="contained"
              onClick={() => setIsEditing(!isEditing)}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isEditing ? t("cancel") : t("edit")}
            </Button>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert severity="error" className="rounded-lg">
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" className="rounded-lg">
              {successMessage}
            </Alert>
          )}

          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserCircleIcon className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">{t("personalInfo")}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label={t("name")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={!isEditing}
                fullWidth
                className="bg-gray-50/50"
              />
              <TextField
                label={t("position")}
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                disabled={!isEditing}
                fullWidth
                className="bg-gray-50/50"
              />
              <TextField
                label={t("phone")}
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={!isEditing}
                fullWidth
                className="bg-gray-50/50"
              />
              <TextField
                select
                label={t("timezone")}
                value={formData.timezone}
                onChange={(e) =>
                  setFormData({ ...formData, timezone: e.target.value })
                }
                disabled={!isEditing}
                fullWidth
                SelectProps={{
                  native: true,
                }}
                className="bg-gray-50/50"
              >
                {timeZones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </TextField>
              <TextField
                label={t("address")}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                disabled={!isEditing}
                fullWidth
                multiline
                rows={3}
                className="col-span-1 sm:col-span-2 bg-gray-50/50"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserCircleIcon className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">{t("emergencyContact")}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextField
                label={t("emergencyContactName")}
                value={formData.emergencyContact.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergencyContact: {
                      ...formData.emergencyContact,
                      name: e.target.value,
                    },
                  })
                }
                disabled={!isEditing}
                fullWidth
                className="bg-gray-50/50"
              />
              <TextField
                label={t("emergencyContactPhone")}
                value={formData.emergencyContact.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergencyContact: {
                      ...formData.emergencyContact,
                      phone: e.target.value,
                    },
                  })
                }
                disabled={!isEditing}
                fullWidth
                className="bg-gray-50/50"
              />
              <TextField
                label={t("emergencyContactRelationship")}
                value={formData.emergencyContact.relationship}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    emergencyContact: {
                      ...formData.emergencyContact,
                      relationship: e.target.value,
                    },
                  })
                }
                disabled={!isEditing}
                fullWidth
                className="col-span-1 sm:col-span-2 bg-gray-50/50"
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                className="w-full sm:w-32"
              >
                {isLoading ? <CircularProgress size={24} /> : t("save")}
              </Button>
            </div>
          )}
        </form>
      </div>
    </PageLayout>
  );
}

export default ProfilePage;
