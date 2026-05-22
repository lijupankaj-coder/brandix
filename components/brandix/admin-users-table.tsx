import type { User } from "@prisma/client";
import { changeUserPlanAction, toggleUserStatusAction } from "@/app/actions/brand-kits";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function AdminUsersTable({ users }: { users: User[] }) {
  if (!users.length) return <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">No data available yet.</div>;

  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
                <form action={changeUserPlanAction} className="flex gap-2">
                  <input type="hidden" name="id" value={user.id} />
                  <select name="plan" defaultValue={user.plan} className="h-9 rounded-lg border bg-background px-2 text-sm">
                    <option value="free">free</option>
                    <option value="pro">pro</option>
                    <option value="business">business</option>
                    <option value="lifetime">lifetime</option>
                  </select>
                  <Button size="sm" variant="outline">Save</Button>
                </form>
              </TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell>
                <form action={toggleUserStatusAction}>
                  <input type="hidden" name="id" value={user.id} />
                  <input type="hidden" name="status" value={user.status} />
                  <Button size="sm" variant="outline">{user.status === "active" ? "Disable" : "Enable"}</Button>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
