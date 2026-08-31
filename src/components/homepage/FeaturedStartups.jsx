"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Spinner } from "@heroui/react";
import { serverFetch } from "@/lib/api";

export default function FeaturedStartups({ startups: initialStartups }) {
  const [startups, setStartups] = useState(initialStartups || []);
  const [loading, setLoading] = useState(!initialStartups);

  // 🟢 Dynamic Startups Fetcher
  useEffect(() => {
    if (initialStartups && initialStartups.length > 0) {
      setStartups(initialStartups);
      setLoading(false);
      return;
    }

    const fetchStartups = async () => {
      try {
        setLoading(true);

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
      } catch (error) {
        console.error("Failed to fetch featured startups:", error);
        setStartups([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStartups();
  }, [initialStartups]);

  return (
    <section className="bg-slate-50 px-4 py-12 transition-colors duration-200 dark:bg-slate-950 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* HEADER SECTION */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Featured Startups
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Discover promising startups building the future
            </p>
          </div>

          {/* 🟢 Public Page Link Updated to /browse-startups */}
          <Link
            href="/startups"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <span>View All</span>
            <span>→</span>
          </Link>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <Spinner size="md" />
          </div>
        ) : !startups || startups.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
              No startups featured yet
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Check back soon to explore upcoming companies.
            </p>
          </div>
        ) : (
          /* CONTENT GRID (SHOWS MAXIMUM 3 ITEMS) */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {startups.slice(0, 3).map((startup) => {
              const startupId = startup._id || startup.id;
              const startupName =
                startup.startup_name || startup.name || startup.title || "Untitled Startup";
              const logoUrl = startup.logo || startup.image || startup.logoUrl;
              const founder =
                startup.founder_name ||
                (startup.founder_email ? startup.founder_email.split("@")[0] : "N/A");

              return (
                <Link
                  key={startupId}
                  href={`startups/${startupId}`}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    {/* Top Row: Industry & Logo */}
                    <div className="flex items-start justify-between gap-3">
                      <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                        {startup.industry || "General"}
                      </span>

                      {logoUrl && (
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50 dark:border-slate-800 dark:bg-slate-800">
                          <img
                            src={logoUrl}
                            alt={startupName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <h3 className="mt-3 line-clamp-1 text-lg font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 sm:text-xl">
                      {startupName}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Founder:{" "}
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {founder}
                      </span>
                    </p>
                  </div>

                  {/* FOOTER */}
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">
                      Team Needed:
                    </span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {startup.team_size_needed ?? 0} Members
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}