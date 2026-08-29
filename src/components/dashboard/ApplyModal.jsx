"use client";

import React, { useState } from "react";
import { serverMutation } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export default function ApplyModal({ opportunity, onClose, onSuccess }) {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [form, setForm] = useState({
    collaborator_name: user?.name || "",
    collaborator_email: user?.email || "",
    phone: "",
    skills: "",
    experience: "",
    cover_letter: "",
    resume_link: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorModalMsg, setErrorModalMsg] = useState("");
  const [inlineError, setInlineError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setInlineError("");

      if (!form.collaborator_email.trim()) {
        setInlineError("Please login before applying.");
        setSubmitting(false);
        return;
      }

      if (!form.cover_letter.trim()) {
        setInlineError("Please write a cover letter.");
        setSubmitting(false);
        return;
      }

      const res = await serverMutation("/api/applications", "POST", {
        opportunity_id: opportunity._id,
        collaborator_name: form.collaborator_name,
        collaborator_email: form.collaborator_email,
        phone: form.phone,
        skills: form.skills,
        experience: form.experience,
        cover_letter: form.cover_letter,
        resume_link: form.resume_link,
      });

      // API থেকে error আসলে আলাদা Pop-up Error Modal দেখাবে
      if (res?.error || res?.success === false) {
        setErrorModalMsg(
          res?.message || "You have already applied to this opportunity."
        );
        return;
      }

      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setErrorModalMsg(err.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  // ১. ডুপ্লিকেট/অন্যান্য এররের জন্য আলাদা পপ-আপ মডাল
  if (errorModalMsg) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-center shadow-2xl animate-in fade-in zoom-in duration-200">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 text-2xl">
            ⚠️
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Notice
          </h3>

          <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            {errorModalMsg}
          </p>

          <button
            onClick={() => {
              setErrorModalMsg("");
              onClose(); // মডালটি বন্ধ করে দেবে
            }}
            className="mt-6 w-full bg-gray-900 hover:bg-black dark:bg-gray-100 dark:hover:bg-white dark:text-gray-900 text-white py-2.5 rounded-xl font-semibold transition cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    );
  }

  // ২. সাকসেস মডাল
  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center shadow-xl">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-3xl font-bold">
            ✓
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Application Submitted!
          </h2>

          <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Your application has been sent to the founder. You can track the status from My Applications.
          </p>

          <button
            onClick={onClose}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // ৩. মূল আবেদন ফরম মডাল
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-5 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Apply for Opportunity
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {opportunity.role_title}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl font-bold p-1 transition cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {inlineError && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-sm font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{inlineError}</span>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-700 dark:text-gray-300">
              Your Name
            </label>
            <input
              name="collaborator_name"
              value={form.collaborator_name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="collaborator_email"
              value={form.collaborator_email}
              onChange={handleChange}
              required
              readOnly={!!user?.email}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950/60 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="you@example.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-700 dark:text-gray-300">
              Phone
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="+880..."
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-700 dark:text-gray-300">
              Your Skills
            </label>
            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          {/* Experience */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-700 dark:text-gray-300">
              Experience
            </label>
            <textarea
              name="experience"
              value={form.experience}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              placeholder="Tell us about your experience..."
            />
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-700 dark:text-gray-300">
              Cover Letter *
            </label>
            <textarea
              name="cover_letter"
              value={form.cover_letter}
              onChange={handleChange}
              required
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
              placeholder="Why should the founder select you?"
            />
          </div>

          {/* Resume Link */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2 text-gray-700 dark:text-gray-300">
              Resume Link
            </label>
            <input
              type="url"
              name="resume_link"
              value={form.resume_link}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="https://..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold transition cursor-pointer"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}