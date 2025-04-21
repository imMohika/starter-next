import "client-only";

import { z } from "zod";

const envServerSchema = z.object({});

type EnvServerSchema = z.infer<typeof envServerSchema>;

export const envClient: EnvServerSchema = envServerSchema.parse(process.env);
