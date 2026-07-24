"use client";

import React, { useState } from "react";
import { Input } from "@heroui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import PasswordRules from "./PasswordRules";

export default function PasswordField({ password, onPasswordChange, passwordRules }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
        Password
      </label>
      <div className="relative">
        <Input
          required
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
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

      <PasswordRules passwordRules={passwordRules} />
    </div>
  );
}