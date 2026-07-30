"use client";

import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { useState } from "react";

export default function RootLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    // 👇 RootLayout Component
    <div className="h-screen flex overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* 2. Sidebar Container (Sticky & Full Height) */}
      <aside className="hidden md:flex flex-col h-full shrink-0">
        <DashboardSidebar isOpen={isMobileOpen} setIsOpen={setIsMobileOpen} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        
        {/* Navbar */}
        <DashboardNavbar 
          isMobileOpen={isMobileOpen} 
          setIsMobileOpen={setIsMobileOpen} 
        />

        {/* 3. Main Content  */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}