import type { BrandColor, BrandKitGenerated, BrandKitInput, BrandStyle } from "@/types/brand";

const fallbackPalettes: Record<BrandStyle, string[]> = {
  Modern: ["#7C3AED", "#2563EB", "#F59E0B"],
  Luxury: ["#111827", "#9F7AEA", "#D6A84F"],
  Minimal: ["#111827", "#64748B", "#7C3AED"],
  Corporate: ["#1D4ED8", "#0F766E", "#F59E0B"],
  Friendly: ["#7C3AED", "#14B8A6", "#F59E0B"],
  Creative: ["#9333EA", "#EC4899", "#F59E0B"],
  Bold: ["#DC2626", "#111827", "#F59E0B"],
  Elegant: ["#6D28D9", "#334155", "#C084FC"],
  Tech: ["#2563EB", "#06B6D4", "#7C3AED"],
  Playful: ["#8B5CF6", "#22C55E", "#F59E0B"]
};

const fontPairs: Record<BrandStyle, [string, string, string]> = {
  Modern: ["Space Grotesk", "Inter", "IBM Plex Mono"],
  Luxury: ["Playfair Display", "Source Sans 3", "Cormorant Garamond"],
  Minimal: ["Inter", "IBM Plex Sans", "JetBrains Mono"],
  Corporate: ["Manrope", "Inter", "Roboto Slab"],
  Friendly: ["Nunito Sans", "Inter", "DM Sans"],
  Creative: ["Fraunces", "DM Sans", "Space Mono"],
  Bold: ["Archivo Black", "Inter", "Oswald"],
  Elegant: ["Cormorant Garamond", "Lora", "Montserrat"],
  Tech: ["Space Grotesk", "Inter", "JetBrains Mono"],
  Playful: ["Poppins", "Nunito Sans", "Baloo 2"]
};

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");
  const value = Number.parseInt(clean, 16);
  return `${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}`;
}

