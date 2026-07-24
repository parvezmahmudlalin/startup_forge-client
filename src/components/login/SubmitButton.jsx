import React from "react";
import { Button } from "@heroui/react";

export default function SubmitButton({ loading }) {
  return (
    <Button
      type="submit"
      disabled={loading}
      className="w-full h-11 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all mt-2"
    >
      {loading ? "Signing In..." : "Sign In"}
    </Button>
  );
}