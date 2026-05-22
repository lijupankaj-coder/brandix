import { z } from "zod";

export const brandStyles = [
  "Modern",
  "Luxury",
  "Minimal",
  "Corporate",
  "Friendly",
  "Creative",
  "Bold",
  "Elegant",
  "Tech",
  "Playful"
] as const;

export const brandKitInputSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required").max(80),
  industry: z.string().trim().min(1, "Industry is required").max(80),
  description: z.string().trim().min(20, "Description should be at least 20 characters").max(700),
  targetAudience: z.string().trim().min(1, "Target audience is required").max(240),
  brandStyle: z.enum(brandStyles),
  websiteUrl: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined)
    .refine((value) => !value || /^https?:\/\/[^\s]+\.[^\s]+$/i.test(value), "Website URL must include http:// or https://"),
  preferredColor: z
    .string()
    .trim()
    .optional()
    .transform((value) => value || undefined)
    .refine((value) => !value || /^#[0-9a-f]{6}$/i.test(value), "Preferred color must be a valid hex code"),
  competitors: z.string().trim().max(260).optional(),
  keywords: z.string().trim().max(260).optional(),
  language: z.string().trim().max(80).optional(),
  market: z.string().trim().max(80).optional(),
  productType: z.string().trim().max(120).optional()
});

export const authSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8)
});

export const signupSchema = authSchema.extend({
  name: z.string().trim().min(2).max(80)
});
