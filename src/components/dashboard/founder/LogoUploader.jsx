"use client";

import { Upload, CheckCircle2 } from "lucide-react";

export default function LogoUploader({ logoPreview, logoFile, onLogoChange }) {
  return (
    <div>
      <label htmlFor="startup-logo" className="mb-2 block text-sm font-medium text-foreground">
        Startup Logo <span className="ml-1 text-danger">*</span>
      </label>

      <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-default-200 bg-default-50 transition hover:border-primary/50 dark:bg-default-50/10">
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
                <div className="h-24 w-24 overflow-hidden rounded-2xl border border-default-200 bg-background shadow-md">
                  <img src={logoPreview} alt="Startup logo preview" className="h-full w-full object-cover" />
                </div>
                <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-success text-white shadow">
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <p className="max-w-xs truncate text-sm font-semibold text-foreground">{logoFile?.name}</p>
              <p className="mt-1 text-xs text-default-400">Click to choose another image</p>
            </>
          ) : (
            <>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Upload size={25} className="text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">Upload your startup logo</p>
              <p className="mt-1 text-xs text-default-400">PNG, JPG or WEBP · Maximum 5MB</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}