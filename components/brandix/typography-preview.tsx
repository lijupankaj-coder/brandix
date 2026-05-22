import type { BrandKitGenerated } from "@/types/brand";

export function TypographyPreview({ typography }: { typography: BrandKitGenerated["typography"] }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {Object.entries(typography).map(([key, font]) => (
        <div key={key} className="rounded-xl border bg-card p-4">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{key}</p>
          <h3 className="mt-2 text-xl font-semibold tracking-normal">{font.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">Weights: {font.weights}</p>
          <p className="mt-4 rounded-lg bg-secondary/60 p-3 text-sm">{font.preview}</p>
          <p className="mt-3 text-sm leading-5 text-muted-foreground">{font.usage}</p>
        </div>
      ))}
    </div>
  );
}
