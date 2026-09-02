"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, Button, Dropdown, Label, useTheme } from "@heroui/react";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { MdDashboard, MdOutlineExplore, MdWorkOutline } from "react-icons/md";
import { Rocket } from "@gravity-ui/icons";
import { Moon, Sun, Home, LogIn } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const Navbar = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const isLoggedIn = !!user;

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (pathname?.includes("dashboard")) {
    return null;
  }

  // Common User Dropdown Component to prevent code duplication
  const UserDropdown = ({ isMobileHeader = false }) => (
    <Dropdown placement="bottom-end">
      <Dropdown.Trigger className="cursor-pointer transition-transform hover:scale-105 focus:outline-none">
        <Avatar size={isMobileHeader ? "sm" : "md"} className="ring-2 ring-indigo-500/30">
          <Avatar.Image
            referrerPolicy="no-referrer"
            alt={user?.name || "User"}
            src={user?.image || undefined}
          />
          <Avatar.Fallback className="bg-indigo-100 font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover className="w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {user?.name || "User"}
          </p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {user?.email || ""}
          </p>
          {user?.role && (
            <span className="mt-1.5 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              {user.role}
            </span>
          )}
        </div>

        <Dropdown.Menu className="mt-1">
          <Dropdown.Item
            id="dashboard"
            textValue="Dashboard"
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Link href="/dashboard" className="flex w-full items-center gap-2">
              <MdDashboard className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Label className="cursor-pointer">Dashboard</Label>
            </Link>
          </Dropdown.Item>

          <Dropdown.Item
            id="profile"
            textValue="Profile"
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Link href="/dashboard/profile" className="flex w-full items-center gap-2">
              <CgProfile className="h-4 w-4 text-slate-500 dark:text-slate-400" />
              <Label className="cursor-pointer">My Profile</Label>
            </Link>
          </Dropdown.Item>

          <Dropdown.Item
            id="logout"
            textValue="Logout"
            variant="danger"
            onClick={handleSignOut}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
          >
            <BiLogOut className="h-4 w-4" />
            <Label className="cursor-pointer font-medium">Log Out</Label>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );

  return (
    <>
      {/* ================= DESKTOP & TOP NAVBAR ================= */}
      <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20 transition-transform group-hover:scale-105">
                <Rocket className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Startup<span className="text-indigo-600 dark:text-indigo-400">Forge</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="hidden items-center gap-1 md:ml-6 md:flex">
              <li>
                <Link
                  href="/"
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === "/"
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "text-slate-700 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/startups"
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === "/startups"
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "text-slate-700 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                  }`}
                >
                  Browse Startups
                </Link>
              </li>
              <li>
                <Link
                  href="/opportunities"
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === "/opportunities"
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "text-slate-700 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                  }`}
                >
                  Browse Opportunities
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Right Controls (Theme Switcher & Profile) */}
          <div className="flex items-center gap-3">
            {mounted ? (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                aria-label="Toggle Theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-amber-400" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-700" />
                )}
              </button>
            ) : (
              <div className="h-9 w-9" />
            )}

            {/* Auth Actions (Desktop & Mobile Top Bar) */}
            <div className="flex items-center">
              {isPending ? (
                <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
              ) : !isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:text-indigo-600 sm:px-4 sm:py-2 sm:text-sm dark:text-slate-200 dark:hover:text-indigo-400"
                  >
                    Log In
                  </Link>
                  <Link href="/register" className="hidden sm:block">
                    <Button className="bg-indigo-600 font-medium text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                      Join Platform
                    </Button>
                  </Link>
                </div>
              ) : (
                <UserDropdown />
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE BOTTOM NAVIGATION ================= */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-3 py-2 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/95 md:hidden">
        <div className="flex items-center justify-around">
          
          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              pathname === "/"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <Home className="h-5 w-5" />
            <span>Home</span>
          </Link>

          {/* Startups */}
          <Link
            href="/startups"
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              pathname === "/startups"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <MdOutlineExplore className="h-5 w-5" />
            <span>Startups</span>
          </Link>

          {/* Opportunities */}
          <Link
            href="/opportunities"
            className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              pathname === "/opportunities"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <MdWorkOutline className="h-5 w-5" />
            <span>Opportunities</span>
          </Link>

          {/* Dashboard (or Login if logged out) */}
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
                pathname.startsWith("/dashboard")
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <MdDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
                pathname === "/login"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <LogIn className="h-5 w-5" />
              <span>Log In</span>
            </Link>
          )}

        </div>
      </div>
    </>
  );
};

export default Navbar;