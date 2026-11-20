
"use client";

import { useState } from "react";
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

const demoPayments = [
  {
    id: 1,
    plan: "Free Plan",
    amount: "$0.00",
    status: "Active",
    date: "Current Plan",
  },
];

export default function VendorSubscriptionPage() {
  const [currentPlan] = useState<"free" | "premium">("free");
  const [upgrading, setUpgrading] = useState(false);

  const isPremium = currentPlan === "premium";

  function handleUpgrade() {
    // Stripe Checkout will be connected in the backend step.
    setUpgrading(true);

    // Temporary frontend demonstration only.
    setTimeout(() => {
      setUpgrading(false);
      alert("Stripe Checkout will be connected in the next step.");
    }, 500);
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
                {isPremium ? "Premium Plan" : "Free Plan"}
              </h2>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>

            <p className="mt-2 text-sm text-[#6B746E]">
              {isPremium
                ? "You have access to all Premium features."
                : "You are currently using the Free plan."}
            </p>
          </div>

          {!isPremium && (
            <button
              type="button"
              onClick={handleUpgrade}
              disabled={upgrading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#174C3C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#10392D] disabled:opacity-60"
            >
              {upgrading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Crown size={17} />
              )}
              Upgrade to Premium
              {!upgrading && <ArrowRight size={16} />}
            </button>
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

              {!isPremium && (
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
              disabled={isPremium || upgrading}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#174C3C] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#10392D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {upgrading ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Crown size={17} />
              )}
              {isPremium ? "Current Premium Plan" : "Upgrade to Premium"}
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
                {demoPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td className="px-5 py-5 font-semibold">
                      <span className="flex items-center gap-2">
                        <CreditCard size={17} className="text-[#A47C55]" />
                        {payment.plan}
                      </span>
                    </td>
                    <td className="px-5 py-5 font-semibold">
                      {payment.amount}
                    </td>
                    <td className="px-5 py-5">
                      <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-5 py-5 text-[#6B746E]">
                      <span className="flex items-center gap-2">
                        <CalendarDays size={15} />
                        {payment.date}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs leading-5 text-[#8A918C]">
          Payment records will appear here after your subscription payments
          are connected.
        </p>
      </section>
    </main>
  );
}
