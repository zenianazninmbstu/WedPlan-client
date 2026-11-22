
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  XCircle,
  ArrowRight,
  CalendarDays,
  MapPin,
  Search,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled";

type Booking = {
  _id: string;
  eventDate: string;
  eventLocation: string;
  status: BookingStatus;
  createdAt: string;
  service?: {
    name?: string;
  };
};

const formatDate = (date: string) => {
  if (!date) return "Not available";

  const parsedDate = new Date(
    date.length === 10 ? `${date}T00:00:00` : date
  );

  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatStatus = (status: BookingStatus) =>
  status.charAt(0).toUpperCase() + status.slice(1);

export default function CustomerDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await authClient.token();
      const token = result.data?.token;

      if (!token) {
        throw new Error("Please sign in again to view your dashboard.");
      }

      const response = await fetch(
        `${API_URL}/api/bookings/my-bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load dashboard data.");
      }

      setBookings(data.bookings || []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const stats = [
    {
      title: "Total Requests",
      value: bookings.length.toString().padStart(2, "0"),
      icon: ClipboardList,
      color: "bg-[#EAF1EC] text-[#174C3C]",
    },
    {
      title: "Pending",
      value: bookings
        .filter((booking) => booking.status === "pending")
        .length.toString()
        .padStart(2, "0"),
      icon: Clock3,
      color: "bg-amber-50 text-amber-600",
    },
    {
      title: "Accepted",
      value: bookings
        .filter((booking) => booking.status === "accepted")
        .length.toString()
        .padStart(2, "0"),
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Rejected",
      value: bookings
        .filter((booking) => booking.status === "rejected")
        .length.toString()
        .padStart(2, "0"),
      icon: XCircle,
      color: "bg-rose-50 text-rose-600",
    },
  ];

  const recentBookings = [...bookings]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    )
    .filter((booking) =>
      (booking.service?.name || "Wedding Service")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .slice(0, 3);

  const statusStyle = (status: BookingStatus) => {
    switch (status) {
      case "accepted":
        return "bg-emerald-50 text-emerald-700";
      case "rejected":
        return "bg-rose-50 text-rose-700";
      case "cancelled":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <section>
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#A47C55]">
          Customer Workspace
        </p>

        <h1 className="font-playfair text-3xl font-semibold text-[#174C3C] sm:text-4xl">
          Welcome Back!
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6B746E]">
          Track your wedding service bookings and manage your
          requests in one place.
        </p>
      </section>

      {/* Statistics Cards */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.title}
              className="rounded-2xl border border-[#E8E1D5] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#6B746E]">
                  {stat.title}
                </p>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <Icon size={21} />
                </div>
              </div>

              {loading ? (
                <div className="mt-5 h-9 w-16 animate-pulse rounded-lg bg-[#E8E1D5]" />
              ) : (
                <h2 className="mt-5 font-playfair text-3xl font-bold text-[#174C3C]">
                  {stat.value}
                </h2>
              )}

              <p className="mt-1 text-xs text-[#8A918C]">
                Your booking overview
              </p>
            </article>
          );
        })}
      </section>

      {/* Recent Booking Requests */}
      <section className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-playfair text-2xl font-semibold text-[#174C3C]">
              Recent Booking Requests
            </h2>

            <p className="mt-2 text-sm text-[#6B746E]">
              Keep track of your latest wedding service requests.
            </p>
          </div>

          <Link
            href="/dashboard/customer/bookings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#174C3C] transition hover:text-[#A47C55]"
          >
            Manage All
            <ArrowRight size={17} />
          </Link>
        </div>

        {/* Search and Browse */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-[#E8E1D5] bg-white px-4 py-3">
            <Search size={18} className="text-[#8A918C]" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your booking requests..."
              className="w-full bg-transparent text-sm text-[#174C3C] outline-none placeholder:text-[#A0A69F]"
            />
          </div>

          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#174C3C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#10392D]"
          >
            Browse Services
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Booking List */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-[#E8E1D5] bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex animate-pulse flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="h-16 w-16 rounded-xl bg-[#E8E1D5]" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-40 rounded bg-[#E8E1D5]" />
                    <div className="h-3 w-56 rounded bg-[#E8E1D5]" />
                    <div className="h-3 w-24 rounded bg-[#E8E1D5]" />
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-white px-6 py-10 text-center">
              <p className="text-sm text-red-600">{error}</p>
              <button
                onClick={fetchBookings}
                className="mt-4 rounded-lg bg-[#174C3C] px-5 py-2 text-sm font-semibold text-white hover:bg-[#10392D]"
              >
                Try Again
              </button>
            </div>
          ) : recentBookings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#E8E1D5] bg-white px-6 py-12 text-center">
              <ClipboardList
                className="mx-auto text-[#A0A69F]"
                size={34}
              />
              <h3 className="mt-3 font-semibold text-[#174C3C]">
                {bookings.length === 0
                  ? "No bookings yet"
                  : "No bookings found"}
              </h3>
              <p className="mt-1 text-sm text-[#6B746E]">
                {bookings.length === 0
                  ? "Your service requests will appear here."
                  : "Try searching with another service name."}
              </p>
            </div>
          ) : (
            recentBookings.map((booking) => (
              <article
                key={booking._id}
                className="rounded-2xl border border-[#E8E1D5] bg-white p-5 shadow-sm sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <h3 className="font-playfair text-xl font-semibold text-[#174C3C]">
                      {booking.service?.name || "Wedding Service"}
                    </h3>

                    <div className="mt-3 flex flex-col gap-2 text-sm text-[#6B746E] sm:flex-row sm:flex-wrap sm:gap-5">
                      <span className="flex items-center gap-2">
                        <CalendarDays
                          size={16}
                          className="text-[#A47C55]"
                        />
                        {formatDate(booking.eventDate)}
                      </span>

                      <span className="flex items-center gap-2">
                        <MapPin
                          size={16}
                          className="text-[#A47C55]"
                        />
                        {booking.eventLocation}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${statusStyle(
                        booking.status
                      )}`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {formatStatus(booking.status)}
                    </span>

                    <Link
                      href="/dashboard/customer/bookings"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#174C3C] hover:text-[#A47C55]"
                    >
                      View Details
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
