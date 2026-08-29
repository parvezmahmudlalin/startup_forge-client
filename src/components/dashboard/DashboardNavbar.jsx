
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Dropdown, Label } from "@heroui/react";
import { BiLogOut } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { FaBell, FaCheckDouble } from "react-icons/fa6";
import { HiHandRaised } from "react-icons/hi2";
import { HiMenuAlt2, HiX } from "react-icons/hi";

import { authClient } from "@/lib/auth-client";
import { serverFetch, serverMutation } from "@/lib/api";

const DashboardNavbar = ({ isMobileOpen, setIsMobileOpen }) => {
  const router = useRouter();

  // =====================================================
  // AUTH SESSION
  // =====================================================

  const { data: session, isPending: authLoading } =
    authClient.useSession();

  const user = session?.user;

  const userEmail = user?.email || "";
  const userRole = user?.role || "collaborator";

  // =====================================================
  // STATES
  // =====================================================

  const [notifications, setNotifications] = useState([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [markingAsRead, setMarkingAsRead] = useState(false);

  // =====================================================
  // FETCH NOTIFICATIONS
  // =====================================================

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

      // Backend যদি সরাসরি array return করে
      if (Array.isArray(data)) {
        setNotifications(data);
        return;
      }

      // Backend যদি { notifications: [] } return করে
      if (Array.isArray(data?.notifications)) {
        setNotifications(data.notifications);
        return;
      }

      setNotifications([]);
    } catch (error) {
      console.error("❌ Failed to fetch notifications:", error);
      setNotifications([]);
    } finally {
      setLoadingNotifications(false);
    }
  }, [userEmail, userRole]);

  // =====================================================
  // INITIAL FETCH + POLLING
  // =====================================================

  useEffect(() => {
    if (authLoading || !userEmail) {
      return;
    }

    // প্রথমবার notification fetch
    fetchNotifications();

    // প্রতি 30 seconds পর নতুন notification check
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [authLoading, userEmail, userRole, fetchNotifications]);

  // =====================================================
  // UNREAD NOTIFICATION
  // =====================================================

  const unreadCount = notifications.filter(
    (notification) =>
      notification.unread === true ||
      notification.read === false
  ).length;

  const hasUnread = unreadCount > 0;

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  const markAllAsRead = async () => {
    if (!userEmail || markingAsRead || !hasUnread) {
      return;
    }

    try {
      setMarkingAsRead(true);

      // UI instantly update
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

      // Backend থেকে আবার latest data নেওয়া
      await fetchNotifications();
    } catch (error) {
      console.error(
        "❌ Failed to mark notifications as read:",
        error
      );

      // যদি error হয় তাহলে আবার database-এর data fetch
      await fetchNotifications();
    } finally {
      setMarkingAsRead(false);
    }
  };

  // =====================================================
  // SIGN OUT
  // =====================================================

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
      console.error("❌ Sign out error:", error);
    }
  };

  // =====================================================
  // FORMAT NOTIFICATION TIME
  // =====================================================

  const formatNotificationTime = (createdAt) => {
    if (!createdAt) {
      return "";
    }

    try {
      const date = new Date(createdAt);

      if (Number.isNaN(date.getTime())) {
        return "";
      }

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

  // =====================================================
  // ROLE LABEL
  // =====================================================

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

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <header className="sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">

        {/* =================================================
            LEFT SECTION
        ================================================= */}

        <div className="flex items-center gap-3">

          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="rounded-xl bg-gray-100 p-2 text-gray-700 transition hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 lg:hidden"
            aria-label="Toggle Menu"
          >
            {isMobileOpen ? (
              <HiX className="h-6 w-6" />
            ) : (
              <HiMenuAlt2 className="h-6 w-6" />
            )}
          </button>

          {/* Welcome */}
          <div>
            <h2 className="flex items-center gap-1.5 text-base font-bold leading-tight text-gray-800 dark:text-white md:text-lg">
              <span>
                Welcome back,{" "}
                {user?.name
                  ? user.name.split(" ")[0]
                  : "User"}
                !
              </span>

              <HiHandRaised className="inline-block h-4 w-4 rotate-12 text-amber-500 md:h-5 md:w-5" />
            </h2>

            <p className="mt-0.5 text-xs capitalize text-gray-500 dark:text-gray-400">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {getRoleLabel()}
              </span>
            </p>
          </div>
        </div>

        {/* =================================================
            RIGHT SECTION
        ================================================= */}

        <div className="flex items-center gap-2 md:gap-4">

          {/* =================================================
              NOTIFICATION DROPDOWN
          ================================================= */}

          <Dropdown placement="bottom-end">

            <Dropdown.Trigger className="cursor-pointer outline-none">

              <div
                className="relative rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
                aria-label="Notifications"
              >
                <FaBell className="h-5 w-5" />

                {/* Unread Dot */}
                {hasUnread && (
                  <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-600 ring-2 ring-white dark:ring-slate-900" />
                )}
              </div>

            </Dropdown.Trigger>

            {/* =================================================
                NOTIFICATION POPOVER
            ================================================= */}

            <Dropdown.Popover className="w-[350px] overflow-hidden rounded-2xl border border-gray-100 bg-white p-0 shadow-xl dark:border-slate-800 dark:bg-slate-900">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/70 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">

                <div className="flex items-center gap-2">

                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    Notifications
                  </span>

                  {/* Unread Count */}
                  {hasUnread && (
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                      {unreadCount} New
                    </span>
                  )}

                </div>

                {/* Mark All Read */}
                {hasUnread && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    disabled={markingAsRead}
                    className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50 dark:text-indigo-400"
                  >
                    <FaCheckDouble className="text-[10px]" />

                    {markingAsRead
                      ? "Updating..."
                      : "Mark all read"}
                  </button>
                )}

              </div>

              {/* =================================================
                  NOTIFICATION LIST
              ================================================= */}

              <div className="max-h-[380px] overflow-y-auto">

                {/* Loading */}
                {loadingNotifications &&
                notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-6 py-10">

                    <div className="mb-3 h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />

                    <p className="text-xs text-gray-400">
                      Loading notifications...
                    </p>

                  </div>
                ) : notifications.length === 0 ? (

                  /* Empty */
                  <div className="flex flex-col items-center justify-center px-6 py-12">

                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-800">

                      <FaBell className="h-5 w-5 text-gray-400" />

                    </div>

                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      No notifications
                    </p>

                    <p className="mt-1 text-center text-xs text-gray-400">
                      You&apos;re all caught up!
                    </p>

                  </div>
                ) : (

                  /* Notifications */
                  <div className="divide-y divide-gray-100 dark:divide-slate-800">

                    {notifications.map((notification) => {

                      const isUnread =
                        notification.unread === true ||
                        notification.read === false;

                      return (
                        <div
                          key={
                            notification._id ||
                            notification.id
                          }
                          className={`cursor-pointer p-4 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800/60 ${
                            isUnread
                              ? "bg-indigo-50/40 dark:bg-indigo-950/20"
                              : ""
                          }`}
                        >

                          <div className="flex items-start gap-3">

                            {/* Notification Icon */}
                            <div
                              className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                isUnread
                                  ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                                  : "bg-gray-100 text-gray-500 dark:bg-slate-800 dark:text-gray-400"
                              }`}
                            >
                              <FaBell className="h-4 w-4" />
                            </div>

                            {/* Content */}
                            <div className="min-w-0 flex-1">

                              <div className="flex items-start justify-between gap-2">

                                <p
                                  className={`text-xs ${
                                    isUnread
                                      ? "font-bold text-gray-900 dark:text-white"
                                      : "font-semibold text-gray-700 dark:text-gray-200"
                                  }`}
                                >
                                  {notification.title ||
                                    "Notification"}
                                </p>

                                {/* Unread Indicator */}
                                {isUnread && (
                                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                                )}

                              </div>

                              <p className="mt-1 line-clamp-3 text-xs leading-5 text-gray-500 dark:text-gray-400">
                                {notification.message ||
                                  notification.desc ||
                                  "You have a new notification."}
                              </p>

                              {/* Time */}
                              <p className="mt-2 text-[10px] text-gray-400">
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

          {/* =================================================
              USER PROFILE DROPDOWN
          ================================================= */}

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

              {/* Profile Popover */}
              <Dropdown.Popover className="w-56 rounded-2xl border border-gray-100 bg-white p-1 shadow-xl dark:border-slate-800 dark:bg-slate-900">

                {/* User Info */}
                <div className="mb-1 border-b border-gray-100 px-3 py-2.5 dark:border-slate-800">

                  <div className="flex items-center gap-2.5">

                    <Avatar size="sm">

                      <Avatar.Image
                        referrerPolicy="no-referrer"
                        alt={user?.name || "User"}
                        src={user?.image || undefined}
                      />

                      <Avatar.Fallback className="bg-indigo-600 text-xs font-bold text-white">
                        {user?.name
                          ? user.name
                              .charAt(0)
                              .toUpperCase()
                          : "U"}
                      </Avatar.Fallback>

                    </Avatar>

                    <div className="flex min-w-0 flex-col">

                      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                        {user?.name || "User"}
                      </p>

                      <p className="truncate text-xs text-gray-400">
                        {user?.email}
                      </p>

                    </div>

                  </div>

                </div>

                {/* Menu */}
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

                  {/* Profile */}
                  <Dropdown.Item
                    id="profile"
                    textValue="Profile"
                    className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-slate-800"
                  >
                    <CgProfile className="h-4 w-4 text-gray-500" />

                    <Label className="cursor-pointer">
                      My Profile
                    </Label>
                  </Dropdown.Item>

                  {/* Logout */}
                  <Dropdown.Item
                    id="logout"
                    textValue="Logout"
                    variant="danger"
                    className="mt-1 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
                  >
                    <BiLogOut className="h-4 w-4" />

                    <Label className="cursor-pointer">
                      Sign Out
                    </Label>
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

