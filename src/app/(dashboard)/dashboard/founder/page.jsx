"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import { FiBriefcase, FiUsers, FiUserCheck, FiTrendingUp } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { serverFetch } from "@/lib/api";

export default function FounderDashboardOverview() {
  const { data: session, isPending: authLoading } = authClient.useSession();

  const [stats, setStats] = useState({
    totalOpportunities: 0,
    totalApplications: 0,
    acceptedMembers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewStats = async () => {
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const email = encodeURIComponent(session.user.email);
        const data = await serverFetch(`/api/founder/overview?email=${email}`);

        if (data?.stats) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Fetch overview stats error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) {
      fetchOverviewStats();
    }
  }, [session?.user?.email]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session?.user?.email) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Please login first.</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Opportunities",
      value: stats.totalOpportunities,
      icon: FiBriefcase,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-500/10",
      borderColor: "border-slate-200 dark:border-slate-800",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: FiUsers,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-500/10",
      borderColor: "border-slate-200 dark:border-slate-800",
    },
    {
      title: "Accepted Members",
      value: stats.acceptedMembers,
      icon: FiUserCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-500/10",
      borderColor: "border-slate-200 dark:border-slate-800",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Welcome back! Here is a summary of your startup's hiring progress.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className={`flex items-center justify-between rounded-xl border ${card.borderColor} bg-white p-6 shadow-sm transition duration-200 hover:scale-[1.01] dark:bg-slate-900`}
            >
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {card.title}
                </p>
                <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {card.value}
                </h3>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bgColor} ${card.color}`}
              >
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Summary Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <FiTrendingUp size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Recruitment Metrics Summary
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Conversion rate:{" "}
              <span className="font-semibold text-slate-900 dark:text-white">
                {stats.totalApplications > 0
                  ? ((stats.acceptedMembers / stats.totalApplications) * 100).toFixed(1)
                  : 0}
                %
              </span>{" "}
              of applicants accepted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}