export function TaglineList({ taglines }: { taglines: string[] }) {
  return (
    <div className="grid gap-2 md:grid-cols-2">
      {taglines.map((tagline, index) => (
        <div key={tagline} className="rounded-xl border bg-card p-4 text-sm">
          <span className="mr-2 text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
          {tagline}
        </div>
      ))}
    </div>
  );
}
