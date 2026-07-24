"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input } from "@heroui/react";
import { Rocket } from "@gravity-ui/icons";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { authClient } from "@/lib/auth-client"; // Better Auth client

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🎯 Intended Route
  const redirectTo = searchParams.get("redirectTo") || "/";

  // Form States
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 1. Email/Password Login Handler
  const handleCredentialLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.email || !formData.password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: redirectTo,
      });

      if (error) {
        // ভুল ইমেইল বা পাসওয়ার্ড দিলে ইউজারকে ক্লিয়ার মেসেজ দেওয়া
        if (error.status === 401 || error.status === 400) {
          setErrorMessage("Invalid email or password. Please try again.");
        } else {
          setErrorMessage(error.message || "Failed to sign in. Please try again.");
        }
        setLoading(false);
        return;
      }

      router.push(redirectTo);
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Google OAuth Login Handler
  const handleGoogleLogin = async () => {
    setErrorMessage("");
    setLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });
    } catch (err) {
      console.error("Google Auth Error:", err);
      setErrorMessage("Failed to initiate Google login. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-indigo-500/5">
        
        {/* Header Section */}
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

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="p-3 text-xs rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-medium text-center animate-shake">
            {errorMessage}
          </div>
        )}

        {/* Google OAuth Login Button */}
        <div>
          <Button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-11 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center justify-center gap-3 transition-all"
          >
            <FaGoogle className="h-4 w-4 text-red-500" />
            <span className="text-sm">Continue with Google</span>
          </Button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 dark:border-gray-800 w-full" />
          <span className="bg-white dark:bg-gray-900 px-3 text-[10px] text-gray-400 uppercase tracking-wider absolute">
            Or Sign In With Email
          </span>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleCredentialLogin} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
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
            <div className="flex items-center justify-between mb-1.5">
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
              >
                {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all mt-2"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          Don't have an account?{" "}
          <Link href="/register" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
            Create Account
          </Link>
        </p>

      </div>
    </div>
  );
}