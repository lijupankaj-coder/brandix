import Link from "next/link";
import { ArrowRight, FolderOpen, PlusCircle } from "lucide-react";
import { DashboardStats } from "@/components/brandix/dashboard-stats";
import { PageHeading } from "@/components/brandix/page-heading";
import { SavedKitCard } from "@/components/brandix/saved-kit-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await requireUser();
  const [kits, totalKits, exportsCount] = await Promise.all([
    prisma.brandKit.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.brandKit.count({ where: { userId: user.id } }),
    prisma.export.count({ where: { userId: user.id } })
  ]);

  return (
    <>
      <PageHeading
        eyebrow="Dashboard"
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Create a new brand kit, revisit saved identities, and download production-ready exports."
        actions={<Button asChild><Link href="/brand-kits/new"><PlusCircle className="h-4 w-4" /> Create new brand kit</Link></Button>}
      />
      <DashboardStats totalKits={totalKits} exportsCount={exportsCount} plan={user.plan} />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-normal">Recent brand kits</h2>
            <Button asChild variant="ghost" size="sm"><Link href="/brand-kits">View all <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
          {kits.length ? (
            <div className="grid gap-4">{kits.map((kit) => <SavedKitCard key={kit.id} kit={kit} />)}</div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <FolderOpen className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">You haven’t created a brand kit yet.</h3>
                <p className="mt-2 text-sm text-muted-foreground">Create your first professional brand kit now.</p>
                <Button asChild className="mt-5"><Link href="/brand-kits/new">Create Brand Kit</Link></Button>
              </CardContent>
            </Card>
          )}
        </section>
        <aside className="space-y-3">
          {[
            ["Create Brand Kit", "/brand-kits/new"],
            ["Saved Kits", "/brand-kits"],
            ["Pricing", "/pricing"],
            ["Account", "/account"]
          ].map(([label, href]) => (
            <Link key={href} href={href} className="flex items-center justify-between rounded-xl border bg-card p-4 text-sm font-medium hover:border-primary/60">
              {label}
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </aside>
      </div>
    </>
  );
}
