"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import FounderDashboard from "@/components/dashboard/FounderDashboard";
import CollaboratorDashboard from "@/components/dashboard/CollaboratiorDashboard";  

export default function DashboardPage() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (session?.user) {
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