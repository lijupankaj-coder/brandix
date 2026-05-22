import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { brandKitInputSchema } from "@/lib/schemas";
import { prisma } from "@/lib/prisma";
import { generateBrandKit } from "@/services/brandKitGenerator";
import type { BrandKitInput } from "@/types/brand";

function redirectWithError(request: NextRequest, message: string) {
  const url = new URL("/brand-kits/new", request.url);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url, { status: 303 });
}

async function saveLogo(file: File | null) {
  if (!file || file.size === 0) return undefined;
  const extensions: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/svg+xml": "svg"
  };
  if (!extensions[file.type]) throw new Error("Logo must be PNG, JPG, or SVG.");
  if (file.size > 2_000_000) throw new Error("Logo file is too large. Please upload a file under 2MB.");
  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = path.join(process.cwd(), "public", "uploads", "logos");
  await mkdir(uploadDir, { recursive: true });
  const filename = `${Date.now()}-${randomBytes(8).toString("hex")}.${extensions[file.type]}`;
  await writeFile(path.join(uploadDir, filename), buffer);
  return `/uploads/logos/${filename}`;
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const value = (name: string) => formData.get(name) ?? "";
  const parsed = brandKitInputSchema.safeParse({
    companyName: value("companyName"),
    industry: value("industry"),
    description: value("description"),
    targetAudience: value("targetAudience"),
    brandStyle: value("brandStyle"),
    websiteUrl: value("websiteUrl"),
    preferredColor: value("preferredColor"),
    competitors: value("competitors"),
    keywords: value("keywords"),
    language: value("language"),
    market: value("market"),
    productType: value("productType")
  });

  if (!parsed.success) return redirectWithError(request, parsed.error.issues[0]?.message || "Check the form and try again.");

  let logoUrl: string | undefined;
  try {
    logoUrl = await saveLogo(formData.get("logo") as File | null);
  } catch (error) {
    return redirectWithError(request, error instanceof Error ? error.message : "Logo upload failed.");
  }

  const user = await getCurrentUser();
  const input = parsed.data as BrandKitInput;
  const generated = generateBrandKit(input);
  const data: Prisma.BrandKitUncheckedCreateInput = {
    userId: user?.id ?? null,
    companyName: input.companyName,
    industry: input.industry,
    description: input.description,
    targetAudience: input.targetAudience,
    brandStyle: input.brandStyle,
    websiteUrl: input.websiteUrl,
    preferredColor: input.preferredColor,
    logoUrl,
    generatedData: generated as unknown as Prisma.InputJsonValue
  };
  const kit = await prisma.brandKit.create({
    data
  });

  return NextResponse.redirect(new URL(`/brand-kits/${kit.id}`, request.url), { status: 303 });
}
