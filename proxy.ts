import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const COOKIE_NAME = "recall_visitor";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function proxy(request: NextRequest) {
  const current = request.cookies.get(COOKIE_NAME)?.value;
  const visitorId = current && UUID_PATTERN.test(current) ? current : crypto.randomUUID();
  const headers = new Headers(request.headers);
  headers.set("x-recall-visitor-id", visitorId);
  const response = NextResponse.next({ request: { headers } });
  if (visitorId !== current) {
    response.cookies.set(COOKIE_NAME, visitorId, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365, path: "/" });
  }
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
