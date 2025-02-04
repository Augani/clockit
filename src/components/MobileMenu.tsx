"use client";

import { Dialog } from "@mui/material";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { navigationItems } from "@/config/navigation";
import useLocale from "@/hooks/useLocale";
import Logo from "@/app/Logo";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const pathname = usePathname();
  const orgName = process.env.NEXT_PUBLIC_ORG_NAME || "Organization";
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="relative z-50"
      fullWidth
      maxWidth="xs"
      PaperProps={{
        className: "!bg-transparent !shadow-none",
      }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />

      {/* Slide-out panel */}
      <div className="fixed inset-0 z-40 flex">
        <div className="relative flex w-full max-w-[280px] flex-col overflow-hidden bg-white shadow-2xl transition-all">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
            <div className="flex items-center gap-2">
              <Logo width={40} height={40} />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-500 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-3">
              {navigationItems.map((item) => {
                const isActive = pathname?.includes(item.href);
                const ItemIcon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={`${item.href}`}
                    className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                    }`}
                    onClick={onClose}
                  >
                    <ItemIcon
                      className={`w-5 h-5 ${
                        isActive ? "text-white" : "text-gray-400"
                      }`}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-4 py-4">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} {orgName}
            </p>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
