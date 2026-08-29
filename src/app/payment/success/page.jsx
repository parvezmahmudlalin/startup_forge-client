"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { serverMutation } from "@/lib/api";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState("Verifying your payment...");

  // আপনার Startups পেজের URL পাথ (প্রয়োজনে এটি চেঞ্জ করে নিন)
  const STARTUPS_PAGE_URL = "/dashboard/founder/startups";

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found.");
      setLoading(false);
      return;
    }

    const processPaymentAndCreateStartup = async () => {
      try {
        // ১. পেমেন্ট ভেরিফাই করা
        const res = await fetch(
          `http://localhost:5000/api/payment/verify-session?session_id=${sessionId}`
        );
        const data = await res.json();

        if (!data.success) {
          setError(data.message || "Payment verification failed.");
          setLoading(false);
          return;
        }

        setPaymentData(data.payment);
        setStatusMessage("Payment verified! Creating your startup...");

        // ২. LocalStorage থেকে পেন্ডিং ডাটা রিড করা
        const savedData = localStorage.getItem("pendingStartupData");

        if (savedData) {
          const payload = JSON.parse(savedData);

          // ৩. ব্যাকএন্ডে Startup ডাটা সাবমিট করা
          await serverMutation("/api/founder/startup", "POST", payload);

          // ৪. ডাটা সেভ হয়ে গেলে LocalStorage ক্লিয়ার করা
          localStorage.removeItem("pendingStartupData");

          setStatusMessage("Startup created successfully! Redirecting...");
          
          // ২ সেকেন্ড পর Startups পেজে রিডাইরেক্ট করবে
          setTimeout(() => {
            router.push(STARTUPS_PAGE_URL);
          }, 2000);
        } else {
          setLoading(false);
          // পেন্ডিং ডাটা না থাকলেও সরাসরি Startups পেজে রিডাইরেক্ট করবে
          setTimeout(() => {
            router.push(STARTUPS_PAGE_URL);
          }, 2500);
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError("Something went wrong while completing your request.");
        setLoading(false);
      }
    };

    processPaymentAndCreateStartup();
  }, [sessionId, router, STARTUPS_PAGE_URL]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-lg font-medium text-gray-300">{statusMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-red-500">Verification Failed</h1>
        <p className="mt-2 text-gray-400">{error}</p>
        <Link
          href={STARTUPS_PAGE_URL}
          className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Go to Startups
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="rounded-lg border border-gray-800 p-8 shadow-xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-green-500">Payment Successful!</h1>
        <p className="mt-2 text-gray-300">Your startup has been created successfully.</p>

        {paymentData && (
          <div className="mt-6 text-left border-t border-gray-800 pt-4 space-y-2 text-sm">
            <p><span className="font-semibold text-gray-400">Email:</span> {paymentData.user_email}</p>
            <p><span className="font-semibold text-gray-400">Amount Paid:</span> ${paymentData.amount}</p>
            <p className="text-xs text-gray-500 break-all">
              <span className="font-semibold">Transaction ID:</span> {paymentData.transaction_id}
            </p>
          </div>
        )}

        <Link
          href={STARTUPS_PAGE_URL}
          className="mt-6 inline-block w-full rounded-md bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          View All Startups
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<p className="text-center py-10">Loading page...</p>}>
      <PaymentSuccessContent />
    </Suspense>
  ); 
}