
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type UserProfile = {
  name: string;
  email: string;
  image?: string;
  role: string;
  businessName?: string;
};

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [businessName, setBusinessName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

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

        setProfile(data.user);
        setName(data.user.name || "");
        setImage(data.user.image || "");
        setBusinessName(data.user.businessName || "");
      } catch (error) {
        setMessage(
          error instanceof Error ? error.message : "Something went wrong."
        );
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, []);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image.");
      setMessageType("error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5MB.");
      setMessageType("error");
      return;
    }

    setUploading(true);
    setMessage("");

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
      setMessage("Image uploaded. Click Save Changes to update your profile.");
      setMessageType("success");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Image upload failed."
      );
      setMessageType("error");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    if (!name.trim()) {
      setMessage("Name is required.");
      setMessageType("error");
      return;
    }

    if (profile?.role === "vendor" && !businessName.trim()) {
      setMessage("Business name is required for vendors.");
      setMessageType("error");
      return;
    }

    setSaving(true);

    try {
      const token = await getToken();

      const updateData: {
        name: string;
        image: string;
        businessName?: string;
      } = {
        name: name.trim(),
        image,
      };

      if (profile?.role === "vendor") {
        updateData.businessName = businessName.trim();
      }

      const response = await fetch(`${API_URL}/api/users/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
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

      setMessage("Profile updated successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Profile update failed."
      );
      setMessageType("error");
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
        <div className="text-center">
          <p className="text-red-600">
            {message || "Unable to load your profile."}
          </p>
          <a href="/sign-in" className="mt-4 inline-block font-semibold text-[#174C3C]">
            Go to Sign In
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-[#F8F5EE] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#174C3C]">
            WedPlan Account
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Profile Settings
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your personal information and profile image.
          </p>
        </div>

        <form
          onSubmit={handleSave}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-8 flex flex-col items-center gap-4">
            {image ? (
              <img
                src={image}
                alt="Profile"
                className="h-28 w-28 rounded-full border-4 border-[#E4EFE9] object-cover"
              />
            ) : (
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#174C3C] text-4xl font-bold text-white">
                {name.charAt(0).toUpperCase() || "U"}
              </div>
            )}

            <label className="cursor-pointer rounded-full border border-[#174C3C] px-5 py-2 text-sm font-semibold text-[#174C3C] transition hover:bg-[#174C3C] hover:text-white">
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
              JPG, PNG or other image formats. Maximum 5MB.
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

            {profile.role === "vendor" && (
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
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Account Role
              </label>
              <input
                type="text"
                value={profile.role}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 capitalize text-gray-500"
              />
            </div>
          </div>

          {message && (
            <p
              role="status"
              className={`mt-5 rounded-lg px-4 py-3 text-sm ${
                messageType === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message}
            </p>
          )}

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
