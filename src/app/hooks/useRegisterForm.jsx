import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { imageUploader } from "@/lib/imageUploader";

export function useRegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    image: "",
    password: "",
    role: "Collaborator",
  });

  const [status, setStatus] = useState({ loading: false, uploading: false, error: "" });

  const passwordRules = {
    hasMinLength: formData.password.length >= 6,
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const updateField = (key, value) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus((prev) => ({ ...prev, uploading: true, error: "" }));

    try {
      const imageUrl = await imageUploader(file);
      if (imageUrl) updateField("image", imageUrl);
    } catch (err) {
      setStatus((prev) => ({ ...prev, error: err.message || "Image upload failed." }));
    } finally {
      setStatus((prev) => ({ ...prev, uploading: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus((prev) => ({ ...prev, error: "" }));

    if (!isPasswordValid) return setStatus((prev) => ({ ...prev, error: "Password requirement not met." }));
    if (!formData.image) return setStatus((prev) => ({ ...prev, error: "Profile image is required." }));

    setStatus((prev) => ({ ...prev, loading: true }));

    try {
      const { error } = await authClient.signUp.email(formData);

      if (error) {
        setStatus((prev) => ({ ...prev, error: error.message || "Registration failed.", loading: false }));
        return;
      }

      router.push("/login");
    } catch (err) {
      setStatus((prev) => ({ ...prev, error: err.message || "Something went wrong.", loading: false }));
    }
  };

  return {
    formData,
    status,
    passwordRules,
    isPasswordValid,
    updateField,
    handleImageUpload,
    handleSubmit,
  };
}