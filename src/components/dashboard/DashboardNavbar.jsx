"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, Dropdown, Label } from "@heroui/react";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { FaBell, FaCheckDouble } from "react-icons/fa6";
import { HiHandRaised, HiArrowLeft } from "react-icons/hi2";
import { HiMenuAlt2, HiX } from "react-icons/hi";

import { authClient } from "@/lib/auth-client";
import { serverFetch, serverMutation } from "@/lib/api";

const DashboardNavbar = ({ isMobileOpen, setIsMobileOpen }) => {
  const router = useRouter();

  // AUTH SESSION
  const { data: session, isPending: authLoading } = authClient.useSession();
  const user = session?.user;
  const userEmail = user?.email || "";
  const userRole = user?.role || "collaborator";

  // STATES
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [markingAsRead, setMarkingAsRead] = useState(false);

  // FETCH NOTIFICATIONS
  const fetchNotifications = useCallback(async () => {
    if (!userEmail) {
      setNotifications([]);
      return;
    }

    try {
      setLoadingNotifications(true);
      const email = encodeURIComponent(userEmail);
      const role = encodeURIComponent(userRole);

      const data = await serverFetch(
        `/api/notifications?email=${email}&role=${role}`
      );

      if (Array.isArray(data)) {
        setNotifications(data);
        return;
      }

      if (Array.isArray(data?.notifications)) {
        setNotifications(data.notifications);
        return;
      }

      setNotifications([]);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  }, [userEmail, userRole]);

  // INITIAL FETCH + POLLING
  useEffect(() => {
    if (authLoading || !userEmail) return;

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [authLoading, userEmail, fetchNotifications]);

  // UNREAD NOTIFICATION
  const unreadCount = notifications.filter(
    (notification) =>
      notification.unread === true || notification.read === false
  ).length;

  const hasUnread = unreadCount > 0;

  // MARK ALL AS READ
  const markAllAsRead = async () => {
    if (!userEmail || markingAsRead || !hasUnread) return;

    try {
      setMarkingAsRead(true);

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          unread: false,
          read: true,
        }))
      );

      const email = encodeURIComponent(userEmail);
      const role = encodeURIComponent(userRole);

      await serverMutation(
        `/api/notifications?email=${email}&role=${role}`,
        "PATCH",
        {}
      );

      await fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
      await fetchNotifications();
    } finally {
      setMarkingAsRead(false);
    }
  };

  // SIGN OUT
  const handleSignOut = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  // FORMAT NOTIFICATION TIME
  const formatNotificationTime = (createdAt) => {
    if (!createdAt) return "";

    try {
      const date = new Date(createdAt);
      if (Number.isNaN(date.getTime())) return "";

      return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  // ROLE LABEL
  const getRoleLabel = () => {
    switch (userRole?.toLowerCase()) {
      case "founder":
        return "Founder";
      case "admin":
        return "Admin";
      case "collaborator":
        return "Collaborator";
      default:
        return userRole || "Collaborator";
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        
        {/* LEFT SECTION */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="rounded-xl bg-slate-100 p-2 text-slate-700 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 lg:hidden"
            aria-label="Toggle Menu"
          >
            {isMobileOpen ? (
              <HiX className="h-6 w-6" />
            ) : (
              <HiMenuAlt2 className="h-6 w-6" />
            )}
          </button>

          <div>
            <h2 className="flex items-center gap-1.5 text-base font-bold leading-tight text-slate-900 dark:text-white sm:text-lg">
              <span>
                Welcome back,{" "}
                {user?.name ? user.name.split(" ")[0] : "User"}!
              </span>
              <HiHandRaised className="inline-block h-4 w-4 rotate-12 text-amber-500 sm:h-5 sm:w-5" />
            </h2>

            <p className="mt-0.5 text-xs capitalize text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {getRoleLabel()}
              </span>
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* BACK TO HOME LINK */}
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            title="Back to Home"
          >
            <HiArrowLeft className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>

          {/* NOTIFICATION DROPDOWN */}
          <Dropdown placement="bottom-end">
            <Dropdown.Trigger className="cursor-pointer outline-none">
              <div
                className="relative rounded-xl p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                aria-label="Notifications"
              >
                <FaBell className="h-5 w-5" />
                {hasUnread && (
                  <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
                )}
              </div>
            </Dropdown.Trigger>

            <Dropdown.Popover className="w-[300px] max-w-[calc(100vw-32px)] overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:w-[350px]">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Notifications
                  </span>
                  {hasUnread && (
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                      {unreadCount} New
                    </span>
                  )}
                </div>

                {hasUnread && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    disabled={markingAsRead}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-indigo-400"
                  >
                    <FaCheckDouble className="text-[10px]" />
                    {markingAsRead ? "Updating..." : "Mark all read"}
                  </button>
                )}
              </div>

              <div className="max-h-[380px] overflow-y-auto">
                {loadingNotifications && notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-6 py-10">
                    <div className="mb-3 h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Loading notifications...
                    </p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-6 py-12">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                      <FaBell className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      No notifications
                    </p>
                    <p className="mt-1 text-center text-xs text-slate-500 dark:text-slate-400">
                      You're all caught up!
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.map((notification) => {
                      const isUnread =
                        notification.unread === true ||
                        notification.read === false;

                      return (
                        <div
                          key={notification._id || notification.id}
                          className={`cursor-pointer p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                            isUnread
                              ? "bg-indigo-50/50 dark:bg-indigo-950/30"
                              : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                isUnread
                                  ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                              }`}
                            >
                              <FaBell className="h-4 w-4" />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p
                                  className={`text-xs ${
                                    isUnread
                                      ? "font-bold text-slate-900 dark:text-white"
                                      : "font-semibold text-slate-800 dark:text-slate-200"
                                  }`}
                                >
                                  {notification.title || "Notification"}
                                </p>
                                {isUnread && (
                                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                                )}
                              </div>

                              <p className="mt-1 line-clamp-3 text-xs leading-5 text-slate-600 dark:text-slate-400">
                                {notification.message ||
                                  notification.desc ||
                                  "You have a new notification."}
                              </p>

                              <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500">
                                {formatNotificationTime(
                                  notification.createdAt
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Dropdown.Popover>
          </Dropdown>

          {/* USER PROFILE DROPDOWN */}
          {user && (
            <Dropdown placement="bottom-end">
              <Dropdown.Trigger className="cursor-pointer outline-none">
                <Avatar
                  size="sm"
                  className="ring-2 ring-indigo-500/20 transition-transform hover:scale-105"
                >
                  <Avatar.Image
                    referrerPolicy="no-referrer"
                    alt={user?.name || "User Avatar"}
                    src={user?.image || undefined}
                  />
                  <Avatar.Fallback className="bg-indigo-600 text-xs font-bold text-white">
                    {user?.name
                      ? user.name.charAt(0).toUpperCase()
                      : "U"}
                  </Avatar.Fallback>
                </Avatar>
              </Dropdown.Trigger>

              <Dropdown.Popover className="w-56 rounded-2xl border border-slate-200 bg-white p-1 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                <div className="mb-1 border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Avatar size="sm">
                      <Avatar.Image
                        referrerPolicy="no-referrer"
                        alt={user?.name || "User"}
                        src={user?.image || undefined}
                      />
                      <Avatar.Fallback className="bg-indigo-600 text-xs font-bold text-white">
                        {user?.name
                          ? user.name.charAt(0).toUpperCase()
                          : "U"}
                      </Avatar.Fallback>
                    </Avatar>

                    <div className="flex min-w-0 flex-col">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {user?.name || "User"}
                      </p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>

                <Dropdown.Menu
                  onAction={(key) => {
                    if (key === "profile") {
                      router.push("/dashboard/profile");
                    }
                    if (key === "logout") {
                      handleSignOut();
                    }
                  }}
                >
                  <Dropdown.Item
                    id="profile"
                    textValue="Profile"
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <CgProfile className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    <Label className="cursor-pointer">My Profile</Label>
                  </Dropdown.Item>

                  <Dropdown.Item
                    id="logout"
                    textValue="Logout"
                    variant="danger"
                    className="mt-1 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                  >
                    <BiLogOut className="h-4 w-4" />
                    <Label className="cursor-pointer">Sign Out</Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          )}

        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;