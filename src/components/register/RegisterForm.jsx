"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { imageUploader } from "@/lib/imageUploader"; // 👈 আপনার তৈরি করা হেলপার ফাংশন

import RoleSelector from "./RoleSelector";
import ImageUpload from "./ImageUpload";
import PasswordField from "./PasswordField";
import SubmitButton from "./SubmitButton";

export default function RegisterForm() {
  const router = useRouter();

  // Form States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
    role: "Collaborator", // Default Role
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Password Rules Validation Checks
  const passwordRules = {
    hasMinLength: formData.password.length >= 6,
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
  };

  const isPasswordValid =
    passwordRules.hasMinLength && passwordRules.hasUpper && passwordRules.hasLower;

  // ImgBB Image Upload via lib/imageUploader
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg("");

    try {
      // 🚀 lib ফোল্ডারের imageUploader ফাংশন কল করা হচ্ছে
      const imageUrl = await imageUploader(file);

      if (imageUrl) {
        setFormData((prev) => ({ ...prev, image: imageUrl }));
      }
    } catch (error) {
      setErrorMsg(error.message || "Image upload failed. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

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
      const { email, password, name, image, role } = formData;

      // 🔑 Better Auth sign-up call
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        image,
        role,
      });

      if (error) {
        setErrorMsg(error.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      // Successful Registration Redirect
      router.push("/login");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
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

        {/* 3. Role Selection */}
        <RoleSelector
          role={formData.role}
          onRoleChange={(role) => setFormData({ ...formData, role })}
        />

        {/* 4. Image Upload */}
        <ImageUpload
          image={formData.image}
          uploadingImage={uploadingImage}
          onImageUpload={handleImageUpload}
          onUrlChange={(url) => setFormData({ ...formData, image: url })}
        />

        {/* 5. Password Field & Rules */}
        <PasswordField
          password={formData.password}
          onPasswordChange={(password) => setFormData({ ...formData, password })}
          passwordRules={passwordRules}
        />

        {/* 6. Submit Button */}
        <SubmitButton
          loading={loading}
          disabled={loading || uploadingImage || !isPasswordValid}
        />
      </form>
    </div>
  );
}