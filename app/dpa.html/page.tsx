import { LegalPage } from "@/components/brandix/legal-page";

export default function DpaPage() {
  return (
    <LegalPage
      title="Data Processing Agreement"
      description="This DPA applies when Brandix processes personal data on behalf of a business customer."
      sections={[
        { title: "Scope", body: ["This DPA forms part of the Brandix Terms for business use where Nebulix acts as a processor for customer-provided personal data."] },
        { title: "Processing Details", body: ["Subject matter includes brand kit generation, previews, file uploads, license validation, export creation, and support. Data categories may include business descriptions, names, logos, URLs, and license records."] },
        { title: "Security", body: ["Nebulix uses reasonable technical and organizational measures to protect processed data, including HTTPS in production and access controls for administrative areas."] },
        { title: "Subprocessors", body: ["Hosting, payment, analytics, email, and storage providers may be used to provide Brandix. Production deployments should document configured subprocessors."] },
        { title: "Requests", body: ["DPA and data protection requests can be sent to hello@nebulixcloud.com."] }
      ]}
    />
  );
}
