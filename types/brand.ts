export type BrandStyle =
  | "Modern"
  | "Luxury"
  | "Minimal"
  | "Corporate"
  | "Friendly"
  | "Creative"
  | "Bold"
  | "Elegant"
  | "Tech"
  | "Playful";

export interface BrandKitInput {
  companyName: string;
  industry: string;
  description: string;
  targetAudience: string;
  brandStyle: BrandStyle;
  websiteUrl?: string;
  preferredColor?: string;
  competitors?: string;
  keywords?: string;
  language?: string;
  market?: string;
  productType?: string;
}

export interface BrandColor {
  name: string;
  hex: string;
  rgb: string;
  usage: string;
}

export interface BrandFont {
  name: string;
  usage: string;
  weights: string;
  preview: string;
}

export interface BrandKitGenerated {
  summary: {
    description: string;
    positioning: string;
    audience: string;
  };
  strategy: {
    essence: string;
    mission: string;
    vision: string;
    promise: string;
    attributes: string[];
  };
  positioningManual: {
    oneLiner: string;
    valueProposition: string;
    differentiators: string[];
    proofPoints: string[];
    personas: Array<{
      name: string;
      needs: string;
      objections: string;
      message: string;
    }>;
    messagingPillars: Array<{
      title: string;
      message: string;
      proof: string;
    }>;
  };
  visualDirection: {
    creativeDirection: string;
    layoutRules: string[];
    imageryStyle: string;
    accessibilityNotes: string[];
  };
  usageExamples: {
    websiteHero: string;
    callToAction: string;
    elevatorPitch: string;
    emailSignature: string;
  };
  colors: BrandColor[];
  typography: {
    heading: BrandFont;
    body: BrandFont;
    accent: BrandFont;
  };
  voice: {
    personality: string;
    tone: string;
    writingStyle: string;
    wordsToUse: string[];
    wordsToAvoid: string[];
  };
  taglines: string[];
  socialBios: {
    instagram: string;
    linkedin: string;
    twitter: string;
    facebook: string;
    metaDescription: string;
  };
  logoUsage: {
    clearSpace: string;
    minimumSize: string;
    backgroundUsage: string;
    dos: string[];
    donts: string[];
  };
  guideline: {
    cover: string;
    overview: string;
    exportChecklist: string[];
  };
  tokens: {
    css: string;
    json: string;
    tailwind: string;
    shadcn: string;
  };
}
