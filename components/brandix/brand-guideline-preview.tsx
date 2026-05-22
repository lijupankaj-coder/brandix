import type { BrandKitGenerated } from "@/types/brand";

export function BrandGuidelinePreview({ companyName, generated }: { companyName: string; generated: BrandKitGenerated }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="bg-[#111827] p-8 text-white">
        <p className="text-sm uppercase tracking-[0.2em] text-white/60">Brand Guidelines</p>
        <h3 className="mt-8 text-4xl font-semibold tracking-normal">{companyName}</h3>
      </div>
      <div className="grid gap-6 p-6 md:grid-cols-2">
        <div>
          <p className="font-medium">Brand overview</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{generated.guideline.overview}</p>
        </div>
        <div>
          <p className="font-medium">Export checklist</p>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            {generated.guideline.exportChecklist.map((item) => <li key={item}>- {item}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
