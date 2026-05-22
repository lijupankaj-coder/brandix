import { LegalPage } from "@/components/brandix/legal-page";

export default function SubscriptionPage() {
  return (
    <LegalPage
      title="Subscription and Cancellation Policy"
      description="This policy explains Brandix download plan subscriptions, renewals, and cancellation."
      sections={[
        { title: "Plans", body: ["Brandix offers a Monthly plan at USD 9 per month and a Yearly plan at USD 89 per year for paid downloads."] },
        { title: "Download Access", body: ["A valid license unlocks downloads during the active billing period. Creating and previewing brand kits remains free."] },
        { title: "Cancellation", body: ["To cancel or change renewal, email hello@nebulixcloud.com from the purchase email. Access normally remains active until the end of the paid term."] },
        { title: "Taxes and Currency", body: ["Taxes, VAT, bank fees, and currency conversion may apply depending on your location and payment provider."] },
        { title: "Refunds", body: ["Refund requests are handled under the Brandix Refund Policy."] }
      ]}
    />
  );
}
