"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Card, Spinner, Button } from "@heroui/react";
import { CirclePlus, Pencil, House } from "@gravity-ui/icons";

import { authClient } from "@/lib/auth-client";
import { serverFetch } from "@/lib/api";

export default function MyStartups() {
  const { data: session, isPending: authLoading } = authClient.useSession();

  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      setLoading(true);

      serverFetch(
        `/api/founder/startup?email=${encodeURIComponent(
          session.user.email
        )}`
      )
        .then((data) => {
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

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" label="Loading startups..." />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <Card className="border border-default-200 bg-content1 p-8 text-center shadow-lg dark:border-default-100">
          <h2 className="text-xl font-bold text-foreground">Please Login</h2>

          <p className="mt-2 text-sm text-default-500">
            You need to login to manage your startups.
          </p>

          <Button
            as={Link}
            href="/login"
            color="primary"
            className="mt-5 font-semibold"
          >
            Login
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            My Startups
          </h1>

          <p className="mt-1 text-sm text-default-500">
            Manage your registered startup profiles and recruitment opportunities.
          </p>
        </div>

        <Button
          as={Link}
          href="/dashboard/founder/startups/create-startup"
          color="primary"
          startContent={<CirclePlus className="h-4 w-4" />}
          className="font-semibold shadow-sm"
        >
          Create Startup
        </Button>
      </div>

      {startups.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {startups.map((item) => (
            <Card
              key={item._id}
              className="border border-default-200 bg-content1 p-6 shadow-sm dark:border-default-100"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                  {item.logo ? (
                    <img
                      src={item.logo}
                      alt={item.startup_name}
                      className="h-20 w-20 rounded-xl border border-default-200 object-cover dark:border-default-100"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-content2">
                      <House className="h-8 w-8 text-default-400" />
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-foreground">
                        {item.startup_name}
                      </h2>

                      {item.funding_stage && (
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {item.funding_stage}
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-medium text-default-500">
                      Industry:{" "}
                      <span className="text-foreground">
                        {item.industry}
                      </span>
                    </p>

                    <p className="max-w-2xl text-sm leading-6 text-default-600">
                      {item.description}
                    </p>

                    <p className="text-xs text-default-400">
                      Founder: {item.founder_email}
                    </p>

                    {item.status && (
                      <span className="inline-block rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
                        Status: {item.status}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  as={Link}
                  href={`/dashboard/founder/startups/${item._id}`}
                  variant="bordered"
                  startContent={<Pencil className="h-4 w-4" />}
                  className="shrink-0 font-semibold border-default-200 dark:border-default-100"
                >
                  Manage Startup
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border border-dashed border-default-300 bg-content1 p-10 text-center dark:border-default-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <House className="h-7 w-7" />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-foreground">
            No Startup Registered Yet
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-default-500">
            You haven't added a startup profile to your account yet. Create your
            startup profile to start publishing job and collaboration
            opportunities.
          </p>

          <Button
            as={Link}
            href="/dashboard/founder/startups/create-startup"
            color="primary"
            startContent={<CirclePlus className="h-4 w-4" />}
            className="mt-6 font-semibold shadow-sm"
          >
            Create Startup
          </Button>
        </Card>
      )}
    </div>
  );
}