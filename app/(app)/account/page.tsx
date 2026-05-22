import { PageHeading } from "@/components/brandix/page-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <>
      <PageHeading eyebrow="Account" title="Profile and plan" description="Review your Brandix account details and current plan." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Name</span><span>{user.name}</span></div>
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Email</span><span>{user.email}</span></div>
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Role</span><span>{user.role}</span></div>
            <div className="flex justify-between gap-4"><span className="text-muted-foreground">Status</span><span>{user.status}</span></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Plan</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-semibold capitalize">{user.plan}</p>
            <p className="text-sm text-muted-foreground">Plan upgrades are ready for payment integration. A Super Admin can change plans manually today.</p>
            <form action="/api/auth/logout" method="post">
              <Button variant="outline">Logout</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
