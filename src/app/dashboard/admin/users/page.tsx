
"use client";
import { authClient } from "@/lib/auth-client";
import { useEffect, useMemo, useState } from "react";
import {
  Eye,
  Search,
  ShieldBan,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";






const API_URL = process.env.NEXT_PUBLIC_API_URL;

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  businessName?: string;
  subscriptionPlan?: string;
  isBlocked?: boolean;
  createdAt?: string;
};

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Get authentication token
 const getToken = async () => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Unable to get authentication token");
  }

  return data.token;
};

// Fetch all registered users
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = await getToken();

      const response = await fetch(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to load users");
      }

      setUsers(data.users || []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Search and role filter
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        user.name?.toLowerCase().includes(searchText) ||
        user.email?.toLowerCase().includes(searchText) ||
        user.businessName?.toLowerCase().includes(searchText);

      const matchesRole =
        role === "all" || user.role?.toLowerCase() === role;

      return matchesSearch && matchesRole;
    });
  }, [users, search, role]);

  // Block or unblock user
  const handleToggleBlock = async (user: User) => {
    try {
      setUpdatingId(user.id);

      const token = await getToken();

      const response = await fetch(
        `${API_URL}/api/users/${user.id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            isBlocked: !user.isBlocked,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update user");
      }

      const updatedUser = {
        ...user,
        isBlocked: !user.isBlocked,
      };

      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item.id === user.id ? updatedUser : item
        )
      );

      if (selectedUser?.id === user.id) {
        setSelectedUser(updatedUser);
      }

      toast.success(
        user.isBlocked
          ? "User unblocked successfully!"
          : "User blocked successfully!"
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "Not available";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div>
        <h1 className="font-playfair text-3xl font-bold text-[#174C3C]">
          Manage Users
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          View and manage all registered customers and vendors on WedPlan.
        </p>
      </div>

      {/* Search and Role Filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={19}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email or business name"
            className="input h-12 w-full rounded-xl border border-[#DCE7DF] bg-white pl-11 text-sm text-gray-700 outline-none focus:border-[#174C3C]"
          />
        </div>

        <select
          value={role}
          onChange={(event) => setRole(event.target.value)}
          className="select h-12 w-full rounded-xl border border-[#DCE7DF] bg-white text-sm text-gray-700 sm:w-44"
        >
          <option value="all">All</option>
          <option value="vendor">Vendor</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-[#E4EAE5] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E4EAE5] px-5 py-4">
          <div className="flex items-center gap-2">
            <Users size={19} className="text-[#174C3C]" />

            <h2 className="font-semibold text-gray-800">
              All Registered Users
            </h2>
          </div>

          <span className="text-sm text-gray-500">
            {filteredUsers.length} users
          </span>
        </div>

        {loading ? (
          <div className="flex min-h-56 items-center justify-center">
            <span className="loading loading-spinner loading-lg text-[#174C3C]" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center px-5 text-center">
            <Users size={35} className="mb-3 text-gray-300" />

            <h3 className="font-semibold text-gray-700">
              No users found
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Try another name, email or role.
            </p>
          </div>
        ) : (
        



<div className="overflow-hidden rounded-2xl border border-[#E3EAE4] bg-white shadow-[0_8px_30px_rgba(25,55,35,0.06)]">
  <div className="overflow-x-auto">
    <table className="w-full min-w-[900px] border-collapse text-left">
      <thead>
        <tr className="border-b border-[#E8EEE9] bg-[#F7F9F7]">
          <th className="w-[36%] px-6 py-5 text-xs font-bold uppercase tracking-wider text-[#718078]">User</th>
          <th className="w-[15%] px-4 py-5 text-xs font-bold uppercase tracking-wider text-[#718078]">Role</th>
          <th className="w-[13%] px-4 py-5 text-xs font-bold uppercase tracking-wider text-[#718078]">Plan</th>
          <th className="w-[16%] px-4 py-5 text-xs font-bold uppercase tracking-wider text-[#718078]">Status</th>
          <th className="w-[20%] px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-[#718078]">Actions</th>
        </tr>
      </thead>

      <tbody>
        {filteredUsers.map((user) => (
          <tr key={user.id} className="group border-b border-[#EDF1ED] last:border-b-0 transition-colors duration-200 hover:bg-[#F7FAF7]">
            <td className="px-6 py-5">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#DCE9DF] bg-[#EAF3EC] text-sm font-bold uppercase text-[#315C43]">
                  {user.name?.charAt(0) || "U"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#24382C]">{user.name || "Unnamed User"}</p>
                  <p className="mt-1 truncate text-xs text-[#87948B]">{user.email}</p>
                </div>
              </div>
            </td>

            <td className="px-4 py-5">
              <span className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                user.role === "admin"
                  ? "bg-purple-50 text-purple-700"
                  : user.role === "vendor"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-[#EDF5EF] text-[#477253]"
              }`}>
                {user.role}
              </span>
            </td>

            <td className="px-4 py-5">
              <span className="text-sm font-medium capitalize text-[#53645A]">
                {user.subscriptionPlan || "free"}
              </span>
            </td>

            <td className="px-4 py-5">
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                user.isBlocked
                  ? "bg-red-50 text-red-600"
                  : "bg-emerald-50 text-emerald-700"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  user.isBlocked ? "bg-red-500" : "bg-emerald-500"
                }`} />
                {user.isBlocked ? "Blocked" : "Active"}
              </span>
            </td>

            <td className="px-6 py-5">
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(user)}
                  title="View user details"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#DCE8DF] bg-white text-[#477253] transition-all hover:border-[#477253] hover:bg-[#EDF5EF] hover:shadow-sm"
                >
                  <Eye size={17} />
                </button>

                
<button
  type="button"
  onClick={() => handleToggleBlock(user)}
  title={user.isBlocked ? "Unblock user" : "Block user"}
  disabled={updatingId === user.id}
  className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-all hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 ${
    user.isBlocked
      ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
      : "border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
  }`}
