"use client";

import React from "react";
import { FaUserAlt, FaUserAstronaut } from "react-icons/fa";

export default function RoleSelector({ role, onRoleChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
        Select Your Account Role
      </label>

      <div className="grid grid-cols-2 gap-4">
        {/* Founder Role Option */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Founder Role: Post ideas and hire team"
          aria-pressed={role === "Founder"}
          onClick={() => onRoleChange("Founder")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onRoleChange("Founder");
            }
          }}
          className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center select-none ${
            role === "Founder"
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
          role="button"
          tabIndex={0}
          aria-label="Collaborator Role: Explore and join projects"
          aria-pressed={role === "Collaborator"}
          onClick={() => onRoleChange("Collaborator")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onRoleChange("Collaborator");
            }
          }}
          className={`cursor-pointer p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 text-center select-none ${
            role === "Collaborator"
              ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
              : "border-gray-100 dark:border-gray-800 hover:border-gray-200 text-gray-600 dark:text-gray-400"
          }`}
        >
          <FaUserAlt className="h-6 w-6" />
          <span className="font-bold text-sm">Collaborator</span>
          <span className="text-[11px] text-gray-400 leading-tight">Explore & join projects</span>
        </div>
      </div>
    </div>
  );
}