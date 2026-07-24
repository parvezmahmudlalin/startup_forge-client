"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { Rocket } from "@gravity-ui/icons";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🎯 Intended Route হ্যান্ডলিং (URL-এ redirectTo না থাকলে ডিফল্ট Home Page '/')
  const redirectTo = searchParams.get("redirectTo") || "/";

  // Form States
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Credential Login Handler (UI Only)
  const handleCredentialLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // 🚀 Simulating Authentication Success
    setTimeout(() => {
      setLoading(false);
      console.log("Logged in with Credentials:", formData);
      router.push(redirectTo); // Intended Route বা Home Page-এ রিডাইরেক্ট
    }, 1000);
  };

  // 2. Google Login Handler (UI Only)
  const handleGoogleLogin = () => {
    setLoading(true);

    // 🚀 Simulating Social Login Redirect
    setTimeout(() => {
      setLoading(false);
      console.log("Logged in with Google");
      router.push(redirectTo); // Intended Route বা Home Page-এ রিডাইরেক্ট
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl space-y-8 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-indigo-500/5">
        
        {/* Header Section */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-105">
              <Rocket className="h-6 w-6" />
            </div>
          </Link>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white mt-4">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sign in to continue to StartupForge
          </p>
        </div>

        {/* Google OAuth Login Button */}
        <div>
          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center justify-center gap-3 transition-colors"
          >
            <FaGoogle className="h-5 w-5 text-red-500" />
            <span>Continue with Google</span>
          </Button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 dark:border-gray-800 w-full" />
          <span className="bg-white dark:bg-gray-900 px-3 text-xs text-gray-400 uppercase tracking-wider absolute">
            Or Sign In With Email
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleCredentialLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <Input
              required
              type="email"
              placeholder="alex@startupforge.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full"
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <Input
                required
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}