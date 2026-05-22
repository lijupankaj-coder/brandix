import { Card, CardContent } from "@/components/ui/card";

export function DashboardStats({ totalKits, exportsCount, plan }: { totalKits: number; exportsCount: number; plan: string }) {
  const stats = [
    ["Brand kits", totalKits],
    ["Exports", exportsCount],
    ["Current plan", plan.charAt(0).toUpperCase() + plan.slice(1)]
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map(([label, value]) => (
        <Card key={label} className="border-border/70">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-normal">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
