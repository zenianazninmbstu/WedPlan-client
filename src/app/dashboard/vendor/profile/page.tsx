
"use client";

import { toast } from "sonner";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type VendorProfile = {
  name: string;
  email: string;
  image?: string;
  businessName?: string;
  role: string;
};

export default function VendorProfilePage() {
  const [profile, setProfile] = useState<VendorProfile | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [businessName, setBusinessName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const getToken = async () => {
    const result = await authClient.token();
    const token = result.data?.token;

    if (result.error || !token) {
      throw new Error("Please sign in to continue.");
    }

    return token;
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await getToken();

        const response = await fetch(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile.");
        }

        if (data.user.role !== "vendor") {
          throw new Error("This page is only available for vendors.");
        }

        setProfile(data.user);
        setName(data.user.name || "");
        setImage(data.user.image || "");
        setBusinessName(data.user.businessName || "");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Something went wrong."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const handleImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setUploading(true);

    try {
      const token = await getToken();
      const formData = new FormData();

      formData.append("image", file);

      const response = await fetch(`${API_URL}/api/uploads`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Image upload failed.");
      }

      setImage(data.imageUrl);
      toast.success(
        "Image uploaded. Save changes to update your profile."
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Image upload failed."
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !businessName.trim()) {
      toast.error("Name and business name are required.");
      return;
    }

    setSaving(true);

    try {
      const token = await getToken();

      const response = await fetch(`${API_URL}/api/users/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          image,
          businessName: businessName.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Profile update failed.");
      }

      setProfile((previous) =>
        previous
          ? {
              ...previous,
              name: name.trim(),
              image,
              businessName: businessName.trim(),
            }
          : previous
      );

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Profile update failed."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <p className="text-gray-600">Loading profile...</p>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <p className="text-center text-red-600">
          Unable to load your profile.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-full flex-1 bg-[#F8F5EE] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#174C3C]">
            Vendor Account
          </p>

          <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
            Profile Settings
          </h1>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Manage your personal and business information.
          </p>
        </div>

        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8"
        >
          <div className="mb-8 flex flex-col items-center gap-4">
            {image ? (
              <img
                src={image}
                alt="Vendor profile"
                className="h-28 w-28 rounded-full border-4 border-[#E4EFE9] object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#174C3C] text-4xl font-bold text-white">
                {name.charAt(0).toUpperCase() || "V"}
              </div>
            )}

            <label className="cursor-pointer rounded-full border border-[#174C3C] px-5 py-2.5 text-sm font-semibold text-[#174C3C] transition hover:bg-[#174C3C] hover:text-white">
              {uploading ? "Uploading..." : "Change Profile Image"}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            <p className="text-xs text-gray-500">
              Image format: JPG, PNG. Maximum size: 5MB.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#174C3C] focus:ring-2 focus:ring-[#174C3C]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Business Name
              </label>

              <input
                type="text"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-[#174C3C] focus:ring-2 focus:ring-[#174C3C]/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
              />

              <p className="mt-1 text-xs text-gray-500">
                Email address cannot be changed here.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Account Role
              </label>

              <input
                type="text"
                value="Vendor"
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || uploading}
            className="mt-7 w-full rounded-full bg-[#174C3C] px-6 py-3 font-semibold text-white transition hover:bg-[#10392D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving Changes..." : "Save Changes"}
          </button>
        </form>
      </div>
    </main>
  );
}
