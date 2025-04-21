export function clientErrorFromUnknown(cause: unknown): Error {
	if (cause instanceof Error) {
		return cause;
	}
	if (typeof cause === "string") {
		return new Error(cause, { cause });
	}

	return new Error(`Unhandled error of type '${typeof cause}'`);
}
