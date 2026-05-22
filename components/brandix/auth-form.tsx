"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BrandixLogo } from "@/components/brandix/logo";
import { ThemeToggle } from "@/components/brandix/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const searchParams = useSearchParams();
  const routeError = searchParams.get("error");

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md border-border/70">
        <CardHeader className="text-center">
          <div className="mb-3 flex items-center justify-between">
            <span className="w-10" />
            <BrandixLogo />
            <ThemeToggle />
          </div>
          <CardTitle>{mode === "login" ? "Welcome back" : "Create your Brandix account"}</CardTitle>
          <CardDescription>
            {mode === "login" ? "Sign in to manage your saved brand kits." : "Start with the Free plan and upgrade when you need exports."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline" className="mb-4 w-full">
            <Link href="/api/auth/google/start">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm font-bold text-[#4285F4]">G</span>
              Continue with Google
            </Link>
          </Button>
          <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            <span>or use email</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <form action={`/api/auth/${mode}`} method="post" className="space-y-4">
            {routeError && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{routeError}</div>}
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" name="name" required placeholder="Alex Morgan" />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required minLength={8} placeholder="At least 8 characters" />
            </div>
            <Button type="submit" className="w-full">
              {mode === "login" ? "Login" : "Sign up"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>No account yet? <Link href="/signup" className="text-primary hover:underline">Sign up</Link></>
            ) : (
              <>Already have an account? <Link href="/login" className="text-primary hover:underline">Login</Link></>
            )}
          </div>
          {mode === "login" && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              <Link href="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
