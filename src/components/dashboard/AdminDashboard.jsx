"use client";

import React from "react";
import { Users, Building2, AlertTriangle } from "lucide-react";

export default function AdminDashboard({ session }) {
  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Admin Control Center 🛡️
        </h1>
        <p className="text-sm text-default-500">
          Manage system users, startup approvals, and platform analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-default-200 bg-background p-5 shadow-sm dark:border-default-100 dark:bg-content1">
          <Users className="text-primary" size={24} />
          <p className="mt-2 text-sm text-default-500">Total System Users</p>
          <h3 className="text-2xl font-bold">1,240</h3>
        </div>

        <div className="rounded-2xl border border-default-200 bg-background p-5 shadow-sm dark:border-default-100 dark:bg-content1">
          <Building2 className="text-primary" size={24} />
          <p className="mt-2 text-sm text-default-500">Pending Approvals</p>
          <h3 className="text-2xl font-bold">5 Startups</h3>
        </div>

        <div className="rounded-2xl border border-default-200 bg-background p-5 shadow-sm dark:border-default-100 dark:bg-content1">
          <AlertTriangle className="text-warning" size={24} />
          <p className="mt-2 text-sm text-default-500">System Status</p>
          <h3 className="text-2xl font-bold">All Healthy</h3>
        </div>
      </div>
    </div>
  );
}