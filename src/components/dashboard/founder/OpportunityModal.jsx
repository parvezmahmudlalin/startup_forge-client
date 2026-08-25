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

  // Startup Dropdown-এর জন্য স্টেট
  const [startups, setStartups] = useState([]);
  const [selectedStartupId, setSelectedStartupId] = useState("");

  const [formData, setFormData] = useState({
    roleTitle: "",
    requiredSkills: "",
    workType: "Remote",
    commitmentLevel: "Full-time",
    deadline: "",
  });

  // ফাউন্ডারের তৈরি করা সব স্টার্টআপ ডাটা ফেচ করা
  useEffect(() => {
    if (!isOpen || !founderEmail) return;

    serverFetch(`/api/founder/startups?email=${founderEmail}`)
      .then((data) => {
        const fetchedStartups = Array.isArray(data) ? data : [];
        setStartups(fetchedStartups);

        // ১. এডিট মোড থাকলে initialData-র startup_id সেট হবে
        // ২. Prop হিসেবে startupId দেওয়া থাকলে সেটি সেট হবে
        // ৩. তা না হলে প্রথম স্টার্টআপটি বাই ডিফল্ট সিলেক্ট থাকবে
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

  // initialData থাকলে ফর্মে ডাটা সেট করা অথবা রিসেট করা
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
        startup_id: finalStartupId, // 👈 নিশ্চিতভাবে startup_id পাঠানো হচ্ছে
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#121824] text-white shadow-2xl">
        <form onSubmit={handleSubmit}>
          {/* HEADER */}
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">
                  {initialData ? "Edit Opportunity" : "Add Opportunity"}
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  {initialData
                    ? "Update your opportunity information."
                    : "Create a new opportunity for your startup."}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-gray-400 hover:bg-white/10 hover:text-white"
              >
                ×
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="space-y-5 px-6 py-6">
            {/* Startup Select Dropdown */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Select Startup <span className="text-red-400">*</span>
              </label>
              <select
                value={selectedStartupId}
                onChange={(e) => setSelectedStartupId(e.target.value)}
                required
                className="w-full rounded-lg border border-white/10 bg-[#1a2230] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="" disabled>
                  {startups.length > 0
                    ? "-- Select a Startup --"
                    : "No startups found. Please create one first."}
                </option>
                {startups.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.startup_name || s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Role Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior React Developer"
                value={formData.roleTitle}
                onChange={(e) => handleChange("roleTitle", e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
              />
            </div>

            {/* Required Skills */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Required Skills <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="React, Node.js, MongoDB"
                value={formData.requiredSkills}
                onChange={(e) => handleChange("requiredSkills", e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500">
                Separate skills using commas.
              </p>
            </div>

            {/* Work Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Work Type</label>
              <select
                value={formData.workType}
                onChange={(e) => handleChange("workType", e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-[#1a2230] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                {WORK_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Commitment */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Commitment</label>
              <select
                value={formData.commitmentLevel}
                onChange={(e) =>
                  handleChange("commitmentLevel", e.target.value)
                }
                className="w-full rounded-lg border border-white/10 bg-[#1a2230] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              >
                {COMMITMENTS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Deadline */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Deadline <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => handleChange("deadline", e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg bg-white/5 px-5 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/10 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (!selectedStartupId && !propStartupId)}
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
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