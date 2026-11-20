
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  BriefcaseBusiness,
  CalendarDays,
  CreditCard,
} from "lucide-react";

export default function VendorDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/sign-in");
      return;
    }

    if (session.user.role !== "vendor") {
      router.replace("/");
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-[#174C3C]">Loading dashboard...</p>
      </div>
    );
  }

  if (session.user.role !== "vendor") return null;

  if (session.user.isBlocked) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <p className="text-center text-red-600">
          Your account is blocked. Please contact support.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh]">
      <p className="text-sm font-medium tracking-wider text-[#A47C55]">
        VENDOR PANEL
      </p>

      <h1 className="mt-2 font-playfair text-3xl font-bold text-[#174C3C] sm:text-4xl">
        Welcome, {session.user.name}!
      </h1>

      <p className="mt-3 text-sm text-[#6B746E] sm:text-base">
        Manage your wedding services and booking activities from here.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-[#E8E1D5] bg-white p-6 shadow-sm">
          <BriefcaseBusiness className="text-[#A47C55]" size={28} />
          <p className="mt-5 text-sm text-[#6B746E]">Total Services</p>
          <h2 className="mt-2 text-3xl font-bold text-[#174C3C]">0</h2>
        </div>

        <div className="rounded-2xl border border-[#E8E1D5] bg-white p-6 shadow-sm">
          <CalendarDays className="text-[#A47C55]" size={28} />
          <p className="mt-5 text-sm text-[#6B746E]">Booking Requests</p>
          <h2 className="mt-2 text-3xl font-bold text-[#174C3C]">0</h2>
        </div>

        <div className="rounded-2xl border border-[#E8E1D5] bg-white p-6 shadow-sm sm:col-span-2 xl:col-span-1">
          <CreditCard className="text-[#A47C55]" size={28} />
          <p className="mt-5 text-sm text-[#6B746E]">Subscription Plan</p>
          <h2 className="mt-2 text-2xl font-bold text-[#174C3C]">
            Free Plan
          </h2>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-[#174C3C] p-6 text-white sm:p-8">
        <h2 className="font-playfair text-2xl font-semibold">
          Grow Your Wedding Business
        </h2>

        <p className="mt-3 max-w-xl text-sm leading-7 text-white/80">
          Add your wedding services to WedPlan and connect with customers
          looking for trusted wedding professionals.
        </p>
      </div>
    </div>
  );
}
