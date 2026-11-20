
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  PlusCircle,
  CalendarDays,
  CreditCard,
  Settings,
  Store,
} from "lucide-react";

export default function VendorDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/login");
      return;
    }

    if (session.user.role !== "vendor") {
      router.replace("/");
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F5EE]">
        <p className="text-[#174C3C]">Loading dashboard...</p>
      </div>
    );
  }

  if (session.user.role !== "vendor") {
    return null;
  }

  if (session.user.isBlocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F5EE] px-4">
        <p className="text-center text-red-600">
          Your account is blocked. Please contact support.
        </p>
      </div>
    );
  }

 const menuItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/dashboard/vendor" },
  { name: "My Services", icon: BriefcaseBusiness, href: "/dashboard/vendor/services" },
  { name: "Add Service", icon: PlusCircle, href: "/dashboard/vendor/add-service" },
  { name: "Booking Requests", icon: CalendarDays, href: "/dashboard/vendor/bookings" },
  { name: "Subscription", icon: CreditCard, href: "/dashboard/vendor/subscription" },
  { name: "Profile Settings", icon: Settings, href: "/dashboard/vendor/profile" },
];

  return (
    <div className="min-h-screen bg-[#F8F5EE] md:flex">

      {/* Sidebar */}
      <aside className="w-full border-b border-[#E8E1D5] bg-white p-5 md:min-h-screen md:w-64 md:border-b-0 md:border-r md:p-6">


        <nav className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-1">
  {menuItems.map((item, index) => {
    const Icon = item.icon;

    return (
      <button
        key={item.name}
        type="button"
        onClick={() => router.push(item.href)}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition hover:bg-[#E5EFE8] ${
          index === 0
            ? "bg-[#174C3C] text-white hover:bg-[#23634F]"
            : "text-[#59665E]"
        }`}
      >
        <Icon size={18} />
        {item.name}
      </button>
    );
  })}
</nav>
      </aside>

      {/* Main Content */}
      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:p-10">
        <div>
          <p className="text-sm font-medium text-[#A47C55]">
            VENDOR PANEL
          </p>

          <h1 className="mt-2 font-playfair text-3xl font-bold text-[#174C3C] sm:text-4xl">
            Welcome, {session.user.name}!
          </h1>

          <p className="mt-3 text-sm text-[#6B746E] sm:text-base">
            Manage your wedding services and booking activities from here.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-[#E8E1D5] bg-white p-6 shadow-sm">
            <BriefcaseBusiness className="text-[#A47C55]" size={28} />

            <p className="mt-5 text-sm text-[#6B746E]">
              Total Services
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#174C3C]">
              0
            </h2>
          </div>

          <div className="rounded-2xl border border-[#E8E1D5] bg-white p-6 shadow-sm">
            <CalendarDays className="text-[#A47C55]" size={28} />

            <p className="mt-5 text-sm text-[#6B746E]">
              Booking Requests
            </p>

            <h2 className="mt-2 text-3xl font-bold text-[#174C3C]">
              0
            </h2>
          </div>

          <div className="rounded-2xl border border-[#E8E1D5] bg-white p-6 shadow-sm sm:col-span-2 xl:col-span-1">
            <CreditCard className="text-[#A47C55]" size={28} />

            <p className="mt-5 text-sm text-[#6B746E]">
              Subscription Plan
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[#174C3C]">
              Free Plan
            </h2>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="mt-8 rounded-2xl bg-[#174C3C] p-6 text-white sm:p-8">
          <h2 className="font-playfair text-2xl font-semibold">
            Grow Your Wedding Business
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-7 text-white/80">
            Add your wedding services to WedPlan and connect with
            customers looking for trusted wedding professionals.
          </p>
        </div>
      </main>
    </div>
  );
}
