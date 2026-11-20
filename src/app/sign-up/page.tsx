
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type AccountRole = "customer" | "vendor";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<AccountRole>("customer");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      setError("Password must contain uppercase and lowercase letters.");
      return;
    }

    if (imageFile) {
      if (!imageFile.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        return;
      }

      if (imageFile.size > 5 * 1024 * 1024) {
        setError("Profile image must be smaller than 5MB.");
        return;
      }
    }

    setLoading(true);

    try {
      const result = await authClient.signUp.email({
  name,
  email,
  password,
  role,
  isBlocked: false,
  businessName: "",
  subscriptionPlan: "free",
  subscriptionExpiresAt: new Date(),
});



      if (result.error) {
        throw new Error(result.error.message || "Registration failed.");
      }

      if (imageFile) {
        try {
          const tokenResult = await authClient.token();
          const token = tokenResult.data?.token;

          if (tokenResult.error || !token) {
            throw new Error("Could not get authentication token.");
          }

          const formData = new FormData();
          formData.append("image", imageFile);

          const uploadResponse = await fetch(`${API_URL}/api/uploads`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          const uploadData = await uploadResponse.json();

          if (!uploadResponse.ok) {
            throw new Error(uploadData.message || "Image upload failed.");
          }

          const updateResponse = await fetch(`${API_URL}/api/users/me`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: uploadData.imageUrl,
            }),
          });

          const updateData = await updateResponse.json();

          if (!updateResponse.ok) {
            throw new Error(updateData.message || "Profile image save failed.");
          }
        } catch {
          setSuccess(
            "Account created, but profile image could not be saved. You can upload it later from Profile Settings."
          );
          setLoading(false);
          return;
        }
      }

      setSuccess("Account created successfully!");

      router.push(
        role === "vendor" ? "/dashboard/vendor" : "/dashboard/customer"
      );
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setSuccess("");

    if (role === "vendor") {
      setError(
        "Google registration currently creates a Customer account. Please use email registration for a Vendor account."
      );
      return;
    }

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Google sign up failed."
      );
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-[#F8F5EE] px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg sm:p-9">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#174C3C]">
            Welcome to WedPlan
          </p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Start planning beautiful wedding experiences.
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#174C3C]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#174C3C]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a password"
                required
                minLength={6}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-[#174C3C]"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-[#174C3C]"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            <p className="mt-1 text-xs text-gray-500">
              Minimum 6 characters, including uppercase and lowercase letters.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Profile Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                setImageFile(event.target.files?.[0] || null)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-700 file:mr-3 file:rounded-full file:border-0 file:bg-[#EAF2ED] file:px-4 file:py-2 file:font-semibold file:text-[#174C3C]"
            />
            <p className="mt-1 text-xs text-gray-500">
              Select an image up to 5MB. It will be uploaded to ImgBB.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Account Role
            </label>
            <select
              value={role}
              onChange={(event) =>
                setRole(event.target.value as AccountRole)
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-[#174C3C]"
            >
              <option value="customer">Customer</option>
              <option value="vendor">Vendor</option>
            </select>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </p>
          )}

          {success && (
            <p
              role="status"
              className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700"
            >
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#174C3C] px-6 py-3 font-semibold text-white transition hover:bg-[#10392D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-500">OR</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        
<button
  type="button"
  onClick={handleGoogleSignUp}
  disabled={loading}
  className="flex w-full items-center justify-center gap-3 rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className="h-5 w-5"
    aria-hidden="true"
  >
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.71 7.18l7.2 5.59c4.2-3.87 7.55-9.59 7.55-17.24Z"
    />
    <path
      fill="#FBBC05"
      d="M10.54 28.59A14.4 14.4 0 0 1 9.5 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.98-6.19Z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.9-5.81l-7.2-5.59c-2 1.34-4.56 2.13-8.7 2.13-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
    />
  </svg>

  <span>Continue with Google</span>
</button>


        <p className="mt-7 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="font-semibold text-[#174C3C] hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}
