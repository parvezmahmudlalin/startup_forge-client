"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, Button, Dropdown, Label, useTheme } from "@heroui/react";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { MdDashboard } from "react-icons/md";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { Rocket } from "@gravity-ui/icons";
import { Moon, Sun } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const isLoggedIn = !!user;
  const isFounder = user?.role?.toLowerCase() === "founder";

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  if (pathname?.includes("dashboard")) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md transition-colors duration-200 dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Logo & Navigation */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20 transition-transform group-hover:scale-105">
              <Rocket className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Startup<span className="text-indigo-600 dark:text-indigo-400">Forge</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <ul className="hidden items-center gap-1 md:ml-6 md:flex">
            <li>
              <Link
                href="/"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/startups"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
              >
                Browse Startups
              </Link>
            </li>
            {!isFounder && (
              <li>
                <Link
                  href="/opportunities"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                >
                  Browse Opportunities
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Right Side: Theme Switcher & User Profile */}
        <div className="hidden items-center gap-3 md:flex">
          {mounted ? (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
            </button>
          ) : (
            <div className="h-9 w-9" />
          )}

          {isPending ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
          ) : !isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400"
              >
                Log In
              </Link>
              <Link href="/register">
                <Button className="bg-indigo-600 font-medium text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                  Join Platform
                </Button>
              </Link>
            </div>
          ) : (
            <Dropdown placement="bottom-end">
              <Dropdown.Trigger className="cursor-pointer transition-transform hover:scale-105 focus:outline-none">
                <Avatar size="md" className="ring-2 ring-indigo-500/30">
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
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          {mounted ? (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
            </button>
          ) : (
            <div className="h-9 w-9" />
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenuAlt3 className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 pt-2 pb-6 shadow-lg dark:border-slate-800 dark:bg-slate-950 md:hidden">
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/startups"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Browse Startups
              </Link>
            </li>

            {!isFounder && (
              <li>
                <Link
                  href="/opportunities"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Browse Opportunities
                </Link>
              </li>
            )}

            {isLoggedIn && (
              <>
                <li className="my-1 border-t border-slate-100 dark:border-slate-800"></li>
                <li>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <MdDashboard className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <CgProfile className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    My Profile
                  </Link>
                </li>
              </>
            )}

            <li className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
              {!isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full border border-slate-200 bg-white font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-indigo-600 font-medium text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                      Join Platform
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button
                  onClick={handleSignOut}
                  className="w-full bg-red-50 font-medium text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400"
                >
                  <BiLogOut className="h-5 w-5" />
                  Log Out
                </Button>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;