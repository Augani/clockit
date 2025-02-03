"use client";
import React, { useState } from "react";
import {
  Cog6ToothIcon,
  UserCircleIcon,
  ArrowLeftEndOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import {
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material";
import { Link } from "@/i18n/routing";
import MobileMenu from "@/components/MobileMenu";
import { useRouter } from "next/navigation";
import useLocale from "@/hooks/useLocale";

interface TopBarProps {
  pageName: string;
}

const TopBar: React.FC<TopBarProps> = ({ pageName }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    router.push(`/${locale}/logout`);
  };

  return (
    <>
      <header className="lg:w-5/6 w-full h-20 bg-white shadow-sm px-4 flex fixed top-0 z-50">
        <div className="relative grid grid-cols-2 flex-row justify-between w-full h-full items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold">{pageName}</h1>
          </div>

          <div className="flex flex-row-reverse items-center  gap-4">
            <div className="relative">
              <IconButton
                onClick={handleClick}
                size="small"
                className="p-1"
                aria-controls={Boolean(anchorEl) ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorEl) ? "true" : undefined}
              >
                <UserCircleIcon className="w-8 h-8 text-gray-600 hover:text-gray-800 transition-colors" />
              </IconButton>

              <Menu
                id="account-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  className: "mt-2",
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.1))",
                    "& .MuiList-root": {
                      padding: "4px 0",
                    },
                    "& .MuiMenuItem-root": {
                      padding: "8px 16px",
                      minWidth: "180px",
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem component={Link} href={`/profile`}>
                  <ListItemIcon>
                    <UserCircleIcon className="w-5 h-5" />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </MenuItem>

                {/* <MenuItem component={Link} href={`/${locale}/settings`}>
                  <ListItemIcon>
                    <Cog6ToothIcon className="w-5 h-5" />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </MenuItem> */}

                <Divider />

                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
};

export default TopBar;
