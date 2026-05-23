import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function authorized(req: NextRequest) {
  const secret = process.env.BRANDIX_ADMIN_SECRET;
  return secret && req.headers.get("x-admin-secret") === secret;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const settings = await prisma.adminSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" }
  });
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const allowed = [
    "freeKitLimit", "proPrice", "businessPrice", "lifetimePrice",
    "pdfExportEnabled", "zipExportEnabled", "logoUploadEnabled",
    "cssExportEnabled", "jsonExportEnabled", "watermarkFreePlan"
  ];
  const data = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));
  const settings = await prisma.adminSettings.upsert({
    where: { id: "default" },
    update: data,
    create: { id: "default", ...data }
  });
  return NextResponse.json(settings);
}
