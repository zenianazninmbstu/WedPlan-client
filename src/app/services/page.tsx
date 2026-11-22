
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";

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
};

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchServices = async (
    searchValue = search,
    categoryValue = category,
    locationValue = location,
    sortValue = sort
  ) => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      params.set("limit", "7");

      if (searchValue.trim()) {
        params.set("search", searchValue.trim());
      }

      if (categoryValue) {
        params.set("category", categoryValue);
      }

      if (locationValue.trim()) {
        params.set("location", locationValue.trim());
      }

      if (sortValue === "price-asc" || sortValue === "price-desc") {
        params.set("sort", sortValue);
      }

      const response = await fetch(
        `${API_URL}/api/services?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Unable to load wedding services.");
      }

      const data = await response.json();
      setServices(data.services || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices("", "", "", "newest");
  }, []);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchServices();
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setLocation("");
    setSort("newest");
    fetchServices("", "", "", "newest");
  };

  return (
    <main className="min-h-screen bg-[#FCFAF8] px-4 py-10 text-[#292321] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Page Heading */}
        <section className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F5EDE8] px-3 py-1.5 text-xs font-medium text-[#963E4B]">
            <span>✧</span>
            Curated Wedding Marketplace
          </div>

          <h1 className="font-serif text-3xl font-bold text-[#292321] sm:text-4xl">
            Browse Wedding Services
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#817976] sm:text-base">
            Search verified photographers, dream venues, florists,
            caterers, and stylists. Sign in to view full galleries
            and send booking requests.
          </p>
        </section>

        {/* Search Filters */}
        <form
          onSubmit={handleSearch}
          className="mb-7 grid grid-cols-1 items-stretch gap-3 rounded-xl border border-[#EDE7E2] bg-white p-3 shadow-sm sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_110px_48px]"
        >
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="⌕  Search services..."
            className="min-w-0 rounded-lg border border-[#EAE5E1] bg-white px-3 py-2.5 text-sm text-[#292321] outline-none transition focus:border-[#963E4B] focus:ring-2 focus:ring-[#963E4B]/10"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="min-w-0 rounded-lg border border-[#EAE5E1] bg-white px-3 py-2.5 text-sm text-[#665D59] outline-none transition focus:border-[#963E4B]"
          >
            <option value="">All Categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="⌖  Filter by city / location..."
            className="min-w-0 rounded-lg border border-[#EAE5E1] bg-white px-3 py-2.5 text-sm text-[#292321] outline-none transition focus:border-[#963E4B] focus:ring-2 focus:ring-[#963E4B]/10"
          />

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="min-w-0 rounded-lg border border-[#EAE5E1] bg-white px-3 py-2.5 text-sm text-[#665D59] outline-none transition focus:border-[#963E4B]"
          >
            <option value="newest">Featured & Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>

          <button
            type="submit"
           className="mt-auto block w-full rounded-lg bg-[#174C3C] py-2.5 text-center text-sm font-semibold text-white transition duration-200 hover:bg-[#10392D] focus:outline-none focus:ring-2 focus:ring-[#174C3C]/30"
          >
            Search
          </button>

          <button
            type="button"
            onClick={handleReset}
            title="Reset all filters"
            className="rounded-lg border border-[#EAE5E1] bg-white px-4 py-2.5 text-sm font-medium text-[#776D68] transition hover:border-[#963E4B] hover:bg-[#F5EDE8] hover:text-[#963E4B]"
          >
            ✕
          </button>
        </form>

        {/* Service Count */}
        <div className="mb-5">
          <p className="text-sm text-[#817976]">
            Showing {services.length} approved wedding services
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-xl bg-[#EEE9E5]"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-xl border border-red-100 bg-white px-5 py-14 text-center">
            <p className="font-medium text-red-700">{error}</p>

            <button
              onClick={() => fetchServices()}
              className="mt-4 rounded-lg bg-[#963E4B] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#78313C]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && services.length === 0 && (
          <div className="rounded-xl border border-[#EDE7E2] bg-white px-5 py-16 text-center shadow-sm">
            <div className="mb-3 text-3xl text-[#963E4B]">⌕</div>

            <h2 className="font-serif text-xl font-semibold text-[#74434A]">
              No matching wedding services found
            </h2>

            <p className="mt-2 text-sm text-[#8B817C]">
              Try adjusting your search keywords, category, or location filters.
            </p>

            <button
              onClick={handleReset}
              className="mt-5 rounded-lg border border-[#963E4B]/30 bg-white px-5 py-2.5 text-sm font-semibold text-[#963E4B] transition hover:bg-[#F5EDE8]"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Service Cards */}
        {!loading && !error && services.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <article
                key={service._id}
                className="group overflow-hidden rounded-xl border border-[#EDE7E2] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <div className="h-52 overflow-hidden bg-[#F0EBE7]">
                  {service.images?.[0] ? (
                    <img
                      src={service.images[0]}
                      alt={service.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-[#948983]">
                      No image available
                    </div>
                  )}
                </div>

                <div className="flex h-[280px] flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#963E4B]">
                    {service.category}
                  </p>

                  <h2 className="mt-2 font-serif text-xl font-semibold text-[#302825]">
                    {service.name}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#817976]">
                    {service.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm text-[#817976]">
                      📍 {service.location}
                    </span>

                    <span className="font-semibold text-[#963E4B]">
                      ৳{Number(service.price).toLocaleString("en-BD")}
                    </span>
                  </div>

                  {service.vendorName && (
                    <p className="mt-2 text-xs text-[#8B817C]">
                      By {service.vendorName}
                    </p>
                  )}

                  <Link
  href={`/services/${service._id}`}
  className="mt-auto block w-full rounded-lg bg-[#174C3C] py-2.5 text-center text-sm font-semibold text-white transition duration-200 hover:bg-[#10392D] focus:outline-none focus:ring-2 focus:ring-[#174C3C]/30"
>
  View Details
</Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
