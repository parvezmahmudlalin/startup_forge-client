"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("redirectTo") || "/";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const updateFormField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCredentialLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErrorMessage("");

    if (!formData.email || !formData.password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email: formData.email,
        password: formData.password,
        callbackURL: redirectTo,
      });

      if (error) {
        if (error.status === 401 || error.status === 400) {
          setErrorMessage("Invalid email or password. Please try again.");
        } else {
          setErrorMessage(error.message || "Failed to sign in. Please try again.");
        }
        setLoading(false);
        return;
      }

      router.push(redirectTo);
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;

    setErrorMessage("");
    setLoading(true);

    try {
      const { data, error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });

      if (error) {
        if (
          error.status === 400 ||
          error.code === "USER_NOT_FOUND" ||
          error.code === "SIGN_UP_DISABLED"
        ) {
          setErrorMessage("No account found with this Google email. Please register first.");
        } else {
          setErrorMessage(error.message || "Failed to sign in with Google.");
        }
        setLoading(false);
      }
    } catch (err) {
      console.error("Google Auth Error:", err);
      setErrorMessage("No account found with this Google email. Please register first.");
      setLoading(false);
    }
  };

  return {
    formData,
    showPassword,
    loading,
    errorMessage,
    updateFormField,
    togglePasswordVisibility,
    handleCredentialLogin,
    handleGoogleLogin,
  };
}