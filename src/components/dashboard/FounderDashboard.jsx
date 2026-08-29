"use client";

import React, { useEffect, useState } from "react";
import {
  Building2,
  Briefcase,
  Users,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";
import { serverFetch } from "@/lib/api";

export default function FounderDashboard({ session }) {
  const [stats, setStats] = useState({
    totalOpportunities: 0,
    totalApplications: 0,
    acceptedMembers: 0,
  });
  const [startupsCount, setStartupsCount] = useState(0);

  useEffect(() => {
    const fetchFounderData = async () => {
      const email = session?.user?.email;
      if (!email) return;

      try {
        const [overviewRes, startupsRes] = await Promise.all([
          serverFetch(`/api/founder/overview?email=${email}`),
          serverFetch(`/api/founder/startups?email=${email}`),
        ]);

        if (overviewRes?.stats) setStats(overviewRes.stats);
        if (Array.isArray(startupsRes)) setStartupsCount(startupsRes.length);
      } catch (err) {
        console.error("Founder dashboard error:", err);
      }
    };

    fetchFounderData();
  }, [session]);

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Welcome back, {session?.user?.name}! 👋
          </h1>
          <p className="text-sm text-default-500">Founder Dashboard Overview</p>
        </div>
        <Link
          href="/dashboard/founder/startups/create-startup"
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <PlusCircle size={18} /> Create Startup
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Startups" value={startupsCount} icon={Building2} />
        <StatCard
          title="Opportunities"
          value={stats.totalOpportunities}
          icon={Briefcase}
        />
        <StatCard
          title="Applications"
          value={stats.totalApplications}
          icon={Users}
        />
        <StatCard
          title="Accepted"
          value={stats.acceptedMembers}
          icon={CheckCircle2}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-default-200 bg-background p-5 shadow-sm dark:border-default-100 dark:bg-content1">
      <div className="flex items-center justify-between">
        <span className="text-sm text-default-500">{title}</span>
        <Icon size={20} className="text-primary" />
      </div>
      <h3 className="mt-3 text-2xl font-bold">{value}</h3>
    </div>
  );
}