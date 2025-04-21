import "server-only";
import { logLevels } from "@/lib/logger";
import { z } from "zod";

const envServerSchema = z.object({
	LOKI_URL: z.string().url().optional(),
	LOKI_APP_NAME: z.string().optional(),
	LOG_LEVEL: z.enum(logLevels).default("info"),
});

type EnvServerSchema = z.infer<typeof envServerSchema>;

export const envServer: EnvServerSchema = envServerSchema.parse(process.env);
