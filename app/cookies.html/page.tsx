import { LegalPage } from "@/components/brandix/legal-page";

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      description="Brandix uses essential cookies and browser storage for sessions, preferences, drafts, and paid download access."
      sections={[
        { title: "Essential Cookies", body: ["If you use admin or account features, Brandix may set an essential session cookie. The public builder can be used without logging in."] },
        { title: "Local Storage", body: ["Brandix stores theme preference, draft URL metadata, and activated license information in your browser localStorage."] },
        { title: "Managing Storage", body: ["You can clear cookies and localStorage in your browser settings. This may remove draft references, active license status, and preferences."] },
        { title: "Third Parties", body: ["Payment and OAuth providers may use their own cookies when you leave Brandix to complete checkout or sign in."] }
      ]}
    />
  );
}
