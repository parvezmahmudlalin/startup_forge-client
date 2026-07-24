"use client";

import React from "react";
import { Button } from "@heroui/react";

export default function SubmitButton({ loading, disabled }) {
  return (
    <Button
      type="submit"
      disabled={disabled}
      className="w-full h-12 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
    >
      {loading ? "Creating Account..." : "Create Account"}
    </Button>
  );
}