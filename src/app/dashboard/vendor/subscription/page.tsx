
"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Crown,
  Sparkles,
  ArrowRight,
  CreditCard,
  CalendarDays,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const freeFeatures = [
  "Maximum 3 Active Services",
  "Basic Vendor Dashboard",
  "Booking Request Management",
];

const premiumFeatures = [
  "Unlimited Active Services",
  "Premium Vendor Badge",
  "All Free Plan Features",
  "Priority Service Placement",
];

type Payment = {
  _id?: string;
  plan?: string;
  amount?: number | string;
  currency?: string;
  status?: string;
  paymentStatus?: string;
  createdAt?: string;
};

export default function VendorSubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState<"free" | "premium">("free");
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loadingSubscription, setLoadingSubscription] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const [upgrading, setUpgrading] = useState(false);

  const isPremium = currentPlan === "premium";

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        setLoadingSubscription(true);
        setLoadError("");

        const result = await authClient.token();
        const token = result.data?.token;

        if (!token) {
          throw new Error("Please sign in again.");
        }

        const response = await fetch(
          `${API_URL}/api/payments/my-subscription`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load subscription details."
          );
        }

        setCurrentPlan(
          data.subscription?.plan === "premium" ? "premium" : "free"
        );

        setExpiresAt(data.subscription?.expiresAt || null);

        setPayments(
          Array.isArray(data.transactions) ? data.transactions : []
        );
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : "Failed to load subscription details."
        );
      } finally {
        setLoadingSubscription(false);
      }
    };

    loadSubscription();
  }, []);

  async function handleUpgrade() {
    try {
      setUpgrading(true);
      setNotice("");

      const result = await authClient.token();
      const token = result.data?.token;

      if (!token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/api/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success || !data.url) {
        throw new Error(data.message || "Unable to start checkout.");
      }

      window.location.href = data.url;
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );

      setUpgrading(false);
    }
  }

  function formatAmount(amount?: number | string, currency?: string) {
    const value = Number(amount);

    if (!Number.isFinite(value)) {
      return "—";
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (currency || "USD").toUpperCase(),
      }).format(value);
  }

  function formatDate(date?: string) {
    if (!date) return "—";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <main className="min-h-screen space-y-8 bg-[#F8F5EE] p-4 text-[#174C3C] sm:p-6 lg:p-8">
      {/* Page Heading */}
      <header>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#A47C55]">
          Vendor Workspace
        </p>

        <h1 className="font-playfair text-3xl font-semibold sm:text-4xl">
          Subscription Plans
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6B746E]">
          Choose the right plan for your wedding business. Grow your visibility,
          manage your services, and unlock more opportunities with WedPlan.
        </p>
      </header>

      {/* Current Subscription */}
      <section className="overflow-hidden rounded-2xl border border-[#D9E5DC] bg-white shadow-sm">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#A47C55]">
              Your Current Subscription
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h2 className="font-playfair text-2xl font-semibold">
                {loadingSubscription
                  ? "Loading..."
                  : isPremium
                    ? "Premium Plan"
                    : "Free Plan"}
              </h2>

              {!loadingSubscription && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Active
                </span>
              )}
            </div>

            <p className="mt-2 text-sm text-[#6B746E]">
              {loadingSubscription
                ? "Loading your subscription details..."
                : isPremium
                  ? "You have access to all Premium features."
                  : "You are currently using the Free plan."}
            </p>

            {!loadingSubscription && isPremium && expiresAt && (
              <p className="mt-2 text-sm text-[#6B746E]">
                Expires on:{" "}
                <span className="font-semibold text-[#174C3C]">
                  {formatDate(expiresAt)}
                </span>
              </p>
            )}

            {loadError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {loadError}
              </p>
            )}
          </div>

          {!loadingSubscription && !isPremium && (
            <div className="flex flex-col items-start">
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={upgrading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#174C3C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#10392D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {upgrading ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Crown size={17} />
                )}
                {upgrading ? "Redirecting..." : "Upgrade to Premium"}
                {!upgrading && <ArrowRight size={16} />}
              </button>

              {notice && (
                <p role="status" className="mt-3 text-sm text-amber-700">
                  {notice}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Plan Cards */}
      <section>
        <div className="mb-6">
          <h2 className="font-playfair text-2xl font-semibold">
            Choose Your Plan
          </h2>
          <p className="mt-2 text-sm text-[#6B746E]">
            Simple and flexible plans designed for your business growth.
          </p>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          {/* Free Plan */}
          <article className="flex flex-col rounded-2xl border border-[#E8E1D5] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-playfair text-2xl font-semibold">
                  Free Plan
                </h3>
                <p className="mt-2 text-sm text-[#6B746E]">
                  Ideal for boutique vendors getting started.
                </p>
              </div>

              {!loadingSubscription && !isPremium && (
                <span className="shrink-0 rounded-full bg-[#EAF1EC] px-3 py-1.5 text-xs font-bold text-[#174C3C]">
                  Current Plan
                </span>
              )}
            </div>

            <div className="mt-7 flex items-baseline gap-2">
              <span className="font-playfair text-5xl font-semibold">$0</span>
              <span className="text-sm text-[#6B746E]">/ month</span>
            </div>

            <div className="my-7 h-px bg-[#E8E1D5]" />

            <p className="mb-5 text-sm font-bold">What's included</p>

            <ul className="flex-1 space-y-4">
              {freeFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EAF1EC] text-[#174C3C]">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <div className="flex items-center gap-2 rounded-xl bg-[#F8F5EE] p-4 text-xs leading-5 text-[#6B746E]">
                <ShieldCheck size={18} className="shrink-0 text-[#174C3C]" />
                A great starting point for growing your wedding business.
              </div>
            </div>
          </article>

          {/* Premium Plan */}
          <article className="relative flex flex-col overflow-hidden rounded-2xl border-2 border-[#174C3C] bg-white p-6 shadow-md sm:p-8">
            <div className="absolute right-0 top-0 rounded-bl-2xl bg-[#174C3C] px-4 py-2 text-xs font-bold text-white">
              <span className="flex items-center gap-1.5">
                <Sparkles size={14} />
                RECOMMENDED
              </span>
            </div>

            <div className="flex items-center gap-3 pr-24">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF1EC] text-[#174C3C]">
                <Crown size={25} />
              </div>

              <div>
                <h3 className="font-playfair text-2xl font-semibold">
                  Premium Plan
                </h3>
                <p className="mt-1 text-sm text-[#6B746E]">
                  For ambitious wedding professionals.
                </p>
              </div>
            </div>

            <div className="mt-7 flex items-baseline gap-2">
              <span className="font-playfair text-5xl font-semibold">$19</span>
              <span className="text-sm text-[#6B746E]">/ month</span>
            </div>

            <div className="my-7 h-px bg-[#E8E1D5]" />

            <p className="mb-5 text-sm font-bold">Everything in Free, plus</p>

            <ul className="flex-1 space-y-4">
              {premiumFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EAF1EC] text-[#174C3C]">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handleUpgrade}
              disabled={isPremium || upgrading || loadingSubscription}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#174C3C] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#10392D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {upgrading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Crown size={17} />
              )}

              {isPremium
                ? "Current Premium Plan"
                : upgrading
                  ? "Redirecting..."
                  : "Upgrade to Premium"}

              {!isPremium && !upgrading && <ArrowRight size={16} />}
            </button>
          </article>
        </div>
      </section>

      {/* Payment History */}
      <section className="space-y-5">
        <div>
          <h2 className="font-playfair text-2xl font-semibold">
            Your Payment History
          </h2>
          <p className="mt-2 text-sm text-[#6B746E]">
            Review your subscription and previous payment records.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E8E1D5] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-[#F8F5EE] text-xs uppercase tracking-wider text-[#6B746E]">
                <tr>
                  <th className="px-5 py-4 font-semibold">Plan</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0ECE4]">
                {loadingSubscription ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-[#6B746E]">
                      <Loader2 className="mx-auto mb-2 animate-spin" size={22} />
                      Loading payment history...
                    </td>
                  </tr>
                ) : payments.length > 0 ? (
                  payments.map((payment, index) => {
                    const paymentStatus =
                      payment.paymentStatus || payment.status || "Processed";

                    const isPaid =
                      paymentStatus.toLowerCase() === "paid" ||
                      paymentStatus.toLowerCase() === "succeeded";

                    return (
                      <tr key={payment._id || `${payment.createdAt}-${index}`}>
                        <td className="px-5 py-5 font-semibold">
                          <span className="flex items-center gap-2">
                            <CreditCard size={17} className="text-[#A47C55]" />
                           {payment.plan
                               ? `${payment.plan.charAt(0).toUpperCase()}${payment.plan.slice(1)} Plan`
                               : "Premium Plan"}
                          </span>
                        </td>

                        <td className="px-5 py-5 font-semibold">
                          {formatAmount(payment.amount, payment.currency)}
                        </td>

                        <td className="px-5 py-5">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                              isPaid
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {paymentStatus}
                          </span>
                        </td>

                        <td className="px-5 py-5 text-[#6B746E]">
                          <span className="flex items-center gap-2">
                            <CalendarDays size={15} />
                            {formatDate(payment.createdAt)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-[#6B746E]">
                      No payment records found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs leading-5 text-[#8A918C]">
          Your subscription and payment information is loaded from your account.
        </p>
      </section>
    </main>
  );
}
