"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Rocket,
  CreditCard,
  Menu,
} from "lucide-react";

const navItems = [
  {
    name: "Overview",
    href: "/dashboard/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Manage Users",
    href: "/dashboard/admin/users",
    icon: Users,
  },
  {
    name: "Manage Startups",
    href: "/dashboard/admin/startups",
    icon: Rocket,
  },
  {
    name: "Transactions",
    href: "/dashboard/admin/transactions",
    icon: CreditCard,
  },
];

export default function AdminLayout({
  children,
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ================================================= */}
      {/* MOBILE TOP NAV */}
      {/* ================================================= */}

      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-default-200 bg-content1 px-4 py-3 md:hidden dark:border-default-100">

        <h2 className="text-lg font-bold text-primary">
          Admin Panel
        </h2>

        <Menu size={22} />
      </div>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <div className="flex min-h-screen">

        {/* ================================================= */}
        {/* SIDEBAR */}
        {/* ================================================= */}

        <aside className="hidden w-64 shrink-0 border-r border-default-200 bg-content1 p-4 md:block dark:border-default-100">

          <div className="mb-8 px-2">

            <h2 className="text-xl font-bold text-primary">
              StartupForge
            </h2>

            <p className="mt-1 text-xs text-default-500">
              Admin Dashboard
            </p>

          </div>

          <nav className="space-y-1">

            {navItems.map((item) => {

              const Icon = item.icon;

              const isActive =
                pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    font-medium
                    transition
                    ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-default-600 hover:bg-default-100 dark:hover:bg-default-50/10"
                    }
                  `}
                >
                  <Icon size={18} />

                  <span>
                    {item.name}
                  </span>
                </Link>
              );
            })}

          </nav>
        </aside>

        {/* ================================================= */}
        {/* CONTENT */}
        {/* ================================================= */}

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}