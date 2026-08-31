"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { serverFetch } from "@/lib/api";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import FounderDashboard from "@/components/dashboard/FounderDashboard";
import CollaboratorDashboard from "@/components/dashboard/CollaboratiorDashboard";

export default function DashboardPage() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const [role, setRole] = useState(null);
  const [dbStats, setDbStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (session?.user) {
      const userRole = session.user.role || "collaborator";
      setRole(userRole.toLowerCase());

      // অ্যাডমিন হলে সরাসরি ব্যাকএন্ড API থেকে আপ-টু-ডেট ডাটা ফেচ করা
      if (userRole.toLowerCase() === "admin") {
        fetchAdminStats();
      } else {
        setLoadingStats(false);
      }
    }
  }, [session]);

  const fetchAdminStats = async () => {
    try {
      setLoadingStats(true);
      const res = await serverFetch("/api/admin/stats");
      if (res?.success) {
        setDbStats(res.stats);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (authLoading || !role || loadingStats) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  switch (role) {
    case "admin":
      return <AdminDashboard session={session} stats={dbStats} refreshStats={fetchAdminStats} />;
    case "founder":
      return <FounderDashboard session={session} />;
    case "collaborator":
    default:
      return <CollaboratorDashboard session={session} />;
  }
}