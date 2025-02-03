"use client";

import React from "react";
import SideBar from "@/components/SideBar";
import TopBar from "@/components/TopBar";
import { useTranslations } from "next-intl";
import {
  Card,
  Divider,
  Switch,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  UserCircleIcon,
  BellIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  PaintBrushIcon,
} from "@heroicons/react/24/outline";

function SettingsPage() {
  const t = useTranslations("settings");

  const SettingSection = ({
    icon,
    title,
    children,
  }: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
  }) => (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        {icon}
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <Divider />
      <div className="space-y-4 pt-2">{children}</div>
    </Card>
  );

  const SettingRow = ({
    title,
    description,
    children,
  }: {
    title: string;
    description: string;
    children: React.ReactNode;
  }) => (
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen w-screen grid grid-cols-12 bg-gray-50">
      <aside className="col-span-2">
        <SideBar />
      </aside>
      <div className="flex flex-col col-span-10">
        <div className="w-full h-16">
          <TopBar pageName={t("title")} />
        </div>
        <div className="p-6 max-w-5xl mx-auto w-full space-y-6">
          {/* Profile Settings */}
          <SettingSection
            icon={<UserCircleIcon className="w-6 h-6 text-primary" />}
            title={t("profile.title")}
          >
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label={t("profile.firstName")}
                defaultValue="John"
                fullWidth
              />
              <TextField
                label={t("profile.lastName")}
                defaultValue="Doe"
                fullWidth
              />
              <TextField
                label={t("profile.email")}
                defaultValue="john.doe@example.com"
                fullWidth
                type="email"
              />
              <TextField
                label={t("profile.phone")}
                defaultValue="+1 234 567 890"
                fullWidth
              />
            </div>
          </SettingSection>

          {/* Notifications */}
          <SettingSection
            icon={<BellIcon className="w-6 h-6 text-primary" />}
            title={t("notifications.title")}
          >
            <SettingRow
              title={t("notifications.email")}
              description={t("notifications.emailDesc")}
            >
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow
              title={t("notifications.push")}
              description={t("notifications.pushDesc")}
            >
              <Switch defaultChecked />
            </SettingRow>
            <SettingRow
              title={t("notifications.weekly")}
              description={t("notifications.weeklyDesc")}
            >
              <Switch />
            </SettingRow>
          </SettingSection>

          {/* Localization */}
          <SettingSection
            icon={<GlobeAltIcon className="w-6 h-6 text-primary" />}
            title={t("localization.title")}
          >
            <SettingRow
              title={t("localization.language")}
              description={t("localization.languageDesc")}
            >
              <Select defaultValue="en" size="small" sx={{ minWidth: 120 }}>
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Español</MenuItem>
                <MenuItem value="fr">Français</MenuItem>
              </Select>
            </SettingRow>
            <SettingRow
              title={t("localization.timezone")}
              description={t("localization.timezoneDesc")}
            >
              <Select defaultValue="UTC" size="small" sx={{ minWidth: 120 }}>
                <MenuItem value="UTC">UTC</MenuItem>
                <MenuItem value="EST">EST</MenuItem>
                <MenuItem value="PST">PST</MenuItem>
              </Select>
            </SettingRow>
          </SettingSection>

          {/* Security */}
          <SettingSection
            icon={<ShieldCheckIcon className="w-6 h-6 text-primary" />}
            title={t("security.title")}
          >
            <SettingRow
              title={t("security.twoFactor")}
              description={t("security.twoFactorDesc")}
            >
              <Switch />
            </SettingRow>
            <SettingRow
              title={t("security.sessions")}
              description={t("security.sessionsDesc")}
            >
              <button className="text-primary hover:text-primary-dark">
                {t("security.manageBtn")}
              </button>
            </SettingRow>
          </SettingSection>

          {/* Appearance */}
          <SettingSection
            icon={<PaintBrushIcon className="w-6 h-6 text-primary" />}
            title={t("appearance.title")}
          >
            <SettingRow
              title={t("appearance.theme")}
              description={t("appearance.themeDesc")}
            >
              <Select defaultValue="light" size="small" sx={{ minWidth: 120 }}>
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System</MenuItem>
              </Select>
            </SettingRow>
            <SettingRow
              title={t("appearance.compact")}
              description={t("appearance.compactDesc")}
            >
              <Switch />
            </SettingRow>
          </SettingSection>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
