"use client";

import { Eye, Save, DollarSign } from "lucide-react";
import { useState } from "react";
import { DownloadPlansModal } from "@/components/brandix/download-plans-modal";
import { Button } from "@/components/ui/button";

export function BuilderToolbar() {
  const [showPlans, setShowPlans] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveDraft = () => {
    localStorage.setItem("brandix-last-draft-url", window.location.href);
    localStorage.setItem("brandix-last-draft-saved-at", new Date().toISOString());
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const preview = () => {
    const previewTarget = document.querySelector("[data-brandix-preview]");
    previewTarget?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-end gap-2">
        {saved && <span className="mr-1 text-xs font-medium text-primary">Draft saved</span>}
        <Button type="button" variant="outline" onClick={() => setShowPlans(true)}>
          <DollarSign className="h-4 w-4" />
          Pricing
        </Button>
        <Button type="button" variant="outline" onClick={preview}>
          <Eye className="h-4 w-4" />
          Preview
        </Button>
        <Button type="button" variant="outline" onClick={saveDraft}>
          <Save className="h-4 w-4" />
          Save Draft
        </Button>
      </div>
      <DownloadPlansModal open={showPlans} onClose={() => setShowPlans(false)} />
    </>
  );
}
