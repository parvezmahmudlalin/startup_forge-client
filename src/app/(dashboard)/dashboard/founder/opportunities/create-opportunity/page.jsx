
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Spinner } from "@heroui/react";
import { X } from "lucide-react";

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

  const { data: session, isPending: authLoading } =
    authClient.useSession();

  const [startups, setStartups] = useState([]);
  const [fetchingStartups, setFetchingStartups] = useState(true);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // CLOSE MODAL
  // =====================================================
  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  // =====================================================
  // FETCH FOUNDER STARTUPS
  // =====================================================
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

        const data = await serverFetch(
          `/api/founder/startup?email=${email}`
        );

        const fetchedStartups = Array.isArray(data) ? data : [];

        setStartups(fetchedStartups);

        if (fetchedStartups.length > 0) {
          setFormData((prev) => ({
            ...prev,
            startupId: fetchedStartups[0]._id,
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

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =====================================================
  // VALIDATE FORM
  // =====================================================
  const validateForm = () => {
    if (!session?.user?.email) {
      return "User session not found. Please login again.";
    }

    if (!formData.startupId) {
      return "Please select a startup.";
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

  // =====================================================
  // SUBMIT OPPORTUNITY
  // =====================================================
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

      // Create Opportunity
      const response = await serverMutation(
        "/api/founder/opportunities",
        "POST",
        payload
      );

      console.log("Opportunity created:", response);

      // =================================================
      // SUCCESS → MANAGE OPPORTUNITY PAGE
      // =================================================

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

  // =====================================================
  // MODAL CLOSED
  // =====================================================
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="relative border-b border-slate-100 p-6 pb-4">
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-5 top-5 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-bold text-slate-900">
            Create Opportunity
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Create a new opportunity for your startup.
          </p>
        </div>

        {/* Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6">

          {authLoading || fetchingStartups ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : !session?.user?.email ? (
            <div className="py-8 text-center text-slate-600">
              Please login first to add opportunities.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                  {error}
                </div>
              )}

              {/* Startup */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Select Startup{" "}
                  <span className="text-rose-500">*</span>
                </label>

                <select
                  value={formData.startupId}
                  onChange={(e) =>
                    handleChange("startupId", e.target.value)
                  }
                  disabled={startups.length === 0}
                  className="w-full rounded-xl bg-[#090d16] px-4 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {startups.length === 0 ? (
                    <option value="" disabled>
                      No startup found. Please create one first.
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

              {/* Role */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Role Title{" "}
                  <span className="text-rose-500">*</span>
                </label>

                <input
                  type="text"
                  placeholder="e.g. Senior React Developer"
                  value={formData.roleTitle}
                  onChange={(e) =>
                    handleChange("roleTitle", e.target.value)
                  }
                  className="w-full rounded-xl bg-[#090d16] px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Skills */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Required Skills{" "}
                  <span className="text-rose-500">*</span>
                </label>

                <input
                  type="text"
                  placeholder="React, Node.js, MongoDB"
                  value={formData.requiredSkills}
                  onChange={(e) =>
                    handleChange(
                      "requiredSkills",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl bg-[#090d16] px-4 py-3 text-sm text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
                />

                <p className="text-[11px] text-slate-500">
                  Separate skills using commas.
                </p>
              </div>

              {/* Work Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Work Type
                </label>

                <select
                  value={formData.workType}
                  onChange={(e) =>
                    handleChange("workType", e.target.value)
                  }
                  className="w-full rounded-xl bg-[#090d16] px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="text-xs font-bold text-slate-800">
                  Commitment
                </label>

                <select
                  value={formData.commitmentLevel}
                  onChange={(e) =>
                    handleChange(
                      "commitmentLevel",
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl bg-[#090d16] px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="text-xs font-bold text-slate-800">
                  Deadline{" "}
                  <span className="text-rose-500">*</span>
                </label>

                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) =>
                    handleChange("deadline", e.target.value)
                  }
                  className="w-full rounded-xl bg-[#090d16] px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
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
                  className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
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

