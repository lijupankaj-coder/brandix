import Link from "next/link";
import type { ReactNode } from "react";
import { BrandixLogo } from "@/components/brandix/logo";
import { ThemeToggle } from "@/components/brandix/theme-toggle";
import { Button } from "@/components/ui/button";
import type { User } from "@prisma/client";

export function AppShell({ children }: { user: User | null; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <BrandixLogo href="/" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/brand-kits/new">Create Brand Kit</Link>
            </Button>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
