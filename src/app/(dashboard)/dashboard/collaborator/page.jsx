"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

import { authClient } from "@/lib/auth-client";
import { serverFetch } from "@/lib/api";

export default function CollaboratorDashboard() {
  const { data: session, isPending } =
    authClient.useSession();

  const email = session?.user?.email;

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    if (!isPending && email) {
      fetchApplications();
    }
  }, [email, isPending]);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const data = await serverFetch(
        `/api/my-applications?email=${encodeURIComponent(
          email
        )}`
      );

      setApplications(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Failed to fetch applications:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const pendingCount =
    applications.filter(
      (a) =>
        a.status?.toLowerCase() === "pending"
    ).length;

  const acceptedCount =
    applications.filter(
      (a) =>
        a.status?.toLowerCase() === "accepted"
    ).length;

  const rejectedCount =
    applications.filter(
      (a) =>
        a.status?.toLowerCase() === "rejected"
    ).length;

  if (isPending) {
    return (
      <div className="p-8">
        Loading dashboard...
      </div>
    );
  }

  if (!email) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">
          Please login first
        </h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-8">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Collaborator Dashboard
            </h1>

            <p className="mt-2 text-gray-500">
              Track your startup applications and updates.
            </p>
          </div>

          <Link
            href="/opportunities"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-sm font-semibold text-center"
          >
            🔍 Explore Opportunities
          </Link>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <StatCard
            label="Total Applied"
            value={applications.length}
          />

          <StatCard
            label="Pending"
            value={pendingCount}
            type="pending"
          />

          <StatCard
            label="Accepted"
            value={acceptedCount}
            type="accepted"
          />

          <StatCard
            label="Rejected"
            value={rejectedCount}
            type="rejected"
          />

        </div>

        {/* Recent Applications */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl">

          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Applications
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Latest application activity
              </p>
            </div>

            <Link
              href="/dashboard/collaborator/applications"
              className="text-sm text-blue-600 hover:underline"
            >
              View All
            </Link>

          </div>

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading...
            </div>
          ) : applications.length === 0 ? (
            <div className="p-12 text-center">

              <div className="text-5xl mb-4">
                💼
              </div>

              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                No Applications Yet
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Explore opportunities and apply to join a startup team.
              </p>

              <Link
                href="/opportunities"
                className="inline-block mt-5 bg-blue-600 text-white px-5 py-2.5 rounded-lg"
              >
                Explore Opportunities
              </Link>

            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">

              {applications
                .slice(0, 5)
                .map((app) => (

                  <div
                    key={app._id}
                    className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >

                    <div>

                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {app
                          .opportunity_details
                          ?.role_title ||
                          "Role Unavailable"}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {app
                          .startup_details
                          ?.startup_name ||
                          "Startup"}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {app.createdAt
                          ? new Date(
                              app.createdAt
                            ).toLocaleDateString()
                          : ""}
                      </p>

                    </div>

                    <StatusBadge
                      status={
                        app.status ||
                        "Pending"
                      }
                    />

                  </div>

                ))}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  type,
}) {
  const classes = {
    pending:
      "text-amber-500",
    accepted:
      "text-green-500",
    rejected:
      "text-red-500",
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
      <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">
        {label}
      </p>

      <h2
        className={`text-3xl font-bold mt-2 ${
          classes[type] ||
          "text-gray-900 dark:text-white"
        }`}
      >
        {value}
      </h2>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized =
    status.toLowerCase();

  if (normalized === "accepted") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        ✓ Accepted
      </span>
    );
  }

  if (normalized === "rejected") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        ✕ Rejected
      </span>
    );
  }

  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
      ⏳ Pending
    </span>
  );
}