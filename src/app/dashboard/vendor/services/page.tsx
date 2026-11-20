"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  Plus,
  MapPin,
  Pencil,
  Trash2,
  Eye,
  X,
  BriefcaseBusiness,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

type Service = {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  location: string;
  images: string[];
  status: "pending" | "approved" | "rejected";
  isActive: boolean;
};

type EditForm = {
  name: string;
  description: string;
  category: string;
  price: string;
  location: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

const inputClass =
  "w-full rounded-xl border border-[#E8E1D5] bg-[#FAF8F3] px-4 py-3 text-sm text-[#174C3C] outline-none transition focus:border-[#174C3C] focus:bg-white";

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-[#174C3C] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#10392D] disabled:cursor-not-allowed disabled:opacity-60";

const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-full border border-[#E8E1D5] bg-white px-4 py-2.5 text-sm font-semibold text-[#174C3C] transition-colors hover:bg-[#F8F5EE] disabled:cursor-not-allowed disabled:opacity-60";

async function getToken(): Promise<string> {
  const result = await authClient.token();

  if (result.error || !result.data?.token) {
    throw new Error("Your session has expired. Please sign in again.");
  }

  return result.data.token;
}

// Read JSON safely, including when the server returns an empty or non-JSON response.
async function readResponse(response: Response): Promise<Record<string, any>> {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export default function VendorServicesPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [viewingService, setViewingService] = useState<Service | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    name: "",
    description: "",
    category: "",
    price: "",
    location: "",
  });

  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Load the signed-in vendor's services.
  async function loadServices() {
    setError("");

    try {
      const token = await getToken();

      const response = await fetch(`${API_URL}/api/services/vendor/my-services`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Could not load your services.");
      }

      setServices(Array.isArray(data.services) ? data.services : []);
    } catch (error) {
      setError(getErrorMessage(error, "Could not load your services."));
    } finally {
      setLoading(false);
    }
  }

  // Only signed-in vendors can use this page.
  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/sign-in");
      return;
    }

    if (session.user.role !== "vendor") {
      router.replace("/");
      return;
    }

    void loadServices();
    // loadServices is intentionally called when the session is ready.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, session, router]);

  const filteredServices = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return services.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchText) ||
        service.category.toLowerCase().includes(searchText) ||
        service.location.toLowerCase().includes(searchText);

      const matchesStatus = filter === "all" || service.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [services, search, filter]);

  const pendingCount = services.filter((service) => service.status === "pending").length;
  const approvedCount = services.filter((service) => service.status === "approved").length;
  const rejectedCount = services.filter((service) => service.status === "rejected").length;

  function openEditForm(service: Service) {
    setEditingService(service);
    setFormError("");
    setNotice("");

    setEditForm({
      name: service.name,
      description: service.description,
      category: service.category,
      price: String(service.price ?? ""),
      location: service.location,
    });
  }

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingService) return;

    const price = Number(editForm.price);

    if (!Number.isFinite(price) || price <= 0) {
      setFormError("Please enter a price greater than zero.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/services/vendor/${editingService._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editForm.name.trim(),
            description: editForm.description.trim(),
            category: editForm.category,
            price,
            location: editForm.location.trim(),
            images: editingService.images ?? [],
          }),
        }
      );

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Could not update the service.");
      }

      setEditingService(null);
      setNotice(
        "Service updated. It may need admin approval again before customers can see it."
      );

      await loadServices();
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not update the service."));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;

    setDeleting(true);
    setError("");

    try {
      const token = await getToken();

      const response = await fetch(`${API_URL}/api/services/vendor/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Could not delete the service.");
      }

      setServices((currentServices) =>
        currentServices.filter((service) => service._id !== deleteId)
      );
      setDeleteId(null);
      setNotice("Service deleted successfully.");
    } catch (error) {
      setError(getErrorMessage(error, "Could not delete the service."));
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleAvailability(service: Service) {
    if (service.status !== "approved") return;

    const newAvailability = !service.isActive;

    setTogglingId(service._id);
    setError("");
    setNotice("");

    try {
      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/services/vendor/${service._id}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive: newAvailability }),
        }
      );

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data.message || "Could not update availability.");
      }

      setServices((currentServices) =>
        currentServices.map((item) =>
          item._id === service._id
            ? { ...item, isActive: newAvailability }
            : item
        )
      );

      setNotice(data.message || "Availability updated successfully.");
    } catch (error) {
      setError(getErrorMessage(error, "Could not update availability."));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setTogglingId(null);
    }
  }

  if (isPending || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#174C3C]" />
        <span className="sr-only">Loading services</span>
      </div>
    );
  }

  return (
    <main className="min-h-screen space-y-7 bg-[#F8F5EE] p-4 text-[#174C3C] sm:p-6 lg:p-8">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#A47C55]">
            Vendor Workspace
          </p>
          <h1 className="font-playfair text-3xl font-semibold sm:text-4xl">
            My Services
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-7 text-[#6B746E]">
            View and manage your services, check approval status, and control
            which approved services are available to customers.
          </p>
        </div>

        <Link
          href="/dashboard/vendor/add-service"
          className={primaryButton}
        >
          <Plus size={18} />
          Add New Service
        </Link>
      </header>

      {notice && (
        <MessageBox
          type="success"
          message={notice}
          onClose={() => setNotice("")}
        />
      )}

      {error && (
        <MessageBox
          type="error"
          message={error}
          onClose={() => setError("")}
        />
      )}

      <section
        aria-label="Service statistics"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        <StatCard
          title="Total Services"
          value={services.length}
          icon={<BriefcaseBusiness size={20} />}
        />
        <StatCard
          title="Approved"
          value={approvedCount}
          icon={<CheckCircle2 size={20} />}
        />
        <StatCard
          title="Pending"
          value={pendingCount}
          icon={<Clock size={20} />}
        />
        <StatCard
          title="Rejected"
          value={rejectedCount}
          icon={<XCircle size={20} />}
        />
      </section>

      <section className="rounded-2xl border border-[#E8E1D5] bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-playfair text-xl font-semibold">Your Listings</h2>
            <p className="mt-1 text-xs text-[#6B746E]">
              {filteredServices.length}{" "}
              {filteredServices.length === 1 ? "service" : "services"} found
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative">
              <span className="sr-only">Search services</span>
              <Search
                size={18}
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B746E]"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search services..."
                className={`${inputClass} pl-10 sm:w-64`}
              />
            </label>

            <label>
              <span className="sr-only">Filter by approval status</span>
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
                className={inputClass}
              >
                <option value="all">All Services</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      {filteredServices.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-[#D9CFBC] bg-white px-5 py-14 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EAF1EC]">
            <BriefcaseBusiness size={28} />
          </div>

          <h2 className="font-playfair text-xl font-semibold">
            {services.length === 0 ? "You have no services yet" : "No matching services"}
          </h2>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#6B746E]">
            {services.length === 0
              ? "Add your first service to start showing your work."
              : "Try another search word or approval status."}
          </p>

          {services.length === 0 && (
            <Link
              href="/dashboard/vendor/add-service"
              className={`${primaryButton} mt-6`}
            >
              <Plus size={17} />
              Add Your First Service
            </Link>
          )}
        </section>
      ) : (
        <section
          aria-label="Your services"
          className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3"
        >
          {filteredServices.map((service) => {
            const isVisibleToCustomers =
              service.status === "approved" && service.isActive;

            return (
              <article
                key={service._id}
                className="flex flex-col overflow-hidden rounded-2xl border border-[#E8E1D5] bg-white shadow-sm"
              >
                <div className="relative h-52 bg-[#EAF1EC]">
                  {service.images?.[0] ? (
                    <img
                      src={service.images[0]}
                      alt={service.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#174C3C]">
                      <BriefcaseBusiness size={38} />
                    </div>
                  )}

                  <div className="absolute left-4 top-4">
                    <StatusBadge status={service.status} />
                  </div>

                  <div className="absolute bottom-3 right-3 rounded-lg bg-white px-3 py-2 text-sm font-bold text-[#174C3C] shadow-sm">
                    ৳{Number(service.price ?? 0).toLocaleString("en-BD")}
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#A47C55]">
                      {service.category}
                    </p>
                    <h2 className="mt-2 line-clamp-1 font-playfair text-xl font-semibold">
                      {service.name}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#6B746E]">
                      {service.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-[#6B746E]">
                    <MapPin size={16} className="shrink-0 text-[#A47C55]" />
                    <span className="line-clamp-1">{service.location}</span>
                  </div>

                  {service.status === "pending" && (
                    <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
                      Waiting for admin approval. Customers cannot see this service yet.
                    </p>
                  )}

                  {service.status === "rejected" && (
                    <p className="rounded-lg bg-red-50 p-3 text-xs leading-5 text-red-700">
                      This service was rejected and is not visible to customers.
                    </p>
                  )}

                  <div className="flex items-center justify-between gap-3 rounded-xl bg-[#F8F5EE] px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold">
                        {isVisibleToCustomers
                          ? "Visible to customers"
                          : "Not visible to customers"}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#6B746E]">
                        {service.status === "approved"
                          ? "Use the switch to manage availability."
                          : "Only approved services can be made available."}
                      </p>
                    </div>

                    <button
                      type="button"
                      role="switch"
                      aria-checked={service.isActive}
                      aria-label={`Make ${service.name} ${
                        service.isActive ? "unavailable" : "available"
                      }`}
                      disabled={
                        togglingId === service._id ||
                        service.status !== "approved"
                      }
                      onClick={() => void handleToggleAvailability(service)}
                      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                        isVisibleToCustomers ? "bg-[#174C3C]" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          isVisibleToCustomers ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="mt-auto grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setViewingService(service)}
                      className={secondaryButton}
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditForm(service)}
                      className={secondaryButton}
                    >
                      <Pencil size={16} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteId(service._id)}
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-60"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>

                  {isVisibleToCustomers && (
                    <Link
                      href={`/services/${service._id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#A47C55] hover:underline"
                    >
                      View public page
                      <ArrowUpRight size={13} />
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}

      {viewingService && (
        <Modal onClose={() => setViewingService(null)}>
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#A47C55]">
                {viewingService.category}
              </p>
              <h2 className="mt-1 font-playfair text-2xl font-semibold">
                {viewingService.name}
              </h2>
            </div>
            <CloseButton onClick={() => setViewingService(null)} label="Close details" />
          </div>

          {viewingService.images?.length > 0 && (
            <div className="mb-5 grid grid-cols-2 gap-3">
              {viewingService.images.map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${viewingService.name} image ${index + 1}`}
                  className="h-40 w-full rounded-xl object-cover"
                />
              ))}
            </div>
          )}

          <p className="whitespace-pre-line text-sm leading-7 text-[#6B746E]">
            {viewingService.description}
          </p>

          <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            <DetailItem
              label="Price"
              value={`৳${Number(viewingService.price ?? 0).toLocaleString("en-BD")}`}
            />
            <DetailItem label="Location" value={viewingService.location} />
            <DetailItem label="Approval Status" value={viewingService.status} />
            <DetailItem
              label="Visible to customers"
              value={
                viewingService.status === "approved" && viewingService.isActive
                  ? "Yes"
                  : "No"
              }
            />
          </dl>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setViewingService(null)}
              className={secondaryButton}
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {editingService && (
        <Modal onClose={() => !saving && setEditingService(null)}>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-playfair text-2xl font-semibold">Edit Service</h2>
            <CloseButton
              onClick={() => !saving && setEditingService(null)}
              label="Close edit form"
            />
          </div>

          <form onSubmit={handleUpdate} className="space-y-4">
            {formError && <MessageBox type="error" message={formError} />}

            <Field label="Service Name">
              <input
                required
                value={editForm.name}
                onChange={(event) =>
                  setEditForm({ ...editForm, name: event.target.value })
                }
                className={inputClass}
              />
            </Field>

            <Field label="Description">
              <textarea
                required
                rows={4}
                value={editForm.description}
                onChange={(event) =>
                  setEditForm({ ...editForm, description: event.target.value })
                }
                className={`${inputClass} resize-y`}
              />
            </Field>

            <Field label="Category">
              <select
                required
                value={editForm.category}
                onChange={(event) =>
                  setEditForm({ ...editForm, category: event.target.value })
                }
                className={inputClass}
              >
                {!CATEGORIES.includes(editForm.category) && editForm.category && (
                  <option value={editForm.category}>{editForm.category}</option>
                )}
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Price (BDT)">
                <input
                  required
                  type="number"
                  min="1"
                  step="1"
                  value={editForm.price}
                  onChange={(event) =>
                    setEditForm({ ...editForm, price: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Location">
                <input
                  required
                  value={editForm.location}
                  onChange={(event) =>
                    setEditForm({ ...editForm, location: event.target.value })
                  }
                  className={inputClass}
                />
              </Field>
            </div>

            <p className="rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
              Updating may send this service for admin approval again. Existing
              images will be kept.
            </p>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                disabled={saving}
                className={secondaryButton}
              >
                Cancel
              </button>
              <button type="submit" disabled={saving} className={primaryButton}>
                {saving && <Loader2 size={16} className="animate-spin" />}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && (
        <Modal onClose={() => !deleting && setDeleteId(null)}>
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={25} />
            </div>

            <h2 className="mt-4 font-playfair text-2xl font-semibold">
              Delete this service?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#6B746E]">
              This action cannot be undone. The service will be permanently removed.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
                className={`flex-1 ${secondaryButton}`}
              >
                Keep Service
              </button>

              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={deleting}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting && <Loader2 size={16} className="animate-spin" />}
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}

function StatusBadge({ status }: { status: Service["status"] }) {
  const styles: Record<Service["status"], string> = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1.5 text-[11px] font-bold capitalize shadow-sm ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#E8E1D5] bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-[#6B746E] sm:text-sm">{title}</p>
        <div className="rounded-xl bg-[#EAF1EC] p-2 text-[#174C3C]">{icon}</div>
      </div>
      <p className="mt-3 font-playfair text-2xl font-semibold sm:text-3xl">{value}</p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-[#174C3C]">{label}</span>
      {children}
    </label>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#F8F5EE] p-3">
      <dt className="text-xs text-[#6B746E]">{label}</dt>
      <dd className="mt-1 font-semibold capitalize text-[#174C3C]">{value}</dd>
    </div>
  );
}

function MessageBox({
  type,
  message,
  onClose,
}: {
  type: "success" | "error";
  message: string;
  onClose?: () => void;
}) {
  const colorClass =
    type === "success"
      ? "border-[#CFE0D5] bg-[#EAF1EC] text-[#174C3C]"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      className={`flex items-center justify-between gap-3 rounded-xl border p-4 text-sm ${colorClass}`}
    >
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close message"
          className="shrink-0"
        >
          <X size={17} />
        </button>
      )}
    </div>
  );
}

function CloseButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200"
      aria-label={label}
    >
      <X size={20} />
    </button>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        className="my-auto w-full max-w-2xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7"
      >
        {children}
      </section>
    </div>
  );
}
