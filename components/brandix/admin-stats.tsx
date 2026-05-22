import { Card, CardContent } from "@/components/ui/card";

export function AdminStats({ stats }: { stats: Record<string, number | string> }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Object.entries(stats).map(([label, value]) => (
        <Card key={label}>
          <CardContent className="p-5">
            <p className="text-sm capitalize text-muted-foreground">{label.replace(/([A-Z])/g, " $1")}</p>
            <p className="mt-2 text-3xl font-semibold tracking-normal">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
