"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import { FiCheck, FiX, FiBriefcase, FiMail } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { serverFetch, serverMutation } from "@/lib/api";

export default function ApplicationsPage() {
  const { data: session, isPending: authLoading } = authClient.useSession();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const email = encodeURIComponent(session.user.email);
      const res = await serverFetch(
        `/api/founder/applications?email=${email}`
      );

      if (res?.error) {
        setError(res.message || "Failed to fetch applications.");
        setApplications([]);
        return;
      }

      if (Array.isArray(res)) {
        setApplications(res);
      } else if (res?.data && Array.isArray(res.data)) {
        setApplications(res.data);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error("Fetch applications error:", err);
      setError("Something went wrong while loading applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchApplications();
    }
  }, [session?.user?.email]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      setUpdatingId(id);

      const res = await serverMutation(
        `/api/founder/applications/${id}`,
        "PATCH",
        {
          status: newStatus,
        }
      );

      if (res?.error) {
        alert(res.message || "Failed to update application status.");
        return;
      }

      setApplications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      console.error("Update status error:", err);
      alert(err?.message || "Failed to update application status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-transparent">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session?.user?.email) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-transparent">
        <p className="text-slate-700 dark:text-slate-300">
          Please login first.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 transition-colors">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Applications
        </h1>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Review candidate applications and manage their recruitment status.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300">
          ⚠️ {error}
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              {/* Table Header */}
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/60">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                    Applicant
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                    Applied Role
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                    Status
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                    Applied Date
                  </th>
                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                          <FiBriefcase
                            size={24}
                            className="text-slate-500 dark:text-slate-400"
                          />
                        </div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          No applications received yet.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  applications.map((item) => {
                    const status = item.status || "Pending";
                    const isProcessing = updatingId === item._id;

                    // Data extract safe checks
                    const name =
                      item.collaborator_name ||
                      item.applicant_name ||
                      "Anonymous Applicant";

                    const email =
                      item.collaborator_email ||
                      item.applicant_email ||
                      "N/A";

                    const roleTitle =
                      item.opportunity_details?.title ||
                      item.opportunity_details?.role ||
                      item.role_title ||
                      "Opportunity";

                    return (
                      <tr
                        key={item._id}
                        className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                      >
                        {/* Candidate Info */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                              {name ? name[0].toUpperCase() : "U"}
                            </div>

                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {name}
                              </p>

                              <p className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                                <FiMail size={12} />
                                {email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Role Title */}
                        <td className="px-5 py-4 text-sm font-medium text-slate-800 dark:text-slate-200">
                          {roleTitle}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                              status === "Accepted"
                                ? "border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-950/40 dark:text-emerald-400"
                                : status === "Rejected"
                                ? "border-rose-500/30 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-950/40 dark:text-rose-400"
                                : "border-amber-500/30 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-950/40 dark:text-amber-400"
                            }`}
                          >
                            {status}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString(
                                "en-GB"
                              )
                            : "N/A"}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* Accept Button */}
                            <button
                              type="button"
                              disabled={
                                isProcessing || status === "Accepted"
                              }
                              onClick={() =>
                                handleStatusUpdate(item._id, "Accepted")
                              }
                              className="flex items-center gap-1 rounded-lg border border-emerald-600/30 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-600 dark:hover:text-white"
                              title="Accept Candidate"
                            >
                              <FiCheck size={14} />
                              Accept
                            </button>

                            {/* Reject Button */}
                            <button
                              type="button"
                              disabled={
                                isProcessing || status === "Rejected"
                              }
                              onClick={() =>
                                handleStatusUpdate(item._id, "Rejected")
                              }
                              className="flex items-center gap-1 rounded-lg border border-rose-600/30 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-rose-500/30 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-600 dark:hover:text-white"
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