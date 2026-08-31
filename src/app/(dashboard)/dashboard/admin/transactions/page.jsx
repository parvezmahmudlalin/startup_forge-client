"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@heroui/react";
import { CreditCard, CheckCircle2, XCircle } from "lucide-react";
import { serverFetch } from "@/lib/api";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await serverFetch("/api/admin/transactions");

      if (res?.success) {
        setTransactions(res.transactions || []);
      } else {
        alert(res?.message || "Failed to load transactions");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  const getStatus = (tx) => {
    const rawStatus = String(
      tx.payment_status || tx.status || ""
    ).toLowerCase();

    const successKeywords = [
      "paid",
      "completed",
      "succeeded",
      "valid",
      "validated",
      "success",
    ];

    return successKeywords.includes(rawStatus);
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary/10 p-3 text-primary">
          <CreditCard size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Transactions</h1>
          <p className="text-sm text-default-500">
            View all platform payment transactions.
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-default-200 bg-content1 dark:border-default-100">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-default-200 bg-default-50 dark:border-default-100 dark:bg-default-100/10">
              <tr>
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold">Startup</th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Transaction ID</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 text-right font-semibold">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-default-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-default-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const paid = getStatus(tx);

                  return (
                    <tr
                      key={tx._id}
                      className="hover:bg-default-50/50 dark:hover:bg-default-100/10"
                    >
                      {/* User */}
                      <td className="p-4">
                        <p className="font-semibold">
                          {tx.userName ||
                            tx.userEmail ||
                            tx.user_email ||
                            tx.founder_email ||
                            tx.email ||
                            tx.cus_email ||
                            "N/A"}
                        </p>
                      </td>

                      {/* Startup Name */}
                      <td className="p-4">
                        <span className="font-medium text-default-700 dark:text-default-300">
                          {tx.startupName ||
                            tx.startup_name ||
                            tx.startupTitle ||
                            "N/A"}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="p-4">
                        <span className="font-bold text-success">
                          $
                          {Number(
                            tx.amount || tx.total_amount || 0
                          ).toFixed(2)}
                        </span>
                      </td>

                      {/* Transaction ID */}
                      <td className="p-4">
                        <span className="rounded-lg bg-default-100 px-2 py-1 font-mono text-xs dark:bg-default-100/10">
                          {tx.tran_id ||
                            tx.transaction_id ||
                            tx.transactionId ||
                            tx._id}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="p-4 text-default-500">
                        {formatDate(
                          tx.paid_at || tx.createdAt || tx.tran_date
                        )}
                      </td>

                      {/* Status */}
                      <td className="p-4 text-right">
                        {paid ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                            <CheckCircle2 size={14} />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger">
                            <XCircle size={14} />
                            Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}