import Link from "next/link";
import { Sparkles } from "lucide-react";

export function BrandixLogo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 font-semibold tracking-normal">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-glow">
        <Sparkles className="h-4 w-4" />
      </span>
      <span>Brandix</span>
    </Link>
  );
}
