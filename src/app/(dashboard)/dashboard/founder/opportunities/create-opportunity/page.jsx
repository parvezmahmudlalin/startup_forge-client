"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Spinner } from "@heroui/react";
import { X, AlertCircle } from "lucide-react";

import { serverFetch, serverMutation } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

const WORK_TYPES = ["Remote", "On-site", "Hybrid"];

const COMMITMENT_LEVELS = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

const INITIAL_FORM_DATA = {
  startupId: "",
  roleTitle: "",
  requiredSkills: "",
  workType: "Remote",
  commitmentLevel: "Full-time",
  deadline: "",
};

export default function AddOpportunityModal({ isOpen = true, onClose }) {
  const router = useRouter();

  const { data: session, isPending: authLoading } = authClient.useSession();

  const [startups, setStartups] = useState([]);
  const [fetchingStartups, setFetchingStartups] = useState(true);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  useEffect(() => {
    if (authLoading) return;

    if (!session?.user?.email) {
      setFetchingStartups(false);
      return;
    }

    const fetchStartups = async () => {
      try {
        setFetchingStartups(true);
        setError("");

        const email = encodeURIComponent(session.user.email);

        const res = await serverFetch(
          `/api/founder/startup?email=${email}`
        );

        if (res?.error) {
          setError(res.message || "Failed to load your startups.");
          setStartups([]);
          return;
        }

        let fetchedStartups = [];
        if (Array.isArray(res)) {
          fetchedStartups = res;
        } else if (res?.data && Array.isArray(res.data)) {
          fetchedStartups = res.data;
        }

        // 🟢 শুধুমাত্র Admin দ্বারা "approved" হওয়া স্টার্টআপগুলোকে ফিল্টার করা
        const approvedOnly = fetchedStartups.filter(
          (s) => s.status?.toLowerCase() === "approved"
        );

        setStartups(approvedOnly);

        if (approvedOnly.length > 0) {
          setFormData((prev) => ({
            ...prev,
            startupId: approvedOnly[0]._id,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch startups:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load your startups."
        );
      } finally {
        setFetchingStartups(false);
      }
    };

    fetchStartups();
  }, [session?.user?.email, authLoading]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!session?.user?.email) {
      return "User session not found. Please login again.";
    }

    if (!formData.startupId) {
      return "Please select an approved startup.";
    }

    if (!formData.roleTitle.trim()) {
      return "Please enter the role title.";
    }

    if (!formData.requiredSkills.trim()) {
      return "Please enter required skills.";
    }

    if (!formData.workType) {
      return "Please select a work type.";
    }

    if (!formData.commitmentLevel) {
      return "Please select a commitment level.";
    }

    if (!formData.deadline) {
      return "Please select a deadline date.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const skillsArray = formData.requiredSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      const payload = {
        startup_id: formData.startupId,
        role_title: formData.roleTitle.trim(),
        required_skills: skillsArray,
        work_type: formData.workType,
        commitment_level: formData.commitmentLevel,
        deadline: formData.deadline,
        founder_email: session.user.email,
      };

      const response = await serverMutation(
        "/api/founder/opportunities",
        "POST",
        payload
      );

      if (response?.error) {
        setError(response.message || "Failed to add opportunity.");
        return;
      }

      if (onClose) {
        onClose();
      }

      router.push("/dashboard/founder/opportunities/manage-opportunity");
      router.refresh();

    } catch (err) {
      console.error("Add opportunity error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to add opportunity."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl transition-colors">

        {/* Header */}
        <div className="relative border-b border-slate-100 dark:border-slate-800 p-6 pb-4">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-5 top-5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Create Opportunity
          </h2>

          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Create a new opportunity for your approved startup.
          </p>
        </div>

        {/* Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6">

          {authLoading || fetchingStartups ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : !session?.user?.email ? (
            <div className="py-8 text-center text-slate-600 dark:text-slate-400">
              Please login first to add opportunities.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-950/40 dark:border-rose-900 p-3 text-sm text-rose-700 dark:text-rose-300">
                  {error}
                </div>
              )}

              {/* Warning Notice if no approved startup is available */}
              {startups.length === 0 && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-900/50 p-4 text-xs text-amber-800 dark:text-amber-300">
                  <AlertCircle size={18} className="shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <p className="font-semibold">No approved startups found!</p>
                    <p className="mt-1">
                      You can only post opportunities for startups approved by the Admin. If you recently created a startup, please wait for Admin approval.
                    </p>
                  </div>
                </div>
              )}

              {/* Startup Selection Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Select Startup{" "}
                  <span className="text-rose-500">*</span>
                </label>

                <select
                  value={formData.startupId}
                  onChange={(e) =>
                    handleChange("startupId", e.target.value)
                  }
                  disabled={startups.length === 0}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {startups.length === 0 ? (
                    <option value="" disabled>
                      No approved startup available
                    </option>
                  ) : (
                    startups.map((startup) => (
                      <option
                        key={startup._id}
                        value={startup._id}
                      >
                        {startup.startup_name || startup.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Role Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Role Title{" "}
                  <span className="text-rose-500">*</span>
                </label>

                <input
                  type="text"
                  placeholder="e.g. Senior React Developer"
                  value={formData.roleTitle}
                  disabled={startups.length === 0}
                  onChange={(e) =>
                    handleChange("roleTitle", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              {/* Skills */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Required Skills{" "}
                  <span className="text-rose-500">*</span>
                </label>

                <input
                  type="text"
                  placeholder="React, Node.js, MongoDB"
                  value={formData.requiredSkills}
                  disabled={startups.length === 0}
                  onChange={(e) =>
                    handleChange(
                      "requiredSkills",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Separate skills using commas.
                </p>
              </div>

              {/* Work Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Work Type
                </label>

                <select
                  value={formData.workType}
                  disabled={startups.length === 0}
                  onChange={(e) =>
                    handleChange("workType", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {WORK_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Commitment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Commitment
                </label>

                <select
                  value={formData.commitmentLevel}
                  disabled={startups.length === 0}
                  onChange={(e) =>
                    handleChange(
                      "commitmentLevel",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {COMMITMENT_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              {/* Deadline */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Deadline{" "}
                  <span className="text-rose-500">*</span>
                </label>

                <input
                  type="date"
                  value={formData.deadline}
                  disabled={startups.length === 0}
                  onChange={(e) =>
                    handleChange("deadline", e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 dark:[color-scheme:dark] disabled:opacity-50"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="rounded-xl bg-slate-100 dark:bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50"
                >
                  Cancel
                </button>

                <Button
                  type="submit"
                  color="primary"
                  isLoading={loading}
                  isDisabled={
                    loading ||
                    !session?.user?.email ||
                    startups.length === 0
                  }
                  className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Creating..."
                    : "Create Opportunity"}
                </Button>

              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}