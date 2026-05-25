import { LegalPage } from "@/components/brandix/legal-page";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="These terms govern use of Brandix, the free brand kit builder with paid downloads by Nebulix."
      sections={[
        { title: "Acceptance of Terms", body: ["By accessing or using Brandix, you agree to these Terms. If you do not agree, do not use the service. Brandix is operated by Nebulix Technologies FZE LLC (SPCFZ License No. 4429986.01; Formation No. 4429986), registered at Business Centre, Sharjah Publishing City Free Zone, Sharjah, United Arab Emirates."] },
        { title: "Free Builder and Paid Downloads", body: ["Users may create and preview brand kits for free. Downloading PDF, ZIP, CSS, JSON, Tailwind, or other export files requires an active paid license."] },
        { title: "Plans", body: ["Brandix download plans are USD 9 per month or USD 89 per year. A license unlocks downloads during the active subscription period."] },
        { title: "User Content", body: ["You retain ownership of company details, logo files, brand assets, and generated materials you create. You grant Nebulix only the rights needed to process, preview, store, and export your brand kit."] },
        { title: "Acceptable Use", body: ["Do not use Brandix to create unlawful, misleading, infringing, or harmful content. Do not bypass paid download, license, payment, or technical protections."] },
        { title: "Contact", body: ["Questions about these Terms can be sent to hello@nebulixcloud.com."] }
      ]}
    />
  );
}
