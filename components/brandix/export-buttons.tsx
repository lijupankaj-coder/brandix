"use client";

import { useState } from "react";
import { Archive, Check, Copy, Download, FileJson, FileText } from "lucide-react";
import { buildProfessionalBrandPdf } from "@/components/brandix/brand-kit-pdf";
import { DownloadPlansModal, useBrandixLicense } from "@/components/brandix/download-plans-modal";
import { Button } from "@/components/ui/button";
import type { BrandKitGenerated } from "@/types/brand";

function downloadText(filename: string, content: string, type = "text/plain") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function socialText(generated: BrandKitGenerated) {
  return Object.entries(generated.socialBios)
    .map(([key, value]) => `${key}\n${value}`)
    .join("\n\n");
}

export function CopyButtons({ generated }: { generated: BrandKitGenerated }) {
  const [message, setMessage] = useState("");
  const copy = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setMessage(`${label} copied successfully`);
    setTimeout(() => setMessage(""), 1800);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="outline" onClick={() => copy("Colors", generated.colors.map((c) => `${c.name}: ${c.hex}`).join("\n"))}><Copy className="h-4 w-4" /> Copy Colors</Button>
      <Button size="sm" variant="outline" onClick={() => copy("CSS", generated.tokens.css)}><Copy className="h-4 w-4" /> Copy CSS</Button>
      <Button size="sm" variant="outline" onClick={() => copy("JSON", generated.tokens.json)}><Copy className="h-4 w-4" /> Copy JSON</Button>
      <Button size="sm" variant="outline" onClick={() => copy("Taglines", generated.taglines.join("\n"))}><Copy className="h-4 w-4" /> Copy Taglines</Button>
      <Button size="sm" variant="outline" onClick={() => copy("Social bios", socialText(generated))}><Copy className="h-4 w-4" /> Copy Bios</Button>
      {message && <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"><Check className="h-3 w-3" /> {message}</span>}
    </div>
  );
}

export function ExportButtons({
  brandKitId,
  companyName,
  generated,
  logoUrl,
  plan,
  watermarkFreePlan,
  settings
}: {
  brandKitId: string;
  companyName: string;
  generated: BrandKitGenerated;
  logoUrl?: string | null;
  plan: string;
  watermarkFreePlan: boolean;
  settings: { pdf: boolean; zip: boolean; css: boolean; json: boolean };
}) {
  const [busy, setBusy] = useState("");
  const [showPlans, setShowPlans] = useState(false);
  const { hasLicense } = useBrandixLicense();
  const watermark = plan === "free" && watermarkFreePlan;

  const recordExport = async (exportType: string) => {
    await fetch("/api/exports", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ brandKitId, exportType })
    }).catch(() => null);
  };

  const requireLicense = (next: () => void | Promise<void>) => {
    if (!hasLicense) {
      setShowPlans(true);
      return;
    }
    void next();
  };

  const exportPdf = async () => {
    if (!settings.pdf) return;
    setBusy("pdf");
    const { blob, filename } = await buildProfessionalBrandPdf(companyName, generated, watermark, logoUrl);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    await recordExport("pdf");
    setBusy("");
  };

  const exportZip = async () => {
    if (!settings.zip) return;
    setBusy("zip");
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    const { blob: pdfBlob } = await buildProfessionalBrandPdf(companyName, generated, false, logoUrl);
    zip.file("brand-identity-toolkit.pdf", pdfBlob);
    zip.file("brand-strategy.txt", [
      generated.strategy?.essence,
      generated.strategy?.mission,
      generated.strategy?.vision,
      generated.strategy?.promise
    ].filter(Boolean).join("\n\n") || generated.summary.description);
    zip.file("brand-positioning-manual.txt", generated.positioningManual?.valueProposition || generated.summary.positioning);
    zip.file("brand-style-toolkit.txt", generated.colors.map((color) => `${color.name}: ${color.hex} / ${color.rgb} / ${color.usage}`).join("\n"));
    zip.file("messaging-pillars.txt", generated.positioningManual?.messagingPillars?.map((pillar) => `${pillar.title}\n${pillar.message}\nProof: ${pillar.proof}`).join("\n\n") || generated.voice.writingStyle);
    zip.file("visual-direction.txt", generated.visualDirection ? [generated.visualDirection.creativeDirection, generated.visualDirection.imageryStyle, ...generated.visualDirection.layoutRules].join("\n\n") : generated.guideline.overview);
    zip.file("colors.json", generated.tokens.json);
    zip.file("design-tokens.css", generated.tokens.css);
    zip.file("tailwind-colors.txt", generated.tokens.tailwind);
    zip.file("social-bios.txt", socialText(generated));
    zip.file("taglines.txt", generated.taglines.join("\n"));
    if (logoUrl) {
      try {
        const response = await fetch(logoUrl);
        const blob = await response.blob();
        const extension = logoUrl.split(".").pop() || "png";
        zip.file(`logo.${extension}`, blob);
      } catch {
        // Optional logo should not block ZIP creation.
      }
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${companyName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-brand-kit.zip`;
    link.click();
    URL.revokeObjectURL(url);
    await recordExport("zip");
    setBusy("");
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button onClick={() => requireLicense(exportPdf)} disabled={!settings.pdf || busy === "pdf"}><FileText className="h-4 w-4" /> Download PDF</Button>
      <Button
        variant="outline"
        onClick={() => requireLicense(async () => {
          downloadText("colors.json", generated.tokens.json, "application/json");
          await recordExport("json");
        })}
        disabled={!settings.json}
      >
        <FileJson className="h-4 w-4" /> Colors JSON
      </Button>
      <Button
        variant="outline"
        onClick={() => requireLicense(async () => {
          downloadText("design-tokens.css", generated.tokens.css, "text/css");
          await recordExport("css");
        })}
        disabled={!settings.css}
      >
        <Download className="h-4 w-4" /> CSS
      </Button>
      <Button
        variant="outline"
        onClick={() => requireLicense(async () => {
          downloadText("tailwind-colors.txt", generated.tokens.tailwind);
          await recordExport("tailwind");
        })}
      >
        <Download className="h-4 w-4" /> Tailwind
      </Button>
      <Button
        variant="outline"
        onClick={() => requireLicense(async () => {
          downloadText("social-bios.txt", socialText(generated));
          await recordExport("social-bios");
        })}
      >
        <Download className="h-4 w-4" /> Social Bios
      </Button>
      <Button variant="accent" onClick={() => requireLicense(exportZip)} disabled={!settings.zip || busy === "zip"}>
        <Archive className="h-4 w-4" /> Download ZIP
      </Button>
      <DownloadPlansModal open={showPlans} onClose={() => setShowPlans(false)} />
    </div>
  );
}
