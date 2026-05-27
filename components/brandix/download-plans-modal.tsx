"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LICENSE_KEY = "brandix-license";
const LICENSE_INFO_KEY = "brandix-license-info";
export const PERMANENT_BRANDIX_LICENSE_KEY = "NBX-LIJU-BRDX-2026";

export interface BrandixLicenseInfo {
  status: "active";
  plan: "monthly" | "yearly" | "manual" | "permanent";
  activatedAt: string;
  expiresAt?: string;
}

function parseBrandixLicenseKey(key: string): BrandixLicenseInfo["plan"] | null {
  const value = key.trim().toUpperCase();
  if (value === PERMANENT_BRANDIX_LICENSE_KEY) return "permanent";
  if (/^BRX-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(value)) return "manual";
  if (value.startsWith("NBX-SUITE-")) return "manual";
  if (key.startsWith("EMAIL:")) return "manual";
  return null;
}

export function getStoredBrandixLicense() {
  if (typeof window === "undefined") return { key: "", info: null as BrandixLicenseInfo | null };
  const key = localStorage.getItem(LICENSE_KEY) || "";
  const rawInfo = localStorage.getItem(LICENSE_INFO_KEY);
  let info: BrandixLicenseInfo | null = null;
  try {
    info = rawInfo ? (JSON.parse(rawInfo) as BrandixLicenseInfo) : null;
  } catch {
    info = null;
  }
  if (!key || !info || info.status !== "active") return { key: "", info: null };
  if (!parseBrandixLicenseKey(key)) return { key: "", info: null };
  if (info.expiresAt && Date.parse(info.expiresAt) < Date.now()) return { key: "", info: null };
  return { key, info };
}

export function useBrandixLicense() {
  const [license, setLicenseState] = useState(() => ({ key: "", info: null as BrandixLicenseInfo | null }));

  useEffect(() => {
    setLicenseState(getStoredBrandixLicense());
  }, []);

  const setLicense = (key: string, plan: BrandixLicenseInfo["plan"] = "manual") => {
    const normalizedKey = key.trim().toUpperCase();
    const info: BrandixLicenseInfo = { status: "active", plan, activatedAt: new Date().toISOString() };
    localStorage.setItem(LICENSE_KEY, normalizedKey);
    localStorage.setItem(LICENSE_INFO_KEY, JSON.stringify(info));
    setLicenseState({ key: normalizedKey, info });
  };

  const clearLicense = () => {
    localStorage.removeItem(LICENSE_KEY);
    localStorage.removeItem(LICENSE_INFO_KEY);
    setLicenseState({ key: "", info: null });
  };

  return { ...license, hasLicense: Boolean(license.key && license.info), setLicense, clearLicense };
}

const PRICING_API = "https://nblx-cffe300c-platform.nebulixcloud.com/api/public/pricing";
const NBLX_API = "https://nblx-cffe300c-platform.nebulixcloud.com/api/public";

