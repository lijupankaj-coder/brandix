import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/brandix/password-reset-forms";

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
