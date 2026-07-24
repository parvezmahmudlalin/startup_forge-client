import React from "react";
import Link from "next/link";
import { Rocket } from "@gravity-ui/icons";

export default function LoginHeader() {
  return (
    <div className="text-center space-y-2">
      <Link href="/" className="inline-flex items-center gap-2.5 group">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105">
          <Rocket className="h-6 w-6" />
        </div>
      </Link>
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-3">
        Welcome Back
      </h2>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Sign in to continue to StartupForge
      </p>
    </div>
  );
}