function clamp(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function shade(hex: string, amount: number) {
  const clean = hex.replace("#", "");
  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);
  const mix = amount > 0 ? 255 : 0;
  const ratio = Math.abs(amount);
  const next = [r, g, b].map((channel) => clamp(channel + (mix - channel) * ratio));
  return `#${next.map((n) => n.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

function buildColor(name: string, hex: string, usage: string): BrandColor {
  return { name, hex: hex.toUpperCase(), rgb: hexToRgb(hex), usage };
}

function sanitizePhrase(value: string) {
  return value.replace(/[<>]/g, "").trim();
}

function sentence(value: string) {
  const clean = sanitizePhrase(value).replace(/\s+/g, " ");
  return clean.endsWith(".") ? clean : `${clean}.`;
}

function titleCase(value: string) {
  return value
    .split(/\s+/)
    .map((word) => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(" ");
}

function normalizeAcronyms(value: string) {
  return value.replace(/\bai\b/gi, "AI").replace(/\bsaas\b/gi, "SaaS").replace(/\bapi\b/gi, "API");
}

function audienceLabel(raw: string, industry: string) {
  const clean = normalizeAcronyms(sanitizePhrase(raw).replace(/\s+/g, " "));
  const wordCount = clean.split(/\s+/).filter(Boolean).length;
  if (!clean) return `decision-makers in ${industry}`;
  if (wordCount > 12 || /[.!?]/.test(clean)) return `growth-focused ${industry} buyers`;
  return clean;
}

function productLabel(input: BrandKitInput, industry: string) {
  return normalizeAcronyms(sanitizePhrase(input.productType || `${industry} solutions`));
}

function styleTone(style: BrandStyle) {
  if (style === "Luxury" || style === "Elegant") return "polished, selective, and precise";
  if (style === "Playful" || style === "Friendly") return "warm, energetic, and approachable";
  if (style === "Bold" || style === "Creative") return "confident, expressive, and memorable";
  if (style === "Corporate") return "credible, structured, and dependable";
  if (style === "Tech") return "sharp, clear, and future-facing";
  return "clear, confident, and modern";
}

function withArticle(value: string) {
  return `${/^(a|e|i|o|u|AI)\b/i.test(value.trim()) ? "an" : "a"} ${value}`;
}

export function generateBrandKit(input: BrandKitInput): BrandKitGenerated {
  const primary = input.preferredColor?.toUpperCase() || fallbackPalettes[input.brandStyle][0];
  const secondary = fallbackPalettes[input.brandStyle][1];
  const accent = fallbackPalettes[input.brandStyle][2];
  const [headingFont, bodyFont, accentFont] = fontPairs[input.brandStyle];
  const company = sanitizePhrase(input.companyName);
  const industry = normalizeAcronyms(sanitizePhrase(input.industry));
  const audience = audienceLabel(input.targetAudience, industry);
  const product = productLabel(input, industry);
  const tone = styleTone(input.brandStyle);
  const description = sentence(input.description);
  const keywords = input.keywords
    ?.split(/[,\n]/)
    .map((word) => word.trim())
    .filter(Boolean)
    .slice(0, 5);

  const colors = [
    buildColor("Primary", primary, "Main brand actions, hero moments, active states, and signature UI elements."),
    buildColor("Secondary", secondary, "Supporting sections, secondary buttons, charts, and complementary visuals."),
    buildColor("Accent", accent, "Highlights, callouts, pricing emphasis, and small moments of warmth."),
    buildColor("Neutral Dark", "#111827", "Headlines, body text, dark surfaces, and high-contrast marks."),
    buildColor("Neutral Light", "#F3F4F6", "Subtle surfaces, dividers, disabled states, and secondary backgrounds."),
    buildColor("Background", "#F9FAFB", "Primary page background and calm content zones."),
    buildColor("Success", "#22C55E", "Positive status, approvals, and completed states."),
    buildColor("Warning", "#F59E0B", "Caution states, usage alerts, and billing notices."),
    buildColor("Error", "#EF4444", "Validation errors, destructive actions, and failed states.")
  ];

  const css = `:root {
  --brand-primary: ${colors[0].hex};
  --brand-secondary: ${colors[1].hex};
  --brand-accent: ${colors[2].hex};
  --brand-neutral-dark: ${colors[3].hex};
  --brand-neutral-light: ${colors[4].hex};
  --brand-background: ${colors[5].hex};
  --brand-success: ${colors[6].hex};
  --brand-warning: ${colors[7].hex};
  --brand-error: ${colors[8].hex};
}`;

  const jsonTokens = JSON.stringify(
    {
      color: Object.fromEntries(colors.map((color) => [color.name.toLowerCase().replace(/\s+/g, "-"), color.hex])),
      typography: {
        heading: headingFont,
        body: bodyFont,
        accent: accentFont
      }
    },
    null,
    2
  );

  const tailwind = `colors: {
  brand: {
    primary: "${colors[0].hex}",
    secondary: "${colors[1].hex}",
    accent: "${colors[2].hex}",
    dark: "${colors[3].hex}",
    light: "${colors[4].hex}",
    background: "${colors[5].hex}"
  }
}`;

  const shadcn = `--primary: ${hexToRgb(colors[0].hex).replace(/,/g, "")};
--accent: ${hexToRgb(colors[2].hex).replace(/,/g, "")};
--background: 249 250 251;
--foreground: 17 24 39;`;

  return {
    summary: {
      description: `${company} is a ${input.brandStyle.toLowerCase()} ${industry} brand built for ${audience}. ${description}`,
      positioning: `${company} helps ${audience} choose ${product} with more confidence by making the offer feel clear, credible, and ready to act on.`,
      audience: `${audience}${input.market ? ` in ${sanitizePhrase(input.market)}` : ""}, especially people looking for clarity, consistency, and a polished brand experience.`
    },
    strategy: {
      essence: `${titleCase(input.brandStyle)} clarity for ${audience}.`,
      mission: `Help ${audience} make confident decisions through useful ${product}, clear communication, and a consistently polished brand experience.`,
      vision: `Become the trusted ${industry} reference that customers remember for practical value, strong execution, and a distinctive point of view.`,
      promise: `${company} makes every interaction feel easier to understand, easier to trust, and easier to move forward with.`,
      attributes: [input.brandStyle, "Clear", "Credible", "Useful", "Memorable"]
    },
    positioningManual: {
      oneLiner: `${company} creates ${withArticle(`${tone} ${product}`)} for ${audience}.`,
      valueProposition: `${company} combines practical expertise with a ${input.brandStyle.toLowerCase()} identity system so customers quickly understand the value, trust the offer, and know what to do next.`,
      differentiators: [
        `A ${input.brandStyle.toLowerCase()} brand presence that feels consistent across every touchpoint.`,
        `Messaging that translates ${industry} value into simple customer outcomes.`,
        "A visual system designed for digital, social, sales, and client-facing materials."
      ],
      proofPoints: [
        "Consistent color, type, voice, and layout rules for repeatable execution.",
        "Messaging pillars that connect customer needs to concrete outcomes.",
        "Export-ready assets for web, social, proposals, and implementation teams."
      ],
      personas: [
        {
          name: "Primary Buyer",
          needs: `A simple way to compare ${industry} options and feel confident before committing.`,
          objections: "They may worry about unclear value, inconsistent quality, or a brand that feels unfinished.",
          message: `${company} gives you a polished, practical path from interest to decision.`
        },
        {
          name: "Practical Evaluator",
          needs: "Clear proof, plain language, and enough structure to justify the next step.",
          objections: "They may tune out broad claims, buzzwords, or visual inconsistency.",
          message: `Every ${company} touchpoint should make the benefit specific and easy to repeat.`
        }
      ],
      messagingPillars: [
        { title: "Clarity", message: "Explain the outcome before the feature.", proof: "Use direct headlines, short supporting copy, and visible next actions." },
        { title: "Trust", message: "Signal quality through consistency.", proof: "Keep color, spacing, typography, and tone steady across channels." },
        { title: "Momentum", message: "Make the next step feel low-friction.", proof: "Use practical CTAs, helpful proof points, and concise social/profile copy." }
      ]
    },
    visualDirection: {
      creativeDirection: `Use a ${input.brandStyle.toLowerCase()} visual language with generous spacing, confident type hierarchy, and purposeful accent color moments.`,
      layoutRules: [
        "Lead with one clear message per section.",
        "Use strong contrast for headlines and calls to action.",
        "Group repeated information into clean cards or structured rows.",
        "Keep decorative elements secondary to product, proof, and customer value."
      ],
      imageryStyle: "Choose images or graphics that show real outcomes, product context, customer confidence, or clean operational detail.",
      accessibilityNotes: [
        "Do not place amber accent text on white at small sizes.",
        "Use neutral dark for body copy on light backgrounds.",
        "Reserve primary color for actions and signature brand moments.",
        "Check contrast before using color overlays or photography."
      ]
    },
    usageExamples: {
      websiteHero: `${company} helps ${audience} move from interest to confident action with ${product}.`,
      callToAction: `Build with ${company}`,
      elevatorPitch: `${company} is a ${input.brandStyle.toLowerCase()} ${industry} brand helping ${audience} understand, trust, and act on ${product}.`,
      emailSignature: `${company} | ${titleCase(industry)} | ${input.websiteUrl || "brand-ready contact"}`
    },
    colors,
    typography: {
      heading: {
        name: headingFont,
        usage: "Headlines, hero copy, section titles, and major campaign statements.",
        weights: "600, 700",
        preview: `${company} makes a sharper first impression.`
      },
      body: {
        name: bodyFont,
        usage: "Paragraphs, interface copy, product pages, proposals, and documentation.",
        weights: "400, 500, 600",
        preview: "Clear language, steady rhythm, and confident spacing make the brand easy to read."
      },
      accent: {
        name: accentFont,
        usage: "Small labels, pull quotes, product codes, captions, and editorial moments.",
        weights: "400, 600",
        preview: "Built with intention."
      }
    },
    voice: {
      personality: `${input.brandStyle}, useful, confident, and human.`,
      tone: `Speak with ${input.brandStyle === "Luxury" || input.brandStyle === "Elegant" ? "restraint and polish" : input.brandStyle === "Playful" ? "energy and warmth" : "clarity and confidence"}.`,
      writingStyle:
        "Use short sentences, concrete benefits, and direct calls to action. Lead with outcomes before features.",
      wordsToUse: keywords?.length ? keywords : ["clear", "trusted", "simple", "professional", "ready"],
      wordsToAvoid: ["cheap", "disruptive", "revolutionary", "best-in-class", "synergy"]
    },
    taglines: [
      `${company}, made unmistakable.`,
      `Build trust before the first click.`,
      `A clearer brand for a sharper business.`,
      `Where ${industry} meets confident design.`,
      `Show up polished everywhere.`,
      `Make every first impression count.`,
      `Brand clarity for the work ahead.`,
      `Simple signals. Stronger recognition.`,
      `Designed to be remembered.`,
      `Your ${input.brandStyle.toLowerCase()} edge in ${industry}.`
    ],
    socialBios: {
      instagram: `${company} helps ${audience} with ${input.productType || industry}. ${input.brandStyle} ideas, clear outcomes, and a brand built to travel.`,
      linkedin: `${company} is ${withArticle(`${input.brandStyle.toLowerCase()} ${industry} brand`)} serving ${audience}. We combine practical expertise with a ${input.brandStyle.toLowerCase()} point of view to help customers make confident decisions.`,
      twitter: `${company}: ${input.brandStyle.toLowerCase()} ${industry} solutions for ${audience}. Clear, useful, ready to grow.`,
      facebook: `${company} supports ${audience} with ${input.productType || industry}. Follow for updates, practical ideas, and a polished look at what we are building.`,
      metaDescription: `${company} is a ${input.brandStyle.toLowerCase()} ${industry} brand helping ${audience} with ${input.productType || "practical solutions"}.`
    },
    logoUsage: {
      clearSpace: "Keep clear space around the logo equal to the height of its main letterform or symbol.",
      minimumSize: "Use the logo no smaller than 120px wide on screens or 32mm wide in print.",
      backgroundUsage:
        "Use the primary logo on light backgrounds, the reversed logo on dark backgrounds, and avoid low-contrast color pairings.",
      dos: [
        "Use approved color combinations.",
        "Keep proportions locked.",
        "Place the logo with generous spacing.",
        "Use SVG or high-resolution PNG for production."
      ],
      donts: [
        "Do not stretch, skew, or rotate the logo.",
        "Do not add shadows or outlines.",
        "Do not place on busy imagery.",
        "Do not recolor outside the approved palette."
      ]
    },
    guideline: {
      cover: `${company} Brand Guidelines`,
      overview: `This mini brand system gives ${company} a consistent visual and verbal identity across web, social, sales, and client-facing materials.`,
      exportChecklist: [
        "Use approved colors and font hierarchy.",
        "Apply logo clear space and minimum size rules.",
        "Keep voice consistent across social and web copy.",
        "Use CSS or JSON tokens when building digital experiences.",
        "Review exported assets before sending to clients or vendors."
      ]
    },
    tokens: { css, json: jsonTokens, tailwind, shadcn }
  };
}
