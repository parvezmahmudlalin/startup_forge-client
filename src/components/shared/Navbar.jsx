"use client";

import { Avatar, Button, Dropdown, Label, useTheme } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { MdDashboard } from "react-icons/md";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { Rocket } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const isLoggedIn = !!user;
  const isFounder = user?.role?.toLowerCase() === "founder";

  const handleSignOut = async () => {
    await authClient.signOut();
    console.log("Signing out...");
  };

  const pathname = usePathname();

  if (pathname.includes("dashboard")) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Logo & Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20 transition-transform group-hover:scale-105">
              <Rocket className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Startup<span className="text-indigo-600 dark:text-indigo-400">Forge</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden items-center gap-1 md:flex ml-6">
            <li>
              <Link
                href="/"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/startups"
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
              >
                Browse Startups
              </Link>
            </li>
            
            {/* Founder না হলে Browse Opportunities লিংক দেখাবে */}
            {!isFounder && (
              <li>
                <Link
                  href="/opportunities"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
                >
                  Browse Opportunities
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Right Side: Auth Buttons / Theme Toggle / User Profile */}
        <div className="hidden items-center gap-3 md:flex">
          {mounted ? (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
          ) : (
            <div className="h-10 w-10" />
          )}

          {isPending ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
          ) : !isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:text-indigo-600 dark:text-gray-200 dark:hover:text-indigo-400"
              >
                Log In
              </Link>
              <Link href="/register">
                <Button className="bg-indigo-600 font-medium text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
                  Join Platform
                </Button>
              </Link>
            </>
          ) : (
            <Dropdown placement="bottom-end">
              <Dropdown.Trigger className="cursor-pointer transition-transform hover:scale-105 focus:outline-none">
                <Avatar size="md" className="ring-2 ring-indigo-500/30">
                  <Avatar.Image
                    referrerPolicy="no-referrer"
                    alt={user?.name || "User"}
                    src={user?.image || undefined}
                  />
                  <Avatar.Fallback className="bg-indigo-100 font-semibold text-indigo-700">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </Avatar.Fallback>
                </Avatar>
              </Dropdown.Trigger>
              <Dropdown.Popover className="w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-xl dark:border-gray-800 dark:bg-gray-900">
                {/* User Info Header */}
                <div className="border-b border-gray-100 px-3 py-2.5 dark:border-gray-800">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user?.name || "User"}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {user?.email || ""}
                  </p>

                  {user?.role && (
                    <span className="mt-1.5 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                      {user.role}
                    </span>
                  )}
                </div>

                {/* Dropdown Menu Links */}
                <Dropdown.Menu className="mt-1">
                  <Dropdown.Item
                    id="dashboard"
                    textValue="Dashboard"
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <Link href="/dashboard" className="flex w-full items-center gap-2">
                      <MdDashboard className="h-4 w-4 text-gray-500" />
                      <Label className="cursor-pointer">Dashboard</Label>
                    </Link>
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="profile"
                    textValue="Profile"
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <Link href="/dashboard/profile" className="flex w-full items-center gap-2">
                      <CgProfile className="h-4 w-4 text-gray-500" />
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

        {/* Mobile Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          {mounted ? (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
          ) : (
            <div className="h-10 w-10" />
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? (
              <HiX className="h-6 w-6" />
            ) : (
              <HiMenuAlt3 className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="border-b border-gray-100 bg-white px-4 pt-2 pb-6 shadow-lg dark:border-gray-800 dark:bg-gray-950 md:hidden">
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/startups"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Browse Startups
              </Link>
            </li>
            
            {/* Founder না হলে মোবাইল ড্রয়ারেও Browse Opportunities দেখাবে */}
            {!isFounder && (
              <li>
                <Link
                  href="/opportunities"
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Browse Opportunities
                </Link>
              </li>
            )}

            {isLoggedIn && (
              <>
                <li className="my-1 border-t border-gray-100 dark:border-gray-800"></li>
                <li>
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <MdDashboard className="h-5 w-5 text-indigo-600" />
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-base font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <CgProfile className="h-5 w-5 text-indigo-600" />
                    My Profile
                  </Link>
                </li>
              </>
            )}

            <li className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-800">
              {!isLoggedIn ? (
                <div className="flex flex-col gap-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full border border-gray-200 bg-white font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-indigo-600 font-medium text-white shadow-sm hover:bg-indigo-700">
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