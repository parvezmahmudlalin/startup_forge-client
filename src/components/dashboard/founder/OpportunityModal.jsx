"use client";

import { useEffect, useState, useRef } from "react";
import { serverFetch, serverMutation } from "@/lib/api";

const WORK_TYPES = ["Remote", "On-site", "Hybrid"];
const COMMITMENTS = ["Full-time", "Part-time", "Contract", "Internship"];

export default function OpportunityModal({
  isOpen,
  onClose,
  startupId: propStartupId,
  founderEmail,
  initialData = null,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);

  const [startups, setStartups] = useState([]);
  const [selectedStartupId, setSelectedStartupId] = useState("");

  const [formData, setFormData] = useState({
    roleTitle: "",
    requiredSkills: "",
    workType: "Remote",
    commitmentLevel: "Full-time",
    deadline: "",
  });

  useEffect(() => {
    if (!isOpen || !founderEmail) return;

    serverFetch(`/api/founder/startups?email=${founderEmail}`)
      .then((data) => {
        const fetchedStartups = Array.isArray(data) ? data : [];
        setStartups(fetchedStartups);

        if (initialData?.startup_id) {
          setSelectedStartupId(initialData.startup_id);
        } else if (propStartupId) {
          setSelectedStartupId(propStartupId);
        } else if (fetchedStartups.length > 0) {
          setSelectedStartupId(fetchedStartups[0]._id);
        }
      })
      .catch((err) => console.error("Failed to fetch startups:", err));
  }, [isOpen, founderEmail, propStartupId, initialData]);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setFormData({
        roleTitle: initialData.role_title || "",
        requiredSkills: Array.isArray(initialData.required_skills)
          ? initialData.required_skills.join(", ")
          : "",
        workType: initialData.work_type || "Remote",
        commitmentLevel: initialData.commitment_level || "Full-time",
        deadline: initialData.deadline
          ? new Date(initialData.deadline).toISOString().split("T")[0]
          : "",
      });
      if (initialData.startup_id) {
        setSelectedStartupId(initialData.startup_id);
      }
    } else {
      setFormData({
        roleTitle: "",
        requiredSkills: "",
        workType: "Remote",
        commitmentLevel: "Full-time",
        deadline: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submittingRef.current) return;

    const finalStartupId = selectedStartupId || propStartupId;

    if (!finalStartupId) {
      alert("Please select or create a startup first!");
      return;
    }

    submittingRef.current = true;
    setLoading(true);

    try {
      const payload = {
        role_title: formData.roleTitle.trim(),
        required_skills: formData.requiredSkills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        work_type: formData.workType,
        commitment_level: formData.commitmentLevel,
        deadline: formData.deadline,
        founder_email: founderEmail,
        startup_id: finalStartupId,
      };

      const isEditing = Boolean(initialData?._id);
      const endpoint = isEditing
        ? `/api/founder/opportunities/${initialData._id}`
        : "/api/founder/opportunities";
      const method = isEditing ? "PUT" : "POST";

      await serverMutation(endpoint, method, payload);

      if (onSuccess) await onSuccess();
      onClose();
    } catch (error) {
      console.error("❌ SUBMIT ERROR:", error);
      alert(error?.message || "Failed to save opportunity.");
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-white transition-colors duration-200">
        <form onSubmit={handleSubmit}>
          {/* HEADER */}
          <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {initialData ? "Edit Opportunity" : "Add Opportunity"}
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {initialData
                    ? "Update your opportunity information."
                    : "Create a new opportunity for your startup."}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="space-y-5 px-6 py-6">
            {/* Startup Select Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Select Startup <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedStartupId}
                onChange={(e) => setSelectedStartupId(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition hover:border-slate-400 focus:border-blue-600 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700 dark:focus:border-blue-500 cursor-pointer"
              >
                <option value="" disabled className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                  {startups.length > 0
                    ? "-- Select a Startup --"
                    : "No startups found. Please create one first."}
                </option>
                {startups.map((s) => (
                  <option
                    key={s._id}
                    value={s._id}
                    className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                  >
                    {s.startup_name || s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Role Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior React Developer"
                value={formData.roleTitle}
                onChange={(e) => handleChange("roleTitle", e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-600 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-blue-500"
              />
            </div>

            {/* Required Skills */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Required Skills <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="React, Node.js, MongoDB"
                value={formData.requiredSkills}
                onChange={(e) => handleChange("requiredSkills", e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-600 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-blue-500"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Separate skills using commas.
              </p>
            </div>

            {/* Work Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Work Type
              </label>
              <select
                value={formData.workType}
                onChange={(e) => handleChange("workType", e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition hover:border-slate-400 focus:border-blue-600 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700 dark:focus:border-blue-500 cursor-pointer"
              >
                {WORK_TYPES.map((type) => (
                  <option
                    key={type}
                    value={type}
                    className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                  >
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Commitment */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Commitment
              </label>
              <select
                value={formData.commitmentLevel}
                onChange={(e) =>
                  handleChange("commitmentLevel", e.target.value)
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition hover:border-slate-400 focus:border-blue-600 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700 dark:focus:border-blue-500 cursor-pointer"
              >
                {COMMITMENTS.map((item) => (
                  <option
                    key={item}
                    value={item}
                    className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Deadline <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => handleChange("deadline", e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition hover:border-slate-400 focus:border-blue-600 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700 dark:focus:border-blue-500 cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (!selectedStartupId && !propStartupId)}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading
                ? "Saving..."
                : initialData
                ? "Save Changes"
                : "Create Opportunity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}