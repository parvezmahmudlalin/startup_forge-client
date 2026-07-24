"use client";

import React from "react";
import Link from "next/link";
import RegisterHeader from "@/components/register/RegisterHeader";
import RegisterForm from "@/components/register/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-8 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-indigo-500/5">
        
        {/* Header */}
        <RegisterHeader />

        {/* Form Components Wrapper */}
        <RegisterForm />

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}