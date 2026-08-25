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
        <p className="text-gray-400">Please login first.</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Opportunities",
      value: stats.totalOpportunities,
      icon: FiBriefcase,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: FiUsers,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      title: "Accepted Members",
      value: stats.acceptedMembers,
      icon: FiUserCheck,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-400">
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
              className={`flex items-center justify-between rounded-xl border ${card.borderColor} bg-[#121824] p-6 transition duration-200 hover:scale-[1.01]`}
            >
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-400">
                  {card.title}
                </p>
                <h3 className="text-3xl font-bold text-white">{card.value}</h3>
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
      <div className="rounded-xl border border-white/10 bg-[#121824] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
            <FiTrendingUp size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              Recruitment Metrics Summary
            </h2>
            <p className="text-sm text-gray-400">
              Conversion rate:{" "}
              <span className="font-medium text-white">
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