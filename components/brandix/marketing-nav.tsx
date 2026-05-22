import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrandixLogo } from "@/components/brandix/logo";
import { ThemeToggle } from "@/components/brandix/theme-toggle";

export async function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <BrandixLogo />
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/brand-kits/new" className="hover:text-foreground">Create</Link>
          <Link href="/#features" className="hover:text-foreground">Features</Link>
          <Link href="/terms.html" className="hover:text-foreground">Terms</Link>
          <Link href="/#faq" className="hover:text-foreground">FAQ</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href="/brand-kits/new">Create Brand Kit</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
