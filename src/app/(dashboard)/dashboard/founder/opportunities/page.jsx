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

  // ==========================================
  // Fetch Opportunities
  // ==========================================

  const fetchOpportunities = async () => {
    if (!session?.user?.email) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const email = encodeURIComponent(
        session.user.email
      );

      const data = await serverFetch(
        `/api/founder/opportunities?email=${email}`
      );

      console.log(
        "Opportunities API Response:",
        data
      );

      setOpportunities(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Fetch opportunities error:",
        error
      );

      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Fetch when session is available
  // ==========================================

  useEffect(() => {
    if (session?.user?.email) {
      fetchOpportunities();
    }
  }, [session?.user?.email]);

  // ==========================================
  // Delete Opportunity
  // ==========================================

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
      await serverMutation(
        `/api/founder/opportunities/${id}`,
        "DELETE"
      );

      setOpportunities((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete opportunity error:",
        error
      );

      alert(
        error?.message ||
          "Failed to delete opportunity."
      );
    }
  };

  // ==========================================
  // Edit Opportunity
  // ==========================================

  const handleEdit = (item) => {
    setSelectedOp(item);
    setIsModalOpen(true);
  };

  // ==========================================
  // Add New Opportunity
  // ==========================================

  const handleAddNew = () => {
    setSelectedOp(null);
    setIsModalOpen(true);
  };

  // ==========================================
  // Close Modal
  // ==========================================

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOp(null);
  };

  // ==========================================
  // Authentication Loading
  // ==========================================

  if (authLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // ==========================================
  // Not Logged In
  // ==========================================

  if (!session?.user?.email) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-400">
          Please login first.
        </p>
      </div>
    );
  }

  // ==========================================
  // Main UI
  // ==========================================

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">

      {/* ======================================
          Header
      ======================================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-white">
            Manage Opportunities
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Create and manage opportunities
            for your startup.
          </p>
        </div>

        {/* Add Opportunity */}

        <button
          type="button"
          onClick={handleAddNew}
          className="flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
        >
          <FiPlus size={18} />

          Add Opportunity
        </button>
      </div>

      {/* ======================================
          Loading
      ======================================= */}

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-white/10 bg-[#121824]">
          <Spinner size="lg" />
        </div>
      ) : (

        /* ====================================
           Opportunities Table
        ===================================== */

        <div className="overflow-hidden rounded-xl border border-white/10 bg-[#121824]">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[750px]">

              {/* =================================
                  Table Header
              ================================== */}

              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02]">

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Role Title
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Work Type
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Commitment
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Deadline
                  </th>

                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Actions
                  </th>

                </tr>
              </thead>

              {/* =================================
                  Table Body
              ================================== */}

              <tbody>

                {opportunities.length === 0 ? (

                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-16 text-center"
                    >

                      <div className="flex flex-col items-center justify-center">

                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
                          <FiBriefcase
                            size={24}
                            className="text-gray-500"
                          />
                        </div>

                        <p className="font-medium text-gray-300">
                          No opportunities created yet.
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          Create your first opportunity
                          to start building your team.
                        </p>

                      </div>

                    </td>
                  </tr>

                ) : (

                  opportunities.map((item) => (

                    <tr
                      key={item._id}
                      className="border-b border-white/5 transition hover:bg-white/[0.02]"
                    >

                      {/* =================================
                          Role Title
                      ================================== */}

                      <td className="px-5 py-4">

                        <p className="font-semibold text-white">
                          {item.role_title ||
                            "Untitled Role"}
                        </p>

                      </td>

                      {/* =================================
                          Work Type
                      ================================== */}

                      <td className="px-5 py-4">

                        <span className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                          {item.work_type ||
                            "N/A"}
                        </span>

                      </td>

                      {/* =================================
                          Commitment
                      ================================== */}

                      <td className="px-5 py-4 text-sm text-gray-300">
                        {item.commitment_level ||
                          "N/A"}
                      </td>

                      {/* =================================
                          Deadline
                      ================================== */}

                      <td className="px-5 py-4 text-sm text-gray-300">

                        {item.deadline
                          ? new Date(
                              item.deadline
                            ).toLocaleDateString(
                              "en-GB"
                            )
                          : "N/A"}

                      </td>

                      {/* =================================
                          Actions
                      ================================== */}

                      <td className="px-5 py-4">

                        <div className="flex items-center justify-center gap-2">

                          {/* Edit */}

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(item)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/10 hover:text-white"
                            aria-label="Edit opportunity"
                            title="Edit"
                          >
                            <FiEdit size={16} />
                          </button>

                          {/* Delete */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                item._id
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-red-400 transition hover:bg-red-500/10 hover:text-red-300"
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

      {/* ======================================
          Opportunity Modal
      ======================================= */}

      <OpportunityModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        founderEmail={session.user.email}
        startupId={
          opportunities[0]?.startup_id || null
        }
        initialData={selectedOp}
        onSuccess={fetchOpportunities}
      />

    </div>
  );
}