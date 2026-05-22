import Link from "next/link";
import { Copy, Download, Trash2 } from "lucide-react";
import type { BrandKit } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteBrandKitAction, duplicateBrandKitAction, renameBrandKitAction } from "@/app/actions/brand-kits";
import { formatDate, safeJsonParse } from "@/lib/utils";
import type { BrandKitGenerated } from "@/types/brand";

export function SavedKitCard({ kit }: { kit: BrandKit }) {
  const generated = safeJsonParse<BrandKitGenerated>(kit.generatedData, {} as BrandKitGenerated);
  const mainColor = generated.colors?.[0]?.hex || kit.preferredColor || "#7C3AED";

  return (
    <Card className="border-border/70">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-xl border shadow-inner" style={{ background: mainColor }} />
          <div className="min-w-0 flex-1">
            <Link href={`/brand-kits/${kit.id}`} className="text-lg font-semibold hover:text-primary">{kit.companyName}</Link>
            <p className="mt-1 text-sm text-muted-foreground">{kit.industry} · {kit.brandStyle} · {formatDate(kit.createdAt)}</p>
          </div>
        </div>
        <form action={renameBrandKitAction} className="mt-4 flex gap-2">
          <input type="hidden" name="id" value={kit.id} />
          <input name="companyName" defaultValue={kit.companyName} className="h-9 min-w-0 flex-1 rounded-lg border bg-background px-3 text-sm" />
          <Button size="sm" variant="outline">Rename</Button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href={`/brand-kits/${kit.id}`}>Open</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={`/brand-kits/${kit.id}/export`}><Download className="h-4 w-4" /> Export</Link>
          </Button>
          <form action={duplicateBrandKitAction}>
            <input type="hidden" name="id" value={kit.id} />
            <Button size="sm" variant="outline"><Copy className="h-4 w-4" /> Duplicate</Button>
          </form>
          <form action={deleteBrandKitAction}>
            <input type="hidden" name="id" value={kit.id} />
            <Button size="sm" variant="outline"><Trash2 className="h-4 w-4" /> Delete</Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
