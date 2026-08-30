"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { serverMutation } from "@/lib/api";

// আপনার .env থেকে Port 5000 এর Server URL নেওয়া হচ্ছে
const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";
const STARTUPS_PAGE_URL = "/dashboard/founder/startups";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Verifying your payment...");

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found.");
      setLoading(false);
      return;
    }

    const processPaymentAndCreateStartup = async () => {
      try {
        // ১. Port 5000 (Backend Express/Node Server) এ verification request পাঠানো
        const res = await fetch(
          `${API_BASE_URL}/api/payment/verify-session?session_id=${sessionId}`
        );

        if (!res.ok) {
          throw new Error(`Server status: ${res.status}. Payment verification route missing or error.`);
        }

        const data = await res.json();

        if (!data.success) {
          setError(data.message || "Payment verification failed.");
          setLoading(false);
          return;
        }

        setPaymentData(data.payment);
        setStatusMessage("Payment verified! Creating your startup...");

        // ২. LocalStorage থেকে Pending Startup Data চেক ও সাবমিট
        const savedData = localStorage.getItem("pendingStartupData");

        if (savedData) {
          const payload = JSON.parse(savedData);

          // backend API তে startup save করা
          await serverMutation("/api/founder/startup", "POST", payload);

          localStorage.removeItem("pendingStartupData");
        }

        setStatusMessage("Startup created successfully! Redirecting...");

        setTimeout(() => {
          router.push(STARTUPS_PAGE_URL);
        }, 2000);
      } catch (err) {
        console.error("Verification error:", err);
        setError(err?.message || "Something went wrong while completing your request.");
        setLoading(false);
      }
    };

    processPaymentAndCreateStartup();
  }, [sessionId, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 p-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent dark:border-blue-500"></div>
        <p className="text-lg font-medium text-slate-700 dark:text-slate-300">{statusMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 p-4">
        <div className="rounded-2xl border border-rose-200 bg-white p-8 shadow-sm dark:border-rose-500/20 dark:bg-slate-900 max-w-md w-full">
          <h1 className="text-2xl font-bold text-rose-600 dark:text-rose-500">Verification Failed</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{error}</p>
          <Link
            href={STARTUPS_PAGE_URL}
            className="mt-6 inline-block rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
          >
            Go to Startups
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 p-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900 max-w-md w-full">
        <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">Payment Successful!</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Your startup has been created successfully.</p>

        {paymentData && (
          <div className="mt-6 text-left border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2 text-sm">
            <p><span className="font-semibold text-slate-500 dark:text-slate-400">Email:</span> <span className="text-slate-800 dark:text-slate-200">{paymentData.user_email}</span></p>
            <p><span className="font-semibold text-slate-500 dark:text-slate-400">Amount Paid:</span> <span className="text-slate-800 dark:text-slate-200">${paymentData.amount}</span></p>
            <p className="text-xs text-slate-500 dark:text-slate-400 break-all">
              <span className="font-semibold">Transaction ID:</span> {paymentData.transaction_id}
            </p>
          </div>
        )}

        <Link
          href={STARTUPS_PAGE_URL}
          className="mt-6 inline-block w-full rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
        >
          View All Startups
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" /></div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}