import "server-only";
import { serverLogger } from "@/lib/logger/logger.server";
import type { z } from "zod";

export type Result<T> =
	| { value: T; err?: never }
	| { value?: never; err: Error };

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const validateBody = async <T extends z.ZodObject<any, any>>(
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
