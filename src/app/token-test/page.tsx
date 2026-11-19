
"use client";

import { authClient } from "@/lib/auth-client";

export default function TokenTestPage() {
  const getToken = async () => {
    const result = await authClient.token();

    console.log("JWT Token:", result);
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold">JWT Token Test</h1>

      <button
        onClick={getToken}
        className="btn btn-primary mt-4"
      >
        Get JWT Token
      </button>
    </div>
  );
}
