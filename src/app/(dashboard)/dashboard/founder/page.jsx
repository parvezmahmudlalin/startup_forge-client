"use client";

import { useEffect, useState } from "react";
import { Spinner, Card } from "@heroui/react";
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
        <p className="text-default-500">Please login first.</p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Opportunities",
      value: stats.totalOpportunities,
      icon: FiBriefcase,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications,
      icon: FiUsers,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      title: "Accepted Members",
      value: stats.acceptedMembers,
      icon: FiUserCheck,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Dashboard Overview
        </h1>
        <p className="mt-1 text-sm text-default-500">
          Welcome back! Here is a summary of your startup's hiring progress.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card
              key={index}
              className="flex flex-row items-center justify-between border border-default-200 bg-content1 p-6 shadow-sm transition duration-200 hover:scale-[1.01] dark:border-default-100"
            >
              <div className="space-y-2">
                <p className="text-sm font-medium text-default-500">
                  {card.title}
                </p>
                <h3 className="text-3xl font-bold text-foreground">
                  {card.value}
                </h3>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bgColor} ${card.color}`}
              >
                <Icon size={24} />
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="border border-default-200 bg-content1 p-6 shadow-sm dark:border-default-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <FiTrendingUp size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Recruitment Metrics Summary
            </h2>
            <p className="text-sm text-default-500">
              Conversion rate:{" "}
              <span className="font-semibold text-foreground">
                {stats.totalApplications > 0
                  ? ((stats.acceptedMembers / stats.totalApplications) * 100).toFixed(1)
                  : 0}
                %
              </span>{" "}
              of applicants accepted.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}