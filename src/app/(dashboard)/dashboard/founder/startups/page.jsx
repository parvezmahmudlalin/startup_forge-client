"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Card, Spinner } from "@heroui/react";
import { CirclePlus, Pencil, House } from "@gravity-ui/icons";

import { authClient } from "@/lib/auth-client";
import { serverFetch } from "@/lib/api";

export default function MyStartups() {
  const { data: session, isPending: authLoading } = authClient.useSession();

  // 1. Single Object-এর বদলে Array/List স্টেট
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD STARTUPS
  // =========================

  useEffect(() => {
    if (session?.user?.email) {
      setLoading(true);

      serverFetch(
        `/api/founder/startup?email=${encodeURIComponent(
          session.user.email
        )}`
      )
        .then((data) => {
          // 2. ব্যাকএন্ড থেকে array রিটার্ন করলে তা সেট করা
          setStartups(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
          console.error("Failed to load startups:", error);
          setStartups([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [session, authLoading]);

  // =========================
  // LOADING
  // =========================

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" label="Loading startups..." />
      </div>
    );
  }

  // =========================
  // NOT LOGGED IN
  // =========================

  if (!session?.user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold">Please Login</h2>

          <p className="mt-2 text-sm text-gray-500">
            You need to login to manage your startups.
          </p>

          <Link
            href="/login"
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Login
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* =========================
          HEADER
      ========================= */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Startups
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your registered startup profiles and recruitment opportunities.
          </p>
        </div>

        {/* 3. Create Startup Button সবসময় থাকবে যাতে নতুন স্টার্টআপ অ্যাড করা যায় */}
        <Link
          href="/dashboard/founder/startups/create-startup"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
        >
          <CirclePlus className="h-4 w-4" />
          Create Startup
        </Link>
      </div>

      {/* =========================
          STARTUPS EXIST
      ========================= */}

      {startups.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {/* 4. .map() চালিয়ে প্রতিটি স্টার্টআপ কার্ড রেন্ডার */}
          {startups.map((item) => (
            <Card
              key={item._id}
              className="border border-default-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                {/* STARTUP INFORMATION */}

                <div className="flex items-start gap-4">
                  {/* LOGO */}

                  {item.logo ? (
                    <img
                      src={item.logo}
                      alt={item.startup_name}
                      className="h-20 w-20 rounded-xl border border-default-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-default-100">
                      <House className="h-8 w-8 text-default-400" />
                    </div>
                  )}

                  {/* CONTENT */}

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {item.startup_name}
                      </h2>

                      {item.funding_stage && (
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                          {item.funding_stage}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-medium text-gray-500">
                      Industry:{" "}
                      <span className="text-gray-800 dark:text-gray-200">
                        {item.industry}
                      </span>
                    </p>

                    <p className="max-w-2xl text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>

                    <p className="text-xs text-gray-400">
                      Founder: {item.founder_email}
                    </p>

                    {item.status && (
                      <span className="inline-block rounded-full bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                        Status: {item.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* DYNAMIC MANAGE STARTUP LINK ([id] পেজে পাঠাবে) */}
                <Link
                  href={`/dashboard/founder/startups/${item._id}`}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white"
                >
                  <Pencil className="h-4 w-4" />
                  Manage Startup
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* =========================
            NO STARTUPS
        ========================= */

        <Card className="border border-dashed border-default-300 p-10 text-center dark:border-gray-700">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <House className="h-7 w-7" />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            No Startup Registered Yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            You haven't added a startup profile to your account yet. Create your
            startup profile to start publishing job and collaboration
            opportunities.
          </p>

          <Link
            href="/dashboard/founder/startups/create-startup"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
          >
            <CirclePlus className="h-4 w-4" />
            Create Startup
          </Link>
        </Card>
      )}
    </div>
  );
}