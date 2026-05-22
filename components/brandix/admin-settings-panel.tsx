import type { AdminSettings } from "@prisma/client";
import { updateAdminSettingsAction } from "@/app/actions/brand-kits";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminSettingsPanel({ settings }: { settings: AdminSettings }) {
  return (
    <Card>
      <CardHeader><CardTitle>Pricing and feature settings</CardTitle></CardHeader>
      <CardContent>
        <form action={updateAdminSettingsAction} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="freeKitLimit">Free plan limit</Label>
              <Input id="freeKitLimit" name="freeKitLimit" type="number" min={1} defaultValue={settings.freeKitLimit} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="proPrice">Pro monthly price</Label>
              <Input id="proPrice" name="proPrice" type="number" min={0} step="0.01" defaultValue={settings.proPrice} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessPrice">Business monthly price</Label>
              <Input id="businessPrice" name="businessPrice" type="number" min={0} step="0.01" defaultValue={settings.businessPrice} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lifetimePrice">Lifetime price</Label>
              <Input id="lifetimePrice" name="lifetimePrice" type="number" min={0} step="0.01" defaultValue={settings.lifetimePrice} />
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["pdfExportEnabled", "PDF export", settings.pdfExportEnabled],
              ["zipExportEnabled", "ZIP export", settings.zipExportEnabled],
              ["logoUploadEnabled", "Logo upload", settings.logoUploadEnabled],
              ["cssExportEnabled", "CSS export", settings.cssExportEnabled],
              ["jsonExportEnabled", "JSON export", settings.jsonExportEnabled],
              ["watermarkFreePlan", "Watermark on free plan", settings.watermarkFreePlan]
            ].map(([name, label, checked]) => (
              <label key={name as string} className="flex items-center gap-3 rounded-lg border bg-background p-3 text-sm">
                <input name={name as string} type="checkbox" defaultChecked={Boolean(checked)} />
                {label as string}
              </label>
            ))}
          </div>
          <Button>Save admin settings</Button>
        </form>
      </CardContent>
    </Card>
  );
}
