
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Eye,
  X,
  Search,
  ClipboardList,
  UserRound,
} from "lucide-react";

type Booking = {
  id: number;
  service: string;
  image: string;
  vendor: string;
  date: string;
  location: string;
  requestDate: string;
  price: number;
  status: "Pending" | "Accepted" | "Rejected" | "Cancelled";
};

const demoBookings: Booking[] = [
  {
    id: 1,
    service: "Wedding Photography",
    image:
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400",
    vendor: "Studio Moments",
    date: "25 December 2026",
    location: "Dhaka, Bangladesh",
    requestDate: "18 November 2026",
    price: 15000,
    status: "Pending",
  },
  {
    id: 2,
    service: "Wedding Decoration",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400",
    vendor: "Dream Decor",
    date: "30 December 2026",
    location: "Dhaka, Bangladesh",
    requestDate: "17 November 2026",
    price: 25000,
    status: "Accepted",
  },
  {
    id: 3,
    service: "Bridal Makeup",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400",
    vendor: "Glamour Studio",
    date: "5 January 2027",
    location: "Gazipur, Bangladesh",
    requestDate: "16 November 2026",
    price: 8000,
    status: "Rejected",
  },
];

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState(demoBookings);
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const filteredBookings = bookings.filter((booking) =>
    booking.service.toLowerCase().includes(search.toLowerCase())
  );

  const cancelBooking = (id: number) => {
    setBookings((previous) =>
      previous.map((booking) =>
        booking.id === id && booking.status === "Pending"
          ? { ...booking, status: "Cancelled" }
          : booking
      )
    );
  };

  const statusStyle = (status: Booking["status"]) => {
    switch (status) {
      case "Accepted":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Cancelled":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <p className="text-sm font-semibold tracking-wider text-emerald-700">
          CUSTOMER DASHBOARD
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#173C2C]">
          My Bookings
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Track and manage all your wedding service requests.
        </p>
      </div>

      {/* Demo notice */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Demo bookings are shown for design testing. Real booking data will
        replace these later.
      </div>

      {/* Search and count */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service name..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-emerald-600"
          />
        </div>

        <p className="text-sm text-gray-500">
          {filteredBookings.length} booking requests
        </p>
      </div>

      {/* Booking List */}
      

<div className="space-y-3">
  {filteredBookings.map((booking) => (
    <div
      key={booking.id}
      className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-md"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Image */}
        <img
          src={booking.image}
          alt={booking.service}
          className="h-24 w-full rounded-lg object-cover sm:w-28"
        />

        {/* Information */}
        <div className="min-w-0 flex-1 space-y-1">
          <h2 className="truncate text-base font-bold text-[#173C2C]">
            {booking.service}
          </h2>

          <p className="text-xs text-gray-500">
            {booking.vendor}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <CalendarDays size={13} />
              {booking.date}
            </span>

            <span className="flex items-center gap-1">
              <MapPin size={13} />
              {booking.location}
            </span>
          </div>

          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyle(
              booking.status
            )}`}
          >
            {booking.status}
          </span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 sm:min-w-36 sm:flex-col sm:items-end sm:justify-center sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
          <div>
            <p className="text-[11px] text-gray-400">Service Price</p>
            <p className="text-lg font-bold text-[#173C2C]">
              ৳{booking.price.toLocaleString("en-BD")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedBooking(booking)}
              title="View Details"
              className="rounded-lg bg-emerald-50 p-2 text-emerald-800 transition hover:bg-emerald-100"
            >
              <Eye size={17} />
            </button>

            {booking.status === "Pending" && (
              <button
                onClick={() => cancelBooking(booking.id)}
                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  ))}

  {filteredBookings.length === 0 && (
    <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
      <ClipboardList className="mx-auto text-gray-400" size={34} />
      <h3 className="mt-3 font-semibold text-gray-700">
        No bookings found
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Try searching with another service name.
      </p>
    </div>
  )}
</div>


      <Link
        href="/services"
        className="inline-flex rounded-xl bg-[#173C2C] px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
      >
        Browse More Services
      </Link>

      {/* Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#173C2C]">
                Booking Details
              </h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <img
              src={selectedBooking.image}
              alt={selectedBooking.service}
              className="mt-5 h-44 w-full rounded-xl object-cover"
            />

            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <p>
                <strong>Service:</strong> {selectedBooking.service}
              </p>
              <p>
                <strong>Vendor:</strong> {selectedBooking.vendor}
              </p>
              <p>
                <strong>Event Date:</strong> {selectedBooking.date}
              </p>
              <p>
                <strong>Location:</strong> {selectedBooking.location}
              </p>
              <p>
                <strong>Request Date:</strong> {selectedBooking.requestDate}
              </p>
              <p>
                <strong>Price:</strong> ৳
                {selectedBooking.price.toLocaleString("en-BD")}
              </p>
              <p>
                <strong>Status:</strong> {selectedBooking.status}
              </p>
            </div>

            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-6 w-full rounded-xl bg-[#173C2C] py-3 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
