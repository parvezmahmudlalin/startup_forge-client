"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { HiX } from "react-icons/hi";
import {
  HiOutlineChartBar,
  HiOutlineRocketLaunch,
  HiOutlinePlusCircle,
  HiOutlineBriefcase,
  HiOutlineDocumentCheck,
  HiOutlineUser,
  HiOutlineUsers,
  HiOutlineCreditCard,
} from "react-icons/hi2";

const DashboardSidebar = ({ isOpen, setIsOpen }) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const pathname = usePathname();

  const role = user?.role?.toLowerCase() || "collaborator";

  const navMenu = {
    founder: [
      { title: "Overview", href: "/dashboard/founder", icon: HiOutlineChartBar },
      { title: "My Startup", href: "/dashboard/founder/startups", icon: HiOutlineRocketLaunch },
      { title: "Add Opportunity", href: "/dashboard/founder/opportunities/create-opportunity", icon: HiOutlinePlusCircle },
      { title: "Manage Opportunities", href: "/dashboard/founder/opportunities/manage-opportunity", icon: HiOutlineBriefcase },
      { title: "Applications", href: "/dashboard/founder/applications", icon: HiOutlineDocumentCheck },
      { title: "Profile", href: "/dashboard/profile", icon: HiOutlineUser },
    ],
    collaborator: [
      { title: "Overview", href: "/dashboard/collaborator", icon: HiOutlineChartBar },
      { title: "My Applications", href: "/dashboard/collaborator/my-applications", icon: HiOutlineDocumentCheck },
      { title: "Profile", href: "/dashboard/profile", icon: HiOutlineUser },
    ],
    admin: [
      { title: "Overview", href: "/dashboard/admin", icon: HiOutlineChartBar },
      { title: "Manage Users", href: "/dashboard/admin/users", icon: HiOutlineUsers },
      { title: "Manage Startups", href: "/dashboard/admin/startups", icon: HiOutlineRocketLaunch },
      { title: "Transactions", href: "/dashboard/admin/transactions", icon: HiOutlineCreditCard },
      { title: "Profile", href: "/dashboard/profile", icon: HiOutlineUser },
    ],
  };

  const menu = navMenu[role] || navMenu.collaborator;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-50 flex h-full min-h-screen w-64 flex-col border-r border-slate-200 bg-white p-4 text-slate-800 transition-transform duration-300 ease-in-out dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Close Header */}
        <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-800 lg:hidden">
          <span className="text-base font-bold text-slate-900 dark:text-white">
            StartupForge
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Close Sidebar"
          >
            <HiX className="h-6 w-6" />
          </button>
        </div>

        {/* User Info Header */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-3.5 dark:border-slate-800 dark:bg-slate-800/60">
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {role} Dashboard
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold text-slate-900 dark:text-white">
            {user?.name || "User"}
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5">
          {menu.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20 dark:bg-indigo-600 dark:text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    isActive
                      ? "text-white"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default DashboardSidebar;