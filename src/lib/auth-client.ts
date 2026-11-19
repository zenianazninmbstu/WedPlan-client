
import { createAuthClient } from "better-auth/react";
import {
  jwtClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",

  plugins: [
    jwtClient(),
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
        },
        isBlocked: {
          type: "boolean",
        },
        businessName: {
          type: "string",
        },
        subscriptionPlan: {
          type: "string",
        },
        subscriptionExpiresAt: {
          type: "date",
        },
      },
    }),
  ],
});
