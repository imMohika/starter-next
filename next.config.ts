import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	serverExternalPackages: ["pino", "pino-pretty", "pino-loki"],
};

export default nextConfig;
