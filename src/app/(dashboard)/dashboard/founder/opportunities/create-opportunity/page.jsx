"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Spinner } from "@heroui/react";
import {
  Briefcase,
  Code,
  Laptop,
  Clock,
  Calendar,
  Rocket,
  ArrowLeft,
  Building2,
  ChevronDown,
} from "lucide-react";

import FormField from "@/components/dashboard/founder/FormField";
import { serverFetch, serverMutation } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

const WORK_TYPES = ["Remote", "On-site", "Hybrid"];
const COMMITMENT_LEVELS = ["Full-time", "Part-time", "Contract", "Internship"];

const INITIAL_FORM_DATA = {
  startupId: "",
  roleTitle: "",
  requiredSkills: "",
  workType: "Remote",
  commitmentLevel: "Full-time",
  deadline: "",
};

export default function AddOpportunityPage() {
  const router = useRouter();
  const { data: session, isPending: authLoading } = authClient.useSession();

  const [startups, setStartups] = useState([]);
  const [fetchingStartups, setFetchingStartups] = useState(true);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch Founder Startups
  useEffect(() => {
    if (!session?.user?.email) return;

    const fetchStartups = async () => {
      try {
        setFetchingStartups(true);
        const email = encodeURIComponent(session.user.email);
        const data = await serverFetch(`/api/founder/startups?email=${email}`);
        const fetchedStartups = Array.isArray(data) ? data : [];
        setStartups(fetchedStartups);

        if (fetchedStartups.length > 0) {
          setFormData((prev) => ({
            ...prev,
            startupId: fetchedStartups[0]._id,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch startups:", err);
      } finally {
        setFetchingStartups(false);
      }
    };

    fetchStartups();
  }, [session?.user?.email]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!session?.user?.email)
      return "User session not found. Please login again.";
    if (!formData.startupId) return "Please select a startup.";
    if (!formData.roleTitle.trim()) return "Please enter the role title.";
    if (!formData.requiredSkills.trim()) return "Please enter required skills.";
    if (!formData.workType) return "Please select a work type.";
    if (!formData.commitmentLevel) return "Please select a commitment level.";
    if (!formData.deadline) return "Please select a deadline date.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) return setError(validationError);

    setLoading(true);

    try {
      const skillsArray = formData.requiredSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      const payload = {
        startup_id: formData.startupId,
        role_title: formData.roleTitle.trim(),
        required_skills: skillsArray,
        work_type: formData.workType,
        commitment_level: formData.commitmentLevel,
        deadline: formData.deadline,
        founder_email: session.user.email,
      };

      await serverMutation("/api/founder/opportunities", "POST", payload);

      router.push("/dashboard/founder/opportunities");
      router.refresh();
    } catch (err) {
      console.error("Add opportunity error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to add opportunity."
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || fetchingStartups) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-transparent">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!session?.user?.email) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-transparent">
        <p className="text-slate-700 dark:text-slate-300">Please login first.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          <ArrowLeft size={17} /> Back
        </button>

        <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-semibold text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                <Briefcase size={23} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Add New Opportunity
                </h2>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  Post a new role for your startup team.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                  <span>⚠️</span>
                  <p>{error}</p>
                </div>
              )}

              {/* Startup Selector */}
              <FormField label="Select Startup" required icon={Building2}>
                <div className="relative w-full">
                  <select
                    value={formData.startupId}
                    onChange={(e) => handleChange("startupId", e.target.value)}
                    className="h-14 w-full appearance-none rounded-xl border border-slate-300 bg-slate-50 pl-11 pr-10 text-sm font-medium text-slate-900 outline-none transition hover:border-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700 dark:focus:border-blue-500"
                  >
                    {startups.length === 0 ? (
                      <option value="" disabled className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white">
                        No startup found. Please create a startup first.
                      </option>
                    ) : (
                      startups.map((s) => (
                        <option
                          key={s._id}
                          value={s._id}
                          className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                        >
                          {s.startup_name || s.name}
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                </div>
              </FormField>

              {/* Role Title */}
              <FormField label="Role Title" required icon={Briefcase}>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Developer"
                  value={formData.roleTitle}
                  onChange={(e) => handleChange("roleTitle", e.target.value)}
                  className="h-14 w-full rounded-xl border border-slate-300 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-blue-500"
                />
              </FormField>

              {/* Required Skills */}
              <FormField
                label="Required Skills"
                required
                icon={Code}
                note="Separate skills with commas (e.g. React, Next.js, Tailwind CSS)"
              >
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, TypeScript"
                  value={formData.requiredSkills}
                  onChange={(e) =>
                    handleChange("requiredSkills", e.target.value)
                  }
                  className="h-14 w-full rounded-xl border border-slate-300 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500 dark:hover:border-slate-700 dark:focus:border-blue-500"
                />
              </FormField>

              {/* Work Type & Commitment Level */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Work Type */}
                <FormField label="Work Type" required icon={Laptop}>
                  <div className="relative w-full">
                    <select
                      value={formData.workType}
                      onChange={(e) => handleChange("workType", e.target.value)}
                      className="h-14 w-full appearance-none rounded-xl border border-slate-300 bg-slate-50 pl-11 pr-10 text-sm font-medium text-slate-900 outline-none transition hover:border-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700 dark:focus:border-blue-500"
                    >
                      {WORK_TYPES.map((type) => (
                        <option
                          key={type}
                          value={type}
                          className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                        >
                          {type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                  </div>
                </FormField>

                {/* Commitment Level */}
                <FormField label="Commitment Level" required icon={Clock}>
                  <div className="relative w-full">
                    <select
                      value={formData.commitmentLevel}
                      onChange={(e) =>
                        handleChange("commitmentLevel", e.target.value)
                      }
                      className="h-14 w-full appearance-none rounded-xl border border-slate-300 bg-slate-50 pl-11 pr-10 text-sm font-medium text-slate-900 outline-none transition hover:border-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:border-slate-700 dark:focus:border-blue-500"
                    >
                      {COMMITMENT_LEVELS.map((level) => (
                        <option
                          key={level}
                          value={level}
                          className="bg-white text-slate-900 dark:bg-slate-900 dark:text-white"
                        >
                          {level}
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                  </div>
                </FormField>
              </div>

              {/* Deadline */}
              <FormField label="Application Deadline" required icon={Calendar}>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleChange("deadline", e.target.value)}
                  className="h-14 w-full rounded-xl border border-slate-300 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-900 outline-none transition hover:border-slate-400 focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-600/20 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:scheme-dark dark:hover:border-slate-700 dark:focus:border-blue-500"
                />
              </FormField>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  color="primary"
                  size="lg"
                  isLoading={loading}
                  isDisabled={loading || !session?.user?.email || startups.length === 0}
                  className="flex w-full items-center justify-center gap-2 font-semibold text-white shadow-lg shadow-blue-500/20"
                >
                  {!loading && <Rocket size={18} />}
                  {loading ? "Posting Opportunity..." : "Post Opportunity"}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </main>
  );
}