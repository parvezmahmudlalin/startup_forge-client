"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { serverFetch } from "@/lib/api";

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [search, setSearch] = useState("");
  const [workType, setWorkType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOpportunities = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (workType && workType !== "All") params.append("workType", workType);

      const queryString = params.toString();
      const endpoint = `/api/opportunities${queryString ? `?${queryString}` : ""}`;

      const res = await serverFetch(endpoint);

      if (res?.error) {
        setError(res.message || "Failed to fetch opportunities.");
        setOpportunities([]);
        return;
      }

      if (Array.isArray(res)) {
        setOpportunities(res);
      } else if (res?.data && Array.isArray(res.data)) {
        setOpportunities(res.data);
      } else {
        setOpportunities([]);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while fetching data.");
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  }, [search, workType]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchOpportunities();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchOpportunities]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            Explore Opportunities
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Find and apply for exciting roles across various startups.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 text-rose-700 dark:text-rose-400 text-sm font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search title or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 transition"
          />

          <select
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 transition cursor-pointer"
          >
            <option value="All" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">All Types</option>
            <option value="Remote" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Remote</option>
            <option value="On-site" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">On-site</option>
            <option value="Hybrid" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Hybrid</option>
          </select>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin dark:border-blue-500/20 dark:border-t-blue-500" />
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              No opportunities found matching your criteria.
            </p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition duration-200"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 text-xs font-semibold">
                      {item.work_type || "Remote"}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {item.commitment_level || "Full-time"}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1 mb-1">
                    {item.role_title}
                  </h2>

                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 font-medium">
                    Startup:{" "}
                    <strong className="text-slate-800 dark:text-slate-200 font-semibold">
                      {item.startup_details?.startup_name || "N/A"}
                    </strong>
                  </p>

                  {/* Skills List */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {item.required_skills?.length > 0 ? (
                      item.required_skills.map((skill, index) => (
                        <span
                          key={`${item._id}-skill-${index}`}
                          className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-xs px-2.5 py-1 rounded-lg font-medium"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500 italic">
                        No specific skills listed
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <Link
                    href={`/opportunities/${item._id}`}
                    className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-sm px-5 py-2.5 rounded-xl font-medium transition dark:bg-blue-600 dark:hover:bg-blue-500"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}