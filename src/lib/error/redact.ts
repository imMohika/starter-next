import { isProduction } from "@/lib/constants";
import type { TLogger } from "@/lib/logger";

// TODO))
const isDatabaseError = <T extends Error>(error: T) => {
	return false;
};

export const redactError = <T extends Error | unknown = unknown>(
	err: T,
	logger: TLogger,
) => {
	if (!isProduction || !(err instanceof Error)) {
		return err;
	}

	logger.debug({ constructor: err.constructor, name: err.name });
	if (isDatabaseError(err)) {
		logger.error({ err }, "Database error redacted");
		return new Error("An error occurred while querying the database.");
	}

	return err;
};
