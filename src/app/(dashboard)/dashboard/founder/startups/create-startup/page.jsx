"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@heroui/react";
import { Rocket } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { serverMutation } from "@/lib/api";

export default function CreateStartupForm() {
  const router = useRouter();

  const {
    data: session,
    isPending: authLoading,
  } = authClient.useSession();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    startup_name: "",
    industry: "",
    description: "",
    funding_stage: "Pre-seed",
    logo: "",
  });

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ---------------------------------------------------
    // CHECK LOGIN
    // ---------------------------------------------------

    if (!session?.user?.email) {
      alert("Please login first.");
      return;
    }

    // ---------------------------------------------------
    // VALIDATE REQUIRED FIELDS
    // ---------------------------------------------------

    if (
      !formData.startup_name.trim() ||
      !formData.industry.trim() ||
      !formData.description.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      // =================================================
      // COMPLETE STARTUP DATA
      // =================================================

      const payload = {
        startup_name: formData.startup_name.trim(),
        industry: formData.industry.trim(),
        description: formData.description.trim(),
        funding_stage: formData.funding_stage,
        logo: formData.logo.trim(),
        founder_email: session.user.email.trim(),
      };

      console.log("Startup payload:", payload);

      // =================================================
      // CHECK FREE LIMIT / PAYMENT
      // =================================================

      const checkRes = await serverMutation(
        "/api/payment/create-checkout-session",
        "POST",
        {
          email: session.user.email,
          startupData: payload,
        }
      );

      console.log("Payment check response:", checkRes);

      // =================================================
      // PAYMENT REQUIRED
      // =================================================

      if (
        checkRes?.requiresPayment &&
        checkRes?.checkoutUrl
      ) {
        alert(
          "You have reached your 3 free startup limit. Redirecting to Stripe..."
        );

        // Stripe checkout
        window.location.href = checkRes.checkoutUrl;

        return;
      }

      // =================================================
      // FREE LIMIT AVAILABLE
      // =================================================

      if (checkRes?.requiresPayment === false) {
        const result = await serverMutation(
          "/api/founder/startup",
          "POST",
          payload
        );

        if (!result?.success) {
          throw new Error(
            result?.message ||
              "Failed to create startup."
          );
        }

        alert("Startup created successfully!");

        router.push("/dashboard/founder/startups");

        return;
      }

      // =================================================
      // UNEXPECTED RESPONSE
      // =================================================

      throw new Error(
        "Unable to determine payment status."
      );
    } catch (error) {
      console.error(
        "❌ Submission error:",
        error
      );

      alert(
        error?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // AUTH LOADING
  // =====================================================

  if (authLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // =====================================================
  // FORM
  // =====================================================

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-default-200 bg-background p-6 shadow-sm dark:border-default-100 dark:bg-content1"
    >
      {/* =================================================
          STARTUP NAME
      ================================================= */}

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Startup Name{" "}
          <span className="text-danger">*</span>
        </label>

        <input
          type="text"
          name="startup_name"
          required
          value={formData.startup_name}
          onChange={handleChange}
          placeholder="e.g. WaveEra"
          disabled={loading}
          className="w-full rounded-xl border border-default-200 bg-content2 px-4 py-2.5 text-sm text-foreground placeholder:text-default-400 outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60 dark:border-default-100"
        />
      </div>

      {/* =================================================
          INDUSTRY
      ================================================= */}

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Industry / Category{" "}
          <span className="text-danger">*</span>
        </label>

        <input
          type="text"
          name="industry"
          required
          value={formData.industry}
          onChange={handleChange}
          placeholder="e.g. EdTech, FinTech, SaaS"
          disabled={loading}
          className="w-full rounded-xl border border-default-200 bg-content2 px-4 py-2.5 text-sm text-foreground placeholder:text-default-400 outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60 dark:border-default-100"
        />
      </div>

      {/* =================================================
          FUNDING STAGE
      ================================================= */}

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Funding Stage
        </label>

        <select
          name="funding_stage"
          value={formData.funding_stage}
          onChange={handleChange}
          disabled={loading}
          className="w-full rounded-xl border border-default-200 bg-content2 px-4 py-2.5 text-sm text-foreground outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60 dark:border-default-100"
        >
          <option
            value="Idea"
            className="bg-background text-foreground"
          >
            Idea
          </option>

          <option
            value="Pre-seed"
            className="bg-background text-foreground"
          >
            Pre-seed
          </option>

          <option
            value="Seed"
            className="bg-background text-foreground"
          >
            Seed
          </option>

          <option
            value="Series A"
            className="bg-background text-foreground"
          >
            Series A
          </option>
        </select>
      </div>

      {/* =================================================
          DESCRIPTION
      ================================================= */}

      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Description{" "}
          <span className="text-danger">*</span>
        </label>

        <textarea
          name="description"
          rows={4}
          required
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your startup idea and goals..."
          disabled={loading}
          className="w-full rounded-xl border border-default-200 bg-content2 p-3 text-sm text-foreground placeholder:text-default-400 outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60 dark:border-default-100"
        />
      </div>

      {/* =================================================
          CREATE BUTTON
      ================================================= */}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground shadow-md transition hover:opacity-90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <>
            <Spinner
              size="sm"
              color="current"
            />

            <span>
              Processing...
            </span>
          </>
        ) : (
          <>
            <Rocket size={18} />

            <span>
              Create Startup
            </span>
          </>
        )}
      </button>
    </form>
  );
}