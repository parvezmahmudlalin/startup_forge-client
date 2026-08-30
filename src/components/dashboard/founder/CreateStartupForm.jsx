"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button } from "@heroui/react";
import { Rocket, Mail, Building2, Sparkles, Layers } from "lucide-react";

import LogoUploader from "@/components/dashboard/founder/LogoUploader";
import FormField from "@/components/dashboard/founder/FormField";
import { imageUploader, serverMutation } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

const FUNDING_STAGES = [
  "Bootstrapped",
  "Idea / Pre-Seed",
  "Seed",
  "Series A",
  "Series B+",
];

const INITIAL_FORM_DATA = {
  name: "",
  industry: "",
  description: "",
  fundingStage: "",
};

export default function CreateStartupForm() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
    };
  }, [logoPreview]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    if (!file.type.startsWith("image/"))
      return setError("Please select a valid image file.");
    if (file.size > 5 * 1024 * 1024)
      return setError("Logo image must be less than 5MB.");

    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    if (!session?.user?.email)
      return "User session not found. Please login again.";
    if (!logoFile) return "Please upload your startup logo.";
    if (!formData.name.trim()) return "Please enter your startup name.";
    if (!formData.industry.trim()) return "Please enter your startup industry.";
    if (!formData.fundingStage) return "Please select a funding stage.";
    if (!formData.description.trim())
      return "Please enter your startup description.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) return setError(validationError);

    setLoading(true);

    try {
      const logoUrl = await imageUploader(logoFile);
      if (!logoUrl) throw new Error("Failed to upload startup logo.");

      const payload = {
        startup_name: formData.name.trim(),
        industry: formData.industry.trim(),
        description: formData.description.trim(),
        funding_stage: formData.fundingStage,
        logo: logoUrl,
        founder_email: session.user.email,
      };

      await serverMutation("/api/founder/startup", "POST", payload);

      router.push("/dashboard/founder/startups");
      router.refresh();
    } catch (err) {
      console.error("Create startup error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-colors duration-200">
      <div className="p-6 sm:p-8">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900">
            <Building2 size={23} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Startup Information
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Tell us about your startup.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400">
              <span>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          {/* Startup Name */}
          <FormField label="Startup Name" required icon={Building2}>
            <input
              type="text"
              placeholder="e.g. Acme Technologies"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="h-14 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition hover:border-slate-400 dark:hover:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </FormField>

          {/* Logo Upload */}
          <LogoUploader
            logoPreview={logoPreview}
            logoFile={logoFile}
            onLogoChange={handleLogoChange}
          />

          {/* Industry */}
          <FormField label="Industry" required icon={Sparkles}>
            <input
              type="text"
              placeholder="e.g. FinTech, EdTech, AI"
              value={formData.industry}
              onChange={(e) => handleChange("industry", e.target.value)}
              className="h-14 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-11 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition hover:border-slate-400 dark:hover:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </FormField>

          {/* Funding Stage */}
          <FormField label="Funding Stage" required icon={Layers}>
            <div className="relative">
              <select
                value={formData.fundingStage}
                onChange={(e) => handleChange("fundingStage", e.target.value)}
                className="h-14 w-full appearance-none rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 pl-11 pr-10 text-sm text-slate-900 dark:text-white outline-none transition hover:border-slate-400 dark:hover:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
              >
                <option value="" disabled className="bg-white dark:bg-slate-900 text-slate-500">
                  Select funding stage
                </option>
                {FUNDING_STAGES.map((stage) => (
                  <option key={stage} value={stage} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {stage}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 dark:text-slate-500">
                ▼
              </span>
            </div>
          </FormField>

          {/* Description */}
          <FormField
            label="Startup Description"
            required
            note="Give potential team members a clear idea about your startup."
          >
            <textarea
              rows={6}
              placeholder="Tell us about your startup, the problem you're solving..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full resize-y rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm leading-6 text-slate-900 dark:text-white outline-none transition placeholder:text-slate-400 dark:placeholder:text-slate-500 hover:border-slate-400 dark:hover:border-slate-700 focus:border-blue-600 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </FormField>

          {/* Founder Email */}
          <FormField
            label="Founder Email"
            icon={Mail}
            note="This email is linked to your founder account."
          >
            <input
              type="email"
              value={session?.user?.email || ""}
              readOnly
              className="h-14 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/50 pl-11 pr-4 text-sm text-slate-500 dark:text-slate-400 outline-none cursor-not-allowed"
            />
          </FormField>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={loading}
              isDisabled={loading || !session?.user?.email}
              className="w-full font-semibold shadow-lg shadow-blue-500/20 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white"
            >
              {!loading && <Rocket size={18} />}
              {loading ? "Creating Startup..." : "Create Startup"}
            </Button>
            <p className="mt-3 text-center text-xs text-slate-500 dark:text-slate-400">
              You can update your startup information later from your dashboard.
            </p>
          </div>
        </form>
      </div>
    </Card>
  );
}