>
  {user.isBlocked ? (
    <>
      <ShieldCheck size={16} />
      Unblock
    </>
  ) : (
    <>
      <ShieldBan size={16} />
      Block
    </>
  )}
</button>

              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {filteredUsers.length === 0 && (
    <div className="px-6 py-16 text-center">
      <Users className="mx-auto mb-3 text-[#A2B2A6]" size={32} />
      <p className="font-semibold text-[#344A3B]">No users found</p>
      <p className="mt-1 text-sm text-[#87948B]">Try changing your search or filter.</p>
    </div>
  )}
</div>


        )}
      </div>

  
      {/* Premium User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071B14]/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#123E30] via-[#174C3C] to-[#23664F] px-6 py-7 sm:px-8">
              <div className="absolute -right-12 -top-16 h-48 w-48 rounded-full border border-white/10" />
              <div className="absolute -right-5 -top-9 h-32 w-32 rounded-full border border-white/10" />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C5E4D3]">
                    WedPlan Administration
                  </p>

                  <h2 className="mt-2 font-playfair text-2xl font-bold text-white sm:text-3xl">
                    User Profile
                  </h2>

                  <p className="mt-1 text-sm text-green-100/75">
                    Complete account information
                  </p>
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/20"
                  aria-label="Close modal"
                >
                  <X size={19} />
                </button>
              </div>

              {/* Profile */}
              <div className="relative mt-7 flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/30 bg-white/15 font-playfair text-3xl font-bold text-white shadow-lg">
                  {selectedUser.name?.trim()?.charAt(0).toUpperCase() || "U"}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-xl font-bold text-white">
                    {selectedUser.name || "Unnamed User"}
                  </h3>

                  <p className="mt-1 break-all text-sm text-green-100/80">
                    {selectedUser.email}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-semibold capitalize text-white">
                      {selectedUser.role}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        selectedUser.isBlocked
                          ? "bg-red-100 text-red-700"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {selectedUser.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="max-h-[55vh] space-y-5 overflow-y-auto p-5 sm:p-8">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#174C3C]">
                  Account Information
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">

                  <div className="rounded-2xl border border-[#E6EDE8] bg-[#F8FAF8] p-4">
                    <p className="text-xs font-medium text-gray-400">
                      Full Name
                    </p>
                    <p className="mt-2 break-words font-semibold text-gray-800">
                      {selectedUser.name || "Not available"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E6EDE8] bg-[#F8FAF8] p-4">
                    <p className="text-xs font-medium text-gray-400">
                      Email Address
                    </p>
                    <p className="mt-2 break-all text-sm font-semibold text-gray-800">
                      {selectedUser.email}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E6EDE8] bg-[#F8FAF8] p-4">
                    <p className="text-xs font-medium text-gray-400">
                      Account Role
                    </p>
                    <p className="mt-2 font-semibold capitalize text-gray-800">
                      {selectedUser.role}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E6EDE8] bg-[#F8FAF8] p-4">
                    <p className="text-xs font-medium text-gray-400">
                      Business Name
                    </p>
                    <p className="mt-2 break-words font-semibold text-gray-800">
                      {selectedUser.businessName || "Not applicable"}
                    </p>
                  </div>

                </div>
              </div>

              {/* Subscription */}
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#174C3C]">
                  Subscription & Activity
                </p>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#E6EDE8] p-4">
                    <p className="text-xs font-medium text-gray-400">
                      Subscription Plan
                    </p>
                    <p className="mt-2 text-lg font-bold capitalize text-[#174C3C]">
                      {selectedUser.subscriptionPlan || "Free"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#E6EDE8] p-4">
                    <p className="text-xs font-medium text-gray-400">
                      Account Status
                    </p>
                    <p className={`mt-2 text-lg font-bold ${
                      selectedUser.isBlocked ? "text-red-600" : "text-emerald-700"
                    }`}>
                      {selectedUser.isBlocked ? "Blocked" : "Active"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Joined Date */}
              <div className="rounded-2xl border border-[#DCE9DF] bg-[#F3F8F4] p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Member Since
                </p>
                <p className="mt-2 font-semibold text-[#174C3C]">
                  {formatDate(selectedUser.createdAt)}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-[#FAFCFA] px-5 py-4 sm:px-8">
              <p className="hidden text-xs text-gray-400 sm:block">
                WedPlan · User Management
              </p>

              <button
                onClick={() => setSelectedUser(null)}
                className="btn w-full rounded-xl border-none bg-[#174C3C] px-7 text-white shadow-md hover:bg-[#103B2E] sm:w-auto"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
