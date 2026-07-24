import React from "react";
import { Input } from "@heroui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordField({ value, onChange, showPassword, onTogglePassword }) {
  return (
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
          value={value}
          onChange={onChange}
          className="w-full pr-10"
        />
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1"
        >
          {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}