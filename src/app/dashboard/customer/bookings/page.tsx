
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Eye,
  X,
  Search,
  ClipboardList,
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
  message?: string;
  status: BookingStatus;
  createdAt: string;
  service?: {
    name?: string;
    price?: number;
    images?: string[];
    location?: string;
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

export default function CustomerBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await authClient.token();
      const token = result.data?.token;

      if (!token) {
        throw new Error("Please sign in again to view your bookings.");
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
        throw new Error(data.message || "Failed to load bookings.");
      }

      setBookings(data.bookings || []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (bookingId: string) => {
    try {
      setCancellingId(bookingId);

      const result = await authClient.token();
      const token = result.data?.token;

      if (!token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not cancel booking.");
      }

      setBookings((previous) =>
        previous.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status: "cancelled" }
            : booking
        )
      );

      if (selectedBooking?._id === bookingId) {
        setSelectedBooking((previous) =>
          previous ? { ...previous, status: "cancelled" } : null
        );
      }

      toast.success("Booking cancelled successfully.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((booking) =>
    (booking.service?.name || "Wedding Service")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const statusStyle = (status: BookingStatus) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "cancelled":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  const getServiceImage = (booking: Booking) =>
    booking.service?.images?.[0] ||
    "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400";

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
        {loading ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center">
            <span className="loading loading-spinner loading-lg text-emerald-700" />
            <p className="mt-3 text-sm text-gray-500">
              Loading your bookings...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-white px-6 py-10 text-center">
            <p className="text-sm text-red-600">{error}</p>
            <button
              onClick={fetchBookings}
              className="mt-4 rounded-lg bg-[#173C2C] px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Try Again
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
            <ClipboardList className="mx-auto text-gray-400" size={34} />
            <h3 className="mt-3 font-semibold text-gray-700">
              {bookings.length === 0
                ? "No bookings yet"
                : "No bookings found"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {bookings.length === 0
                ? "Your service requests will appear here."
                : "Try searching with another service name."}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition-all duration-200 hover:border-emerald-300 hover:shadow-md"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Image */}
                <img
                  src={getServiceImage(booking)}
                  alt={booking.service?.name || "Wedding Service"}
                  className="h-24 w-full rounded-lg object-cover sm:w-28"
                />

                {/* Information */}
                <div className="min-w-0 flex-1 space-y-1">
                  <h2 className="truncate text-base font-bold text-[#173C2C]">
                    {booking.service?.name || "Wedding Service"}
                  </h2>

                  <p className="text-xs text-gray-500">
                    Service Provider
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <CalendarDays size={13} />
                      {formatDate(booking.eventDate)}
                    </span>

                    <span className="flex items-center gap-1">
                      <MapPin size={13} />
                      {booking.eventLocation}
                    </span>
                  </div>

                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyle(
                      booking.status
                    )}`}
                  >
                    {formatStatus(booking.status)}
                  </span>
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3 sm:min-w-36 sm:flex-col sm:items-end sm:justify-center sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                  <div>
                    <p className="text-[11px] text-gray-400">
                      Service Price
                    </p>
                    <p className="text-lg font-bold text-[#173C2C]">
                      ৳
                      {(booking.service?.price || 0).toLocaleString("en-BD")}
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

                    {booking.status === "pending" && (
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        disabled={cancellingId === booking._id}
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {cancellingId === booking._id
                          ? "Cancelling..."
                          : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
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
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
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
              src={getServiceImage(selectedBooking)}
              alt={selectedBooking.service?.name || "Wedding Service"}
              className="mt-5 h-44 w-full rounded-xl object-cover"
            />

            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <p>
                <strong>Service:</strong>{" "}
                {selectedBooking.service?.name || "Wedding Service"}
              </p>
              <p>
                <strong>Vendor:</strong> Service Provider
              </p>
              <p>
                <strong>Event Date:</strong>{" "}
                {formatDate(selectedBooking.eventDate)}
              </p>
              <p>
                <strong>Event Location:</strong>{" "}
                {selectedBooking.eventLocation}
              </p>
              <p>
                <strong>Service Location:</strong>{" "}
                {selectedBooking.service?.location || "Not available"}
              </p>
              <p>
                <strong>Request Date:</strong>{" "}
                {formatDate(selectedBooking.createdAt)}
              </p>
              <p>
                <strong>Price:</strong> ৳
                {(selectedBooking.service?.price || 0).toLocaleString("en-BD")}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {formatStatus(selectedBooking.status)}
              </p>
              <p>
                <strong>Additional Message:</strong>{" "}
                {selectedBooking.message || "No additional message"}
              </p>
            </div>

            {selectedBooking.status === "pending" && (
              <button
                onClick={() => cancelBooking(selectedBooking._id)}
                disabled={cancellingId === selectedBooking._id}
                className="mt-5 w-full rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
              >
                {cancellingId === selectedBooking._id
                  ? "Cancelling..."
                  : "Cancel Booking"}
              </button>
            )}

            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-3 w-full rounded-xl bg-[#173C2C] py-3 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
