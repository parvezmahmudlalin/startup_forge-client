"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import { FiCheck, FiX, FiUser, FiMail, FiBriefcase } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { serverFetch, serverMutation } from "@/lib/api";

export default function ApplicationsPage() {
  const { data: session, isPending: authLoading } = authClient.useSession();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Application Data Fetching
  const fetchApplications = async () => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const email = encodeURIComponent(session.user.email);
      const data = await serverFetch(`/api/founder/applications?email=${email}`);
      setApplications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch applications error:", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchApplications();
    }
  }, [session?.user?.email]);

  // Handle Accept / Reject Action
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setUpdatingId(id);
      await serverMutation("/api/founder/applications", "PATCH", {
        applicationId: id,
        status: newStatus,
      });

      // UI-তে ইনস্ট্যান্ট স্ট্যাটাস আপডেট
      setApplications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (error) {
      console.error("Update status error:", error);
      alert(error?.message || "Failed to update application status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session?.user?.email) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-400">Please login first.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Applications</h1>
        <p className="mt-1 text-sm text-gray-400">
          Review candidate applications and manage their recruitment status.
        </p>
      </div>

      {/* Main Content / Table */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-white/10 bg-[#121824]">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#121824]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Applicant
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Applied Role
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Status
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Applied Date
                  </th>
                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
                          <FiBriefcase size={24} className="text-gray-500" />
                        </div>
                        <p className="font-medium text-gray-300">
                          No applications received yet.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  applications.map((item) => {
                    const status = item.status || "Pending";
                    const isProcessing = updatingId === item._id;

                    return (
                      <tr
                        key={item._id}
                        className="border-b border-white/5 transition hover:bg-white/[0.02]"
                      >
                        {/* Candidate Info */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 font-semibold">
                              {item.applicant_name ? item.applicant_name[0].toUpperCase() : "U"}
                            </div>
                            <div>
                              <p className="font-semibold text-white">
                                {item.applicant_name || "Anonymous Applicant"}
                              </p>
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <FiMail size={12} />
                                {item.applicant_email || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role Title */}
                        <td className="px-5 py-4 text-sm font-medium text-gray-300">
                          {item.role_title || "Opportunity"}
                        </td>

                        {/* Status Badge */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              status === "Accepted"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : status === "Rejected"
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {status}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4 text-sm text-gray-400">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString("en-GB")
                            : "N/A"}
                        </td>

                        {/* Action Buttons */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* Accept Button */}
                            <button
                              type="button"
                              disabled={isProcessing || status === "Accepted"}
                              onClick={() => handleStatusUpdate(item._id, "Accepted")}
                              className="flex items-center gap-1 rounded-lg bg-emerald-600/20 px-3 py-1.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30 transition hover:bg-emerald-600 hover:text-white disabled:opacity-40"
                              title="Accept Candidate"
                            >
                              <FiCheck size={14} />
                              Accept
                            </button>

                            {/* Reject Button */}
                            <button
                              type="button"
                              disabled={isProcessing || status === "Rejected"}
                              onClick={() => handleStatusUpdate(item._id, "Rejected")}
                              className="flex items-center gap-1 rounded-lg bg-rose-600/20 px-3 py-1.5 text-xs font-semibold text-rose-400 border border-rose-500/30 transition hover:bg-rose-600 hover:text-white disabled:opacity-40"
                              title="Reject Candidate"
                            >
                              <FiX size={14} />
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}