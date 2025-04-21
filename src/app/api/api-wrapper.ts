import type { Params } from "@/app/types";
import { serverErrorFromUnknown } from "@/lib/error/error.server";
import { HttpError } from "@/lib/error/http-error";
import { serverLogger } from "@/lib/logger/logger.server";
import { ApiError } from "next/dist/server/api-utils";
import { type NextRequest, NextResponse } from "next/server";

type ApiHandler<T extends NextResponse | Response = NextResponse> = (
	request: NextRequest,
	{ params }: { params: Promise<Params> },
) => Promise<T>;

export const apiWrapper = <T extends NextResponse | Response = NextResponse>(
	handler: ApiHandler<T>,
) => {
	return async (req: NextRequest, { params }: { params: Promise<Params> }) => {
		try {
			const result = await handler(req, { params });
			if (result) {
				return result;
			}

			return NextResponse.json({ ok: true });
		} catch (error) {
			let serverError: HttpError;
			if (error instanceof ApiError) {
				serverError = HttpError.fromApiError(req, error);
			} else {
				serverError = serverErrorFromUnknown(error);
			}

			// log 4xx errors as info level
			if (serverError.statusCode >= 400 && serverError.statusCode < 500) {
				serverLogger.info({ err: serverError }, serverError.message);
			} else {
				serverLogger.error({ err: serverError }, serverError.message);
			}

			return NextResponse.json(
				{
					ok: false,
					message: serverError.message,
					url: serverError.url,
					method: serverError.method,
				},
				{ status: serverError.statusCode },
			);
		}
	};
};
