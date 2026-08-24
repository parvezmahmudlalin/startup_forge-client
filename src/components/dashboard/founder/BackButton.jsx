"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-default-500 transition hover:text-primary"
    >
      <ArrowLeft size={17} /> Back
    </button>
  );
}