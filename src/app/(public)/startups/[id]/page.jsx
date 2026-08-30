"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { serverFetch } from "@/lib/api";

export default function StartupDetailsPage({ params }) {
  const resolvedParams = use(params);
  const startupId = resolvedParams?.id;

  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (startupId) {
      fetchStartupDetails();
    }
  }, [startupId]);

  const fetchStartupDetails = async () => {
    try {
      setLoading(true);
      setError("");

      // 1st Attempt: /api/startup/:id
      let res = await serverFetch(`/api/startup/${startupId}`);

      // Fallback Attempt: /startup/:id (যদি /api ছাড়া কনফিগার করা থাকে)
      if (typeof res === "string" && res.includes("Cannot GET")) {
        res = await serverFetch(`/startup/${startupId}`);
      }

      // Fallback Attempt 2: /api/startups/:id
      if (typeof res === "string" && res.includes("Cannot GET")) {
        res = await serverFetch(`/api/startups/${startupId}`);
      }

      // যদি ব্যাকএন্ড 404 HTML পাঠায়
      if (typeof res === "string" && res.includes("Cannot GET")) {
        setError("API endpoint not reachable on the server.");
        return;
      }

      // Data extraction logic
      if (res?._id) {
        setStartup(res);
      } else if (res?.success && res?.data) {
        setStartup(res.data);
      } else if (res?.data && res.data._id) {
        setStartup(res.data);
      } else if (res?.startup) {
        setStartup(res.startup);
      } else {
        setError(res?.message || "Startup not found.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch startup details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading startup details...</p>
        </div>
      </div>
    );
  }

  if (error || !startup) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center shadow-sm">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Startup Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            {error || "The startup you are looking for does not exist."}
          </p>
          <Link
            href="/startups"
            className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition"
          >
            ← Back to Startups
          </Link>
        </div>
      </div>
    );
  }

  const startupName = startup.startup_name || startup.name || "Unnamed Startup";
  const logoUrl = startup.logo || startup.image;
  const founderEmail = startup.founder_email || "Not specified";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4 sm:px-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/startups"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
          >
            ← Back to All Startups
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-10 shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 sm:w-24 sm:h-24 relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shrink-0">
                {logoUrl ? (
                  <img src={logoUrl} alt={startupName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-extrabold text-2xl text-gray-400">
                    {startupName[0]}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {startupName}
                </h1>
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                  {startup.industry || "General Industry"}
                </p>
              </div>
            </div>

            {startup.funding_stage && (
              <span className="px-4 py-1.5 text-xs font-bold rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                {startup.funding_stage} Stage
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-gray-100 dark:border-gray-800">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">Founder Contact</span>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate block mt-0.5">{founderEmail}</span>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <span className="text-xs text-gray-500 dark:text-gray-400 block font-medium">Status</span>
              <span className="text-sm font-semibold text-green-600 dark:text-green-400 capitalize block mt-0.5">{startup.status || "Active"}</span>
            </div>
          </div>

          <div className="pt-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About the Startup</h2>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed whitespace-pre-line">
              {startup.description || "No description provided for this startup."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}