"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { brandStyles } from "@/lib/schemas";

const steps = ["Business details", "Brand personality", "Visual preferences", "Generate"];

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button type="submit" size="lg" disabled={isSubmitting}>
      <Sparkles className="h-4 w-4" />
      {isSubmitting ? "Generating..." : "Generate Brand Kit"}
    </Button>
  );
}

export function BrandKitForm() {
  return <BrandKitWizard />;
}

export function BrandKitWizard() {
  const [step, setStep] = useState(0);
  const [logoName, setLogoName] = useState("");
  const [clientError, setClientError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);
  const readValue = (formData: FormData, name: string) => String(formData.get(name) || "").trim();

  const validateStep = (index: number) => {
    if (!formRef.current) return true;
    const formData = new FormData(formRef.current);
    const required = (name: string, label: string) => {
      if (readValue(formData, name)) return true;
      setClientError(`${label} is required.`);
      return false;
    };

    setClientError("");
    if (index === 0) {
      if (!required("companyName", "Company name")) return false;
      if (!required("industry", "Industry")) return false;
      const description = readValue(formData, "description");
      if (description.length < 20) {
        setClientError("Description should be at least 20 characters.");
        return false;
      }
      return required("targetAudience", "Target audience");
    }
    if (index === 1) return required("brandStyle", "Brand style");
    if (index === 2) {
      const websiteUrl = readValue(formData, "websiteUrl");
      const preferredColor = readValue(formData, "preferredColor");
      if (websiteUrl && !/^https?:\/\/[^\s]+\.[^\s]+$/i.test(websiteUrl)) {
        setClientError("Website URL must include http:// or https://.");
        return false;
      }
      if (preferredColor && !/^#[0-9a-f]{6}$/i.test(preferredColor)) {
        setClientError("Preferred color must be a valid hex code like #7C3AED.");
        return false;
      }
    }
    return true;
  };

  const validateAll = () => {
    for (let index = 0; index <= 2; index += 1) {
      if (!validateStep(index)) {
        setStep(index);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!validateAll()) {
      event.preventDefault();
      return;
    }
    setIsSubmitting(true);
  };

  return (
    <Card className="overflow-hidden border-border/70">
      <div className="h-1 bg-secondary">
        <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
      <CardContent className="p-0">
        <div className="grid lg:grid-cols-[260px_1fr]">
          <aside className="border-b bg-secondary/40 p-5 lg:border-b-0 lg:border-r">
            <div className="space-y-2">
              {steps.map((label, index) => (
                <button
                  type="button"
                  key={label}
                  onClick={() => setStep(index)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                    index === step ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:bg-card/60"
                  }`}
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border text-xs">{index + 1}</span>
                  {label}
                </button>
              ))}
            </div>
          </aside>
          <form ref={formRef} action="/api/brand-kits" method="post" encType="multipart/form-data" noValidate onSubmit={handleSubmit} className="space-y-6 p-5 md:p-8">
            {(error || clientError) && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {clientError || error}
              </div>
            )}

            <section className={step === 0 ? "grid gap-5" : "hidden"}>
              <div>
                <h2 className="text-xl font-semibold tracking-normal">Business details</h2>
                <p className="mt-1 text-sm text-muted-foreground">Start with the basics so Brandix can shape a useful identity system.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company name</Label>
                  <Input id="companyName" name="companyName" placeholder="Northstar Studio" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input id="industry" name="industry" placeholder="Design agency" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Short business description</Label>
                <Textarea id="description" name="description" placeholder="Describe what the business does, what makes it different, and what customers need from it." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAudience">Target audience</Label>
                <Input id="targetAudience" name="targetAudience" placeholder="Startup founders, local retailers, agency clients" />
              </div>
            </section>

            <section className={step === 1 ? "grid gap-5" : "hidden"}>
              <div>
                <h2 className="text-xl font-semibold tracking-normal">Brand personality</h2>
                <p className="mt-1 text-sm text-muted-foreground">Choose the style and language cues that should guide the kit.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandStyle">Brand style</Label>
                <select id="brandStyle" name="brandStyle" className="h-10 w-full rounded-lg border bg-background px-3 text-sm">
                  {brandStyles.map((style) => <option key={style}>{style}</option>)}
                </select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="keywords">Brand keywords</Label>
                  <Input id="keywords" name="keywords" placeholder="trusted, fast, calm, premium" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred language</Label>
                  <Input id="language" name="language" placeholder="English" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="market">Country / market</Label>
                  <Input id="market" name="market" placeholder="UAE, US, global" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productType">Product or service type</Label>
                  <Input id="productType" name="productType" placeholder="Consulting, software, bakery" />
                </div>
              </div>
            </section>

            <section className={step === 2 ? "grid gap-5" : "hidden"}>
              <div>
                <h2 className="text-xl font-semibold tracking-normal">Visual preferences</h2>
                <p className="mt-1 text-sm text-muted-foreground">Optional direction helps align colors, references, and logo guidance.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Input id="websiteUrl" name="websiteUrl" placeholder="https://example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredColor">Preferred primary color</Label>
                  <Input id="preferredColor" name="preferredColor" placeholder="#7C3AED" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="competitors">Competitor or reference brands</Label>
                <Textarea id="competitors" name="competitors" placeholder="List competitors, inspiration brands, or visual references." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Existing logo upload</Label>
                <label className="flex cursor-pointer items-center justify-between rounded-lg border border-dashed bg-secondary/30 px-4 py-4 text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground"><Upload className="h-4 w-4" /> {logoName || "PNG, JPG, or SVG under 2MB"}</span>
                  <span className="font-medium text-primary">Choose file</span>
                  <input id="logo" name="logo" type="file" accept=".png,.jpg,.jpeg,.svg,image/png,image/jpeg,image/svg+xml" className="hidden" onChange={(event) => setLogoName(event.target.files?.[0]?.name || "")} />
                </label>
              </div>
            </section>

            <section className={step === 3 ? "grid gap-5" : "hidden"}>
              <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8">
                <div className="mb-5 inline-flex rounded-full border bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  Free local AI
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-normal">Ready to generate</h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
                  Brandix will use the free local AI generator to create colors, typography, voice, social bios, logo usage rules, guideline copy, and design tokens.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(0)}>Review details</Button>
                <SubmitButton isSubmitting={isSubmitting} />
              </div>
            </section>

            <div className="flex justify-between border-t pt-5">
              <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              {step < steps.length - 1 && (
                <Button type="button" onClick={() => validateStep(step) && setStep((value) => Math.min(steps.length - 1, value + 1))}>
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
