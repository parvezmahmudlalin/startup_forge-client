"use client";

import React, { useEffect, useState } from "react";
import { Users, Building2, AlertTriangle, Loader2 } from "lucide-react";
import { serverFetch } from "@/lib/api";

export default function AdminDashboard({ session }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingStartups: 0,
    systemStatus: "Healthy",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchDashboardStats() {
      try {
        const data = await serverFetch("/api/admin/stats");
        if (isMounted && data) {
          setStats({
            totalUsers: data.totalUsers ?? 0,
            pendingStartups: data.pendingStartups ?? 0,
            systemStatus: data.systemStatus || "Healthy",
          });
        }
      } catch (error) {
        console.error("Failed to fetch admin dashboard stats:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchDashboardStats();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-8 p-6 text-slate-900 dark:text-white transition-colors duration-200">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
          Admin Control Center 🛡️
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Manage system users, startup approvals, and platform analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Users */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors duration-200">
          <Users className="text-blue-600 dark:text-blue-400" size={24} />
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Total System Users
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {loading ? (
              <Loader2 className="animate-spin text-slate-400" size={20} />
            ) : (
              stats.totalUsers.toLocaleString()
            )}
          </h3>
        </div>

        {/* Pending Approvals */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors duration-200">
          <Building2 className="text-blue-600 dark:text-blue-400" size={24} />
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Pending Approvals
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {loading ? (
              <Loader2 className="animate-spin text-slate-400" size={20} />
            ) : (
              `${stats.pendingStartups} Startups`
            )}
          </h3>
        </div>

        {/* System Status */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-colors duration-200">
          <AlertTriangle className="text-amber-500 dark:text-amber-400" size={24} />
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            System Status
          </p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {loading ? (
              <Loader2 className="animate-spin text-slate-400" size={20} />
            ) : (
              stats.systemStatus
            )}
          </h3>
        </div>
      </div>
    </div>
  );
}