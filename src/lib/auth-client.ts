
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
      required: false,
    },
    isBlocked: {
      type: "boolean",
      required: false,
    },
    businessName: {
      type: "string",
      required: false,
    },
    subscriptionPlan: {
      type: "string",
      required: false,
    },
    subscriptionExpiresAt: {
      type: "date",
      required: false,
    },
  },
}),
  ],
});
