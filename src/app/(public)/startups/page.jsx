"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { serverFetch } from "@/lib/api";

export default function StartupsPage() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await serverFetch("/api/startups");

      // API Response Safe Extractor
      let extractedData = [];
      if (Array.isArray(res)) {
        extractedData = res;
      } else if (res?.data && Array.isArray(res.data)) {
        extractedData = res.data;
      } else if (res?.startups && Array.isArray(res.startups)) {
        extractedData = res.startups;
      }

      setStartups(extractedData);
    } catch (err) {
      console.error(err);
      setError("Failed to load startups.");
    } finally {
      setLoading(false);
    }
  };

  // Unique industry list for filter
  const industries = [
    "All",
    ...Array.from(
      new Set(startups.map((s) => s.industry).filter(Boolean))
    ),
  ];

  // Search & Filter Logic with flexible field fallbacks
  const filteredStartups = startups.filter((startup) => {
    const startupName =
      startup.startup_name || startup.name || startup.title || "";
    const description = startup.description || "";

    const matchesSearch =
      startupName.toLowerCase().includes(search.toLowerCase()) ||
      description.toLowerCase().includes(search.toLowerCase());

    const matchesIndustry =
      selectedIndustry === "All" || startup.industry === selectedIndustry;

    return matchesSearch && matchesIndustry;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 transition-colors sm:p-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Explore Visionary Startups
          </h1>
          <p className="mt-3 text-base text-gray-600 dark:text-gray-400">
            Discover innovative companies building the future. Join their journey and collaborate to make an impact.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row dark:border-gray-800 dark:bg-gray-900">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search by name or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-4 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div className="flex w-full items-center gap-3 md:w-auto">
            <span className="whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300">
              Industry:
            </span>
            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 md:w-48 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="p-20 text-center text-gray-500 dark:text-gray-400">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            Loading startups...
          </div>
        ) : error ? (
          <div className="p-6 text-center font-medium text-red-600 dark:text-red-400">
            ⚠️ {error}
          </div>
        ) : filteredStartups.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-16 text-center dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 text-5xl">🚀</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              No Startups Found
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try adjusting your search query or filter options.
            </p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredStartups.map((startup) => {
              const startupName =
                startup.startup_name || startup.name || startup.title || "Unnamed Startup";
              const logoUrl = startup.logo || startup.image || startup.logoUrl;
              const founder = startup.founder_email
                ? startup.founder_email.split("@")[0]
                : startup.founder_name || "Founder";

              return (
                <div
                  key={startup._id}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="p-6">
                    {/* Header: Logo & Funding Stage */}
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-100 dark:border-gray-700 dark:bg-gray-800">
                        {logoUrl ? (
                          <img
                            src={logoUrl}
                            alt={startupName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-bold text-gray-500">
                            {startupName[0]}
                          </div>
                        )}
                      </div>
                      {startup.funding_stage && (
                        <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:border-blue-800 dark:bg-blue-950/60 dark:text-blue-400">
                          {startup.funding_stage}
                        </span>
                      )}
                    </div>

                    {/* Startup Details */}
                    <h3 className="line-clamp-1 mb-1 text-xl font-bold text-gray-900 dark:text-white">
                      {startupName}
                    </h3>
                    <p className="mb-3 text-xs font-medium text-blue-600 dark:text-blue-400">
                      {startup.industry || "General"}
                    </p>
                    <p className="line-clamp-3 mb-4 text-sm text-gray-600 dark:text-gray-400">
                      {startup.description || "No description provided."}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 p-6 pt-4 dark:border-gray-800/60">
                    <span className="max-w-[140px] truncate text-xs text-gray-500 dark:text-gray-400">
                      By: {founder}
                    </span>
                    <Link
                      href={`/startups/${startup._id}`}
                      className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}