"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-slate-50 px-4 py-16 transition-colors duration-200 dark:bg-slate-950 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl text-center"
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl">
          Build Your Dream Team at{" "}
          <span className="text-indigo-600 dark:text-indigo-400">
            StartupForge
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 dark:text-slate-300 sm:text-lg md:text-xl">
          Connecting visionary startup founders with talented developers,
          designers, and marketers to turn ideas into reality.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
          <Link
            href="/opportunities"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all duration-200 hover:bg-indigo-700 hover:shadow-indigo-600/35 active:scale-[0.98] dark:bg-indigo-600 dark:hover:bg-indigo-500"
          >
            Explore Opportunities
          </Link>
          <Link
            href="/startups"
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 transition-all duration-200 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 active:scale-[0.98]"
          >
            Browse Startups
          </Link>
        </div>
      </motion.div>
    </section>
  );
}