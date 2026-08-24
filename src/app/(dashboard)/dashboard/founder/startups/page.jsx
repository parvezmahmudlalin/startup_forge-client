"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, Spinner } from "@heroui/react";
import { CirclePlus, Pencil, House } from "@gravity-ui/icons";
import { authClient } from "@/lib/auth-client";
import { serverFetch } from "@/lib/api";

export default function MyStartups() {
  const { data: session, isPending: authLoading } = authClient.useSession();
  const [startup, setStartup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      serverFetch(`/api/founder/startup?email=${encodeURIComponent(session.user.email)}`)
        .then((data) => {
          setStartup(data?._id ? data : null);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to load startup:", err);
          setLoading(false);
        });
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [session, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" label="Loading startup details..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            My Startup Profile
          </h1>
          <p className="text-sm text-gray-500">
            Manage your registered startup profile and recruitment opportunities.
          </p>
        </div>

        {!startup && (
          <Link
            href="/dashboard/founder/startups/create-startup"
            
            startContent={<CirclePlus className="h-4 w-4" />}
          >
            <Button color = "primary" >Create Startup</Button>
          </Link>
        )}
      </div>

      {startup ? (
        <Card className="border border-default-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              {startup.logo ? (
                <img
                  src={startup.logo}
                  alt={startup.startup_name}
                  className="h-20 w-20 rounded-xl border border-default-200 object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-default-100">
                  <House className="h-8 w-8 text-default-400" />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {startup.startup_name}
                  </h2>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    {startup.funding_stage}
                  </span>
                </div>

                <p className="text-sm font-medium text-gray-500">
                  Industry: <span className="text-gray-800 dark:text-gray-200">{startup.industry}</span>
                </p>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {startup.description}
                </p>

                <p className="text-xs text-gray-400">
                  Founder Email: {startup.founder_email}
                </p>
              </div>
            </div>

             <Link
            href="/dashboard/founder/startups/manage-startup"
            
            startContent={<CirclePlus className="h-4 w-4" />}
          >
            <Button color = "primary" >Manage Startup</Button>
          </Link>
          </div>
        </Card>
      ) : (
        <Card className="border border-dashed border-default-300 p-10 text-center dark:border-gray-700">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <House className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
            No Startup Registered Yet
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            You haven't added a startup profile to your account yet. Create your startup profile to start publishing job and collaboration opportunities.
          </p>
           <Link
            href="/dashboard/founder/startups/create-startup"
            
            startContent={<CirclePlus className="h-4 w-4" />}
          >
            <Button color = "primary" >Create Startup</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}