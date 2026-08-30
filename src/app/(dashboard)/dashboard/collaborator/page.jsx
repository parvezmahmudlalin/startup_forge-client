"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { serverFetch } from "@/lib/api";

export default function CollaboratorDashboard() {
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPending && email) {
      fetchApplications();
    }
  }, [email, isPending]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await serverFetch(
        `/api/my-applications?email=${encodeURIComponent(email)}`
      );

      if (res?.error) {
        setError(res.message || "Failed to fetch applications.");
        setApplications([]);
        return;
      }

      if (Array.isArray(res)) {
        setApplications(res);
      } else if (res?.data && Array.isArray(res.data)) {
        setApplications(res.data);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
      setError("Something went wrong while loading dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = applications.filter(
    (a) => a.status?.toLowerCase() === "pending"
  ).length;

  const acceptedCount = applications.filter(
    (a) => a.status?.toLowerCase() === "accepted"
  ).length;

  const rejectedCount = applications.filter(
    (a) => a.status?.toLowerCase() === "rejected"
  ).length;

  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20 text-slate-700 dark:text-slate-300">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Please login first
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            You need to be signed in to access your dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Collaborator Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Track your startup applications and updates.
          </p>
        </div>

        <Link
          href="/opportunities"
          className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          🔍 Explore Opportunities
        </Link>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
          ⚠️ {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Applied" value={applications.length} />
        <StatCard label="Pending" value={pendingCount} type="pending" />
        <StatCard label="Accepted" value={acceptedCount} type="accepted" />
        <StatCard label="Rejected" value={rejectedCount} type="rejected" />
      </div>

      {/* Recent Applications Section */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 p-5 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Applications
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Latest application activity
            </p>
          </div>

          <Link
            href="/dashboard/collaborator/applications"
            className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            View All
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500 dark:text-slate-400">
            <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="p-10 text-center">
            <div className="mb-2 text-4xl">💼</div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-white">
              No Applications Yet
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Explore opportunities and apply to join a startup team.
            </p>
            <Link
              href="/opportunities"
              className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-indigo-700"
            >
              Explore Opportunities
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {applications.slice(0, 5).map((app) => (
              <div
                key={app._id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/40"
              >
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {app.opportunity_details?.role_title || "Role Unavailable"}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {app.startup_details?.startup_name || "Startup"}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                    {app.createdAt
                      ? new Date(app.createdAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>

                <StatusBadge status={app.status || "Pending"} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, type }) {
  const classes = {
    pending: "text-amber-600 dark:text-amber-400",
    accepted: "text-emerald-600 dark:text-emerald-400",
    rejected: "text-rose-600 dark:text-rose-400",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </p>
      <h2
        className={`mt-2 text-3xl font-bold ${
          classes[type] || "text-slate-900 dark:text-white"
        }`}
      >
        {value}
      </h2>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = status.toLowerCase();

  if (normalized === "accepted") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-400 dark:ring-emerald-500/30">
        ✓ Accepted
      </span>
    );
  }

  if (normalized === "rejected") {
    return (
      <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-600/20 dark:bg-rose-950/50 dark:text-rose-400 dark:ring-rose-500/30">
        ✕ Rejected
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-400 dark:ring-amber-500/30">
      ⏳ Pending
    </span>
  );
}