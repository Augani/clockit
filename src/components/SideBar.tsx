"use client";
import { Link } from "@/i18n/routing";
import React from "react";
import Logo from "@/app/Logo";
import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentIcon,
  Cog6ToothIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { navigationItems } from "@/config/navigation";
import useLocale from "@/hooks/useLocale";

interface SideBarProps {
  isOpen?: boolean;
  className?: string;
}

const SideBar: React.FC<SideBarProps> = ({ isOpen = true, className }) => {
  const pathname = usePathname();
  const locale = useLocale();
  const { data: session } = useSession();
  const orgName = process.env.NEXT_PUBLIC_ORG_NAME || "Organization";

  const isAdmin =
    session?.user?.role === "admin" || session?.user?.role === "super_admin";

  const filteredNavItems = navigationItems.filter(
    (item) => !item.adminOnly || (item.adminOnly && isAdmin)
  );

  return (
    <div
      className={`h-screen w-64 fixed left-0 top-0  bg-transparent transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } ${className}`}
    >
      <div className="p-4">
        <div className="flex flex-row items-center justify-center gap-2">
          <Logo width={60} height={60} />
          <h1 className="text-2xl font-bold">{orgName}</h1>
        </div>
        <nav className="flex flex-col gap-2 mt-6">
          <ul className="space-y-5">
            {filteredNavItems.map((item) => {
              const isActive = pathname?.includes(item.href);
              const ItemIcon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={`${item.href}`}
                    className={`flex flex-row text-sm font-semibold items-center gap-2 py-2 px-4 hover:border-r hover:scale-105  transition-all duration-200 border-primary text-gray-800 ${
                      isActive ? "border-l-2 border-primary" : ""
                    }`}
                  >
                    <ItemIcon className="w-5 h-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SideBar;
