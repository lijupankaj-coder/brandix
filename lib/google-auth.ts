import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createPasswordHash, createSession, hashToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const GOOGLE_OAUTH_STATE_COOKIE = "brandix_google_state";

export function getAppUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function getGoogleRedirectUri() {
  return `${getAppUrl()}/api/auth/google/callback`;
}

export function googleOAuthConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export async function createGoogleStateCookie() {
  const state = randomBytes(24).toString("base64url");
  const cookieStore = await cookies();
  cookieStore.set(GOOGLE_OAUTH_STATE_COOKIE, hashToken(state), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60
  });
  return state;
}

export async function assertGoogleState(state: string | null) {
  const cookieStore = await cookies();
  const saved = cookieStore.get(GOOGLE_OAUTH_STATE_COOKIE)?.value;
  cookieStore.delete(GOOGLE_OAUTH_STATE_COOKIE);
  return Boolean(state && saved && saved === hashToken(state));
}

interface GoogleTokenResponse {
  access_token?: string;
  id_token?: string;
  error?: string;
  error_description?: string;
}

interface GoogleUserInfo {
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
}

export async function finishGoogleLogin(code: string) {
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: getGoogleRedirectUri(),
      grant_type: "authorization_code"
    })
  });

  const tokenData = (await tokenResponse.json()) as GoogleTokenResponse;
  if (!tokenResponse.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || tokenData.error || "Google sign-in failed.");
  }

  const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { authorization: `Bearer ${tokenData.access_token}` }
  });
  const profile = (await profileResponse.json()) as GoogleUserInfo;

  if (!profileResponse.ok || !profile.email || !profile.email_verified) {
    throw new Error("Google account email could not be verified.");
  }

  const email = profile.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  const user =
    existing ||
    (await prisma.user.create({
      data: {
        email,
        name: profile.name || email.split("@")[0],
        passwordHash: await createPasswordHash(randomBytes(32).toString("base64url")),
        role: "user",
        plan: "free",
        status: "active"
      }
    }));

  if (user.status !== "active") throw new Error("This Brandix account is disabled.");

  await createSession(user.id);
}

export function authErrorRedirect(message: string) {
  const url = new URL("/login", getAppUrl());
  url.searchParams.set("error", message);
  return NextResponse.redirect(url);
}
