"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Card, Button } from "@heroui/react";

import {
  Building2,
  Sparkles,
  Layers,
  Mail,
  Save,
  Trash2,
  ArrowLeft,
  X,
} from "lucide-react";

import LogoUploader from "@/components/dashboard/founder/LogoUploader";
import FormField from "@/components/dashboard/founder/FormField";

import { serverFetch, serverMutation, imageUploader } from "@/lib/api";

import { authClient } from "@/lib/auth-client";

const FUNDING_STAGES = [
  "Bootstrapped",
  "Idea / Pre-Seed",
  "Seed",
  "Series A",
  "Series B+",
];

export default function ManageStartupPage() {
  const router = useRouter();

  const { data: session, isPending: authLoading } = authClient.useSession();

  const [startupId, setStartupId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    description: "",
    fundingStage: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [existingLogoUrl, setExistingLogoUrl] = useState("");

  const [initialLoading, setInitialLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // =====================================================
  // FETCH STARTUP
  // =====================================================

  useEffect(() => {
    const fetchStartup = async () => {
      if (!session?.user?.email) {
        if (!authLoading) {
          setInitialLoading(false);
        }

        return;
      }

      try {
        setInitialLoading(true);
        setError("");

        const data = await serverFetch(
          `/api/founder/startup?email=${encodeURIComponent(
            session.user.email,
          )}`,
        );

        if (!data?._id) {
          setError("Startup profile not found.");
          return;
        }

        setStartupId(data._id);

        setFormData({
          name: data.startup_name || "",
          industry: data.industry || "",
          description: data.description || "",
          fundingStage: data.funding_stage || "",
        });

        setExistingLogoUrl(data.logo || "");
        setLogoPreview(data.logo || "");
      } catch (err) {
        console.error("Failed to load startup:", err);

        setError(err?.message || "Failed to load startup details.");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchStartup();
  }, [session, authLoading]);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =====================================================
  // HANDLE LOGO
  // =====================================================

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Logo image must be less than 5MB.");
      return;
    }

    setLogoFile(file);

    const previewUrl = URL.createObjectURL(file);

    setLogoPreview(previewUrl);
  };

  // =====================================================
  // UPDATE STARTUP
  // =====================================================

  const handleUpdate = async (e) => {
    e.preventDefault();

    setError("");

    if (!startupId) {
      setError("Startup ID not found.");
      return;
    }

    if (!session?.user?.email) {
      setError("You must be logged in.");
      return;
    }

    if (!formData.name.trim()) {
      setError("Startup name is required.");
      return;
    }

    if (!formData.industry.trim()) {
      setError("Industry is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Startup description is required.");
      return;
    }

    if (!formData.fundingStage) {
      setError("Please select a funding stage.");
      return;
    }

    try {
      setUpdating(true);

      // Keep existing logo
      let logoUrl = existingLogoUrl;

      // Upload new logo only if selected
      if (logoFile) {
        logoUrl = await imageUploader(logoFile);
      }

      const payload = {
        startup_name: formData.name.trim(),
        industry: formData.industry.trim(),
        description: formData.description.trim(),
        funding_stage: formData.fundingStage,
        logo: logoUrl,
        founder_email: session.user.email,
      };

      await serverMutation(`/api/founder/startup/${startupId}`, "PUT", payload);

      router.push("/dashboard/founder/startups");

      router.refresh();
    } catch (err) {
      console.error("Update startup error:", err);

      setError(err?.message || "Failed to update startup.");
    } finally {
      setUpdating(false);
    }
  };

  // =====================================================
  // DELETE STARTUP
  // =====================================================

  const handleDelete = async () => {
    if (!startupId) {
      setError("Startup ID not found.");
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await serverMutation(`/api/founder/startup/${startupId}`, "DELETE");

      setShowDeleteModal(false);

      router.push("/dashboard/founder/startups");

      router.refresh();
    } catch (err) {
      console.error("Delete startup error:", err);

      setError(err?.message || "Failed to delete startup.");

      setDeleting(false);
    }
  };

  // =====================================================
  // AUTH LOADING
  // =====================================================

  if (authLoading || initialLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm font-medium text-default-500">
          Loading startup details...
        </div>
      </div>
    );
  }

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!session?.user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold">Login Required</h2>

          <p className="mt-2 text-sm text-default-500">
            Please login to manage your startup.
          </p>

          <Button
            color="primary"
            className="mt-5"
            onPress={() => router.push("/login")}
          >
            Go to Login
          </Button>
        </Card>
      </main>
    );
  }

  // =====================================================
  // MAIN UI
  // =====================================================

  return (
    <>
      <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Back */}
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-default-500 transition hover:text-primary"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          {/* Card */}
          <Card className="border border-default-200 bg-content1 shadow-sm">
            <div className="p-6 sm:p-8">
              {/* Header */}
              <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Building2 size={23} className="text-primary" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      Manage Startup Profile
                    </h2>

                    <p className="mt-1 text-sm text-default-500">
                      Update or remove your startup details.
                    </p>
                  </div>
                </div>

                {/* Delete Button */}
                <Button
                  color="danger"
                  variant="flat"
                  onPress={() => setShowDeleteModal(true)}
                  className="font-medium"
                  startContent={<Trash2 size={16} />}
                >
                  Delete Startup
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleUpdate} className="space-y-6">
                {/* Error */}
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

                {/* Logo */}
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
                  <div className="relative">
                    <select
                      value={formData.fundingStage}
                      onChange={(e) =>
                        handleChange("fundingStage", e.target.value)
                      }
                      required
                      className="h-14 w-full appearance-none rounded-xl border border-default-200 bg-background pl-11 pr-10 text-sm text-foreground outline-none transition hover:border-default-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select funding stage</option>

                      {FUNDING_STAGES.map((stage) => (
                        <option key={stage} value={stage}>
                          {stage}
                        </option>
                      ))}
                    </select>

                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-default-400">
                      ▼
                    </span>
                  </div>
                </FormField>

                {/* Description */}
                <FormField label="Startup Description" required>
                  <textarea
                    rows={6}
                    placeholder="Tell us about your startup..."
                    value={formData.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    required
                    className="w-full resize-y rounded-xl border border-default-200 bg-transparent px-4 py-3 text-sm leading-6 text-foreground outline-none transition hover:border-default-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </FormField>

                {/* Founder Email */}
                <FormField label="Founder Email" icon={Mail}>
                  <input
                    type="email"
                    value={session?.user?.email || ""}
                    readOnly
                    className="h-14 w-full rounded-xl border border-default-200 bg-default-100 pl-11 pr-4 text-sm text-default-500 outline-none dark:bg-default-100/10"
                  />
                </FormField>

                {/* Update */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    color="primary"
                    size="lg"
                    isLoading={updating}
                    isDisabled={updating}
                    className="w-full font-semibold shadow-lg shadow-primary/20"
                    startContent={!updating ? <Save size={18} /> : null}
                  >
                    {updating ? "Saving Changes..." : "Update Startup"}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </main>

      {/* =================================================
          DELETE CONFIRMATION MODAL
          Native Tailwind modal
      ================================================= */}
      {showDeleteModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deleting) {
              setShowDeleteModal(false);
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl border border-default-200 bg-background p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-danger-100 text-danger-600 dark:bg-danger-950">
                  <Trash2 size={19} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    Delete Startup
                  </h3>

                  <p className="text-xs text-default-500">Permanent action</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="rounded-lg p-2 text-default-500 transition hover:bg-default-100 hover:text-foreground disabled:opacity-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-6">
              <p className="text-sm leading-6 text-default-600">
                Are you sure you want to delete{" "}
                <strong className="text-foreground">{formData.name}</strong>?
              </p>

              <p className="mt-2 text-sm text-danger-500">
                This action is permanent and cannot be undone.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="mt-7 flex justify-end gap-3">
              <Button
                variant="flat"
                onPress={() => setShowDeleteModal(false)}
                isDisabled={deleting}
              >
                Cancel
              </Button>

              <Button
                color="danger"
                onPress={handleDelete}
                isLoading={deleting}
                startContent={!deleting ? <Trash2 size={16} /> : null}
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
