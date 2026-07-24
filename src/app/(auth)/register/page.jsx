"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input } from "@heroui/react";
import {  Rocket,Check,  XmarkShape } from "@gravity-ui/icons";
import {  FaUserAlt , FaUserAstronaut, FaEye, FaEyeSlash, FaCloudUploadAlt } from "react-icons/fa";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
    role: "Collaborator", // Default Role
  });

  const [showPassword, setShowPassword] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔑 Password Rules Validation Checks
  const passwordRules = {
    hasMinLength: formData.password.length >= 6,
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
  };

  const isPasswordValid =
    passwordRules.hasMinLength && passwordRules.hasUpper && passwordRules.hasLower;

  // 📸 Handle ImgBB Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg("");

    const imgData = new FormData();
    imgData.append("image", file);

    try {
      // ⚠️ Note: .env.local ফাইলে NEXT_PUBLIC_IMGBB_API_KEY সেভ করে রাখুন
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "YOUR_IMGBB_API_KEY";
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: imgData,
      });

      const data = await res.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.data.url }));
      } else {
        setErrorMsg("Failed to upload image to ImgBB. Try again or paste URL.");
      }
    } catch (error) {
      setErrorMsg("Image upload failed. Please check your network or API key.");
    } finally {
      setUploadingImage(false);
    }
  };

  // 🚀 Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    await authClient.signUp.email({ email: user.email, password: user.password, name: user.name, image: user.image, role: user.role });

    if (!isPasswordValid) {
      setErrorMsg("Password does not meet the security requirements.");
      return;
    }

    if (!formData.image) {
      setErrorMsg("Please upload an image or provide an image URL.");
      return;
    }

    setLoading(true);

    try {
      console.log("Registration Payload:", formData);
      // TODO: Call Better Auth sign-up API here
      // await authClient.signUp.email({ email, password, name, image, role });

      // Successful Registration Redirect
      router.push("/login");
    } catch (err) {
      setErrorMsg(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
            Join StartupForge
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Create an account to build startup teams or apply for opportunities
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 dark:bg-red-950/40 dark:border-red-900/50">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Name Input */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <Input
              required
              type="text"
              placeholder="e.g. Alex Rivera"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full"
            />
          </div>

          {/* 2. Email Input */}
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

          {/* 3. Role Selection Cards */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Select Your Account Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Founder Role Option */}
              <div
                onClick={() => setFormData({ ...formData, role: "Founder" })}
                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center ${
                  formData.role === "Founder"
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                    : "border-gray-100 dark:border-gray-800 hover:border-gray-200 text-gray-600 dark:text-gray-400"
                }`}
              >
                <FaUserAstronaut className="h-6 w-6" />
                <span className="font-bold text-sm">Founder</span>
                <span className="text-[11px] text-gray-400 leading-tight">Post ideas & hire team</span>
              </div>

              {/* Collaborator Role Option */}
              <div
                onClick={() => setFormData({ ...formData, role: "Collaborator" })}
                className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center ${
                  formData.role === "Collaborator"
                    ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                    : "border-gray-100 dark:border-gray-800 hover:border-gray-200 text-gray-600 dark:text-gray-400"
                }`}
              >
                <FaUserAlt  className="h-6 w-6" />
                <span className="font-bold text-sm">Collaborator</span>
                <span className="text-[11px] text-gray-400 leading-tight">Explore & join projects</span>
              </div>
            </div>
          </div>

          {/* 4. Image Upload Field (ImgBB File Upload + Image URL Input) */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Profile Photo
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer hover:border-indigo-500 transition-colors">
                <FaCloudUploadAlt className="h-5 w-5 text-indigo-600" />
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                  {uploadingImage ? "Uploading to ImgBB..." : "Upload File"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />
              </label>

              <span className="text-xs text-gray-400">OR</span>

              <Input
                type="url"
                placeholder="Paste Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="flex-1 w-full"
              />
            </div>

            {formData.image && (
              <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600 font-medium">
                <Check className="h-4 w-4" /> Image attached successfully!
              </div>
            )}
          </div>

          {/* 5. Password Input & Live Rules Check */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
              Password
            </label>
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Password Validation Rules UI */}
            <div className="mt-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 space-y-1.5 text-xs">
              <div className={`flex items-center gap-2 ${passwordRules.hasMinLength ? "text-emerald-600 font-medium" : "text-gray-400"}`}>
                {passwordRules.hasMinLength ? <Check className="h-3.5 w-3.5" /> : <XmarkShape className="h-3.5 w-3.5" />}
                Minimum 6 characters
              </div>
              <div className={`flex items-center gap-2 ${passwordRules.hasUpper ? "text-emerald-600 font-medium" : "text-gray-400"}`}>
                {passwordRules.hasUpper ? <Check className="h-3.5 w-3.5" /> : <XmarkShape className="h-3.5 w-3.5" />}
                At least one uppercase letter (A-Z)
              </div>
              <div className={`flex items-center gap-2 ${passwordRules.hasLower ? "text-emerald-600 font-medium" : "text-gray-400"}`}>
                {passwordRules.hasLower ? <Check className="h-3.5 w-3.5" /> : <XmarkShape className="h-3.5 w-3.5" />}
                At least one lowercase letter (a-z)
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading || uploadingImage || !isPasswordValid}
            className="w-full h-12 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

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