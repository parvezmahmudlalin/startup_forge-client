import React from "react";
import { Button } from "@heroui/react";
import { FaGoogle } from "react-icons/fa";

export default function GoogleLoginButton({ onClick, loading }) {
  return (
    <div>
      <Button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="w-full h-11 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center justify-center gap-3 transition-all"
      >
        <FaGoogle className="h-4 w-4 text-red-500" />
        <span className="text-sm">Continue with Google</span>
      </Button>
    </div>
  );
}