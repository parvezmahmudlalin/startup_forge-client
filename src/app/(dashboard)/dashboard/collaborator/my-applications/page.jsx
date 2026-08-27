"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const userEmail = "lalin@example.com";

  useEffect(() => {
    if (!userEmail) return;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/my-applications?email=${encodeURIComponent(userEmail)}`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          setApplications(data);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error("Fetch Applications Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [userEmail]);

  // Delete Handler Function
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to cancel this application?");
    if (!isConfirmed) return;

    try {
      setDeletingId(id);
      const res = await fetch(`http://localhost:5000/api/applications/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        setApplications((prev) => prev.filter((app) => app._id !== id));
      } else {
        alert(data.message || "Failed to delete application");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Something went wrong while deleting!");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header and Top Action Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Applications</h1>

        <Link
          href="/opportunities"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          Explore Opportunities
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse text-left">
          <thead className="bg-gray-100 border-b text-gray-700">
            <tr>
              <th className="p-4">Opportunity Name</th>
              <th className="p-4">Applied Date</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  Loading applications...
                </td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No applications found for this email.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr key={app._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-800">
                    {app.opportunity_details?.role_title || app.role_title || "Unknown Role"}
                  </td>
                  <td className="p-4 text-gray-600">
                    {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        app.status === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : app.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {app.status || "Pending"}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(app._id)}
                      disabled={deletingId === app._id}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white font-medium rounded transition disabled:opacity-50 inline-block"
                    >
                      {deletingId === app._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}