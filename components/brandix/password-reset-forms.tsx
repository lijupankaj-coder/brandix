"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BrandixLogo } from "@/components/brandix/logo";
import { ThemeToggle } from "@/components/brandix/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const success = searchParams.get("success");
  const resetUrl = searchParams.get("resetUrl");

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md border-border/70">
        <CardHeader className="text-center">
          <div className="mb-3 flex items-center justify-between">
            <span className="w-10" />
            <BrandixLogo />
            <ThemeToggle />
          </div>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>Enter your email and Brandix will prepare a secure reset link.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action="/api/auth/forgot-password" method="post" className="space-y-4">
            {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            {success && <div className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm text-primary">{success}</div>}
            {resetUrl && (
              <div className="rounded-lg border bg-secondary p-3 text-xs">
                <p className="mb-2 font-medium">Local reset link</p>
                <Link href={resetUrl} className="break-all text-primary underline">{resetUrl}</Link>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="you@example.com" />
            </div>
            <Button type="submit" className="w-full">Create reset link</Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Remembered it? <Link href="/login" className="text-primary hover:underline">Back to login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md border-border/70">
        <CardHeader className="text-center">
          <div className="mb-3 flex items-center justify-between">
            <span className="w-10" />
            <BrandixLogo />
            <ThemeToggle />
          </div>
          <CardTitle>Choose a new password</CardTitle>
          <CardDescription>Your reset link expires after one hour.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action="/api/auth/reset-password" method="post" className="space-y-4">
            <input type="hidden" name="token" value={token} />
            {error && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input id="password" name="password" type="password" required minLength={8} placeholder="At least 8 characters" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} placeholder="Repeat your password" />
            </div>
            <Button type="submit" className="w-full" disabled={!token}>Reset password</Button>
          </form>
          {!token && <p className="mt-4 text-center text-sm text-destructive">Missing reset token. Request a new reset link.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
