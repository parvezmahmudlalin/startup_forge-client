"use client";

import React from "react";
import { Input } from "@heroui/react";
import { Check } from "@gravity-ui/icons";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function ImageUpload({ image, uploadingImage, onImageUpload, onUrlChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
        Profile Photo
      </label>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <label className="flex-1 w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer hover:border-indigo-500 transition-colors">
          <FaCloudUploadAlt className="h-5 w-5 text-indigo-600" />
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            {uploadingImage ? "Uploading to ImgBB..." : "Upload File"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
            disabled={uploadingImage}
          />
        </label>

        <span className="text-xs text-gray-400">OR</span>

        <Input
          type="url"
          placeholder="Paste Image URL"
          value={image}
          onChange={(e) => onUrlChange(e.target.value)}
          className="flex-1 w-full"
        />
      </div>

      {image && (
        <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600 font-medium">
          <Check className="h-4 w-4" /> Image attached successfully!
        </div>
      )}
    </div>
  );
}