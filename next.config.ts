import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
	serverExternalPackages: ["pino", "pino-pretty", "pino-loki"],
};

export default nextConfig;
