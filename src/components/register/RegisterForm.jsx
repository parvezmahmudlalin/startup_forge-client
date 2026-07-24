"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

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

  // ImgBB Image Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMsg("");

    const imgData = new FormData();
    imgData.append("image", file);

    try {
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
      console.log("Registration Payload:", formData);
      const { email, password, name, image, role } = formData;
      
      await authClient.signUp.email({ email, password, name, image, role });

      // Successful Registration Redirect
      router.push("/login");
    } catch (err) {
      setErrorMsg(err.message || "Registration failed. Please try again.");
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