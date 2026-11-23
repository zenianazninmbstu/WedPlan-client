
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Service = {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  location: string;
  images?: string[];
  vendorName?: string;
  vendorId?: string;
};

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [eventDate, setEventDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/services/${serviceId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load service details.");
        }

        setService(data.service || data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) fetchService();
  }, [serviceId]);

  const handleBooking = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!eventDate || !eventLocation.trim() || !message.trim()) {
      toast.error("Please complete all booking fields.");
      return;
    }

    try {
      setSubmitting(true);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        toast.error("Please sign in to send a booking request.");
        router.push("/sign-in");
        return;
      }

      const response = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId,
          eventDate,
          eventLocation: eventLocation.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Booking request failed.");
      }

      toast.success("Booking request submitted successfully!");

      setEventDate("");
      setEventLocation("");
      setMessage("");

      router.push("/dashboard/customer/bookings");
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FCFAF8]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#174C3C]/20 border-t-[#174C3C]" />
          <p className="mt-3 text-sm text-gray-500">
            Loading service details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !service) {
    return (
      <main className="min-h-screen bg-[#FCFAF8] px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#174C3C]">
          Service Not Found
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {error || "This service is not available."}
        </p>
        <Link
          href="/services"
          className="mt-5 inline-block rounded-lg bg-[#174C3C] px-5 py-3 text-sm font-semibold text-white"
        >
          Browse Services
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FCFAF8] px-4 py-10 text-[#292321] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/services"
          className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-[#174C3C] hover:underline"
        >
          <ArrowLeft size={17} />
          Back to Services
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Service Information */}
          <section>
            <div className="h-72 overflow-hidden rounded-2xl bg-[#EEE9E5] sm:h-96">
              {service.images?.[0] ? (
            <img
              src={service.images[0]}
               alt={service.name}
  onError={() => console.log("Broken image URL:", service.images?.[0])}
  className="h-full w-full object-cover"
               />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  No image available
                </div>
              )}
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-[#963E4B]">
              {service.category}
            </p>

            <h1 className="mt-2 font-playfair text-3xl font-bold text-[#174C3C]">
              {service.name}
            </h1>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
              {service.description}
            </p>

            <div className="mt-6 space-y-3 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <MapPin size={17} className="text-[#A47C55]" />
                {service.location}
              </p>

              {service.vendorName && (
                <p>Provided by: {service.vendorName}</p>
              )}
            </div>

            <p className="mt-6 text-2xl font-bold text-[#963E4B]">
              ৳{Number(service.price).toLocaleString("en-BD")}
            </p>
          </section>

          {/* Booking Form */}
          <section className="h-fit rounded-2xl border border-[#EDE7E2] bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#A47C55]">
                Make It Yours
              </p>
              <h2 className="mt-2 font-playfair text-2xl font-bold text-[#174C3C]">
                Request a Booking
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Share your event details with the vendor.
              </p>
            </div>

            <form onSubmit={handleBooking} className="space-y-5">
              <div>
                <label
                  htmlFor="eventDate"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  <CalendarDays className="mr-2 inline" size={16} />
                  Event Date
                </label>
                <input
                  id="eventDate"
                  type="date"
                  min={today}
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#174C3C]"
                />
              </div>

              <div>
                <label
                  htmlFor="eventLocation"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  <MapPin className="mr-2 inline" size={16} />
                  Event Location
                </label>
                <input
                  id="eventLocation"
                  type="text"
                  required
                  maxLength={300}
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  placeholder="Enter event venue or city"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#174C3C]"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Additional Message
                </label>
                <textarea
                  id="message"
                  required
                  maxLength={1000}
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell the vendor about your event requirements..."
                  className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#174C3C]"
                />
                <p className="mt-1 text-right text-xs text-gray-400">
                  {message.length}/1000
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-[#174C3C] py-3.5 text-sm font-semibold text-white transition hover:bg-[#123C30] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Submitting Request..." : "Send Booking Request"}
              </button>

              <p className="text-center text-xs leading-5 text-gray-400">
                Your request will be sent to the vendor for review.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
