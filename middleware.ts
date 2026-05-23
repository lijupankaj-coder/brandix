import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "brandix_session";
const protectedPrefixes = ["/dashboard", "/account"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected) return NextResponse.next();

  if (!request.cookies.get(SESSION_COOKIE)?.value) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
