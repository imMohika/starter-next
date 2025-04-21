import { validateBody } from "@/app/api/_utils/utils";
import { logLevels } from "@/lib/logger";
import { serverLogger } from "@/lib/logger/logger.server";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
	level: z.enum(logLevels),
	first: z.unknown(),
	msg: z.string().optional(),
});

export async function POST(request: Request) {
	const { value: data, err: validationErr } = await validateBody(
		request,
		bodySchema,
	);

	if (!data) {
		return NextResponse.json({ error: validationErr }, { status: 400 });
	}

	const { level, first, msg } = data;
	switch (level) {
		case "error": {
			serverLogger.error(first, msg);
			break;
		}
		case "warn": {
			serverLogger.warn(first, msg);
			break;
		}
		case "info": {
			serverLogger.info(first, msg);
			break;
		}
		case "debug": {
			serverLogger.debug(first, msg);
			break;
		}
		default:
			serverLogger.error(first, msg);
	}

	return NextResponse.json({ ok: true });
}
