import { notFound } from "next/navigation";
import { ExportButtons } from "@/components/brandix/export-buttons";
import { PageHeading } from "@/components/brandix/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canUseFeature } from "@/lib/plans";
import { safeJsonParse } from "@/lib/utils";
import type { BrandKitGenerated } from "@/types/brand";

export default async function ExportPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const { id } = await params;
  const [kit, settings] = await Promise.all([
    prisma.brandKit.findFirst({ where: { id } }),
    prisma.adminSettings.upsert({ where: { id: "default" }, update: {}, create: { id: "default" } })
  ]);
  if (!kit) notFound();
  const generated = safeJsonParse<BrandKitGenerated>(kit.generatedData, {} as BrandKitGenerated);

  return (
    <>
      <PageHeading
        eyebrow="Export"
        title={`Download ${kit.companyName}`}
        description="Export a client-ready PDF, colors, CSS variables, Tailwind snippets, social copy, or a complete ZIP package."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card>
          <CardHeader><CardTitle>Export options</CardTitle></CardHeader>
          <CardContent>
            <ExportButtons
              brandKitId={kit.id}
              companyName={kit.companyName}
              generated={generated}
              logoUrl={kit.logoUrl}
              plan={user?.plan || "guest"}
              watermarkFreePlan={settings.watermarkFreePlan}
              settings={{ pdf: settings.pdfExportEnabled, zip: settings.zipExportEnabled, css: settings.cssExportEnabled, json: settings.jsonExportEnabled }}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Plan access</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Current access: <span className="font-medium text-foreground">Free builder</span></p>
            <p>PDF export: {settings.pdfExportEnabled ? "Enabled" : "Disabled"}</p>
            <p>CSS/JSON export: License required</p>
            <p>ZIP export: License required</p>
            <p>Create and preview for free. Downloads unlock after payment or license activation.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
