"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireUser } from "@/lib/auth";

export async function renameBrandKitAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");
  const companyName = String(formData.get("companyName") || "").trim();
  if (!id || !companyName) return;

  await prisma.brandKit.updateMany({
    where: { id, userId: user.id },
    data: { companyName }
  });
  revalidatePath("/brand-kits");
}

export async function deleteBrandKitAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");
  if (!id) return;
  await prisma.brandKit.deleteMany({ where: { id, userId: user.id } });
  revalidatePath("/dashboard");
  revalidatePath("/brand-kits");
}

export async function duplicateBrandKitAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") || "");
  const kit = await prisma.brandKit.findFirst({ where: { id, userId: user.id } });
  if (!kit) return;
  await prisma.brandKit.create({
    data: {
      userId: user.id,
      companyName: `${kit.companyName} Copy`,
      industry: kit.industry,
      description: kit.description,
      targetAudience: kit.targetAudience,
      brandStyle: kit.brandStyle,
      websiteUrl: kit.websiteUrl,
      preferredColor: kit.preferredColor,
      logoUrl: kit.logoUrl,
      generatedData: kit.generatedData as Prisma.InputJsonValue
    }
  });
  revalidatePath("/brand-kits");
}

export async function updateAdminSettingsAction(formData: FormData) {
  await requireAdmin();
  const data = {
    freeKitLimit: Number(formData.get("freeKitLimit") || 1),
    proPrice: Number(formData.get("proPrice") || 7),
    businessPrice: Number(formData.get("businessPrice") || 19),
    lifetimePrice: Number(formData.get("lifetimePrice") || 39),
    pdfExportEnabled: formData.get("pdfExportEnabled") === "on",
    zipExportEnabled: formData.get("zipExportEnabled") === "on",
    logoUploadEnabled: formData.get("logoUploadEnabled") === "on",
    cssExportEnabled: formData.get("cssExportEnabled") === "on",
    jsonExportEnabled: formData.get("jsonExportEnabled") === "on",
    watermarkFreePlan: formData.get("watermarkFreePlan") === "on"
  };
  await prisma.adminSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data }
  });
  revalidatePath("/admin");
}

export async function changeUserPlanAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const plan = String(formData.get("plan") || "free");
  if (!id || !["free", "pro", "business", "lifetime"].includes(plan)) return;
  await prisma.user.update({ where: { id }, data: { plan } });
  revalidatePath("/admin");
}

export async function toggleUserStatusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "active") === "active" ? "disabled" : "active";
  if (!id) return;
  await prisma.user.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
}