export function DownloadPlansModal({ open, onClose, onActivated }: { open: boolean; onClose: () => void; onActivated?: () => void }) {
  const { key, info, hasLicense, setLicense, clearLicense } = useBrandixLicense();
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailBusy, setEmailBusy] = useState(false);
  const [prices, setPrices] = useState({ monthly: 9, yearly: 89 });

  useEffect(() => {
    if (open) setInputKey(key || "");
  }, [key, open]);

  useEffect(() => {
    fetch(PRICING_API, { signal: AbortSignal.timeout(3000) })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        const app = data?.apps?.find((a: { slug: string }) => a.slug === "brandix");
        if (app) setPrices({ monthly: Number(app.proPrice), yearly: Number(app.teamPrice) });
      })
      .catch(() => {});
  }, []);

  if (!open) return null;

  const activateByEmail = async () => {
    const email = emailInput.trim();
    if (!email.includes("@")) { setEmailError("Enter a valid email address."); return; }
    setEmailBusy(true);
    setEmailError("");
    try {
      const res = await fetch(NBLX_API + "/validate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, appSlug: "brandix" }),
      });
      const d = await res.json();
      if (d.valid) {
        setLicense("EMAIL:" + email.toLowerCase(), "manual");
        setEmailError("");
        onActivated?.();
      } else {
        setEmailError("No active Brandix subscription found for this email.");
      }
    } catch {
      setEmailError("Could not connect. Try again.");
    } finally {
      setEmailBusy(false);
    }
  };

  const activate = async () => {
    const value = inputKey.trim().toUpperCase();
    if (!value) { setError("Enter your license key."); return; }
    // Suite key — validate against super admin
    if (value.startsWith("NBX-SUITE-")) {
      setError("");
      try {
        const res = await fetch(NBLX_API + "/validate-license", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: value }),
        });
        const d = await res.json();
        if (d.valid) {
          setLicense(value, "manual");
          onActivated?.();
        } else {
          setError("Suite key invalid or expired.");
        }
      } catch {
        setError("Could not connect. Try again.");
      }
      return;
    }
    const plan = parseBrandixLicenseKey(value);
    if (!plan) { setError("Enter a valid Brandix license key."); return; }
    setLicense(value, plan);
    setError("");
    onActivated?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/65 p-4 backdrop-blur-md sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pricing-title"
    >
      <div className="my-4 max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 text-slate-950 shadow-2xl sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-600">Free builder. Paid downloads.</p>
            <h2 id="pricing-title" className="mt-1 text-xl font-bold tracking-normal sm:text-2xl">Brandix download plans</h2>
          </div>
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50">Close</Button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-bold">Monthly</h3>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-bold">${prices.monthly}</span>
              <span className="pb-1 text-sm font-medium text-slate-500">/ month</span>
            </div>
            <p className="mt-2 text-sm leading-5 text-slate-500">All features. Export unlimited client-ready ZIP files monthly.</p>
            <button type="button" onClick={async () => {
              try { const r = await fetch(NBLX_API + "/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ appSlug: "brandix", plan: "pro", successUrl: window.location.href + "?payment=success", cancelUrl: window.location.href }) }); const d = await r.json(); window.location.href = d.url || d.fallbackUrl; } catch { window.location.href = "mailto:hello@nebulixcloud.com?subject=Brandix%20Monthly%20Plan"; }
            }} className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-violet-600 text-sm font-semibold text-white hover:bg-violet-700">
              Choose Monthly
            </button>
          </div>
          <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
            <span className="absolute right-4 top-4 rounded-full bg-slate-950 px-2 py-1 text-xs font-bold text-white">Best value</span>
            <h3 className="font-bold">Yearly</h3>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-bold">${prices.yearly}</span>
              <span className="pb-1 text-sm font-medium text-slate-500">/ year</span>
            </div>
            <p className="mt-2 text-sm leading-5 text-slate-500">All features. Best value, save over 17% with annual billing.</p>
            <button type="button" onClick={async () => {
              try { const r = await fetch(NBLX_API + "/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ appSlug: "brandix", plan: "team", successUrl: window.location.href + "?payment=success", cancelUrl: window.location.href }) }); const d = await r.json(); window.location.href = d.url || d.fallbackUrl; } catch { window.location.href = "mailto:hello@nebulixcloud.com?subject=Brandix%20Yearly%20Plan"; }
            }} className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-violet-600 text-sm font-semibold text-white hover:bg-violet-700">
              Choose Yearly
            </button>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-slate-200 p-4">
          <h3 className="font-bold">Already paid?</h3>
          <p className="mt-1 text-sm text-slate-500">Enter the email you used at checkout to unlock downloads on this browser.</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} placeholder="you@example.com" className="border-slate-300 bg-white text-slate-950" />
            <Button type="button" onClick={activateByEmail} disabled={emailBusy} className="bg-white text-slate-900 hover:bg-slate-50" variant="outline">
              {emailBusy ? "Checking…" : "Activate"}
            </Button>
          </div>
          {emailError && <p className="mt-3 text-sm font-medium text-red-600">{emailError}</p>}
        </div>

        <div className="mt-3 rounded-lg border border-slate-200 p-4">
          <h3 className="font-bold">Have a license key or Nebulix Suite key?</h3>
          <p className="mt-1 text-sm text-slate-500">Paste your Brandix license key or NBX-SUITE key to unlock downloads on this browser.</p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Input value={inputKey} onChange={(event) => setInputKey(event.target.value)} placeholder="BRX-XXXX or NBX-SUITE-XXXX" className="border-slate-300 bg-white text-slate-950" />
            <Button type="button" onClick={activate} className="bg-white text-slate-900 hover:bg-slate-50" variant="outline">Activate</Button>
          </div>
          {hasLicense && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              <span>{info?.plan === "permanent" ? "Permanent license active." : `Active ${info?.plan || "manual"} license.`} Downloads are unlocked.</span>
              <button type="button" onClick={clearLicense} className="font-semibold underline">Clear</button>
            </div>
          )}
          {error && <p className="mt-3 text-sm font-medium text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
