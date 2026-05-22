import type { BrandKitGenerated } from "@/types/brand";

export function LogoUsageGuide({ logoUrl, logoUsage }: { logoUrl?: string | null; logoUsage: BrandKitGenerated["logoUsage"] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
      <div className="flex min-h-48 items-center justify-center rounded-xl border bg-secondary/40 p-6">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt="Uploaded logo preview" className="max-h-36 max-w-full object-contain" />
        ) : (
          <div className="text-center text-sm text-muted-foreground">No logo uploaded</div>
        )}
      </div>
      <div className="rounded-xl border bg-card p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm font-medium">Clear space</p>
            <p className="mt-2 text-sm text-muted-foreground">{logoUsage.clearSpace}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Minimum size</p>
            <p className="mt-2 text-sm text-muted-foreground">{logoUsage.minimumSize}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Background usage</p>
            <p className="mt-2 text-sm text-muted-foreground">{logoUsage.backgroundUsage}</p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium">Do</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {logoUsage.dos.map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">Don't</p>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              {logoUsage.donts.map((item) => <li key={item}>- {item}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
