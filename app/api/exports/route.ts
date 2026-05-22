import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { brandKitId?: string; exportType?: string } | null;
  if (!body?.brandKitId || !body?.exportType) return NextResponse.json({ error: "Missing export details." }, { status: 400 });

  const kit = await prisma.brandKit.findUnique({ where: { id: body.brandKitId }, select: { id: true } });
  if (!kit) return NextResponse.json({ error: "Brand kit not found." }, { status: 404 });

  await prisma.export.create({
    data: {
      userId: null,
      brandKitId: body.brandKitId,
      exportType: body.exportType
    }
  });
  return NextResponse.json({ ok: true });
}
