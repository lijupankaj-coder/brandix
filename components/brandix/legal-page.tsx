import Link from "next/link";
import { MarketingFooter } from "@/components/brandix/marketing-footer";
import { MarketingNav } from "@/components/brandix/marketing-nav";

const legalLinks = [
  ["Terms", "/terms.html"],
  ["Privacy", "/privacy.html"],
  ["Cookies", "/cookies.html"],
  ["Refund", "/refund.html"],
  ["Subscription", "/subscription.html"],
  ["DPA", "/dpa.html"]
];

export function LegalPage({ title, description, sections }: { title: string; description: string; sections: { title: string; body: string[] }[] }) {
  return (
    <div className="min-h-screen">
      <MarketingNav />
      <main className="mx-auto max-w-4xl px-6 py-14">
        <div className="mb-8 rounded-2xl border bg-card p-8 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Legal document</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">{title}</h1>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">{description}</p>
          <p className="mt-3 text-xs text-muted-foreground">Brandix by Nebulix. Last updated: May 19, 2026.</p>
        </div>
        <div className="space-y-4">
          {sections.map((section, index) => (
            <section key={section.title} className="rounded-xl border bg-card p-6">
              <h2 className="text-xl font-semibold tracking-normal"><span className="mr-3 text-primary">{String(index + 1).padStart(2, "0")}</span>{section.title}</h2>
              <div className="mt-3 space-y-3 text-sm leading-7 text-muted-foreground">
                {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          {legalLinks.map(([label, href]) => (
            <Link key={href} href={href} className="rounded-lg border bg-card px-4 py-2 text-muted-foreground hover:text-foreground">{label}</Link>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
