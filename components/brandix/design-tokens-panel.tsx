import type { BrandKitGenerated } from "@/types/brand";

export function DesignTokensPanel({ tokens }: { tokens: BrandKitGenerated["tokens"] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {Object.entries(tokens).map(([key, value]) => (
        <div key={key} className="overflow-hidden rounded-xl border bg-[#0b1020] text-slate-100">
          <div className="border-b border-white/10 px-4 py-3 text-sm font-medium capitalize">{key}</div>
          <pre className="max-h-80 overflow-auto p-4 text-xs leading-5"><code>{value}</code></pre>
        </div>
      ))}
    </div>
  );
}
