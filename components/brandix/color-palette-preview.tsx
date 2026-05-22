import type { BrandColor } from "@/types/brand";

export function ColorPalettePreview({ colors }: { colors: BrandColor[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {colors.map((color) => (
        <div key={color.name} className="overflow-hidden rounded-xl border bg-card">
          <div className="h-20" style={{ background: color.hex }} />
          <div className="space-y-1 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">{color.name}</p>
              <code className="rounded-md bg-secondary px-2 py-1 text-xs">{color.hex}</code>
            </div>
            <p className="text-xs text-muted-foreground">RGB {color.rgb}</p>
            <p className="text-sm leading-5 text-muted-foreground">{color.usage}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
