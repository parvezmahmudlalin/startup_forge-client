"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-20 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto space-y-6"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          Build Your Dream Team at <span className="text-blue-500">StartupForge</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
          Connecting visionary startup founders with talented developers, designers, and marketers to turn ideas into reality.
        </p>
        <div>
          <Link href="/browse-opportunities">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-3 rounded-xl transition duration-300 shadow-lg hover:shadow-blue-500/30">
              Explore Opportunities
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}