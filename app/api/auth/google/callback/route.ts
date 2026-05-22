import { NextRequest, NextResponse } from "next/server";
import { assertGoogleState, authErrorRedirect, finishGoogleLogin, getAppUrl, googleOAuthConfigured } from "@/lib/google-auth";

export async function GET(request: NextRequest) {
  if (!googleOAuthConfigured()) return authErrorRedirect("Google login is not configured yet.");

  const error = request.nextUrl.searchParams.get("error");
  if (error) return authErrorRedirect(`Google sign-in was cancelled or failed: ${error}`);

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  if (!code || !(await assertGoogleState(state))) return authErrorRedirect("Google sign-in state was invalid. Please try again.");

  try {
    await finishGoogleLogin(code);
    return NextResponse.redirect(`${getAppUrl()}/dashboard`);
  } catch (loginError) {
    return authErrorRedirect(loginError instanceof Error ? loginError.message : "Google sign-in failed.");
  }
}
