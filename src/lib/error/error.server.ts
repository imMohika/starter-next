import "server-only";

import { HttpError } from "@/lib/error/http-error";
import { redactError } from "@/lib/error/redact";
import { serverLogger } from "@/lib/logger/logger.server";

export function serverErrorFromUnknown(cause: unknown): HttpError {
	if (cause instanceof SyntaxError) {
		return new HttpError({
			statusCode: 500,
			message: "Unexpected error",
		});
	}

	if (cause instanceof HttpError) {
		const redactedCause = redactError(cause, serverLogger);
		return {
			...redactedCause,
			name: cause.name,
			message: cause.message ?? "",
			cause: cause.cause,
			url: cause.url,
			statusCode: cause.statusCode,
			method: cause.method,
		};
	}

	if (cause instanceof Error) {
		const redacted = redactError(cause, serverLogger);
		// TODO)) get status code based on error type
		const statusCode = 400;
		return new HttpError({
			statusCode,
			message: redacted.message,
			cause: redacted,
		});
	}

	return new HttpError({
		statusCode: 500,
		message: `Unhandled error of type '${typeof cause}'`,
	});
}
