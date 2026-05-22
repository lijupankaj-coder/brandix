import { LegalPage } from "@/components/brandix/legal-page";

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund Policy"
      description="This policy explains refund handling for Brandix paid download access."
      sections={[
        { title: "Refund Window", body: ["Refunds may be requested within 7 days of first purchase if substantial downloads, custom support, or delivered services have not been used."] },
        { title: "Non-Refundable Items", body: ["Renewals after the refund window, accounts terminated for misuse, and completed custom services may be non-refundable."] },
        { title: "How to Request", body: ["Email hello@nebulixcloud.com from the purchase email with the app name, payment reference, purchase date, and reason for the request."] },
        { title: "Chargebacks", body: ["Please contact Nebulix before opening a chargeback so we can investigate and help resolve the issue."] }
      ]}
    />
  );
}
