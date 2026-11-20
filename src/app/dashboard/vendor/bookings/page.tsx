"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CalendarDays,
  Check,
  Mail,
  MapPin,
  MessageSquareText,
  RefreshCw,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type BookingStatus = "pending" | "accepted" | "rejected";

type Booking = {
  _id: string;
  customerName?: string;
  customerEmail?: string;
  serviceName?: string;
  service?: {
    name?: string;
    price?: number | string;
  };
  price?: number | string;
  eventDate: string;
  eventLocation: string;
  message: string;
  status: BookingStatus;
  createdAt?: string;
};

export default function VendorBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const getToken = async () => {
    const result = await authClient.token();
    return result.data?.token;
  };

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = await getToken();

      if (!token) {
        throw new Error("Authentication token not found. Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/api/bookings/vendor/requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load booking requests.");
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
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleBookingAction = async (
    bookingId: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      setUpdatingId(bookingId);

      const token = await getToken();

      if (!token) {
        throw new Error("Please sign in again.");
      }

      const response = await fetch(
        `${API_URL}/api/bookings/${bookingId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not update booking status.");
      }

      setBookings((previousBookings) =>
        previousBookings.map((booking) =>
          booking._id === bookingId
            ? { ...booking, status }
            : booking
        )
      );

      toast.success(
        status === "accepted"
          ? "Booking accepted successfully!"
          : "Booking rejected successfully!"
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";

      toast.error(message);
      fetchBookings();
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date: string) => {
    if (!date) return "Date not provided";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatPrice = (price?: number | string) => {
    if (price === undefined || price === null || price === "") {
      return "Price unavailable";
    }

    const amount = Number(price);

    if (!Number.isFinite(amount)) return `$${price}`;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusStyle = (status: BookingStatus) => {
    if (status === "accepted") {
      return "bg-green-100 text-green-800";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-amber-100 text-amber-800";
  };

  return (
    <div className="w-full space-y-7">
      {/* Page Heading */}
      <div>
        <p className="mb-2 text-sm font-medium text-[#A47C55]">
          Vendor Hub / Booking Requests
        </p>

        <h1 className="font-playfair text-3xl font-bold text-[#174C3C] sm:text-4xl">
          Booking Requests
        </h1>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Review and manage your incoming event bookings.
        </p>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-end">
        <button
          onClick={fetchBookings}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-[#174C3C]/20 px-4 py-2 text-sm font-medium text-[#174C3C] transition hover:bg-[#174C3C]/5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex min-h-52 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-[#174C3C]/20 border-t-[#174C3C]" />
            <p className="mt-3 text-sm text-gray-500">
              Loading booking requests...
            </p>
          </div>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
          <p className="text-sm text-red-700">{error}</p>
          <button
            onClick={fetchBookings}
            className="mt-3 rounded-lg bg-[#174C3C] px-4 py-2 text-sm font-medium text-white hover:bg-[#123c30]"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && bookings.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#174C3C]/20 bg-white px-5 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#174C3C]/10">
            <CalendarDays className="text-[#174C3C]" size={25} />
          </div>

          <h2 className="mt-4 font-playfair text-xl font-semibold text-[#174C3C]">
            No Booking Requests Yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            New booking requests for your services will appear here.
          </p>
        </div>
      )}

      {/* Booking Cards */}
      {!loading && !error && bookings.length > 0 && (
        <div className="space-y-5">
          {bookings.map((booking) => {
            const serviceName =
              booking.serviceName ||
              booking.service?.name ||
              "Service";

            const servicePrice =
              booking.price ?? booking.service?.price;

            return (
              <article
                key={booking._id}
                className="rounded-2xl border border-[#174C3C]/10 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-6"
              >
                {/* First Row: Service, Status, Price and Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2">
                    <h2 className="font-playfair text-lg font-bold text-[#174C3C] sm:text-xl">
                      {serviceName}
                    </h2>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>

                    <span className="text-base font-bold text-[#A47C55]">
                      {formatPrice(servicePrice)}
                    </span>
                  </div>

                  {/* Both Buttons Stay Side by Side on the Right */}
                  {booking.status === "pending" && (
                    <div className="ml-auto flex shrink-0 items-center gap-2">
                      <button
                        onClick={() =>
                          handleBookingAction(booking._id, "accepted")
                        }
                        disabled={updatingId === booking._id}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-green-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
                      >
                        <Check size={15} />
                        {updatingId === booking._id
                          ? "Updating..."
                          : "Accept"}
                      </button>

                      <button
                        onClick={() =>
                          handleBookingAction(booking._id, "rejected")
                        }
                        disabled={updatingId === booking._id}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:text-sm"
                      >
                        <X size={15} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>

                <div className="my-5 border-t border-gray-100" />

                {/* Customer and Event Information */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <UserRound size={16} className="shrink-0 text-[#A47C55]" />
                    <span>{booking.customerName || "Customer"}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail size={16} className="shrink-0 text-[#A47C55]" />
                    <span className="break-all">
                      {booking.customerEmail || "Email unavailable"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays
                      size={16}
                      className="shrink-0 text-[#A47C55]"
                    />
                    <span>{formatDate(booking.eventDate)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="shrink-0 text-[#A47C55]" />
                    <span>{booking.eventLocation || "Location not provided"}</span>
                  </div>
                </div>

                {/* Customer Message */}
                <div className="mt-5 rounded-xl bg-[#F8F5EE] p-4">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#174C3C]">
                    <MessageSquareText size={16} />
                    Customer Message
                  </div>

                  <p className="text-sm leading-6 text-gray-600">
                    {booking.message || "No message provided."}
                  </p>
                </div>

                {/* Final Status Note */}
                {booking.status !== "pending" && (
                  <p className="mt-4 text-xs text-gray-500">
                    This booking request has been {booking.status}. No further
                    action is available.
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}