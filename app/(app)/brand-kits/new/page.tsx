import { BrandKitWizard } from "@/components/brandix/brand-kit-wizard";
import { PageHeading } from "@/components/brandix/page-heading";
import { Suspense } from "react";

export default function CreateBrandKitPage() {
  return (
    <>
      <PageHeading
        eyebrow="Create Brand Kit"
        title="Build a professional mini identity system."
        description="Complete the four-step wizard and Brandix will generate colors, typography, voice, taglines, social copy, logo rules, guidelines, and design tokens."
      />
      <Suspense>
        <BrandKitWizard />
      </Suspense>
    </>
  );
}
