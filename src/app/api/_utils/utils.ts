import "server-only";
import { ApiError } from "next/dist/server/api-utils";
import type { z } from "zod";
import type { ZodObjectSchema } from "@/app/types";
import { serverLogger } from "@/lib/logger/logger.server";

export type Result<T> =
  | { value: T; err?: never }
  | { value?: never; err: Error };

export const validateBody = async <T extends ZodObjectSchema>(
  request: Request,
  validator: T,
): Promise<Result<z.infer<T>>> => {
  try {
    const body = await request.json();
    return {
      value: await validator.parseAsync(body),
    };
  } catch (e) {
    let msg: string;
    if (typeof e === "string") {
      msg = e;
    } else if (e instanceof Error) {
      msg = e.message;
    } else {
      serverLogger.error(
        { error: e, url: request.url },
        "unknown error when parsing body",
      );
      msg = "Bad Request";
    }
    return {
      err: new Error(msg),
    };
  }
};

export const parseBody = async <T extends ZodObjectSchema>(
  request: Request,
  validator: T,
): Promise<z.infer<T>> => {
  const { value, err } = await validateBody(request, validator);
  if (!value) {
    throw new ApiError(400, err?.message ?? "invalid request body");
  }

  return value;
};
