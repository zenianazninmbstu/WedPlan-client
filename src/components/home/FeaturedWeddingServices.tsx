
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  MapPin,
  ArrowUpRight,
  Store,
  RefreshCw,
} from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  businessName?: string;
  image?: string;
}

interface Service {
  _id: string;
  name: string;
  category: string;
  price: number;
  location: string;
  images: string[];
  vendor?: Vendor;
}

export default function FeaturedWeddingServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      const response = await fetch(
        `${apiUrl}/api/services?limit=6`
      );

      if (!response.ok) {
        throw new Error("Unable to load wedding services.");
      }

      const data = await response.json();

      if (!data.success || !Array.isArray(data.services)) {
        throw new Error("Invalid services response.");
      }

      setServices(data.services);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <section className="bg-[#F8F5EE] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        
{/* Section Heading */}
<motion.div
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.5 }}
  variants={{
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.18,
      },
    },
  }}
  className="mx-auto mb-12 max-w-2xl text-center sm:mb-16"
>
  <motion.span
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 },
      },
    }}
    className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-[#A47C55]"
  >
    Make Your Day Special
  </motion.span>

  <motion.h2
    variants={{
      hidden: { opacity: 0, y: 25 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7 },
      },
    }}
    className="font-playfair text-3xl font-semibold text-[#174C3C] sm:text-4xl lg:text-5xl"
  >
    Featured Wedding Services
  </motion.h2>

  <motion.p
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 },
      },
    }}
    className="mt-4 text-sm leading-7 text-[#6B746E] sm:text-base"
  >
    Discover exceptional wedding professionals and beautiful
    services to bring your dream celebration to life.
  </motion.p>
</motion.div>


        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                <div className="h-56 animate-pulse bg-[#E8E1D5]" />

                <div className="space-y-4 p-6">
                  <div className="h-3 w-1/3 animate-pulse rounded bg-[#E8E1D5]" />
                  <div className="h-6 w-3/4 animate-pulse rounded bg-[#E8E1D5]" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-[#E8E1D5]" />
                  <div className="h-10 animate-pulse rounded-full bg-[#E8E1D5]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="py-12 text-center">
            <p className="text-base text-red-600">{error}</p>

            <button
              onClick={fetchServices}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#174C3C] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#A47C55]"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && services.length === 0 && (
          <div className="rounded-2xl border border-[#E8E1D5] bg-white px-5 py-16 text-center">
            <Store className="mx-auto mb-4 text-[#A47C55]" size={38} />

            <h3 className="font-playfair text-2xl font-semibold text-[#174C3C]">
              No Services Available Yet
            </h3>

            <p className="mt-3 text-sm text-[#6B746E]">
              Wonderful wedding services will appear here soon.
            </p>
          </div>
        )}

        {/* Service Cards */}
        {!loading && !error && services.length > 0 && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {services.map((service, index) => (
              <motion.article
                key={service._id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="group overflow-hidden rounded-2xl border border-[#E8E1D5] bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
              >
                {/* Service Image */}
                <div className="relative h-56 overflow-hidden bg-[#E8E1D5] sm:h-60">
                  {service.images?.[0] ? (
                    <img
                      src={service.images[0]}
                      alt={service.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#6B746E]">
                      Image Not Available
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />

                  <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#174C3C]">
                    {service.category}
                  </span>
                </div>

                {/* Service Information */}
                <div className="p-5 sm:p-6">
                  <h3 className="font-playfair text-xl font-semibold text-[#174C3C] transition-colors group-hover:text-[#A47C55] sm:text-2xl">
                    {service.name}
                  </h3>

                  <div className="mt-4 flex items-center gap-2 text-sm text-[#747C76]">
                    <MapPin size={17} className="shrink-0 text-[#A47C55]" />
                    <span>{service.location}</span>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-[#EEE9DF] pt-5">
                    <div>
                      <p className="text-xs text-[#858B85]">
                        Starting Price
                      </p>

                      <p className="mt-1 text-xl font-bold text-[#174C3C]">
                        ৳{service.price.toLocaleString("en-BD")}
                      </p>
                    </div>

                    <span className="rounded-full bg-[#EAF1EC] p-3 text-[#174C3C]">
                      <Store size={20} />
                    </span>
                  </div>

                  {/* Vendor Information */}
                  <div className="mt-5 flex min-w-0 items-center gap-3 border-t border-[#EEE9DF] pt-4">
                    {service.vendor?.image ? (
                      <img
                        src={service.vendor.image}
                        alt={service.vendor.name}
                        className="h-10 w-10 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF1EC] text-[#174C3C]">
                        <Store size={18} />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-xs text-[#858B85]">
                        Service Provider
                      </p>

                      <p className="truncate text-sm font-semibold text-[#174C3C]">
                        {service.vendor?.businessName ||
                          service.vendor?.name ||
                          "Vendor information unavailable"}
                      </p>
                    </div>
                  </div>

                  {/* View Details */}
                  <Link
                    href={`/services/${service._id}`}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#174C3C] px-5 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#A47C55]"
                  >
                    View Details
                    <ArrowUpRight size={17} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
