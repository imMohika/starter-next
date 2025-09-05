import { NextResponse } from "next/server";
import { z } from "zod";
import { parseBody } from "@/app/api/_utils/utils";
import { apiWrapper } from "@/app/api/api-wrapper";
import { userDatabase } from "@/lib/db";

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
