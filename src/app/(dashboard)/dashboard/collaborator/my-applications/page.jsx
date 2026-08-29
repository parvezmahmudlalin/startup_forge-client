"use client";

import React, { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { serverFetch } from "@/lib/api";

export default function MyApplicationsPage() {
  const { data: session, isPending } = authClient.useSession();
  const email = session?.user?.email;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    if (!isPending && email) {
      loadApplications();
    }
  }, [email, isPending]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await serverFetch(
        `/api/my-applications?email=${encodeURIComponent(email)}`
      );

      // Check API error
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
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications =
    activeTab === "All"
      ? applications
      : applications.filter(
          (app) => app.status?.toLowerCase() === activeTab.toLowerCase()
        );

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Loading session...</span>
        </div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-8">
        <div className="text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-2xl max-w-md w-full">
          <p className="text-gray-800 dark:text-gray-200 text-lg font-medium">
            Please login first to view your applications.
          </p>
        </div>
      </div>
    );
  }

  const counts = {
    All: applications.length,
    Pending: applications.filter(
      (a) => a.status?.toLowerCase() === "pending"
    ).length,
    Accepted: applications.filter(
      (a) => a.status?.toLowerCase() === "accepted"
    ).length,
    Rejected: applications.filter(
      (a) => a.status?.toLowerCase() === "rejected"
    ).length,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-8 transition-colors">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            My Applications
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Track all your startup applications in one place.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mt-8 mb-6">
          {Object.keys(counts).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {tab} ({counts[tab]})
            </button>
          ))}
        </div>

        {/* Applications List Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading applications...
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="p-16 text-center">
              <div className="text-5xl mb-4">📄</div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                No applications found
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                You haven't applied to any opportunities in this category yet.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredApplications.map((app) => {
                const status = app.status || "Pending";

                return (
                  <div
                    key={app._id}
                    className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5 hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {app.opportunity_details?.role_title ||
                          "Role Unavailable"}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                        Startup:{" "}
                        <span className="text-gray-900 dark:text-gray-200">
                          {app.startup_details?.startup_name || "N/A"}
                        </span>
                      </p>

                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        Applied on:{" "}
                        {app.createdAt
                          ? new Date(app.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <StatusBadge status={status} />

                      {app.resume_link && (
                        <a
                          href={app.resume_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Resume ↗
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const normalized = status.toLowerCase();

  if (normalized === "accepted") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
        ✓ Accepted
      </span>
    );
  }

  if (normalized === "rejected") {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
        ✕ Rejected
      </span>
    );
  }

  return (
    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
      ⏳ Pending
    </span>
  );
}