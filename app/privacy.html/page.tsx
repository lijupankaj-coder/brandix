import { LegalPage } from "@/components/brandix/legal-page";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This policy explains how Brandix handles builder inputs, generated kits, uploaded logos, licenses, and browser storage."
      sections={[
        { title: "Information We Process", body: ["Brandix may process company names, industry, descriptions, target audience details, style preferences, uploaded logos, generated brand kit data, license keys, and export activity."] },
        { title: "How We Use Information", body: ["We use this information to generate brand kits, provide previews, validate paid download access, support users, secure the service, and improve product quality."] },
        { title: "Browser Storage", body: ["Brandix uses localStorage for draft links, theme preference, and license activation on this browser. Clearing browser storage may reset these items."] },
        { title: "Uploads", body: ["Uploaded logos are stored so they can appear in previews and downloads. Do not upload files you do not have permission to use."] },
        { title: "Requests", body: ["Privacy requests can be sent to hello@nebulixcloud.com. We aim to respond within 14 business days."] }
      ]}
    />
  );
}
