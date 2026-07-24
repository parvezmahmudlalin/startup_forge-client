"use client";

import React from "react";
import Link from "next/link";
import { Rocket } from "@gravity-ui/icons";

export default function RegisterHeader() {
  return (
    <div className="text-center space-y-2">
      <Link href="/" className="inline-flex items-center gap-2.5 group">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105">
          <Rocket className="h-6 w-6" />
        </div>
      </Link>
      <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mt-4">
        Join StartupForge
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Create an account to build startup teams or apply for opportunities
      </p>
    </div>
  );
}