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
      setOpportunities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Explore Opportunities</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search title or skills..."
          className="p-3 border border-gray-300 rounded-lg flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="p-3 border border-gray-300 rounded-lg"
          value={workType}
          onChange={(e) => setWorkType(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Remote">Remote</option>
          <option value="On-site">On-site</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      {loading ? (
        <p>Loading opportunities...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((item) => (
            <div key={item._id} className="border p-5 rounded-lg shadow-sm bg-white">
              <h2 className="text-xl font-semibold mb-2">{item.role_title}</h2>
              <p className="text-gray-600 mb-2">
                Startup: <strong>{item.startup_details?.startup_name || "N/A"}</strong>
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.required_skills?.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
              <Link
                href={`/opportunities/${item._id}`}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}