"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import FounderDashboard from "./components/FounderDashboard";
import CollaboratorDashboard from "./components/CollaboratorDashboard";
import AdminDashboard from "./components/AdminDashboard";

export default function DashboardPage() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      // ইউজার অবজেক্ট থেকে রোল নেওয়া (ডিফল্ট 'collaborator' রাখা হয়েছে)
      const userRole = session.user.role || "collaborator";
      setRole(userRole.toLowerCase());
    }
  }, [session]);

  if (authLoading || !role) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // রোল অনুযায়ী কম্পোনেন্ট রেন্ডার
  switch (role) {
    case "admin":
      return <AdminDashboard session={session} />;
    case "founder":
      return <FounderDashboard session={session} />;
    case "collaborator":
    default:
      return <CollaboratorDashboard session={session} />;
  }
}