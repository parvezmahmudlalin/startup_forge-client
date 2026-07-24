"use client";

import React from "react";
import { Check, XmarkShape } from "@gravity-ui/icons";

export default function PasswordRules({ passwordRules }) {
  return (
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
  );
}