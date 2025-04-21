import { z } from "zod";

const envServerSchema = z.object({
	APP_ENV: z.enum(["production", "development", "test"]),
});

type EnvServerSchema = z.infer<typeof envServerSchema>;

export const envShared: EnvServerSchema = envServerSchema.parse({
	APP_ENV: process.env.APP_ENV ?? process.env.NODE_ENV,
});
