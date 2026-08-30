"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiBriefcase,
} from "react-icons/fi";

import OpportunityModal from "@/components/dashboard/founder/OpportunityModal";
import { authClient } from "@/lib/auth-client";
import {
  serverFetch,
  serverMutation,
} from "@/lib/api";

export default function ManageOpportunitiesPage() {
  const {
    data: session,
    isPending: authLoading,
  } = authClient.useSession();

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOp, setSelectedOp] = useState(null);

  const fetchOpportunities = async () => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const email = encodeURIComponent(session.user.email);
      const res = await serverFetch(
        `/api/founder/opportunities?email=${email}`
      );

      if (res?.error) {
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
    } catch (error) {
      console.error("Fetch opportunities error:", error);
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      fetchOpportunities();
    }
  }, [session?.user?.email]);

  const handleDelete = async (id) => {
    if (!id) {
      alert("Opportunity ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this opportunity?"
    );

    if (!confirmed) return;

    try {
      const res = await serverMutation(
        `/api/founder/opportunities/${id}`,
        "DELETE"
      );

      if (res?.error) {
        alert(res.message || "Failed to delete opportunity.");
        return;
      }

      setOpportunities((prev) =>
        prev.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.error("Delete opportunity error:", error);
      alert(error?.message || "Failed to delete opportunity.");
    }
  };

  const handleEdit = (item) => {
    setSelectedOp(item);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedOp(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOp(null);
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
        <p className="text-slate-600 dark:text-slate-400">
          Please login first.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Manage Opportunities
            </h1>

            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Create and manage opportunities for your startup.
            </p>
          </div>

          {/* Add Opportunity */}
          <button
            type="button"
            onClick={handleAddNew}
            className="flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            <FiPlus size={18} />
            Add Opportunity
          </button>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Spinner size="lg" />
          </div>
        ) : (
          /* Opportunities Table */
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] border-collapse">
                {/* Header */}
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/70 dark:border-slate-800 dark:bg-slate-800/60">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                      Role Title
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                      Work Type
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                      Commitment
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                      Deadline
                    </th>

                    <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                      Actions
                    </th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {opportunities.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            <FiBriefcase size={24} />
                          </div>

                          <p className="font-medium text-slate-800 dark:text-slate-200">
                            No opportunities created yet.
                          </p>

                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Create your first opportunity to start building your team.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    opportunities.map((item) => (
                      <tr
                        key={item._id}
                        className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/50"
                      >
                        {/* Role Title */}
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {item.role_title || "Untitled Role"}
                          </p>
                        </td>

                        {/* Work Type */}
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full border border-blue-200/60 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                            {item.work_type || "N/A"}
                          </span>
                        </td>

                        {/* Commitment */}
                        <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                          {item.commitment_level || "N/A"}
                        </td>

                        {/* Deadline */}
                        <td className="px-5 py-4 text-sm text-slate-700 dark:text-slate-300">
                          {item.deadline
                            ? new Date(item.deadline).toLocaleDateString("en-GB")
                            : "N/A"}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {/* Edit */}
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                              aria-label="Edit opportunity"
                              title="Edit"
                            >
                              <FiEdit size={16} />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => handleDelete(item._id)}
                              className="flex h-9 w-9 items-center justify-center rounded-lg text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
                              aria-label="Delete opportunity"
                              title="Delete"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Opportunity Modal */}
        <OpportunityModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          founderEmail={session?.user?.email}
          startupId={opportunities[0]?.startup_id || null}
          initialData={selectedOp}
          onSuccess={fetchOpportunities}
        />
      </div>
    </div>
  );
}