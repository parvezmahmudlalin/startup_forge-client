"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { serverFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import ApplyModal from "@/components/dashboard/ApplyModal";

export default function OpportunityDetailsPage() {
  const params = useParams();
  const id = params?.id;

  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [opportunity, setOpportunity] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOpportunityAndStatus();
    }
  }, [id, user?.email]);

  const fetchOpportunityAndStatus = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch opportunity data
      const data = await serverFetch(`/api/opportunities/${id}`);
      setOpportunity(data);

      // Check application status
      if (user?.email) {
        const apps = await serverFetch(
          `/api/applications/my-applications?email=${user.email}`
        );
        
        if (Array.isArray(apps)) {
          const applied = apps.some((app) => {
            const oppId = app.opportunity_id?._id || app.opportunity_id;
            return String(oppId) === String(id);
          });
          setHasApplied(applied);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load opportunity.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !opportunity) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
        <div className="text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-8 rounded-2xl shadow-sm max-w-md w-full">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Opportunity not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
            {error}
          </p>
          <Link
            href="/opportunities"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
          >
            Back to Opportunities
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Back */}
          <Link
            href="/opportunities"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            ← Back to Opportunities
          </Link>

          {/* Main Card */}
          <div className="mt-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-800">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-5">
                <div>
                  <span className="inline-block mb-3 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold">
                    {opportunity.status || "Open"}
                  </span>

                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {opportunity.role_title}
                  </h1>

                  <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm">
                    Startup:{" "}
                    <strong className="text-gray-900 dark:text-gray-200 font-semibold">
                      {opportunity.startup_details?.startup_name || "N/A"}
                    </strong>
                  </p>
                </div>

                {/* Apply Button Handling */}
                {hasApplied ? (
                  <button
                    disabled
                    className="bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700 px-7 py-3 rounded-xl font-semibold cursor-not-allowed whitespace-nowrap"
                  >
                    ✓ Already Applied
                  </button>
                ) : (
                  <button
                    onClick={() => setShowApplyModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold transition whitespace-nowrap shadow-sm cursor-pointer"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <InfoCard
                  label="Work Type"
                  value={opportunity.work_type || "Remote"}
                />
                <InfoCard
                  label="Location"
                  value={opportunity.location || "Remote"}
                />
                <InfoCard
                  label="Category"
                  value={opportunity.category || "General"}
                />
                <InfoCard
                  label="Commitment"
                  value={opportunity.commitment_level || "Full-time"}
                />
              </div>

              {/* Description */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  About this Opportunity
                </h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed text-sm sm:text-base">
                  {opportunity.description || "No description available."}
                </p>
              </section>

              {/* Skills */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {opportunity.required_skills?.length > 0 ? (
                    opportunity.required_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3.5 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-xs sm:text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400 text-sm italic">
                      No specific skills listed.
                    </span>
                  )}
                </div>
              </section>

              {/* Deadline */}
              {opportunity.deadline && (
                <section className="pt-6 border-t border-gray-100 dark:border-gray-800">
                  <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    Application Deadline
                  </h2>
                  <p className="text-gray-900 dark:text-gray-200 font-medium text-base">
                    {new Date(opportunity.deadline).toLocaleDateString()}
                  </p>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <ApplyModal
          opportunity={opportunity}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            setHasApplied(true);
          }}
        />
      )}
    </>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-gray-100/80 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
        {label}
      </p>
      <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
        {value}
      </p>
    </div>
  );
}