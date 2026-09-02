"use client";

import React from "react";
import { Input } from "@heroui/react";
import PasswordField from "./PasswordField";
import SubmitButton from "./SubmitButton";

export default function LoginForm({
  formData,
  showPassword,
  loading,
  onFieldChange,
  onTogglePassword,
  onSubmit,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
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
          onChange={(e) => onFieldChange("email", e.target.value)}
          className="w-full"
        />
      </div>

      {/* Password Field */}
      <PasswordField
        value={formData.password}
        onChange={(e) => onFieldChange("password", e.target.value)}
        showPassword={showPassword}
        onTogglePassword={onTogglePassword}
      />

      {/* Submit Button */}
      <SubmitButton loading={loading} />
    </form>
  );
}