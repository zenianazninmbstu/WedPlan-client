
"use client";

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

const stats = [
  {
    title: "Total Requests",
    value: "12",
    icon: ClipboardList,
    color: "bg-[#EAF1EC] text-[#174C3C]",
  },
  {
    title: "Pending",
    value: "04",
    icon: Clock3,
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Accepted",
    value: "06",
    icon: CheckCircle2,
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "Rejected",
    value: "02",
    icon: XCircle,
    color: "bg-rose-50 text-rose-600",
  },
];

const recentBookings = [
  {
    id: 1,
    service: "Wedding Photography",
    date: "25 December 2026",
    location: "Dhaka, Bangladesh",
    status: "Accepted",
  },
];

export default function CustomerDashboardPage() {
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

              <h2 className="mt-5 font-playfair text-3xl font-bold text-[#174C3C]">
                {stat.value}
              </h2>

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
          {recentBookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded-2xl border border-[#E8E1D5] bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <h3 className="font-playfair text-xl font-semibold text-[#174C3C]">
                    {booking.service}
                  </h3>

                  <div className="mt-3 flex flex-col gap-2 text-sm text-[#6B746E] sm:flex-row sm:flex-wrap sm:gap-5">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={16} className="text-[#A47C55]" />
                      {booking.date}
                    </span>

                    <span className="flex items-center gap-2">
                      <MapPin size={16} className="text-[#A47C55]" />
                      {booking.location}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {booking.status}
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
          ))}
        </div>
      </section>
    </div>
  );
}
