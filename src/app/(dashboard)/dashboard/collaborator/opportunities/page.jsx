"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { serverFetch } from "@/lib/api";

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [search, setSearch] = useState("");
  const [workType, setWorkType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOpportunities();
  }, [search, workType]);

  const fetchOpportunities = async () => {
    setLoading(true);
    setError("");
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (workType) queryParams.append("workType", workType);

      const query = queryParams.toString();
      const res = await serverFetch(`/api/opportunities${query ? `?${query}` : ""}`);

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
      setError("Something went wrong while fetching opportunities.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 transition-colors">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Explore Opportunities
        </h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search title or skills..."
            className="p-3 border border-gray-300 dark:border-gray-800 rounded-lg flex-1 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="p-3 border border-gray-300 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Opportunities Display */}
        {loading ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading opportunities...
          </div>
        ) : opportunities.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <p className="text-gray-600 dark:text-gray-400">No opportunities found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((item) => (
              <div
                key={item._id}
                className="border border-gray-200 dark:border-gray-800 p-5 rounded-xl shadow-sm bg-white dark:bg-gray-900 flex flex-col justify-between transition"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {item.role_title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-2 text-sm">
                    Startup:{" "}
                    <strong className="text-gray-800 dark:text-gray-200">
                      {item.startup_details?.startup_name || "N/A"}
                    </strong>
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.required_skills?.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-900 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/opportunities/${item._id}`}
                  className="inline-block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}