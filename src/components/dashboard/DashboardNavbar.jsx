"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, Dropdown, Label } from "@heroui/react";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { authClient } from "@/lib/auth-client";

const DashboardNavbar = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Sign Out Handler
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
      <div className="flex items-center justify-between px-6 py-3.5">
        
        {/* Welcome Section */}
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white leading-tight">
              Welcome back, {user?.name ? user.name.split(" ")[0] : "User"}! 👋
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              Role: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user?.role || "Collaborator"}</span>
            </p>
          </div>
        </div>

        {/* Right Action Icons & Profile Dropdown */}
        <div className="flex items-center gap-4">
          
          {/* Notifications Button */}
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="Notifications"
          >
            🔔
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
          </button>

          {/* User Dropdown */}
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
                
                {/* Profile Header Card */}
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

                {/* Dropdown Menu Items */}
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