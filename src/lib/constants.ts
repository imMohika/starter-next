import { envShared } from "@/lib/env/env";

export const isProduction = envShared.APP_ENV === "production";
export const isServer = typeof window === "undefined";
