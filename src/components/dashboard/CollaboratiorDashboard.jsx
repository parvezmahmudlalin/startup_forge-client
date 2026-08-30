"use client";

import React, { useEffect, useState } from "react";
import { Send, Clock, CheckCircle2 } from "lucide-react";
import { serverFetch } from "@/lib/api";

export default function CollaboratorDashboard({ session }) {
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollaboratorData = async () => {
      try {
        const email = session?.user?.email;
        if (!email) return;

        const res = await serverFetch(`/api/my-applications?email=${email}`);
        if (Array.isArray(res)) {
          setMyApplications(res);
        } else if (res?.data && Array.isArray(res.data)) {
          setMyApplications(res.data);
        }
      } catch (err) {
        console.error("Error fetching collaborator data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollaboratorData();
  }, [session]);

  const appliedCount = myApplications.length;
  const acceptedCount = myApplications.filter(
    (a) => a.status === "Accepted"
  ).length;
  const pendingCount = myApplications.filter(
    (a) => a.status === "Pending"
  ).length;

  return (
    <div className="w-full space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
          Welcome back, {session?.user?.name || "Collaborator"}! 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track your applications and explore new opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Applied Jobs
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
              <Send size={20} />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
            {appliedCount}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Pending Review
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
              <Clock size={20} />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
            {pendingCount}
          </h3>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Accepted
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <h3 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
            {acceptedCount}
          </h3>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-900 dark:text-white">
          My Applications
        </h2>

        {loading ? (
          <div className="py-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Loading applications...
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {myApplications.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                You haven't applied to any roles yet.
              </p>
            ) : (
              myApplications.map((app) => (
                <div
                  key={app._id}
                  className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {app.opportunity_details?.role_title || "Role Title"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Startup: {app.startup_details?.startup_name || "N/A"}
                    </p>
                  </div>

                  <div className="mt-2 sm:mt-0">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        app.status === "Accepted"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300"
                          : app.status === "Rejected"
                          ? "bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300"
                      }`}
                    >
                      {app.status || "Pending"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}