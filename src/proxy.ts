import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const cookie = req.cookies.get("studio_auth")?.value;
  const password = process.env.STUDIO_PASSWORD;

  if (!password || cookie === password) return NextResponse.next();

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/studio-login";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/studio", "/studio/:path*"],
};
