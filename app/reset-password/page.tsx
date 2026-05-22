import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/brandix/password-reset-forms";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  return (
    <Suspense>
      <ResetPasswordForm token={token} />
    </Suspense>
  );
}
