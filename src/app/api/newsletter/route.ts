import { NextRequest, NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { Resend } from "resend";
import { z } from "zod";
import { SITE_URL } from "@/lib/site";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({ email: z.string().email(), website: z.string().optional() });

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

  // Honeypot: bots fill this, humans don't
  if (parsed.data.website) return NextResponse.json({ ok: true });

  // Check for existing subscriber to avoid duplicates
  const existing = await writeClient.fetch(
    `*[_type == "newsletterSubscriber" && email == $email][0]._id`,
    { email: parsed.data.email }
  );
  if (existing) return NextResponse.json({ alreadySubscribed: true });

  await writeClient.create({
    _type: "newsletterSubscriber",
    email: parsed.data.email,
    subscribedAt: new Date().toISOString(),
  });

  await resend.emails.send({
    from: "BluJ <onboarding@resend.dev>",
    to: [parsed.data.email],
    subject: "You're on the list.",
    text: `Hey,\n\nYou're signed up for BluJ deals and updates. We'll only reach out when there's something worth your time: fuel specials, new menu items, or news from the stations.\n\nSee you at the pump.\n\nThe BluJ Team`,
    html: welcomeEmail(),
  });

  return NextResponse.json({ ok: true });
}

function welcomeEmail(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're on the list.</title>
</head>
<body style="margin:0;padding:0;background-color:#0A0E1A;font-family:'DM Sans',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0A0E1A;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

          <!-- Amber top bar -->
          <tr>
            <td style="height:3px;background-color:#F59E0B;"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="background-color:#161D35;padding:40px 48px 32px;">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#8892A4;">New Hampshire &amp; Vermont</p>
              <p style="margin:0;font-family:Impact,'Arial Narrow',Arial,sans-serif;font-size:72px;font-weight:900;color:#F0F4FF;letter-spacing:0.06em;line-height:1;text-transform:uppercase;">BluJ</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="height:1px;background-color:#1D6FFF;opacity:0.3;"></td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color:#0A0E1A;padding:48px 48px 40px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#8892A4;">You're in.</p>
              <h1 style="margin:0 0 24px;font-family:Impact,'Arial Narrow',Arial,sans-serif;font-size:48px;font-weight:900;color:#F0F4FF;letter-spacing:0.04em;line-height:1;text-transform:uppercase;">Watch for deals.</h1>
              <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#8892A4;">
                You're signed up for BluJ deals and updates. We'll only reach out when there's something worth your time: fuel specials, new deli items, or news from the stations.
              </p>
              <p style="margin:0;font-size:16px;line-height:1.7;color:#8892A4;">
                See you at the pump.
              </p>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background-color:#0A0E1A;padding:0 48px 48px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background-color:rgba(29,111,255,0.12);border:1px solid #1D6FFF;">
                    <a href="${SITE_URL}/news" style="display:inline-block;padding:14px 28px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#1D6FFF;text-decoration:none;font-family:Helvetica,Arial,sans-serif;">
                      Read Latest News →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Locations strip -->
          <tr>
            <td style="background-color:#161D35;padding:24px 48px;">
              <p style="margin:0 0 12px;font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#8892A4;">Find Us</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:12px;color:#8892A4;line-height:1.6;">
                    Concord, NH &nbsp;·&nbsp; Manchester, NH &nbsp;·&nbsp; Nashua, NH &nbsp;·&nbsp; White River Junction, VT
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="height:1px;background-color:#F59E0B;"></td>
          </tr>
          <tr>
            <td style="background-color:#0A0E1A;padding:20px 48px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#8892A4;">
                    © ${new Date().getFullYear()} BluJ. All rights reserved.
                  </td>
                  <td align="right" style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#8892A4;">
                    NH &amp; VT
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
