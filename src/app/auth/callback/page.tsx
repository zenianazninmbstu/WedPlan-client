
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Verifying your account...");

  useEffect(() => {
    let active = true;

    const verifySession = async () => {
      try {
        const result = await authClient.getSession();

        if (!active) return;

        if (result.error || !result.data?.user) {
          setMessage("Unable to verify your login. Redirecting...");
          setTimeout(() => router.replace("/sign-in"), 1500);
          return;
        }

        const role = result.data.user.role;

        let dashboard = "";

        if (role === "admin") {
          dashboard = "/dashboard/admin";
        } else if (role === "vendor") {
          dashboard = "/dashboard/vendor";
        } else if (role === "customer") {
          dashboard = "/dashboard/customer";
        }

        if (!dashboard) {
          setMessage("Your account role could not be identified.");
          setTimeout(() => router.replace("/sign-in"), 1500);
          return;
        }

        setMessage("Google sign in successful! Redirecting...");

        setTimeout(() => {
          router.replace(dashboard);
        }, 1000);
      } catch {
        if (!active) return;

        setMessage("Something went wrong. Please sign in again.");
        setTimeout(() => router.replace("/sign-in"), 1500);
      }
    };

    verifySession();

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#faf7f5] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[#eadfdc] bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600" />

        <h1 className="text-xl font-bold text-gray-900">
          Please Wait
        </h1>

        <p className="mt-3 text-sm text-gray-600">{message}</p>
      </div>
    </main>
  );
}
