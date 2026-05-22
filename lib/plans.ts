export type Plan = "free" | "pro" | "business" | "lifetime";

export const planNames: Record<Plan, string> = {
  free: "Free",
  pro: "Pro",
  business: "Business",
  lifetime: "Lifetime"
};

export function normalizePlan(plan: string): Plan {
  if (plan === "pro" || plan === "business" || plan === "lifetime") return plan;
  return "free";
}

export function canUseFeature(plan: string, feature: "css" | "json" | "tailwind" | "zip" | "logo" | "fullPdf") {
  const normalized = normalizePlan(plan);
  if (feature === "logo") return normalized !== "free";
  if (feature === "fullPdf") return normalized !== "free";
  if (feature === "zip") return normalized !== "free";
  if (feature === "css" || feature === "json" || feature === "tailwind") return normalized !== "free";
  return false;
}

export function taglineLimit(plan: string) {
  return normalizePlan(plan) === "free" ? 4 : 10;
}
