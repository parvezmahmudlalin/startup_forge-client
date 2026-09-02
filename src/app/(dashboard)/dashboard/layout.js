"use client";

import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function RootLayout({ children }) {
  return (
    // 👇 RootLayout Component
    <div className="h-screen flex overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* 1. Sidebar Container (Desktop View-এ বামে থাকবে, Mobile View-এ নিচে চলে যাবে) */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        
        {/* Navbar */}
        <DashboardNavbar />

        {/* 2. Main Content (pb-20 মোবাইল ভিউতে নিচের বার থেকে কনটেন্টকে মুক্ত রাখবে) */}
        <main className="flex-1 p-4 sm:p-6 pb-20 lg:pb-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}