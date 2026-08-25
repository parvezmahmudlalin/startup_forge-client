"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button } from "@heroui/react";
import { Briefcase, Code, Laptop, Clock, Calendar, Rocket, ArrowLeft } from "lucide-react";

import FormField from "@/components/dashboard/founder/FormField";
import { serverMutation } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

const WORK_TYPES = ["Remote", "On-site", "Hybrid"];
const COMMITMENT_LEVELS = ["Full-time", "Part-time", "Contract", "Internship"];

const INITIAL_FORM_DATA = {
  roleTitle: "",
  requiredSkills: "",
  workType: "Remote",
  commitmentLevel: "Full-time",
  deadline: "",
};

export default function AddOpportunityPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!session?.user?.email) return "User session not found. Please login again.";
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
      setError(err instanceof Error ? err.message : "Failed to add opportunity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-default-500 transition hover:text-primary"
        >
          <ArrowLeft size={17} /> Back
        </button>

        <Card className="border border-default-200 bg-content1 shadow-sm">
          <div className="p-6 sm:p-8">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Briefcase size={23} className="text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Add New Opportunity</h2>
                <p className="mt-1 text-sm text-default-500">Post a new role for your startup team.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-start gap-3 rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-600 dark:border-danger-900 dark:bg-danger-950/30 dark:text-danger-400">
                  <span>⚠️</span>
                  <p>{error}</p>
                </div>
              )}

              {/* Role Title */}
              <FormField label="Role Title" required icon={Briefcase}>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Developer"
                  value={formData.roleTitle}
                  onChange={(e) => handleChange("roleTitle", e.target.value)}
                  className="h-14 w-full rounded-xl border border-default-200 bg-transparent pl-11 pr-4 text-sm text-foreground outline-none transition hover:border-default-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                  onChange={(e) => handleChange("requiredSkills", e.target.value)}
                  className="h-14 w-full rounded-xl border border-default-200 bg-transparent pl-11 pr-4 text-sm text-foreground outline-none transition hover:border-default-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </FormField>

              {/* Work Type & Commitment Level (2 Columns Layout) */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Work Type */}
                <FormField label="Work Type" required icon={Laptop}>
                  <select
                    value={formData.workType}
                    onChange={(e) => handleChange("workType", e.target.value)}
                    className="h-14 w-full appearance-none rounded-xl border border-default-200 bg-background pl-11 pr-10 text-sm text-foreground outline-none transition hover:border-default-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {WORK_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-default-400">
                    ▼
                  </span>
                </FormField>

                {/* Commitment Level */}
                <FormField label="Commitment Level" required icon={Clock}>
                  <select
                    value={formData.commitmentLevel}
                    onChange={(e) => handleChange("commitmentLevel", e.target.value)}
                    className="h-14 w-full appearance-none rounded-xl border border-default-200 bg-background pl-11 pr-10 text-sm text-foreground outline-none transition hover:border-default-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {COMMITMENT_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-default-400">
                    ▼
                  </span>
                </FormField>
              </div>

              {/* Deadline */}
              <FormField label="Application Deadline" required icon={Calendar}>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleChange("deadline", e.target.value)}
                  className="h-14 w-full rounded-xl border border-default-200 bg-transparent pl-11 pr-4 text-sm text-foreground outline-none transition hover:border-default-400 focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                  className="flex w-full items-center gap-2 font-semibold shadow-lg shadow-primary/20"
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