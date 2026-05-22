import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Free Builder",
    price: "$0",
    description: "Create and preview brand kits without an account.",
    features: ["Unlimited building", "Full preview", "Brand colors", "Typography", "Messaging ideas"],
    cta: "Start building"
  },
  {
    name: "Monthly",
    price: "$9/mo",
    description: "Unlock client-ready downloads monthly.",
    features: ["PDF downloads", "Complete ZIP export", "CSS and JSON export", "Tailwind snippets", "Social copy files", "Logo included"],
    cta: "Choose Monthly",
    highlighted: true
  },
  {
    name: "Yearly",
    price: "$89/yr",
    description: "Best value for repeat brand work.",
    features: ["All monthly features", "Save over 17%", "Unlimited client-ready exports", "Annual license", "Commercial usage"],
    cta: "Choose Yearly"
  },
  {
    name: "Already Paid",
    price: "License",
    description: "Activate your browser with a Brandix key.",
    features: ["Paste license key", "Unlock downloads", "Keep building free", "Use on this browser"],
    cta: "Activate key"
  }
];

export function PricingCards() {
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {plans.map((plan) => (
        <Card key={plan.name} className={plan.highlighted ? "border-primary shadow-glow" : "border-border/70"}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {plan.name}
              {plan.highlighted && <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">Popular</span>}
            </CardTitle>
            <div className="text-3xl font-semibold tracking-normal">{plan.price}</div>
            <p className="text-sm text-muted-foreground">{plan.description}</p>
          </CardHeader>
          <CardContent className="space-y-5">
            <ul className="space-y-2 text-sm">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button asChild className="w-full" variant={plan.highlighted ? "default" : "outline"}>
              <Link href={plan.name === "Free Builder" ? "/brand-kits/new" : "/pricing"}>{plan.cta}</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
