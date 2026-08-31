"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import {
  Users,
  Rocket,
  BriefcaseBusiness,
  DollarSign,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

import { serverFetch } from "@/lib/api";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStartups: 0,
    totalOpportunities: 0,
    totalApproved: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await serverFetch("/api/admin/stats");

      if (res?.success) {
        setStats(
          res.stats || {
            totalUsers: 0,
            totalStartups: 0,
            totalOpportunities: 0,
            totalApproved: 0,
            totalRevenue: 0,
          }
        );
      } else {
        setError(res?.message || "Failed to load statistics.");
      }
    } catch (error) {
      console.error(error);
      setError("Something went wrong while loading statistics.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      iconClass: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Total Startups",
      value: stats.totalStartups,
      icon: Rocket,
      iconClass: "bg-violet-500/10 text-violet-500",
    },
    {
      title: "Total Opportunities",
      value: stats.totalOpportunities,
      icon: BriefcaseBusiness,
      iconClass: "bg-orange-500/10 text-orange-500",
    },
    {
      title: "Total Revenue",
      value: `$${Number(stats.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      iconClass: "bg-emerald-500/10 text-emerald-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck size={24} className="text-primary" />
          <h1 className="text-2xl font-bold">Admin Overview</h1>
        </div>

        <p className="mt-1 text-sm text-default-500">
          Monitor and manage StartupForge platform activity.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-danger/20 bg-danger/10 p-4 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-default-200 bg-content1 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-default-100"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-default-500">{card.title}</p>
                  <h2 className="mt-2 text-3xl font-bold">{card.value}</h2>
                </div>

                <div className={`rounded-xl p-3 ${card.iconClass}`}>
                  <Icon size={23} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1 text-xs text-success">
                <TrendingUp size={14} />
                <span>Platform statistic</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-default-200 bg-content1 p-6 dark:border-default-100">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-success/10 p-3 text-success">
              <CheckCircle2 size={24} />
            </div>

            <div>
              <p className="text-sm text-default-500">Approved Startups</p>
              <p className="text-2xl font-bold">{stats.totalApproved}</p>
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-default-100">
            <div
              className="h-full rounded-full bg-success transition-all"
              style={{
                width:
                  stats.totalStartups > 0
                    ? `${Math.min(
                        100,
                        (stats.totalApproved / stats.totalStartups) * 100
                      )}%`
                    : "0%",
              }}
            />
          </div>

          <p className="mt-2 text-xs text-default-500">Approved startup ratio</p>
        </div>

        <div className="rounded-2xl border border-default-200 bg-content1 p-6 dark:border-default-100">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <Rocket size={24} />
            </div>

            <div>
              <p className="text-sm text-default-500">StartupForge Activity</p>
              <p className="text-2xl font-bold">
                {stats.totalStartups + stats.totalOpportunities}
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm text-default-500">
            Total startups and opportunities currently available on the platform.
          </p>
        </div>
      </div>
    </div>
  );
}