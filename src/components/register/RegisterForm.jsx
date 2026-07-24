"use client";

import React from "react";
import { Input } from "@heroui/react";


import RoleSelector from "./RoleSelector";
import ImageUpload from "./ImageUpload";
import PasswordField from "./PasswordField";
import SubmitButton from "./SubmitButton";
import { useRegisterForm } from "@/app/hooks/useRegisterForm";

export default function RegisterForm() {
  const {
    formData,
    status,
    passwordRules,
    isPasswordValid,
    updateField,
    handleImageUpload,
    handleSubmit,
  } = useRegisterForm();
  console.log(formData.role);

  return (
    <div className="space-y-6">
      {status.error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100 dark:bg-red-950/40 dark:border-red-900/50">
          {status.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
            Full Name
          </label>
          <Input
            required
            type="text"
            placeholder="e.g. Alex Rivera"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
            Email Address
          </label>
          <Input
            required
            type="email"
            placeholder="alex@startupforge.com"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            className="w-full"
          />
        </div>

        <RoleSelector
          role={formData.role}
          onRoleChange={(role) => updateField("role", role)}
        />

        <ImageUpload
          image={formData.image}
          uploadingImage={status.uploading}
          onImageUpload={handleImageUpload}
          onUrlChange={(url) => updateField("image", url)}
        />

        <PasswordField
          password={formData.password}
          onPasswordChange={(password) => updateField("password", password)}
          passwordRules={passwordRules}
        />

        <SubmitButton
          loading={status.loading}
          disabled={status.loading || status.uploading || !isPasswordValid}
        />
      </form>
    </div>
  );
}