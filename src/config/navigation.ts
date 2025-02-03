import {
  HomeIcon,
  CalendarIcon,
  UsersIcon,
  DocumentIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ClockIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

export const navigationItems: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: UserIcon,
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: CalendarIcon,
  },
  {
    name: "Team",
    href: "/team",
    icon: UsersIcon,
    adminOnly: true,
  },
  // {
  //   name: "Documents",
  //   href: "/documents",
  //   icon: DocumentIcon,
  // },
  {
    name: "Reports",
    href: "/reports",
    icon: ChartBarIcon,
    adminOnly: true,
  },
  // {
  //   name: "Settings",
  //   href: "/settings",
  //   icon: Cog6ToothIcon,
  // },
];
