"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Avatar, Dropdown, Label } from "@heroui/react";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { FaBell } from "react-icons/fa6"; // React Icons Bell
import { HiHandRaised } from "react-icons/hi2"; // নিখুঁত Wave/Raised Hand Icon 👋
import { HiMenuAlt2, HiX } from "react-icons/hi";
import { authClient } from "@/lib/auth-client";

const DashboardNavbar = ({ isMobileOpen, setIsMobileOpen }) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        
        {/* Left Section: Mobile Menu Toggle & Welcome Message */}
        <div className="flex items-center gap-3">
          {/* 📱 Mobile Menu Hamburger Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-gray-200 transition"
            aria-label="Toggle Menu"
          >
            {isMobileOpen ? <HiX className="w-6 h-6" /> : <HiMenuAlt2 className="w-6 h-6" />}
          </button>

          <div>
            <h2 className="text-base md:text-lg font-bold text-gray-800 dark:text-white leading-tight flex items-center gap-1.5">
              <span>Welcome back, {user?.name ? user.name.split(" ")[0] : "User"}!</span>
              <HiHandRaised className="h-4 w-4 md:h-5 md:w-5 text-amber-500 inline-block rotate-12" />
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize mt-0.5">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user?.role || "Collaborator"}</span>
            </p>
          </div>
        </div>

        {/* Right Section: Notifications & User Profile */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Notifications Button */}
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-indigo-600 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="Notifications"
          >
            <FaBell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
          </button>

          {/* User Profile Dropdown */}
          {user && (
            <Dropdown>
              <Dropdown.Trigger className="outline-none cursor-pointer">
                <Avatar size="sm" className="ring-2 ring-indigo-500/20 transition-transform hover:scale-105">
                  <Avatar.Image
                    referrerPolicy="no-referrer"
                    alt={user?.name || "User Avatar"}
                    src={user?.image}
                  />
                  <Avatar.Fallback className="bg-indigo-600 text-white font-bold text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </Avatar.Fallback>
                </Avatar>
              </Dropdown.Trigger>

              <Dropdown.Popover className="w-56 p-1 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xl rounded-2xl">
                
                <div className="px-3 py-2.5 border-b border-gray-100 dark:border-slate-800 mb-1">
                  <div className="flex items-center gap-2.5">
                    <Avatar size="sm">
                      <Avatar.Image alt={user?.name} src={user?.image} />
                      <Avatar.Fallback className="bg-indigo-600 text-white font-bold text-xs">
                        {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </Avatar.Fallback>
                    </Avatar>
                    <div className="flex flex-col truncate">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <Dropdown.Menu
                  onAction={(key) => {
                    if (key === "profile") router.push("/dashboard/profile");
                    if (key === "logout") handleSignOut();
                  }}
                >
                  <Dropdown.Item
                    id="profile"
                    textValue="Profile"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <CgProfile className="h-4 w-4 text-gray-500" />
                    <Label className="cursor-pointer">My Profile</Label>
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="logout"
                    textValue="Logout"
                    variant="danger"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer mt-1"
                  >
                    <BiLogOut className="h-4 w-4" />
                    <Label className="cursor-pointer">Sign Out</Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          )}

        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;