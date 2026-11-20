
"use client";

import { useState } from "react";
import {
  Camera,
  UserRound,
  Mail,
  Phone,
  MapPin,
  Save,
} from "lucide-react";

export default function CustomerProfilePage() {
  const [preview, setPreview] = useState("");
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhotoChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setMessage("Please select a JPG, PNG or WEBP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("Image size must be less than 5 MB.");
      return;
    }

    setPreview(URL.createObjectURL(file));
    setMessage("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(
      "Profile API integration is pending. Your changes are not saved yet."
    );
  };

  const inputClass =
    "w-full rounded-lg border border-gray-200 bg-[#FCFDFB] px-3 py-2 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

  return (
    <div className="mx-auto max-w-4xl space-y-4">

      {/* Page Heading */}
      <div>
        <p className="text-[11px] font-semibold tracking-[0.18em] text-emerald-700">
          CUSTOMER DASHBOARD
        </p>

        <h1 className="mt-1 text-2xl font-bold text-[#173C2C]">
          Profile Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage your personal information and keep your profile up to date.
        </p>
      </div>

      {/* Main Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">

        {/* Card Heading */}
        <div className="mb-4 border-b border-gray-100 pb-3">
          <h2 className="text-lg font-bold text-[#173C2C]">
            Profile Settings
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Update your profile details and personal information below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Profile Photo */}
          <div className="flex items-center gap-4">
            <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-emerald-100 bg-emerald-50">
              {preview ? (
                <img
                  src={preview}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={30} className="text-emerald-700" />
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-[#173C2C]">
                Profile Photo
              </h3>

              <p className="mt-1 text-[11px] text-gray-400">
                JPG, PNG or WEBP · Maximum 5 MB
              </p>

              <label className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100">
                <Camera size={14} />
                Upload New Photo

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            {/* Full Name */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <UserRound size={14} className="text-emerald-700" />
                Full Name
              </label>

              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={inputClass}
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <Mail size={14} className="text-emerald-700" />
                Email Address
              </label>

              <input
                name="email"
                type="email"
                value={formData.email}
                readOnly
                placeholder="Your account email"
                className={`${inputClass} cursor-not-allowed bg-gray-100`}
              />

              <p className="mt-1 text-[10px] text-gray-400">
                Email is managed by your account.
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <Phone size={14} className="text-emerald-700" />
                Phone Number
              </label>

              <input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={inputClass}
              />
            </div>

            {/* Location */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <MapPin size={14} className="text-emerald-700" />
                City / Location
              </label>

              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your city or location"
                className={inputClass}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              Bio / About
            </label>

            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={2}
              maxLength={300}
              placeholder="Tell couples or vendors a little about yourself..."
              className={`${inputClass} resize-none`}
            />

            <p className="mt-1 text-right text-[10px] text-gray-400">
              {formData.bio.length}/300 characters
            </p>
          </div>

          {/* Feedback */}
          {message && (
            <p
              role="status"
              className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800"
            >
              {message}
            </p>
          )}

          {/* Save Button */}
          <div className="flex justify-end border-t border-gray-100 pt-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-[#173C2C] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800"
            >
              <Save size={15} />
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
