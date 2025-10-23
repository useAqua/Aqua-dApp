import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const addressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid Ethereum address");

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    RPC_URL: z.string().url().optional(),
    GTE_API: z.string().url().optional(),
    AQUA_REGISTRY_ADDRESS: addressSchema,
    AQUA_POINTS_POOL_ADDRESS: addressSchema.optional(), // TODO: Make required
    LP_SHARE_CALCULATION_ORACLE: addressSchema,
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_PROJECT_ID: z.string().optional(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
    GTE_API: process.env.GTE_API,
    RPC_URL: process.env.RPC_URL,
    AQUA_REGISTRY_ADDRESS: process.env.AQUA_REGISTRY_ADDRESS,
    AQUA_POINTS_POOL_ADDRESS: process.env.AQUA_POINTS_POOL_ADDRESS,
    LP_SHARE_CALCULATION_ORACLE: process.env.LP_SHARE_CALCULATION_ORACLE,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
