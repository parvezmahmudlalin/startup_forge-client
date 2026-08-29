"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [search, setSearch] = useState("");
  const [workType, setWorkType] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOpportunities();
  }, [search, workType]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ search, workType }).toString();
      const res = await fetch(`http://localhost:5000/api/opportunities?${query}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setOpportunities(data);
      } else {
        setOpportunities([]);
      }
    } catch (err) {
      console.error("Error fetching opportunities:", err);
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  // Safe Startup Name Extractor
  const getStartupName = (item) => {
    if (typeof item.startup_details === "string") return item.startup_details;
    
    return (
      item.startup_details?.startup_name ||
      item.startup_details?.company_name ||
      item.startup_details?.name ||
      item.startup_name ||
      item.company_name ||
      (item.founder_email ? `By ${item.founder_email.split("@")[0]}` : "N/A")
    );
  };

  // Safe Skills Array Extractor
  const getSkillsArray = (skills) => {
    if (Array.isArray(skills)) return skills;
    if (typeof skills === "string") return skills.split(",").map((s) => s.trim());
    return [];
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
          Explore Opportunities
        </h1>

        {/* Filter Options */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search title or skills..."
            className="p-3 border border-gray-300 dark:border-slate-800 rounded-lg flex-1 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="p-3 border border-gray-300 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 cursor-pointer transition-colors"
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
          >
            <option value="All" className="bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100">
              All Types
            </option>
            <option value="Remote" className="bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100">
              Remote
            </option>
            <option value="On-site" className="bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100">
              On-site
            </option>
            <option value="Hybrid" className="bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100">
              Hybrid
            </option>
          </select>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="text-center py-12 text-gray-500 dark:text-slate-400 font-medium">
            Loading opportunities...
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 text-gray-500 dark:text-slate-400">
            No opportunities found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((item) => {
              const skills = getSkillsArray(item.required_skills);
              const startupName = getStartupName(item);

              return (
                <div
                  key={item._id}
                  className="border border-gray-200 dark:border-slate-800 p-5 rounded-lg shadow-sm bg-white dark:bg-slate-900 flex flex-col justify-between hover:shadow-md transition duration-300"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-white line-clamp-1">
                        {item.role_title || "Untitled Role"}
                      </h2>
                      {item.work_type && (
                        <span className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 px-2 py-1 rounded font-medium shrink-0">
                          {item.work_type}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
                      Startup:{" "}
                      <span className="font-semibold text-gray-800 dark:text-slate-200">
                        {startupName}
                      </span>
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {skills.length > 0 ? (
                        skills.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50 text-xs px-2.5 py-1 rounded-md font-medium"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-slate-500">
                          No specific skills listed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-slate-800/80 mt-2">
                    <Link
                      href={`/opportunities/${item._id}`}
                      className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
                    >
                      View Details
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