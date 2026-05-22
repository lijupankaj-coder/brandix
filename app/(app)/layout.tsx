import type { ReactNode } from "react";
import { AppShell } from "@/components/brandix/app-shell";
import { BuilderToolbar } from "@/components/brandix/builder-toolbar";
import { getCurrentUser } from "@/lib/auth";

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  return (
    <AppShell user={user}>
      <BuilderToolbar />
      {children}
    </AppShell>
  );
}
