"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Spinner } from "@heroui/react";
import { serverFetch } from "@/lib/api";

export default function FeaturedOpportunities({ opportunities: initialOpportunities }) {
  const [opportunities, setOpportunities] = useState(initialOpportunities || []);
  const [loading, setLoading] = useState(!initialOpportunities);

  // 🟢 Helper Function to filter active (non-expired) opportunities
  const filterActiveOpportunities = (list) => {
    if (!Array.isArray(list)) return [];

    const today = new Date();
    // আজকের দিনের শুরুর সময় সেট করা (00:00:00) যাতে আজকের দিনে ডেডলাইন থাকা আইটেমগুলোও শো করে
    today.setHours(0, 0, 0, 0);

    return list.filter((item) => {
      if (!item.deadline) return true; // ডেডলাইন দেওয়া না থাকলে শো করবে

      const deadlineDate = new Date(item.deadline);
      // যদি ডেডলাইন ভ্যালিড ডেট হয় এবং আজ বা আজকের পর হয়, তবেই শো করবে
      return !isNaN(deadlineDate.getTime()) && deadlineDate >= today;
    });
  };

  // 🟢 Dynamic Opportunities Fetcher
  useEffect(() => {
    if (initialOpportunities && initialOpportunities.length > 0) {
      setOpportunities(filterActiveOpportunities(initialOpportunities));
      setLoading(false);
      return;
    }

    const fetchOpportunities = async () => {
      try {
        setLoading(true);

        const res = await serverFetch("/api/opportunities");

        if (res?.error) {
          console.warn(res.message || "Failed to fetch opportunities");
          setOpportunities([]);
          return;
        }

        let fetchedData = [];
        if (Array.isArray(res)) {
          fetchedData = res;
        } else if (res?.data && Array.isArray(res.data)) {
          fetchedData = res.data;
        }

        // 🟢 শুধুমাত্র যেসব ডেডলাইন পার হয়নি সেগুলো ফিল্টার করে রাখা
        setOpportunities(filterActiveOpportunities(fetchedData));
      } catch (error) {
        console.error("Failed to fetch featured opportunities:", error);
        setOpportunities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [initialOpportunities]);

  // DATE FORMATTER HELPER
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (Number.isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <section className="bg-slate-50 px-4 py-12 transition-colors duration-200 dark:bg-slate-950 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* HEADER SECTION */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              Featured Opportunities
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Apply to open roles and join dynamic teams
            </p>
          </div>

          {/* 🟢 Public Page Link */}
          <Link
            href="/browse-opportunities"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 transition-colors hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            <span>View All</span>
            <span>→</span>
          </Link>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <Spinner size="md" />
          </div>
        ) : !opportunities || opportunities.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
            <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
              No active opportunities available right now
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Check back later for new openings.
            </p>
          </div>
        ) : (
          /* CONTENT GRID (SHOWS MAXIMUM 3 ACTIVE ITEMS) */
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.slice(0, 3).map((item) => {
              const skills = Array.isArray(item.required_skills)
                ? item.required_skills
                : typeof item.required_skills === "string"
                ? item.required_skills.split(",").map((s) => s.trim())
                : [];

              const opportunityId = item._id || item.id;
              const startupName =
                item.startup_name ||
                item.startup_details?.startup_name ||
                "Startup Name";

              return (
                <Link
                  key={opportunityId}
                  href={`/browse-opportunities/${opportunityId}`}
                  className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div>
                    <h3 className="line-clamp-1 text-lg font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 sm:text-xl">
                      {item.role_title || "Untitled Role"}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      {startupName}
                    </p>

                    {/* SKILLS */}
                    <div className="mb-6 mt-4 flex flex-wrap gap-1.5">
                      {skills.length > 0 ? (
                        skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">
                          No specific skills listed
                        </span>
                      )}
                    </div>
                  </div>

                  {/* FOOTER */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
                    <span>Deadline:</span>
                    <span className="font-semibold text-rose-500 dark:text-rose-400">
                      {formatDate(item.deadline)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}