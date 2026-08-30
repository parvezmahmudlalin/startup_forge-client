"use client";

import { Upload, CheckCircle2 } from "lucide-react";

export default function LogoUploader({ logoPreview, logoFile, onLogoChange }) {
  return (
    <div>
      <label htmlFor="startup-logo" className="mb-2 block text-sm font-medium text-slate-800 dark:text-slate-200">
        Startup Logo <span className="ml-1 text-rose-500">*</span>
      </label>

      <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 transition hover:border-blue-500/50 dark:hover:border-blue-500/50">
        <input
          id="startup-logo"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={onLogoChange}
          className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
        />

        <div className="flex min-h-48 flex-col items-center justify-center p-6 text-center">
          {logoPreview ? (
            <>
              <div className="relative mb-4">
                <div className="h-24 w-24 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md">
                  <img src={logoPreview} alt="Startup logo preview" className="h-full w-full object-cover" />
                </div>
                <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <p className="max-w-xs truncate text-sm font-semibold text-slate-900 dark:text-white">{logoFile?.name}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Click to choose another image</p>
            </>
          ) : (
            <>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900">
                <Upload size={25} className="text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Upload your startup logo</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">PNG, JPG or WEBP · Maximum 5MB</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}