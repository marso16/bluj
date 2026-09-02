import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  preferredLocation: z.string().optional(),
  message: z.string().max(2000).optional(),
});

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { name, email, phone, preferredLocation, message } = parsed.data;
  await writeClient.create({
    _type: "jobApplication",
    name,
    email,
    phone: phone ?? "",
    ...(preferredLocation
      ? { preferredLocation: { _type: "reference", _ref: preferredLocation } }
      : {}),
    message: message ?? "",
    submittedAt: new Date().toISOString(),
    status: "new",
  });

  return NextResponse.json({ ok: true });
}
