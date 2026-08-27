"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
// আপনার নিজস্ব Auth Context থাকলে সেটি ব্যবহার করুন (যেমন Firebase Auth বা NextAuth)
// import { useAuth } from "@/context/AuthContext";

export default function OpportunityDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  // ⚠️ আপনার সিস্টেমে লগইন করা ইউজারের ডাটা আনুন।
  // ডেমো হিসেবে ধরে নিচ্ছি ইউজার লগইন আছে:
  const currentUser = {
    displayName: "Lalin",
    email: "lalin@example.com" // আপনার অ্যাপের আসল লগইন করা ইউজারের ইমেইল আসবে
  };

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    resume_link: "",
    cover_letter: "",
  });

  useEffect(() => {
    if (id) {
      fetchOpportunityDetails();
    }
  }, [id]);

  const fetchOpportunityDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/opportunities/${id}`);
      const data = await res.json();
      if (res.ok) {
        setOpportunity(data);
      } else {
        setErrorMsg(data.message || "Failed to load details");
      }
    } catch (err) {
      setErrorMsg("Server error fetching opportunity");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const payload = {
      opportunity_id: id,
      applicant_email: currentUser?.email,
      applicant_name: currentUser?.displayName || "Anonymous",
      resume_link: formData.resume_link,
      cover_letter: formData.cover_letter,
      founder_email: opportunity?.founder_email || "",
    };

    try {
      const res = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        alert("Application submitted successfully!");
        router.push("/dashboard/collaborator");
      } else {
        setErrorMsg(result.message || "Failed to submit application");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Opportunity...</div>;
  if (!opportunity) return <div className="p-10 text-center text-red-500">{errorMsg || "Not Found"}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{opportunity.role_title}</h1>
        <p className="text-gray-600 mb-4">Work Type: {opportunity.work_type}</p>
        <p className="text-gray-700">Deadline: {opportunity.deadline}</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Apply for this Role</h2>
        {errorMsg && <div className="bg-red-100 text-red-600 p-3 rounded mb-4">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Your Email</label>
            <input
              type="email"
              disabled
              value={currentUser?.email || ""}
              className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Resume Link (Google Drive / PDF)*</label>
            <input
              type="url"
              required
              placeholder="https://drive.google.com/file/..."
              value={formData.resume_link}
              onChange={(e) => setFormData({ ...formData, resume_link: e.target.value })}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Cover Letter</label>
            <textarea
              rows="4"
              placeholder="Why are you a good fit?"
              value={formData.cover_letter}
              onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </div>
  );
}