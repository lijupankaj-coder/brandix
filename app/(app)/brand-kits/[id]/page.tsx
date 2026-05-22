import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Edit3, RefreshCw, Save } from "lucide-react";
import { BrandGuidelinePreview } from "@/components/brandix/brand-guideline-preview";
import { BrandVoiceCard } from "@/components/brandix/brand-voice-card";
import { ColorPalettePreview } from "@/components/brandix/color-palette-preview";
import { CopyButtons, ExportButtons } from "@/components/brandix/export-buttons";
import { DesignTokensPanel } from "@/components/brandix/design-tokens-panel";
import { LogoUsageGuide } from "@/components/brandix/logo-usage-guide";
import { PageHeading } from "@/components/brandix/page-heading";
import { SocialBioCard } from "@/components/brandix/social-bio-card";
import { PositioningPreview, StrategyPreview, VisualDirectionPreview } from "@/components/brandix/strategy-preview";
import { TaglineList } from "@/components/brandix/tagline-list";
import { TypographyPreview } from "@/components/brandix/typography-preview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { safeJsonParse } from "@/lib/utils";
import type { BrandKitGenerated } from "@/types/brand";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card className="border-border/70">
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default async function BrandKitResultPage({ params }: { params: Promise<{ id: string }> }) {
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
        eyebrow="Brand Kit Preview"
        title={kit.companyName}
        description={generated.summary.description}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline"><Save className="h-4 w-4" /> Save Brand Kit</Button>
            <Button asChild variant="outline"><Link href="/brand-kits/new"><RefreshCw className="h-4 w-4" /> Regenerate</Link></Button>
            <Button asChild variant="outline"><Link href="/brand-kits/new"><Edit3 className="h-4 w-4" /> Edit Inputs</Link></Button>
            <Button asChild><Link href={`/brand-kits/${kit.id}/export`}>Export</Link></Button>
          </div>
        }
      />
      <div className="mb-6">
        <CopyButtons generated={generated} />
      </div>
      <div className="space-y-6" data-brandix-preview>
        <Section title="Brand Identity Toolkit">
          <StrategyPreview generated={generated} />
        </Section>
        <Section title="Brand Positioning Manual">
          <PositioningPreview generated={generated} />
        </Section>
        <Section title="Brand Style Toolkit"><ColorPalettePreview colors={generated.colors} /></Section>
        <Section title="Visual Direction System"><VisualDirectionPreview generated={generated} /></Section>
        <Section title="Typography System"><TypographyPreview typography={generated.typography} /></Section>
        <Section title="Voice and Messaging Toolkit"><BrandVoiceCard voice={generated.voice} /></Section>
        <Section title="Tagline Library"><TaglineList taglines={generated.taglines} /></Section>
        <Section title="Social Profile Toolkit"><SocialBioCard socialBios={generated.socialBios} /></Section>
        <Section title="Logo Usage Manual"><LogoUsageGuide logoUrl={kit.logoUrl} logoUsage={generated.logoUsage} /></Section>
        <Section title="Implementation Assets"><DesignTokensPanel tokens={generated.tokens} /></Section>
        <Section title="Client-Ready Brand Manual Preview"><BrandGuidelinePreview companyName={kit.companyName} generated={generated} /></Section>
        <Card className="border-border/70">
          <CardHeader><CardTitle>Downloads</CardTitle></CardHeader>
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
      </div>
    </>
  );
}
