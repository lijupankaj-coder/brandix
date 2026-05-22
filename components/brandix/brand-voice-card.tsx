import type { BrandKitGenerated } from "@/types/brand";
import { Badge } from "@/components/ui/badge";

export function BrandVoiceCard({ voice }: { voice: BrandKitGenerated["voice"] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border bg-card p-5">
        <p className="text-sm font-medium">Personality</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{voice.personality}</p>
        <p className="mt-4 text-sm font-medium">Tone</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{voice.tone}</p>
        <p className="mt-4 text-sm font-medium">Writing style</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{voice.writingStyle}</p>
      </div>
      <div className="rounded-xl border bg-card p-5">
        <p className="text-sm font-medium">Words to use</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {voice.wordsToUse.map((word) => <Badge key={word}>{word}</Badge>)}
        </div>
        <p className="mt-5 text-sm font-medium">Words to avoid</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {voice.wordsToAvoid.map((word) => <Badge key={word} className="bg-destructive/10 text-destructive">{word}</Badge>)}
        </div>
      </div>
    </div>
  );
}
