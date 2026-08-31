"use client";

export default function AdminLayout({ children }) {
  return (
    <div className="w-full min-h-screen p-6 lg:p-8">
      {/* Main Content Area (Full Width) */}
      <main className="w-full">{children}</main>
    </div>
  );
}