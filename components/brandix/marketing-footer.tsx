import Link from "next/link";
import { BrandixLogo } from "@/components/brandix/logo";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div className="space-y-3">
          <BrandixLogo />
          <p className="max-w-sm text-sm text-muted-foreground">
            Create a professional brand kit in minutes. Built by Nebulix for founders, freelancers, and modern teams.
          </p>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-medium">Product</p>
          <Link href="/brand-kits/new" className="block text-muted-foreground hover:text-foreground">Create Brand Kit</Link>
          <Link href="/terms.html" className="block text-muted-foreground hover:text-foreground">Terms</Link>
          <Link href="/privacy.html" className="block text-muted-foreground hover:text-foreground">Privacy</Link>
          <Link href="/cookies.html" className="block text-muted-foreground hover:text-foreground">Cookies</Link>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-medium">Nebulix</p>
          <Link href="https://nebulixcloud.com" target="_blank" rel="noopener" className="block text-muted-foreground hover:text-foreground">nebulixcloud.com</Link>
          <p className="text-muted-foreground">hello@nebulixcloud.com</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 pt-1 text-xs">
            <Link href="/refund.html" className="text-muted-foreground hover:text-foreground">Refund</Link>
            <Link href="/subscription.html" className="text-muted-foreground hover:text-foreground">Subscription</Link>
            <Link href="/dpa.html" className="text-muted-foreground hover:text-foreground">DPA</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl border-t border-border/40 px-6 py-4 text-xs text-muted-foreground">
        © 2026 Nebulix. All rights reserved.
      </div>
    </footer>
  );
}
