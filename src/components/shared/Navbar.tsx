
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user;
  const role = user?.role;

  const dashboardLink =
    role === "admin"
      ? "/dashboard/admin"
      : role === "vendor"
        ? "/dashboard/vendor"
        : "/dashboard/customer";

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setIsProfileOpen(false);
      setIsMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
  return (
    <nav className="relative z-50 w-full border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/wedplan-logo.png"
            alt="WedPlan Logo"
            width={180}
            height={70}
            priority
            className="h-auto w-[130px] object-contain sm:w-[150px]"
          />
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-10 md:flex">
          <Link href="/" className="text-sm font-semibold text-gray-800 hover:text-[#174C3C]">
            Home
          </Link>

          <Link href="/services" className="text-sm font-semibold text-gray-800 hover:text-[#174C3C]">
            Browse Services
          </Link>
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {!isPending && !user && (
            <>
              <Link
                href="/sign-in"
                className="rounded-full border border-[#174C3C] px-6 py-2.5 text-sm font-semibold text-[#174C3C] hover:bg-[#174C3C] hover:text-white"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-full bg-[#174C3C] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#10392D]"
              >
                Sign Up
              </Link>
            </>
          )}

          {!isPending && user && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 rounded-full border border-gray-200 px-3 py-2 hover:bg-gray-50"
                aria-expanded={isProfileOpen}
              >
                {user.image ? (
                 <img
  src={user.image}
  alt={user.name}
  width={36}
  height={36}
  className="h-9 w-9 rounded-full object-cover"
/>
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#174C3C] font-semibold text-white">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                <span className="max-w-32 truncate text-sm font-semibold text-gray-800">
                  {user.name}
                </span>

                <span className="text-xs text-gray-500">▼</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
                  <div className="border-b border-gray-100 px-3 py-3">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                    <p className="mt-1 text-xs capitalize text-[#174C3C]">
                      {role}
                    </p>
                  </div>

                  <Link
                    href={dashboardLink}
                    onClick={() => setIsProfileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/profile-settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile Settings
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#174C3C] text-[#174C3C] hover:bg-[#174C3C] hover:text-white md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {isMenuOpen && (
        <div className="flex flex-col gap-5 border-t border-gray-100 bg-white px-5 py-6 shadow-md md:hidden">
          <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-sm font-semibold text-gray-800">
            Home
          </Link>

          <Link href="/services" onClick={() => setIsMenuOpen(false)} className="text-sm font-semibold text-gray-800">
            Browse Services
          </Link>

          {!isPending && !user && (
            <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-5">
              <Link
                href="/sign-in"
                onClick={() => setIsMenuOpen(false)}
                className="w-fit rounded-full border border-[#174C3C] px-6 py-2.5 text-sm font-semibold text-[#174C3C]"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                onClick={() => setIsMenuOpen(false)}
                className="w-fit rounded-full bg-[#174C3C] px-6 py-2.5 text-sm font-semibold text-white"
              >
                Sign Up
              </Link>
            </div>
          )}

          {!isPending && user && (
            <div className="flex flex-col gap-3 border-t border-gray-100 pt-5">
              <div className="flex items-center gap-3">
                {user.image ? (
                <img
  src={user.image}
  alt={user.name}
  width={40}
  height={40}
  className="h-10 w-10 rounded-full object-cover"
/>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#174C3C] font-semibold text-white">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-800">{user.name}</p>
                  <p className="truncate text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              <Link href={dashboardLink} onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-700">
                Dashboard
              </Link>

              <Link href="/profile-settings" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-700">
                Profile Settings
              </Link>

              <button type="button" onClick={handleLogout} className="text-left text-sm font-medium text-red-600">
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
