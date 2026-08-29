"use client";

import React, { useEffect, useState } from "react";
import { Send, Clock, CheckCircle2 } from "lucide-react";
import { serverFetch } from "@/lib/api";

export default function CollaboratorDashboard({ session }) {
  const [myApplications, setMyApplications] = useState([]);

  useEffect(() => {
    const fetchCollaboratorData = async () => {
      try {
        const email = session?.user?.email;
        if (!email) return;

        const res = await serverFetch(`/api/my-applications?email=${email}`);
        if (Array.isArray(res)) {
          setMyApplications(res);
        }
      } catch (err) {
        console.error("Error fetching collaborator data:", err);
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
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Welcome back, {session?.user?.name || "Collaborator"}! 👋
        </h1>
        <p className="text-sm text-default-500">
          Track your applications and explore new opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-default-200 bg-background p-5 shadow-sm dark:border-default-100 dark:bg-content1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-default-500">Applied Jobs</span>
            <Send size={20} className="text-primary" />
          </div>
          <h3 className="mt-2 text-2xl font-bold">{appliedCount}</h3>
        </div>

        <div className="rounded-2xl border border-default-200 bg-background p-5 shadow-sm dark:border-default-100 dark:bg-content1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-default-500">Pending Review</span>
            <Clock size={20} className="text-warning" />
          </div>
          <h3 className="mt-2 text-2xl font-bold">{pendingCount}</h3>
        </div>

        <div className="rounded-2xl border border-default-200 bg-background p-5 shadow-sm dark:border-default-100 dark:bg-content1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-default-500">Accepted</span>
            <CheckCircle2 size={20} className="text-success" />
          </div>
          <h3 className="mt-2 text-2xl font-bold">{acceptedCount}</h3>
        </div>
      </div>

      <div className="rounded-2xl border border-default-200 bg-background p-6 shadow-sm dark:border-default-100 dark:bg-content1">
        <h2 className="mb-4 text-lg font-bold">My Applications</h2>
        <div className="divide-y divide-default-100">
          {myApplications.length === 0 ? (
            <p className="py-4 text-sm text-default-400">
              You haven't applied to any roles yet.
            </p>
          ) : (
            myApplications.map((app) => (
              <div
                key={app._id}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="font-semibold text-foreground">
                    {app.opportunity_details?.role_title || "Role"}
                  </p>
                  <p className="text-xs text-default-400">
                    Startup: {app.startup_details?.startup_name || "N/A"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    app.status === "Accepted"
                      ? "bg-success/10 text-success"
                      : app.status === "Rejected"
                      ? "bg-danger/10 text-danger"
                      : "bg-warning/10 text-warning"
                  }`}
                >
                  {app.status || "Pending"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}