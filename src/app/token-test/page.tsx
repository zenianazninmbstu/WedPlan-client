
"use client";

import { authClient } from "@/lib/auth-client";

export default function TokenTestPage() {
  const getToken = async () => {
    console.log("Button clicked!");

    try {
      const result = await authClient.token();
      console.log("Token response:", result);
    } catch (error) {
      console.error("Token error:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">JWT Token Test</h1>

      <button
        type="button"
        onClick={getToken}
        className="mt-4 rounded-md bg-blue-600 px-5 py-2 text-white"
      >
        Get JWT Token
      </button>
    </div>
  );
}
