"use client";

import React from "react";
import Link from "next/link";

import LoginHeader from "@/components/login/LoginHeader";
import GoogleLoginButton from "@/components/login/GoogleLoginButton";
import LoginForm from "@/components/login/LoginForm";
import { useLoginForm } from "@/app/hooks/useLoginForm";


export default function LoginPage() {
  const {
    formData,
    showPassword,
    loading,
    errorMessage,
    updateFormField,
    togglePasswordVisibility,
    handleCredentialLogin,
    handleGoogleLogin,
  } = useLoginForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 bg-white dark:bg-gray-900 p-8 sm:p-10 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-indigo-500/5">
        
        {/* Header Section */}
        <LoginHeader />

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="p-3 text-xs rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 font-medium text-center transition-all">
            {errorMessage}
          </div>
        )}

        {/* Google OAuth Login Button */}
        <GoogleLoginButton onClick={handleGoogleLogin} loading={loading} />

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-200 dark:border-gray-800 w-full" />
          <span className="bg-white dark:bg-gray-900 px-3 text-[10px] text-gray-400 uppercase tracking-wider absolute">
            Or Sign In With Email
          </span>
        </div>

        {/* Email & Password Form Component */}
        <LoginForm
          formData={formData}
          showPassword={showPassword}
          loading={loading}
          onFieldChange={updateFormField}
          onTogglePassword={togglePasswordVisibility}
          onSubmit={handleCredentialLogin}
        />

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