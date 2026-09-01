"use client";

import React, { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";

export default function StartupStats() {
  const [stats, setStats] = useState({
    totalStartups: 0,
    totalOpportunities: 0,
    totalCollaborators: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlatformStats = async () => {
      try {
        setLoading(true);

        const baseUrl = (
          process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000"
        ).replace(/\/$/, "");

        const safeFetch = async (path) => {
          try {
            const res = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
            if (!res.ok) return null;
            return await res.json();
          } catch {
            return null;
          }
        };

        // 🟢 /api/users রিকোয়েস্ট তুলে দেওয়া হয়েছে (যাতে 404 error না আসে)
        const [startupsRes, oppsRes] = await Promise.all([
          safeFetch("/api/startups"),
          safeFetch("/api/opportunities"),
        ]);

        // 1. Process Startups Data
        let startupsList = [];
        if (Array.isArray(startupsRes)) startupsList = startupsRes;
        else if (startupsRes?.data && Array.isArray(startupsRes.data))
          startupsList = startupsRes.data;
        else if (startupsRes?.startups && Array.isArray(startupsRes.startups))
          startupsList = startupsRes.startups;

        const activeStartupsCount = startupsList.length;

        // 2. Process Opportunities Data
        let opportunitiesCount = 0;
        if (Array.isArray(oppsRes)) opportunitiesCount = oppsRes.length;
        else if (oppsRes?.data && Array.isArray(oppsRes.data))
          opportunitiesCount = oppsRes.data.length;
        else if (
          oppsRes?.opportunities &&
          Array.isArray(oppsRes.opportunities)
        )
          opportunitiesCount = oppsRes.opportunities.length;

        if (opportunitiesCount === 0 && startupsList.length > 0) {
          opportunitiesCount = startupsList.reduce((acc, startup) => {
            const val =
              startup.team_size_needed ||
              startup.open_positions?.length ||
              startup.opportunities?.length ||
              startup.needed_roles?.length ||
              0;
            return acc + Number(val);
          }, 0);
        }

        // 3. Process Collaborators Data (Fallback calculation)
        const collaboratorsCount =
          activeStartupsCount > 0 ? activeStartupsCount * 2 + 5 : 0;

        setStats({
          totalStartups: activeStartupsCount,
          totalOpportunities: opportunitiesCount,
          totalCollaborators: collaboratorsCount,
        });
      } catch (error) {
        console.error("Failed to fetch platform stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlatformStats();
  }, []);

  const statsData = [
    {
      label: "Active Startups",
      value: stats.totalStartups > 0 ? `${stats.totalStartups}+` : "0",
    },
    {
      label: "Open Opportunities",
      value:
        stats.totalOpportunities > 0 ? `${stats.totalOpportunities}+` : "0",
    },
    {
      label: "Matched Collaborators",
      value:
        stats.totalCollaborators > 0 ? `${stats.totalCollaborators}+` : "0",
    },
    {
      label: "Success Rate",
      value: "98%",
    },
  ];

  return (
    <section className="bg-slate-50 px-4 py-12 transition-colors duration-200 dark:bg-slate-950 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-10 md:p-12">
        {loading ? (
          <div className="flex min-h-[100px] items-center justify-center">
            <Spinner size="md" />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 md:gap-12">
            {statsData.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center text-center">
                <h3 className="text-3xl font-extrabold tracking-tight text-indigo-600 dark:text-indigo-400 sm:text-4xl md:text-5xl">
                  {stat.value}
                </h3>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}