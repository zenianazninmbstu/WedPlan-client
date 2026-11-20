
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Service = {
  _id: string;
  isActive: boolean;
  status: string;
};

type Booking = {
  _id: string;
  status: string;
};

type DashboardStats = {
  totalServices: number;
  activeServices: number;
  pendingBookings: number;
  acceptedBookings: number;
};

export default function VendorDashboard() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [stats, setStats] = useState<DashboardStats>({
    totalServices: 0,
    activeServices: 0,
    pendingBookings: 0,
    acceptedBookings: 0,
  });

  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

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

  useEffect(() => {
    if (!session || session.user.role !== "vendor" || session.user.isBlocked) {
      return;
    }

    const loadDashboardStats = async () => {
      try {
        setIsLoadingStats(true);
        setStatsError("");

        const tokenResult = await authClient.token();

        if (tokenResult.error || !tokenResult.data?.token) {
          throw new Error("Your session has expired. Please sign in again.");
        }

        const headers = {
          Authorization: `Bearer ${tokenResult.data.token}`,
        };

        const [servicesResponse, bookingsResponse] = await Promise.all([
          fetch(`${API_URL}/api/services/vendor/my-services`, { headers }),
          fetch(`${API_URL}/api/bookings/vendor/requests`, { headers }),
        ]);

        const servicesData = await servicesResponse.json();
        const bookingsData = await bookingsResponse.json();

        if (!servicesResponse.ok) {
          throw new Error(
            servicesData.message || "Could not load your services."
          );
        }

        if (!bookingsResponse.ok) {
          throw new Error(
            bookingsData.message || "Could not load your bookings."
          );
        }

        const services: Service[] = Array.isArray(servicesData.services)
          ? servicesData.services
          : [];

        const bookings: Booking[] = Array.isArray(bookingsData.bookings)
          ? bookingsData.bookings
          : [];

        setStats({
          totalServices: services.length,
          activeServices: services.filter(
            (service) => service.isActive === true
          ).length,
          pendingBookings: bookings.filter(
            (booking) => booking.status === "pending"
          ).length,
          acceptedBookings: bookings.filter(
            (booking) => booking.status === "accepted"
          ).length,
        });
      } catch (error) {
        setStatsError(
          error instanceof Error
            ? error.message
            : "Failed to load dashboard statistics."
        );
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadDashboardStats();
  }, [session]);

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

  const statCards = [
    {
      title: "Total Services",
      value: stats.totalServices,
      icon: BriefcaseBusiness,
    },
    {
      title: "Active Services",
      value: stats.activeServices,
      icon: CheckCircle2,
    },
    {
      title: "Pending Booking Requests",
      value: stats.pendingBookings,
      icon: Clock,
    },
    {
      title: "Accepted Bookings",
      value: stats.acceptedBookings,
      icon: CalendarDays,
    },
  ];

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

      {statsError && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {statsError}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl border border-[#E8E1D5] bg-white p-6 shadow-sm"
            >
              <Icon className="text-[#A47C55]" size={28} />

              <p className="mt-5 text-sm text-[#6B746E]">{card.title}</p>

              <h2 className="mt-2 text-3xl font-bold text-[#174C3C]">
                {isLoadingStats ? "..." : card.value}
              </h2>
            </div>
          );
        })}
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
