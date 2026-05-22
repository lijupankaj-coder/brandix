import Link from "next/link";
import { ArrowRight, CheckCircle2, FileDown, Palette, Sparkles, Type, Wand2 } from "lucide-react";
import { MarketingFooter } from "@/components/brandix/marketing-footer";
import { MarketingNav } from "@/components/brandix/marketing-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  ["AI brand kit generator", Sparkles],
  ["Color palette generator", Palette],
  ["Font pairing suggestions", Type],
  ["Brand voice and tagline ideas", Wand2],
  ["Logo usage guidance", CheckCircle2],
  ["PDF brand guideline export", FileDown],
  ["CSS / JSON export", FileDown],
  ["Saved brand kits", CheckCircle2]
];

const faqs = [
  ["Can Brandix work without an AI API?", "Yes. The MVP uses deterministic local generation first, with a clean service boundary for future AI providers."],
  ["What is included in a brand kit?", "Colors, typography, positioning, tone of voice, taglines, social bios, logo usage guidance, guidelines, and design tokens."],
  ["Can I export files for clients?", "Yes. You can build and preview for free, then unlock client-ready downloads with a Brandix monthly or yearly license."],
  ["Do I need an account to create a kit?", "No. You can create and preview a full brand kit in the browser without signing in."]
];

function SampleBrandKitMockup() {
  return (
    <div className="relative mx-auto max-w-5xl rounded-2xl border bg-card p-4 shadow-glow">
      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl bg-[#111827] p-6 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-white/50">Sample kit</p>
          <h2 className="mt-8 text-4xl font-semibold tracking-normal">Northstar Studio</h2>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/70">A modern identity for a strategy studio helping founders turn early traction into trusted market presence.</p>
          <div className="mt-8 grid grid-cols-5 gap-2">
            {["#7C3AED", "#2563EB", "#F59E0B", "#111827", "#F9FAFB"].map((color) => (
              <div key={color} className="h-16 rounded-lg border border-white/10" style={{ background: color }} />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-xl border bg-background p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Typography</p>
            <h3 className="mt-3 text-2xl font-semibold">Space Grotesk</h3>
            <p className="mt-2 text-sm text-muted-foreground">Inter for clear interface and long-form copy.</p>
          </div>
          <div className="rounded-xl border bg-background p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Voice</p>
            <p className="mt-3 text-sm leading-6">Confident, useful, direct, and human. Lead with outcomes before features.</p>
          </div>
          <div className="rounded-xl border bg-background p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Tagline</p>
            <p className="mt-3 text-lg font-medium">Build trust before the first click.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <main>
        <section className="relative overflow-hidden px-6 pb-16 pt-20">
          <div className="absolute inset-0 -z-10 bg-grid opacity-40" />
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-4 py-1.5 text-xs font-medium text-primary shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Brandix by Nebulix
            </div>
            <h1 className="mt-7 text-5xl font-semibold tracking-normal md:text-7xl">Brandix</h1>
            <p className="mt-4 text-2xl text-gradient-brand md:text-3xl">Create a professional brand kit in minutes.</p>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              Brandix helps you generate brand colors, font pairings, taglines, tone of voice, social bios, and downloadable brand guidelines from simple business details.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg"><Link href="/brand-kits/new">Create Brand Kit <ArrowRight className="h-4 w-4" /></Link></Button>
            </div>
          </div>
          <div className="mt-16">
            <SampleBrandKitMockup />
          </div>
        </section>

        <section id="features" className="border-t border-border/60 px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Features</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal md:text-5xl">Everything a mini brand system needs.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(([label, Icon]) => (
                <Card key={label as string} className="border-border/70">
                  <CardContent className="p-5">
                    <Icon className="h-5 w-5 text-primary" />
                    <p className="mt-4 font-medium">{label as string}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/60 px-6 py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">How it works</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal md:text-5xl">From details to guidelines.</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {["Enter business details", "Choose brand style", "Generate brand kit", "Export and use"].map((step, index) => (
                <div key={step} className="rounded-xl border bg-card p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">{index + 1}</div>
                  <p className="mt-5 font-medium">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="border-t border-border/60 px-6 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">FAQ</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal md:text-5xl">Practical answers.</h2>
            </div>
            <div className="space-y-3">
              {faqs.map(([question, answer]) => (
                <Card key={question} className="border-border/70">
                  <CardContent className="p-5">
                    <p className="font-medium">{question}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
