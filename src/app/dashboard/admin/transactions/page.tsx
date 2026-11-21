
"use client";

import { authClient } from "@/lib/auth-client";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Loader2,
  CreditCard,
  CheckCircle2,
  Clock3,
  ReceiptText,
} from "lucide-react";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Transaction = {
  _id?: string;
  vendorId: string;
  vendor?: {
    name?: string;
    email?: string;
  } | null;
  plan?: string;
  amount: number;
  currency?: string;
  status?: string;
  createdAt?: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const getToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Please login again.");
    }

    return data.token;
  };

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/payments/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to load transactions."
        );
      }

      setTransactions(data.transactions || []);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load transactions."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const filteredTransactions = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return transactions.filter((transaction) => {
      return (
        transaction.vendor?.name
          ?.toLowerCase()
          .includes(searchText) ||
        transaction.vendor?.email
          ?.toLowerCase()
          .includes(searchText) ||
        transaction.plan?.toLowerCase().includes(searchText) ||
        transaction.status?.toLowerCase().includes(searchText)
      );
    });
  }, [transactions, search]);

  const getStatus = (status?: string) => {
    const normalized = status?.toLowerCase();

    if (normalized === "paid" || normalized === "completed") {
      return {
        label: "Completed",
        style: "bg-emerald-50 text-emerald-700 border-emerald-100",
        icon: CheckCircle2,
      };
    }

    if (normalized === "failed") {
      return {
        label: "Failed",
        style: "bg-red-50 text-red-600 border-red-100",
        icon: CreditCard,
      };
    }

    return {
      label: "Pending",
      style: "bg-amber-50 text-amber-700 border-amber-100",
      icon: Clock3,
    };
  };

  const formatAmount = (
    amount: number,
    currency?: string
  ) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (currency || "usd").toUpperCase(),
    }).format(Number(amount || 0));
  };

  const formatDate = (date?: string) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const completedCount = transactions.filter(
    (item) =>
      item.status?.toLowerCase() === "paid" ||
      item.status?.toLowerCase() === "completed"
  ).length;

  const pendingCount = transactions.filter(
    (item) =>
      !["paid", "completed", "failed"].includes(
        item.status?.toLowerCase() || ""
      )
  ).length;

  const totalRevenue = transactions.reduce((total, item) => {
    const status = item.status?.toLowerCase();

    if (status === "paid" || status === "completed") {
      return total + Number(item.amount || 0);
    }

    return total;
  }, 0);

  return (
    <div className="space-y-5">
      {/* Page Heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-playfair text-2xl font-bold tracking-tight text-[#174C3C] sm:text-3xl">
            Platform Transactions
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718078]">
            View vendor subscription payments and verified
            transaction history managed through Stripe Checkout.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchTransactions}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-[#DCE7DF] bg-white px-3 py-2 text-xs font-semibold text-[#174C3C] shadow-sm transition hover:bg-[#F4F8F4] disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#E5EBE5] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[#849087]">
              Total Transactions
            </p>
            <ReceiptText size={18} className="text-[#174C3C]" />
          </div>

          <p className="mt-2 text-2xl font-bold text-[#174C3C]">
            {transactions.length}
          </p>
        </div>

        <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[#849087]">
              Completed Payments
            </p>
            <CheckCircle2 size={18} className="text-emerald-600" />
          </div>

          <p className="mt-2 text-2xl font-bold text-emerald-700">
            {completedCount}
          </p>
        </div>

        <div className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[#849087]">
              Verified Revenue
            </p>
            <CreditCard size={18} className="text-[#A47C55]" />
          </div>

          <p className="mt-2 text-2xl font-bold text-[#174C3C]">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Payment History */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-playfair text-xl font-bold text-[#174C3C]">
              Payment History
            </h2>
            <p className="mt-1 text-xs text-[#849087]">
              A record of vendor subscription transactions.
            </p>
          </div>

          <span className="text-xs font-medium text-[#849087]">
            {filteredTransactions.length} records
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search vendor, email, plan or status..."
            className="h-11 w-full rounded-lg border border-[#DCE7DF] bg-white pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-[#174C3C] focus:ring-2 focus:ring-[#174C3C]/10"
          />
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-52 items-center justify-center rounded-xl border border-[#E5EBE5] bg-white">
            <div className="flex items-center gap-2 text-sm text-[#174C3C]">
              <Loader2 size={22} className="animate-spin" />
              Loading transactions...
            </div>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-[#DCE7DF] bg-white px-5 text-center">
            <ReceiptText
              size={36}
              className="mb-3 text-[#A8B8AC]"
            />

            <h3 className="text-sm font-semibold text-[#344A3B]">
              No transactions found
            </h3>

            <p className="mt-1 text-xs text-[#87948B]">
              {transactions.length === 0
                ? "Verified payment records will appear here."
                : "Try changing your search."}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-hidden rounded-xl border border-[#E4EAE5] bg-white shadow-sm md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[#F3F7F3]">
                    <tr className="text-xs font-semibold text-[#59665E]">
                      <th className="px-5 py-4">Vendor Information</th>
                      <th className="px-4 py-4">Plan</th>
                      <th className="px-4 py-4">Amount</th>
                      <th className="px-4 py-4">Payment Status</th>
                      <th className="px-4 py-4">Transaction Date</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-[#EEF1ED]">
                    {filteredTransactions.map((transaction, index) => {
                      const status = getStatus(transaction.status);
                      const StatusIcon = status.icon;

                      return (
                        <tr
                          key={
                            transaction._id ||
                            `${transaction.vendorId}-${transaction.createdAt}-${index}`
                          }
                          className="transition hover:bg-[#FAFCFA]"
                        >
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-[#344A3B]">
                              {transaction.vendor?.name || "Vendor"}
                            </p>
                            <p className="mt-1 text-xs text-[#87948B]">
                              {transaction.vendor?.email || "Email unavailable"}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            <span className="rounded-full bg-[#EAF2EC] px-3 py-1 text-xs font-semibold capitalize text-[#174C3C]">
                              {transaction.plan || "Premium"}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-sm font-bold text-[#174C3C]">
                            {formatAmount(
                              transaction.amount,
                              transaction.currency
                            )}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${status.style}`}
                            >
                              <StatusIcon size={12} />
                              {status.label}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-xs text-[#718078]">
                            {formatDate(transaction.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-3 md:hidden">
              {filteredTransactions.map((transaction, index) => {
                const status = getStatus(transaction.status);
                const StatusIcon = status.icon;

                return (
                  <article
                    key={
                      transaction._id ||
                      `${transaction.vendorId}-${transaction.createdAt}-${index}`
                    }
                    className="rounded-xl border border-[#E4EAE5] bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-[#174C3C]">
                          {transaction.vendor?.name || "Vendor"}
                        </h3>

                        <p className="mt-1 break-all text-xs text-[#87948B]">
                          {transaction.vendor?.email || "Email unavailable"}
                        </p>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-semibold ${status.style}`}
                      >
                        <StatusIcon size={11} />
                        {status.label}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#EEF1ED] pt-3">
                      <div>
                        <p className="text-[10px] font-medium text-[#87948B]">
                          Subscription Plan
                        </p>
                        <p className="mt-1 text-xs font-semibold capitalize text-[#344A3B]">
                          {transaction.plan || "Premium"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-medium text-[#87948B]">
                          Payment Amount
                        </p>
                        <p className="mt-1 text-sm font-bold text-[#174C3C]">
                          {formatAmount(
                            transaction.amount,
                            transaction.currency
                          )}
                        </p>
                      </div>

                      <div className="col-span-2">
                        <p className="text-[10px] font-medium text-[#87948B]">
                          Transaction Date
                        </p>
                        <p className="mt-1 text-xs text-[#59665E]">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        )}
      </div>

      <p className="border-t border-[#E5EBE5] pt-4 text-center text-[11px] leading-5 text-[#87948B]">
        Payment records are read-only and managed through verified Stripe
        payment events. Administrators cannot manually change payment status.
      </p>
    </div>
  );
}
