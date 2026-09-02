import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({ email: z.string().email() });

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
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });

  // Check for existing subscriber to avoid duplicates
  const existing = await writeClient.fetch(
    `*[_type == "newsletterSubscriber" && email == $email][0]._id`,
    { email: parsed.data.email }
  );
  if (existing) return NextResponse.json({ ok: true });

  await writeClient.create({
    _type: "newsletterSubscriber",
    email: parsed.data.email,
    subscribedAt: new Date().toISOString(),
  });

  await resend.emails.send({
    from: "BluJ <onboarding@resend.dev>",
    to: [parsed.data.email],
    subject: "You're on the list.",
    text: `Hey,\n\nYou're signed up for BluJ deals and updates. We'll only reach out when there's something worth your time — fuel specials, new menu items, or news from the stations.\n\nSee you at the pump.\n\n— The BluJ Team\nbluj.com`,
  });

  return NextResponse.json({ ok: true });
}
