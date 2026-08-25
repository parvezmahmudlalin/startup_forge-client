"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, Button } from "@heroui/react";
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

  // Next.js 15+ কম্প্যাটিবিলিটির জন্য unwrapping params
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

        // 🟢 FIX: ইমেইল দিয়ে না খুঁজে URL-এর নির্দিষ্ট targetStartupId দিয়ে API কল অথবা filtering
        const response = await serverFetch(
          `/api/founder/startup/${targetStartupId}`
        );

        let data = response?.startup || response?.data || response;

        // যদি ব্যাকএন্ড সিঙ্গেল অবজেক্ট না দিয়ে Array ফেরত দেয়, তবে ক্লিক করা ID-র সাথে match করানো হচ্ছে
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

  const handleDelete = async () => {
    if (!startupId) return setError("Startup ID not found.");

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

  if (authLoading || initialLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-sm font-medium text-gray-400">Loading startup details...</div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="p-8 text-center bg-[#111625] border border-gray-800">
          <h2 className="text-xl font-bold text-white">Login Required</h2>
          <p className="mt-2 text-sm text-gray-400">Please login to manage your startup.</p>
          <Button color="primary" className="mt-5" onPress={() => router.push("/login")}>
            Go to Login
          </Button>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0e14] text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Manage / Edit Startup</h1>
            <p className="text-sm text-gray-400">Update your startup profile information</p>
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

        {/* Card Form */}
        <Card className="border border-gray-800 bg-[#121824] p-6 sm:p-8 shadow-xl rounded-2xl">
          <form onSubmit={handleUpdate} className="space-y-6">
            
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400 flex items-center gap-2">
                <span>⚠️</span>
                <p>{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Startup Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Startup Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. NextGen Wave Era"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="w-full h-12 rounded-xl border border-gray-700 bg-[#1a2130] px-4 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Industry *
                </label>
                <input
                  type="text"
                  placeholder="e.g. FinTech, AI, EdTech"
                  value={formData.industry}
                  onChange={(e) => handleChange("industry", e.target.value)}
                  className="w-full h-12 rounded-xl border border-gray-700 bg-[#1a2130] px-4 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Funding Stage */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Funding Stage *
                </label>
                <select
                  value={formData.fundingStage}
                  onChange={(e) => handleChange("fundingStage", e.target.value)}
                  className="w-full h-12 rounded-xl border border-gray-700 bg-[#1a2130] px-4 text-sm text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select Stage</option>
                  {FUNDING_STAGES.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              {/* Founder Email */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Founder Email
                </label>
                <input
                  type="email"
                  value={session?.user?.email || ""}
                  readOnly
                  className="w-full h-12 rounded-xl border border-gray-800 bg-[#151b26] px-4 text-sm text-gray-400 cursor-not-allowed"
                />
              </div>

            </div>

            {/* Startup Logo */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
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
              <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Startup Description *
              </label>
              <textarea
                rows={4}
                placeholder="Tell us about your startup..."
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full rounded-xl border border-gray-700 bg-[#1a2130] p-4 text-sm text-white focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              color="primary"
              size="lg"
              isLoading={updating}
              isDisabled={updating}
              className="w-full font-semibold shadow-lg bg-blue-600 hover:bg-blue-500 text-white rounded-xl h-12"
              startContent={!updating ? <Save size={18} /> : null}
            >
              {updating ? "Saving Changes..." : "Update Startup"}
            </Button>

          </form>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-[#121824] p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Delete Startup</h3>
            <p className="text-sm text-gray-300">
              Are you sure you want to delete <strong className="text-white">{formData.name}</strong>? This action cannot be undone.
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