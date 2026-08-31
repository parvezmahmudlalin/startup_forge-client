"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import {
  Trash2,
  CheckCircle,
  XCircle,
  Rocket,
} from "lucide-react";
import {
  serverFetch,
  serverMutation,
} from "@/lib/api";

export default function ManageStartupsPage() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      setLoading(true);

      const res = await serverFetch("/api/admin/startups");

      if (res?.success) {
        setStartups(res.startups || []);
      } else {
        alert(res?.message || "Failed to load startups");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // STATUS
  // =====================================================

  const handleStatus = async (id, status) => {
    try {
      setActionLoading(id);

      const res = await serverMutation(
        `/api/admin/startups/${id}`,
        "PATCH",
        { status }
      );

      if (res?.success) {
        setStartups((prev) =>
          prev.map((startup) =>
            startup._id === id
              ? {
                  ...startup,
                  status,
                }
              : startup
          )
        );
      } else {
        alert(res?.message || "Failed to update startup");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    if (
      !confirm("Are you sure you want to delete this startup?")
    ) {
      return;
    }

    try {
      setActionLoading(id);

      const res = await serverMutation(
        `/api/admin/startups/${id}`,
        "DELETE"
      );

      if (res?.success) {
        setStartups((prev) =>
          prev.filter((startup) => startup._id !== id)
        );
      } else {
        alert(res?.message || "Failed to delete startup");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-3 text-primary">
          <Rocket size={24} />
        </div>

        <div>
          <h1 className="text-2xl font-bold">Manage Startups</h1>

          <p className="text-sm text-default-500">
            Approve, reject and remove startup posts.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-default-200 bg-content1 dark:border-default-100">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="border-b border-default-200 bg-default-50 dark:border-default-100 dark:bg-default-100/10">
              <tr>
                <th className="p-4 font-semibold">Startup</th>
                <th className="p-4 font-semibold">Industry</th>
                <th className="p-4 font-semibold">Founder</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-default-100">
              {startups.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-10 text-center text-default-500"
                  >
                    No startups found.
                  </td>
                </tr>
              ) : (
                startups.map((startup) => {
                  const status = startup.status || "Pending";
                  const busy = actionLoading === startup._id;

                  // Safe extraction of fields from DB
                  const startupName =
                    startup.startup_name ||
                    startup.name ||
                    startup.title ||
                    startup.companyName ||
                    "Unnamed Startup";

                  const founderEmail =
                    startup.founder_email ||
                    startup.email ||
                    startup.userEmail ||
                    startup.founder ||
                    "N/A";

                  const logoUrl = startup.logo || startup.image || startup.logoUrl;

                  return (
                    <tr
                      key={startup._id}
                      className="hover:bg-default-50/50 dark:hover:bg-default-100/10"
                    >
                      {/* Startup Name & Logo */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {logoUrl ? (
                            <img
                              src={logoUrl}
                              alt={startupName}
                              className="h-10 w-10 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                              <Rocket size={18} />
                            </div>
                          )}

                          <div>
                            <p className="font-semibold">{startupName}</p>

                            <p className="text-xs text-default-500">Startup</p>
                          </div>
                        </div>
                      </td>

                      {/* Industry */}
                      <td className="p-4 text-default-500">
                        {startup.industry || startup.category || "N/A"}
                      </td>

                      {/* Founder */}
                      <td className="p-4 text-default-500">{founderEmail}</td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            ${
                              status === "Approved"
                                ? "bg-success/10 text-success"
                                : status === "Rejected"
                                ? "bg-danger/10 text-danger"
                                : "bg-warning/10 text-warning"
                            }
                          `}
                        >
                          {status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button
                            disabled={busy}
                            onClick={() =>
                              handleStatus(startup._id, "Approved")
                            }
                            title="Approve"
                            className="rounded-lg p-2 text-success transition hover:bg-success/10 disabled:opacity-50"
                          >
                            <CheckCircle size={18} />
                          </button>

                          <button
                            disabled={busy}
                            onClick={() =>
                              handleStatus(startup._id, "Rejected")
                            }
                            title="Reject"
                            className="rounded-lg p-2 text-warning transition hover:bg-warning/10 disabled:opacity-50"
                          >
                            <XCircle size={18} />
                          </button>

                          <button
                            disabled={busy}
                            onClick={() => handleDelete(startup._id)}
                            title="Delete"
                            className="rounded-lg p-2 text-danger transition hover:bg-danger/10 disabled:opacity-50"
                          >
                            <Trash2 size={18} />
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
    </div>
  );
}