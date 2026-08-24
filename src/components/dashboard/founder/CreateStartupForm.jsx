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
    <Card className="border border-default-200 bg-content1 shadow-sm">
      <div className="p-6 sm:p-8">
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <Building2 size={23} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Startup Information
            </h2>
            <p className="mt-1 text-sm text-default-500">
              Tell us about your startup.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-600 dark:border-danger-900 dark:bg-danger-950/30 dark:text-danger-400">
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
              className="h-14 w-full rounded-xl border border-default-200 bg-transparent pl-11 pr-4 text-sm text-foreground outline-none transition hover:border-default-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
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
              className="h-14 w-full rounded-xl border border-default-200 bg-transparent pl-11 pr-4 text-sm text-foreground outline-none transition hover:border-default-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </FormField>

          {/* Funding Stage */}
          <FormField label="Funding Stage" required icon={Layers}>
            <select
              value={formData.fundingStage}
              onChange={(e) => handleChange("fundingStage", e.target.value)}
              className="h-14 w-full appearance-none rounded-xl border border-default-200 bg-background pl-11 pr-10 text-sm text-foreground outline-none transition hover:border-default-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="" disabled>
                Select funding stage
              </option>
              {FUNDING_STAGES.map((stage) => (
                <option key={stage} value={stage}>
                  {stage}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-default-400">
              ▼
            </span>
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
              className="w-full resize-y rounded-xl border border-default-200 bg-transparent px-4 py-3 text-sm leading-6 text-foreground outline-none transition placeholder:text-default-400 hover:border-default-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </FormField>

          {/* Founder Email (Read Only Warnings Fixed) */}
          <FormField
            label="Founder Email"
            icon={Mail}
            note="This email is linked to your founder account."
          >
            <input
              type="email"
              value={session?.user?.email || ""}
              readOnly
              className="h-14 w-full rounded-xl border border-default-200 bg-default-100 pl-11 pr-4 text-sm text-default-500 outline-none dark:bg-default-100/10"
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
              className="w-full font-semibold shadow-lg shadow-primary/20"
            >
              {!loading && <Rocket size={18} />}
              {loading ? "Creating Startup..." : "Create Startup"}
            </Button>
            <p className="mt-3 text-center text-xs text-default-400">
              You can update your startup information later from your dashboard.
            </p>
          </div>
        </form>
      </div>
    </Card>
  );
}