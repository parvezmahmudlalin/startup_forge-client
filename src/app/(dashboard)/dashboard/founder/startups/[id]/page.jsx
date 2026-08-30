"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Spinner } from "@heroui/react";
import { Save, Trash2 } from "lucide-react";

import LogoUploader from "@/components/dashboard/founder/LogoUploader";
import { serverFetch, serverMutation, imageUploader } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

const FUNDING_STAGES = [
  "Bootstrapped",
  "Idea / Pre-Seed",
  "Seed",
  "Series A",
  "Series B+",
];

export default function ManageStartupPage({ params }) {
  const router = useRouter();
  const { data: session, isPending: authLoading } = authClient.useSession();

  // Next.js 15+ unwrapping params
  const resolvedParams = params ? use(params) : null;
  const targetStartupId = resolvedParams?.id;

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

  useEffect(() => {
    const fetchStartup = async () => {
      if (!session?.user?.email) {
        if (!authLoading) setInitialLoading(false);
        return;
      }

      if (!targetStartupId) {
        setError("Invalid Startup ID.");
        setInitialLoading(false);
        return;
      }

      try {
        setInitialLoading(true);
        setError("");

        const response = await serverFetch(
          `/api/founder/startup/${targetStartupId}`
        );

        if (response?.error) {
          setError(response.message || "Failed to load startup details.");
          return;
        }

        let data = response?.startup || response?.data || response;

        if (Array.isArray(data)) {
          data = data.find(
            (item) => item._id === targetStartupId || item.id === targetStartupId
          );
        }

        const foundId = data?._id || data?.id;

        if (!foundId) {
          setError("Startup profile not found.");
          return;
        }

        setStartupId(foundId);
        setFormData({
          name: data.startup_name || data.name || "",
          industry: data.industry || "",
          description: data.description || "",
          fundingStage: data.funding_stage || data.fundingStage || "",
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
  }, [session, authLoading, targetStartupId]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    if (!startupId) return setError("Startup ID not found. Please reload.");
    if (!session?.user?.email) return setError("You must be logged in.");
    if (!formData.name.trim()) return setError("Startup name is required.");
    if (!formData.industry.trim()) return setError("Industry is required.");
    if (!formData.description.trim()) return setError("Startup description is required.");
    if (!formData.fundingStage) return setError("Please select a funding stage.");

    try {
      setUpdating(true);
      let logoUrl = existingLogoUrl;

      if (logoFile) {
        const uploadRes = await imageUploader(logoFile);
        logoUrl = uploadRes?.url || uploadRes?.secure_url || uploadRes || existingLogoUrl;
      }

      const payload = {
        startup_name: formData.name.trim(),
        industry: formData.industry.trim(),
        description: formData.description.trim(),
        funding_stage: formData.fundingStage,
        logo: logoUrl,
        founder_email: session.user.email,
      };

      const res = await serverMutation(`/api/founder/startup/${startupId}`, "PUT", payload);

      if (res?.error) {
        setError(res.message || "Failed to update startup.");
        return;
      }

      router.push("/dashboard/founder/startups");
      router.refresh();
    } catch (err) {
      console.error("Update startup error:", err);
      setError(err?.message || "Failed to update startup.");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!startupId) return setError("Startup ID not found.");

    try {
      setDeleting(true);
      setError("");

      const res = await serverMutation(`/api/founder/startup/${startupId}`, "DELETE");

      if (res?.error) {
        setError(res.message || "Failed to delete startup.");
        return;
      }

      setShowDeleteModal(false);
      router.push("/dashboard/founder/startups");
      router.refresh();
    } catch (err) {
      console.error("Delete startup error:", err);
      setError(err?.message || "Failed to delete startup.");
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading || initialLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="p-8 text-center border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-lg">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Login Required</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Please login to manage your startup.</p>
          <Button color="primary" className="mt-5" onPress={() => router.push("/login")}>
            Go to Login
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Manage / Edit Startup</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Update your startup profile information</p>
          </div>
          
          <Button
            color="danger"
            variant="flat"
            onPress={() => setShowDeleteModal(true)}
            startContent={<Trash2 size={16} />}
            className="w-fit"
          >
            Delete Startup
          </Button>
        </div>

        {/* Form Card */}
        <Card className="border border-slate-200 bg-white p-6 sm:p-8 shadow-sm rounded-2xl dark:border-slate-800 dark:bg-slate-900">
          <form onSubmit={handleUpdate} className="space-y-6">
            
            {error && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <span>⚠️</span>
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Startup Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Startup Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. NextGen Wave Era"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                />
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Industry *
                </label>
                <input
                  type="text"
                  placeholder="e.g. FinTech, AI, EdTech"
                  value={formData.industry}
                  onChange={(e) => handleChange("industry", e.target.value)}
                  className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                />
              </div>

              {/* Funding Stage */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Funding Stage *
                </label>
                <select
                  value={formData.fundingStage}
                  onChange={(e) => handleChange("fundingStage", e.target.value)}
                  className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
                >
                  <option value="">Select Stage</option>
                  {FUNDING_STAGES.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              {/* Founder Email */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Founder Email
                </label>
                <input
                  type="email"
                  value={session?.user?.email || ""}
                  readOnly
                  className="w-full h-12 rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500 cursor-not-allowed dark:border-slate-800 dark:bg-slate-800/30 dark:text-slate-400"
                />
              </div>

            </div>

            {/* Startup Logo */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Startup Logo
              </label>
              <LogoUploader
                logoPreview={logoPreview}
                logoFile={logoFile}
                onLogoChange={handleLogoChange}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Startup Description *
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about your startup..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 focus:border-blue-500 focus:outline-none resize-none dark:border-slate-800 dark:bg-slate-800/50 dark:text-white"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={updating}
              isDisabled={updating}
              className="w-full font-semibold shadow-md bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 dark:bg-blue-500 dark:hover:bg-blue-600"
              startContent={!updating ? <Save size={18} /> : null}
            >
              {updating ? "Saving Changes..." : "Update Startup"}
            </Button>

          </form>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Startup</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{formData.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="flat" onPress={() => setShowDeleteModal(false)} isDisabled={deleting}>
                Cancel
              </Button>
              <Button color="danger" onPress={handleDelete} isLoading={deleting}>
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}