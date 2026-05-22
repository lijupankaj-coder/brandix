import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createPasswordHash, createSession, destroyCurrentSession, hashToken, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { authSchema, signupSchema } from "@/lib/schemas";

function redirectTo(request: NextRequest, pathname: string, params?: Record<string, string>) {
  const url = new URL(pathname, request.url);
  Object.entries(params || {}).forEach(([key, value]) => url.searchParams.set(key, value));
  return NextResponse.redirect(url, { status: 303 });
}

export async function handleLogin(request: NextRequest) {
  const formData = await request.formData();
  const parsed = authSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) return redirectTo(request, "/login", { error: "Enter a valid email and password." });

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
  if (!user || user.status !== "active") return redirectTo(request, "/login", { error: "Invalid credentials or inactive account." });

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) return redirectTo(request, "/login", { error: "Invalid credentials or inactive account." });

  await createSession(user.id);
  return redirectTo(request, "/dashboard");
}

export async function handleSignup(request: NextRequest) {
  const formData = await request.formData();
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password")
  });

  if (!parsed.success) {
    return redirectTo(request, "/signup", { error: "Enter your name, a valid email, and a password of at least 8 characters." });
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return redirectTo(request, "/signup", { error: "An account already exists for this email." });

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash: await createPasswordHash(parsed.data.password),
      role: "user",
      plan: "free"
    }
  });

  await createSession(user.id);
  return redirectTo(request, "/dashboard");
}

export async function handleLogout(request: NextRequest) {
  await destroyCurrentSession();
  return redirectTo(request, "/");
}

export async function handleForgotPassword(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email || !email.includes("@")) return redirectTo(request, "/forgot-password", { error: "Enter the email for your Brandix account." });

  const genericSuccess = "If that account exists, a password reset link has been prepared.";
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || user.status !== "active") {
    return redirectTo(request, "/forgot-password", { success: genericSuccess });
  }

  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } },
    data: { usedAt: new Date() }
  });

  const token = randomBytes(32).toString("base64url");
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + 60 * 60 * 1000)
    }
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  const resetUrl = `${appUrl.replace(/\/$/, "")}/reset-password?token=${token}`;

  if (process.env.NODE_ENV !== "production") {
    return redirectTo(request, "/forgot-password", {
      success: "Password reset link created. In production this should be sent by email.",
      resetUrl
    });
  }

  return redirectTo(request, "/forgot-password", { success: "If that account exists, a password reset link has been sent." });
}

export async function handleResetPassword(request: NextRequest) {
  const formData = await request.formData();
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  const errorUrl = `/reset-password${token ? `?token=${encodeURIComponent(token)}` : ""}`;
  if (password.length < 8) return redirectTo(request, errorUrl, { error: "Password must be at least 8 characters." });
  if (password !== confirmPassword) return redirectTo(request, errorUrl, { error: "Passwords do not match." });

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: createHash("sha256").update(token).digest("hex") },
    include: { user: true }
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date() || resetToken.user.status !== "active") {
    return redirectTo(request, "/reset-password", { error: "This reset link is invalid or expired." });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash: await createPasswordHash(password) }
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() }
    }),
    prisma.session.deleteMany({ where: { userId: resetToken.userId } })
  ]);

  await createSession(resetToken.userId);
  return redirectTo(request, "/dashboard");
}
