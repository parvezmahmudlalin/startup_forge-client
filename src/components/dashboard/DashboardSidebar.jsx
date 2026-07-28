"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const DashboardSidebar = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const pathname = usePathname();

  // Role Normalize (e.g. "Founder" -> "founder")
  const role = user?.role?.toLowerCase() || "collaborator";

  const navMenu = {
    // 1. Founder Dashboard Menu
    founder: [
      {
        title: "Overview",
        href: "/dashboard/founder",
      },
      {
        title: "My Startup",
        href: "/dashboard/founder/my-startup",
      },
      {
        title: "Add Opportunity",
        href: "/dashboard/founder/add-opportunity",
      },
      {
        title: "Manage Opportunities",
        href: "/dashboard/founder/manage-opportunities",
      },
      {
        title: "Applications",
        href: "/dashboard/founder/applications",
      },
      {
        title: "Profile",
        href: "/dashboard/profile",
      },
    ],

    // 2. Collaborator Dashboard Menu
    collaborator: [
      {
        title: "Overview",
        href: "/dashboard/collaborator",
      },
      {
        title: "My Applications",
        href: "/dashboard/collaborator/my-applications",
      },
      {
        title: "Profile",
        href: "/dashboard/profile",
      },
    ],

    // 3. Admin Dashboard Menu
    admin: [
      {
        title: "Overview",
        href: "/dashboard/admin",
      },
      {
        title: "Manage Users",
        href: "/dashboard/admin/users",
      },
      {
        title: "Manage Startups",
        href: "/dashboard/admin/startups",
      },
      {
        title: "Transactions",
        href: "/dashboard/admin/transactions",
      },
      {
        title: "Profile",
        href: "/dashboard/profile",
      },
    ],
  };

  // Safe fallback if role matches none
  const menu = navMenu[role] || navMenu.collaborator;

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-4 border-r border-slate-800">
      {/* User Info Header */}
      <div className="mb-6 px-4 py-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
        <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider">
          {role} Dashboard
        </p>
        <p className="text-sm font-medium text-slate-200 truncate mt-0.5">
          {user?.name || "User"}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-1.5">
        {menu.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.title}
              href={item.href}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;