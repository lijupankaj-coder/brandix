import { Prisma } from "@prisma/client";
import { AdminSettingsPanel } from "@/components/brandix/admin-settings-panel";
import { AdminStats } from "@/components/brandix/admin-stats";
import { AdminUsersTable } from "@/components/brandix/admin-users-table";
import { PageHeading } from "@/components/brandix/page-heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

function topCounts(items: { key: string }[]) {
  const counts = new Map<string, number>();
  items.forEach((item) => counts.set(item.key, (counts.get(item.key) || 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
}

export default async function SuperAdminPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin();
  const { q = "" } = await searchParams;
  const search = q.trim();
  const whereUser: Prisma.UserWhereInput = search
    ? { OR: [{ email: { contains: search } }, { name: { contains: search } }] }
    : {};
  const whereKit: Prisma.BrandKitWhereInput = search
    ? { OR: [{ companyName: { contains: search } }, { industry: { contains: search } }] }
    : {};

  const [users, kits, totalUsers, totalKits, totalExports, exportsRows, settings] = await Promise.all([
    prisma.user.findMany({ where: whereUser, orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.brandKit.findMany({ where: whereKit, orderBy: { createdAt: "desc" }, take: 10, include: { user: true } }),
    prisma.user.count(),
    prisma.brandKit.count(),
    prisma.export.count(),
    prisma.export.findMany({ select: { exportType: true } }),
    prisma.adminSettings.upsert({ where: { id: "default" }, update: {}, create: { id: "default" } })
  ]);

  const allKits = await prisma.brandKit.findMany({ select: { industry: true, brandStyle: true } });
  const plans = await prisma.user.findMany({ select: { plan: true } });

  return (
    <>
      <PageHeading
        eyebrow="Super Admin"
        title="Brandix control center"
        description="View platform usage, search users and kits, manage plan access, pricing, and feature toggles."
      />
      <AdminStats stats={{ totalUsers, totalBrandKits: totalKits, totalExports, exportTypes: new Set(exportsRows.map((row) => row.exportType)).size }} />

      <form className="mt-8 max-w-lg">
        <Input name="q" defaultValue={search} placeholder="Search users or brand kits" />
      </form>

      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Most used industries</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {topCounts(allKits.map((kit) => ({ key: kit.industry }))).length ? topCounts(allKits.map((kit) => ({ key: kit.industry }))).map(([key, count]) => (
              <div key={key} className="flex justify-between"><span>{key}</span><span className="text-muted-foreground">{count}</span></div>
            )) : "No data available yet."}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Most selected styles</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {topCounts(allKits.map((kit) => ({ key: kit.brandStyle }))).length ? topCounts(allKits.map((kit) => ({ key: kit.brandStyle }))).map(([key, count]) => (
              <div key={key} className="flex justify-between"><span>{key}</span><span className="text-muted-foreground">{count}</span></div>
            )) : "No data available yet."}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Plan distribution</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {topCounts(plans.map((plan) => ({ key: plan.plan }))).map(([key, count]) => (
              <div key={key} className="flex justify-between"><span>{key}</span><span className="text-muted-foreground">{count}</span></div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6">
        <Card>
          <CardHeader><CardTitle>Recent users</CardTitle></CardHeader>
          <CardContent><AdminUsersTable users={users} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent brand kits</CardTitle></CardHeader>
          <CardContent>
            {kits.length ? (
              <div className="overflow-x-auto rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Style</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kits.map((kit) => (
                      <TableRow key={kit.id}>
                        <TableCell>{kit.companyName}</TableCell>
                        <TableCell>{kit.user?.email || "Anonymous builder"}</TableCell>
                        <TableCell>{kit.industry}</TableCell>
                        <TableCell>{kit.brandStyle}</TableCell>
                        <TableCell>{formatDate(kit.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">No data available yet.</div>
            )}
          </CardContent>
        </Card>
        <AdminSettingsPanel settings={settings} />
      </div>
    </>
  );
}
