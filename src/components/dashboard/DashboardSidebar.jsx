"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { HiX } from "react-icons/hi";

const DashboardSidebar = ({ isOpen, setIsOpen }) => {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const pathname = usePathname();

  const role = user?.role?.toLowerCase() || "collaborator";

  const navMenu = {
    founder: [
      { title: "Overview", href: "/dashboard/founder" },
      { title: "My Startup", href: "/dashboard/founder/startups" },
      { title: "Add Opportunity", href: "/dashboard/founder/opportunities/create-opportunity" },
      { title: "Manage Opportunities", href: "/dashboard/founder/opportunities/manage-opportunity" },
      { title: "Applications", href: "/dashboard/founder/applications" },
      { title: "Profile", href: "/dashboard/profile" },
    ],
    collaborator: [
      { title: "Overview", href: "/dashboard/collaborator" },
      { title: "My Applications", href: "/dashboard/collaborator/my-applications" },
      { title: "Profile", href: "/dashboard/profile" },
    ],
    admin: [
      { title: "Overview", href: "/dashboard/admin" },
      { title: "Manage Users", href: "/dashboard/admin/users" },
      { title: "Manage Startups", href: "/dashboard/admin/startups" },
      { title: "Transactions", href: "/dashboard/admin/transactions" },
      { title: "Profile", href: "/dashboard/profile" },
    ],
  };

  const menu = navMenu[role] || navMenu.collaborator;

  return (
    <>
      {/* 🌫️ Mobile Overlay Background */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* 🖥️ Responsive Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 w-64 h-full min-h-screen bg-slate-900 text-white p-4 border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Close Button */}
        <div className="flex justify-between items-center lg:hidden mb-4 pb-2 border-b border-slate-800">
          <span className="text-base font-bold text-white">StartupForge</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

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
                onClick={() => setIsOpen(false)}
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
    </>
  );
};

export default DashboardSidebar;