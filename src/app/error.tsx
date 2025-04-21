"use client";

import { ErrorCard } from "@/components/error-card";
import { clientErrorFromUnknown } from "@/lib/error/error.client";
import { HttpError } from "@/lib/error/http-error";
import { redactError } from "@/lib/error/redact";
import { clientLogger } from "@/lib/logger/logger.client";
import { useEffect, useMemo } from "react";

export type ErrorPageProps = {
	error: Error;
	reset?: () => void;
};

export default function RootErrorPage({ error, reset }: ErrorPageProps) {
	useEffect(() => {
		clientLogger.error({ error }, `Client error: ${error.message}`);
	}, [error]);

	const processedError = useMemo(() => {
		const err = clientErrorFromUnknown(error);

		if (err instanceof HttpError) {
			const redactedError = redactError(error, clientLogger);
			return {
				statusCode: err.statusCode,
				title: redactedError.name,
				name: redactedError.name,
				message: redactedError.message,
				url: err.url,
				method: err.method,
				cause: err.cause,
			};
		}

		return {
			statusCode: 500,
			title: "Internal Server Error",
			name: "Internal Server Error",
			message: "An unexpected error occurred.",
		};
	}, [error]);

	return (
		<ErrorCard
			error={processedError}
			reset={reset}
			statusCode={processedError.statusCode}
			message={processedError.message}
		/>
	);
}
