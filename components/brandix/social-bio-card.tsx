import type { BrandKitGenerated } from "@/types/brand";

export function SocialBioCard({ socialBios }: { socialBios: BrandKitGenerated["socialBios"] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {Object.entries(socialBios).map(([key, value]) => (
        <div key={key} className="rounded-xl border bg-card p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{key.replace(/([A-Z])/g, " $1")}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
        </div>
      ))}
    </div>
  );
}
