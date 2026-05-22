import { NextResponse } from "next/server";
import { createGoogleStateCookie, getGoogleRedirectUri, googleOAuthConfigured } from "@/lib/google-auth";

export async function GET() {
  if (!googleOAuthConfigured()) {
    const url = new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
    url.searchParams.set("error", "Google login is not configured yet.");
    return NextResponse.redirect(url);
  }

  const state = await createGoogleStateCookie();
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID || "",
    redirect_uri: getGoogleRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
    access_type: "online"
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
