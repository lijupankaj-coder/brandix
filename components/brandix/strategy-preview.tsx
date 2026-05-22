import type { BrandKitGenerated } from "@/types/brand";

function fallbackStrategy(generated: BrandKitGenerated) {
  return {
    essence: "Clear brand confidence.",
    mission: generated.summary.description,
    vision: generated.summary.positioning,
    promise: generated.summary.audience,
    attributes: generated.voice.wordsToUse
  };
}

function fallbackPositioning(generated: BrandKitGenerated) {
  return {
    oneLiner: generated.summary.positioning,
    valueProposition: generated.summary.description,
    differentiators: generated.guideline.exportChecklist.slice(0, 3),
    proofPoints: generated.guideline.exportChecklist.slice(0, 3),
    personas: [],
    messagingPillars: []
  };
}

export function StrategyPreview({ generated }: { generated: BrandKitGenerated }) {
  const strategy = generated.strategy || fallbackStrategy(generated);
  const positioning = generated.positioningManual || fallbackPositioning(generated);

  return (
    <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-4">
        {[
          ["Brand essence", strategy.essence],
          ["Mission", strategy.mission],
          ["Vision", strategy.vision],
          ["Promise", strategy.promise]
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border bg-card p-4">
            <p className="text-sm font-medium">{label}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border bg-secondary/40 p-5">
        <p className="text-sm font-medium">Value proposition</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{positioning.valueProposition}</p>
        <p className="mt-5 text-sm font-medium">Brand attributes</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {strategy.attributes.map((attribute) => (
            <span key={attribute} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{attribute}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PositioningPreview({ generated }: { generated: BrandKitGenerated }) {
  const positioning = generated.positioningManual || fallbackPositioning(generated);

  return (
    <div className="space-y-5">
      <div className="rounded-xl border bg-card p-5">
        <p className="text-sm font-medium">One-liner</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{positioning.oneLiner}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ListPanel title="Differentiators" items={positioning.differentiators} />
        <ListPanel title="Proof points" items={positioning.proofPoints} />
      </div>
      {positioning.messagingPillars.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {positioning.messagingPillars.map((pillar) => (
            <div key={pillar.title} className="rounded-xl border bg-card p-4">
              <p className="font-medium">{pillar.title}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{pillar.message}</p>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">{pillar.proof}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ListPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-sm font-medium">{title}</p>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
        {items.map((item) => <li key={item}>- {item}</li>)}
      </ul>
    </div>
  );
}

export function VisualDirectionPreview({ generated }: { generated: BrandKitGenerated }) {
  const visual = generated.visualDirection;
  if (!visual) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border bg-card p-5">
        <p className="text-sm font-medium">Creative direction</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{visual.creativeDirection}</p>
        <p className="mt-5 text-sm font-medium">Imagery style</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{visual.imageryStyle}</p>
      </div>
      <div className="space-y-4">
        <ListPanel title="Layout rules" items={visual.layoutRules} />
        <ListPanel title="Accessibility notes" items={visual.accessibilityNotes} />
      </div>
    </div>
  );
}
