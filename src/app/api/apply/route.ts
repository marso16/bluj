import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().max(2000).optional(),
  position: z.string().max(200).optional(),
});

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  // Honeypot: bots fill this, humans don't
  if (formData.get("website")) return NextResponse.json({ ok: true });

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    message: formData.get("message") || undefined,
    position: formData.get("position") || undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { name, email, phone, message, position } = parsed.data;

  // Upload CV if provided
  let cvAssetRef: string | null = null;
  const cvFile = formData.get("cv");
  if (cvFile instanceof File && cvFile.size > 0) {
    const buffer = Buffer.from(await cvFile.arrayBuffer());
    const asset = await writeClient.assets.upload("file", buffer, {
      filename: cvFile.name,
      contentType: cvFile.type || "application/pdf",
    });
    cvAssetRef = asset._id;
  }

  await writeClient.create({
    _type: "jobApplication",
    name,
    email,
    phone: phone ?? "",
    message: message ?? "",
    position: position ?? "",
    ...(cvAssetRef ? { cv: { _type: "file", asset: { _type: "reference", _ref: cvAssetRef } } } : {}),
    submittedAt: new Date().toISOString(),
    status: "new",
  });

  return NextResponse.json({ ok: true });
}
