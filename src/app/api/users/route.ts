import { apiWrapper } from "@/app/api/api-wrapper";
import { userDatabase } from "@/lib/db";
import { NextResponse } from "next/server";
import { parseBody } from "@/app/api/_utils/utils";
import { z } from "zod";

export const GET = apiWrapper(async () => {
	const users = await userDatabase.all();
	return NextResponse.json(users);
});

const bodySchema = z.object({
	username: z.string(),
});

export const POST = apiWrapper(async (req) => {
	const { username } = await parseBody(req, bodySchema);
	await userDatabase.create(username);

	return NextResponse.json({ ok: true });
});
