
"use client";

import { authClient } from "@/lib/auth-client";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Check,
  X,
  Loader2,
  ImageOff,
  MapPin,
  PackageCheck,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const categories = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

type Service = {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  location: string;
  images: string[];
  vendorId: string;
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
  createdAt?: string;
  vendor?: {
    name: string;
    email: string;
  } | null;
};

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  const getToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Please login again.");
    }

    return data.token;
  };

  // Load all submitted services
  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await fetch(`${API_URL}/api/services/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load services.");
      }

      setServices(data.services || []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load services."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Search and filter
  const filteredServices = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return services.filter((service) => {
      const matchesSearch =
        !searchText ||
        service.name?.toLowerCase().includes(searchText) ||
        service.location?.toLowerCase().includes(searchText) ||
        service.vendor?.name?.toLowerCase().includes(searchText) ||
        service.vendor?.email?.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" || service.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" || service.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [services, search, statusFilter, categoryFilter]);

  // Approve pending or reject services
  const handleStatusChange = async (
    service: Service,
    status: "approved" | "rejected"
  ) => {
    try {
      setUpdatingId(service._id);

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/services/${service._id}/status`,
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

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update service status.");
      }

      setServices((previous) =>
        previous.map((item) =>
          item._id === service._id
            ? { ...item, status, isActive: false }
            : item
        )
      );

      toast.success(
        status === "approved"
          ? "Service approved successfully!"
          : "Service rejected successfully!"
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Change published service visibility
  const handleVisibilityChange = async (service: Service) => {
    try {
      setUpdatingId(service._id);

      const token = await getToken();
      const nextActiveState = !service.isActive;

      const response = await fetch(
        `${API_URL}/api/services/${service._id}/visibility`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isActive: nextActiveState,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update service visibility.");
      }

      setServices((previous) =>
        previous.map((item) =>
          item._id === service._id
            ? { ...item, isActive: nextActiveState }
            : item
        )
      );

      toast.success(
        nextActiveState
          ? "Service is now visible to customers!"
          : "Service has been deactivated."
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete service
  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/services/${deleteTarget._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete service.");
      }

      setServices((previous) =>
        previous.filter((item) => item._id !== deleteTarget._id)
      );

      toast.success("Service deleted successfully!");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete service."
      );
    } finally {
      setDeleting(false);
    }
  };

  // Display prices in US dollars
  const formatPrice = (price: number) =>
    `$${Number(price || 0).toLocaleString("en-US")}`;

  const formatDate = (date?: string) => {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status: Service["status"]) => {
    if (status === "approved") {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }

    if (status === "rejected") {
      return "bg-red-50 text-red-600 border-red-100";
    }

    return "bg-amber-50 text-amber-700 border-amber-100";
  };

  const pendingCount = services.filter(
    (service) => service.status === "pending"
  ).length;

  const approvedCount = services.filter(
    (service) => service.status === "approved"
  ).length;

  const activeCount = services.filter(
    (service) => service.status === "approved" && service.isActive
  ).length;

  return (
    <div className="space-y-4">
      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-playfair text-2xl font-bold tracking-tight text-[#174C3C] sm:text-3xl">
          Manage Wedding Services
        </h1>

        <button
          type="button"
          onClick={fetchServices}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-[#DCE7DF] bg-white px-3 py-2 text-xs font-semibold text-[#174C3C] shadow-sm transition hover:bg-[#F4F8F4] disabled:opacity-50"
        >
          <RefreshCw
            size={14}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[
          {
            label: "Total Services",
            value: services.length,
            color: "text-[#174C3C]",
            border: "border-[#E5EBE5]",
          },
          {
            label: "Pending Review",
            value: pendingCount,
            color: "text-amber-600",
            border: "border-amber-100",
          },
          {
            label: "Approved",
            value: approvedCount,
            color: "text-emerald-700",
            border: "border-emerald-100",
          },
          {
            label: "Currently Active",
            value: activeCount,
            color: "text-[#174C3C]",
            border: "border-[#E5EBE5]",
          },
        ].map((item) => (
          <div
            key={item.label}
            className={`flex items-center justify-between rounded-xl border ${item.border} bg-white px-3 py-2.5 shadow-sm sm:px-4`}
          >
            <span className="text-[11px] font-medium text-[#849087] sm:text-xs">
              {item.label}
            </span>
            <span className={`text-lg font-bold ${item.color}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by service name and location..."
            className="h-10 w-full rounded-lg border border-[#DCE7DF] bg-white pl-10 pr-3 text-sm text-gray-700 outline-none transition focus:border-[#174C3C] focus:ring-2 focus:ring-[#174C3C]/10"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-10 min-w-0 rounded-lg border border-[#DCE7DF] bg-white px-2.5 text-xs text-gray-700 outline-none focus:border-[#174C3C] sm:w-36"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="h-10 min-w-0 rounded-lg border border-[#DCE7DF] bg-white px-2.5 text-xs text-gray-700 outline-none focus:border-[#174C3C] sm:w-48"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PackageCheck size={17} className="text-[#174C3C]" />
          <h2 className="text-sm font-semibold text-[#263C32]">
            Submitted Services
          </h2>
        </div>

        <span className="text-xs font-medium text-[#849087]">
          {filteredServices.length} results
        </span>
      </div>

      {/* Service List */}
      {loading ? (
        <div className="flex min-h-48 items-center justify-center rounded-xl border border-[#E5EBE5] bg-white">
          <div className="flex items-center gap-2 text-sm text-[#174C3C]">
            <Loader2 size={22} className="animate-spin" />
            Loading services...
          </div>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed border-[#DCE7DF] bg-white px-5 text-center">
          <PackageCheck size={34} className="mb-2 text-[#A8B8AC]" />
          <h3 className="text-sm font-semibold text-[#344A3B]">
            No services found
          </h3>
          <p className="mt-1 text-xs text-[#87948B]">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredServices.map((service) => (
            <article
              key={service._id}
              className="overflow-hidden rounded-xl border border-[#E4EAE5] bg-white p-2.5 shadow-sm transition duration-200 hover:border-[#B9D2C2] hover:shadow-md sm:p-3"
            >
              <div className="flex min-w-0 gap-3">
                {/* Service Image */}
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-[#F0F4F0] sm:h-28 sm:w-32">
                  {service.images?.[0] ? (
                    <img
                      src={service.images[0]}
                      alt={service.name}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#A5B4A8]">
                      <ImageOff size={25} />
                    </div>
                  )}
                </div>

                {/* Service Details */}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  {/* Name + Status Badge */}
                  <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                    <h3 className="min-w-0 truncate font-playfair text-lg font-bold text-[#174C3C]">
                      {service.name}
                    </h3>

                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold capitalize sm:text-xs ${getStatusStyle(
                        service.status
                      )}`}
                    >
                      {service.status}
                    </span>
                  </div>

                  {/* Category */}
                  <span className="text-xs font-semibold text-[#A47C55] sm:text-sm">
                    {service.category}
                  </span>

                  {/* Description */}
                  <p className="line-clamp-2 text-sm text-[#7B827D]">
                    {service.description}
                  </p>

                  {/* Price + Actions */}
                  <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
                    <p className="shrink-0 text-xs font-bold text-[#174C3C] sm:text-sm">
                      {formatPrice(service.price)}
                    </p>

                    <div className="flex flex-wrap items-center gap-1">
                      {service.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(service, "approved")
                            }
                            disabled={updatingId === service._id}
                            className="inline-flex items-center gap-0.5 rounded bg-[#174C3C] px-2 py-1 text-[9px] font-semibold text-white transition hover:bg-[#23634F] disabled:opacity-50 sm:text-[10px]"
                          >
                            {updatingId === service._id ? (
                              <Loader2 size={10} className="animate-spin" />
                            ) : (
                              <Check size={10} />
                            )}
                            Approve
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(service, "rejected")
                            }
                            disabled={updatingId === service._id}
                            className="inline-flex items-center gap-0.5 rounded border border-red-200 bg-red-50 px-2 py-1 text-[9px] font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50 sm:text-[10px]"
                          >
                            <X size={10} />
                            Reject
                          </button>
                        </>
                      )}

                      {service.status === "approved" && (
                        <>
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(service, "rejected")
                            }
                            disabled={updatingId === service._id}
                            className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            {updatingId === service._id ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <X size={13} />
                            )}
                            Reject
                          </button>

                          <button
                            type="button"
                            role="switch"
                            aria-checked={service.isActive}
                            aria-label={`${
                              service.isActive ? "Deactivate" : "Activate"
                            } ${service.name}`}
                            onClick={() => handleVisibilityChange(service)}
                            disabled={updatingId === service._id}
                            className={`inline-flex items-center gap-1 rounded border px-3 py-1.5 text-xs font-semibold transition disabled:opacity-50 ${
                              service.isActive
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-gray-200 bg-gray-50 text-gray-600"
                            }`}
                          >
                            {updatingId === service._id ? (
                              <Loader2 size={13} className="animate-spin" />
                            ) : (
                              <span
                                className={`relative h-3 w-5 rounded-full ${
                                  service.isActive
                                    ? "bg-emerald-600"
                                    : "bg-gray-300"
                                }`}
                              >
                                <span
                                  className={`absolute top-0.5 h-2 w-2 rounded-full bg-white shadow-sm transition-all ${
                                    service.isActive ? "left-2.5" : "left-0.5"
                                  }`}
                                />
                              </span>
                            )}
                            {service.isActive ? "Active" : "Inactive"}
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => setDeleteTarget(service)}
                        disabled={updatingId === service._id}
                        className="inline-flex items-center gap-0.5 rounded border border-red-200 bg-white px-2 py-1 text-[9px] font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50 sm:text-[10px]"
                      >
                        <Trash2 size={10} />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Location + Date */}
                  <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-[#7B827D] sm:text-sm">
                    <span className="inline-flex min-w-0 items-center gap-1">
                      <MapPin
                        size={11}
                        className="shrink-0 text-[#A47C55]"
                      />
                      <span className="max-w-40 truncate">
                        {service.location}
                      </span>
                    </span>

                    <span>{formatDate(service.createdAt)}</span>
                  </div>

                  {/* Vendor Information */}
                  <div className="min-w-0 truncate text-xs text-[#7B827D] sm:text-sm">
                    <span className="font-semibold text-[#344A3B]">
                      {service.vendor?.name || "Wedding Vendor"}
                    </span>
                    <span className="text-[#A0AAA2]"> · </span>
                    {service.vendor?.email || "Email unavailable"}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#071B14]/60 p-4 backdrop-blur-sm"
          onClick={() => !deleting && setDeleteTarget(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-service-title"
            className="w-full max-w-sm rounded-2xl border border-white/20 bg-white p-5 shadow-2xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={22} />
            </div>

            <h2
              id="delete-service-title"
              className="mt-4 text-center font-playfair text-xl font-bold text-[#174C3C]"
            >
              Delete Service?
            </h2>

            <p className="mt-2 text-center text-sm leading-5 text-[#7B827D]">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#344A3B]">
                {deleteTarget.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="flex-1 rounded-lg border border-[#DCE7DF] px-3 py-2.5 text-xs font-semibold text-[#53645A] transition hover:bg-[#F6F8F6] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
