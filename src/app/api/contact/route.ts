import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(3000),
});

const resend = new Resend(process.env.RESEND_API_KEY);

function confirmationEmail(name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>We got your message.</title></head>
<body style="margin:0;padding:0;background-color:#0A0E1A;font-family:'DM Sans',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0A0E1A;">
    <tr><td align="center" style="padding:40px 16px;">
      <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
        <tr><td style="height:3px;background-color:#F59E0B;"></td></tr>
        <tr>
          <td style="background-color:#161D35;padding:40px 48px 32px;">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#8892A4;">New Hampshire &amp; Vermont</p>
            <p style="margin:0;font-family:Impact,'Arial Narrow',Arial,sans-serif;font-size:72px;font-weight:900;color:#F0F4FF;letter-spacing:0.06em;line-height:1;text-transform:uppercase;">BluJ</p>
          </td>
        </tr>
        <tr><td style="height:1px;background-color:#1D6FFF;opacity:0.3;"></td></tr>
        <tr>
          <td style="background-color:#0A0E1A;padding:48px 48px 40px;">
            <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.25em;text-transform:uppercase;color:#8892A4;">Message received.</p>
            <h1 style="margin:0 0 24px;font-family:Impact,'Arial Narrow',Arial,sans-serif;font-size:48px;font-weight:900;color:#F0F4FF;letter-spacing:0.04em;line-height:1;text-transform:uppercase;">Thanks, ${name}.</h1>
            <p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:#8892A4;">We got your message and we'll get back to you as soon as we can.</p>
            <p style="margin:0;font-size:16px;line-height:1.7;color:#8892A4;">In the meantime, check out the latest from our stations.</p>
          </td>
        </tr>
        <tr>
          <td style="background-color:#0A0E1A;padding:0 48px 48px;">
            <table cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background-color:rgba(29,111,255,0.12);border:1px solid #1D6FFF;">
                  <a href="https://bluj.com/news" style="display:inline-block;padding:14px 28px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#1D6FFF;text-decoration:none;font-family:Helvetica,Arial,sans-serif;">Read Latest News →</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr><td style="height:1px;background-color:#F59E0B;"></td></tr>
        <tr>
          <td style="background-color:#0A0E1A;padding:20px 48px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#8892A4;">© ${new Date().getFullYear()} BluJ. All rights reserved.</td>
                <td align="right" style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#8892A4;">NH &amp; VT</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { name, email, message } = parsed.data;

  // Notify BluJ team
  const { error } = await resend.emails.send({
    from: "BluJ <onboarding@resend.dev>",
    to: ["marcelino.keyrouz16@gmail.com"],
    replyTo: email,
    subject: `Contact form: ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  // Confirmation to sender
  await resend.emails.send({
    from: "BluJ <onboarding@resend.dev>",
    to: [email],
    subject: "We got your message.",
    html: confirmationEmail(name),
  });

  return NextResponse.json({ ok: true });
}
