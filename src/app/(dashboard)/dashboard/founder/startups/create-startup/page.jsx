"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";
import { Rocket } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { serverMutation } from "@/lib/api";

export default function CreateStartupForm() {
  const router = useRouter();
  const { data: session, isPending: authLoading } = authClient.useSession();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    startup_name: "",
    industry: "",
    description: "",
    funding_stage: "Pre-seed",
    logo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user?.email) {
      alert("Please login first.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        founder_email: session.user.email,
      };

      // ১. পেমেন্ট প্রয়োজন কি না চেক করা
      const checkRes = await serverMutation(
        "/api/payment/create-checkout-session",
        "POST",
        { email: session.user.email }
      );

      // ২. Limit অতিক্রম করলে ডাটা সেভ করে Stripe-এ রিডাইরেক্ট করা
      if (checkRes?.requiresPayment && checkRes?.checkoutUrl) {
        localStorage.setItem("pendingStartupData", JSON.stringify(payload));
        
        alert("You have reached your free limit. Redirecting to Stripe...");
        window.location.href = checkRes.checkoutUrl;
        return;
      }

      // ৩. Free limit থাকলে সরাসরি API কল
      await serverMutation("/api/founder/startup", "POST", payload);

      alert("Startup created successfully!");
      router.push("/dashboard/founder");
    } catch (error) {
      console.error("Submission error:", error);
      alert(error?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-default-200 bg-background p-6 shadow-sm dark:border-default-100 dark:bg-content1"
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Startup Name <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          name="startup_name"
          required
          value={formData.startup_name}
          onChange={handleChange}
          placeholder="e.g. WaveEra"
          className="w-full rounded-xl border border-default-200 bg-content2 px-4 py-2.5 text-sm text-foreground placeholder:text-default-400 outline-none transition focus:border-primary dark:border-default-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Industry / Category
        </label>
        <input
          type="text"
          name="industry"
          required
          value={formData.industry}
          onChange={handleChange}
          placeholder="e.g. EdTech, FinTech, SaaS"
          className="w-full rounded-xl border border-default-200 bg-content2 px-4 py-2.5 text-sm text-foreground placeholder:text-default-400 outline-none transition focus:border-primary dark:border-default-100"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Funding Stage
        </label>
        <select
          name="funding_stage"
          value={formData.funding_stage}
          onChange={handleChange}
          className="w-full rounded-xl border border-default-200 bg-content2 px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary dark:border-default-100"
        >
          <option value="Idea" className="bg-background text-foreground">Idea</option>
          <option value="Pre-seed" className="bg-background text-foreground">Pre-seed</option>
          <option value="Seed" className="bg-background text-foreground">Seed</option>
          <option value="Series A" className="bg-background text-foreground">Series A</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          required
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your startup idea and goals..."
          className="w-full rounded-xl border border-default-200 bg-content2 p-3 text-sm text-foreground placeholder:text-default-400 outline-none transition focus:border-primary dark:border-default-100"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground shadow-md transition hover:opacity-90 active:scale-[0.99] disabled:opacity-50"
      >
        {loading ? (
          <Spinner size="sm" color="current" />
        ) : (
          <>
            <Rocket size={18} /> Create Startup
          </>
        )}
      </button>
    </form>
  );
}