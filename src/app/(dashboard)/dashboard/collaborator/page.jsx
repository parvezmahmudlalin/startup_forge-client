"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
// আপনার Auth Context ইম্পোর্ট করুন (যেমন Firebase Auth বা NextAuth)
// import { useAuth } from "@/context/AuthContext";

export default function CollaboratorDashboard() {
  // ⚠️ আপনার আসল Auth স্টেট ব্যবহার করবেন:
  // const { user } = useAuth();
  const currentUser = {
    displayName: "Lalin",
    email: "lalin@example.com", // ফর্ম এ যে ইমেইল দিয়ে সাবমিট করা হয়েছে
  };

  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.email) {
      fetchMyApplications(currentUser.email);
    }
  }, [currentUser?.email]);

  const fetchMyApplications = async (email) => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/my-applications?email=${email}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setApplications(data);
        setFilteredApps(data);
      } else {
        setApplications([]);
        setFilteredApps([]);
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (status) => {
    setActiveTab(status);
    if (status === "All") {
      setFilteredApps(applications);
    } else {
      const filtered = applications.filter(
        (app) => app.status?.toLowerCase() === status.toLowerCase()
      );
      setFilteredApps(filtered);
    }
  };

  // স্ট্যাটাস কার্ডের কাউন্ট হিসাব করা
  const pendingCount = applications.filter((a) => a.status?.toLowerCase() === "pending").length;
  const acceptedCount = applications.filter((a) => a.status?.toLowerCase() === "accepted").length;
  const rejectedCount = applications.filter((a) => a.status?.toLowerCase() === "rejected").length;

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Collaborator Dashboard</h1>
          <p className="text-gray-500">Track your startup applications and opportunity updates.</p>
        </div>
        <Link
          href="/opportunities"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition"
        >
          🔍 Explore Opportunities
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">TOTAL APPLIED</p>
          <h2 className="text-3xl font-bold text-gray-800">{applications.length}</h2>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">PENDING</p>
          <h2 className="text-3xl font-bold text-amber-500">{pendingCount}</h2>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">ACCEPTED</p>
          <h2 className="text-3xl font-bold text-emerald-500">{acceptedCount}</h2>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">REJECTED</p>
          <h2 className="text-3xl font-bold text-red-500">{rejectedCount}</h2>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {["All", "Pending", "Accepted", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 min-h-[300px]">
        {loading ? (
          <div className="flex justify-center items-center h-48 text-gray-400">Loading applications...</div>
        ) : filteredApps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-3 text-gray-400">💼</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No Applications Found</h3>
            <p className="text-sm text-gray-500">You haven't applied to any opportunities yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredApps.map((app) => (
              <div key={app._id} className="py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800 text-lg">
                    {app.opportunity_details?.role_title || "Role Unavailable"}
                  </h4>
                  <p className="text-sm text-gray-500">
                    Startup: {app.startup_details?.startup_name || "N/A"} • Applied on:{" "}
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      app.status === "Accepted"
                        ? "bg-emerald-100 text-emerald-700"
                        : app.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {app.status || "Pending"}
                  </span>
                  {app.resume_link && (
                    <a
                      href={app.resume_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View Resume
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}