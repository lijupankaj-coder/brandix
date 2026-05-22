import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Brandix — AI Brand Kit Generator by Nebulix",
  description:
    "Create professional brand kits with colors, fonts, taglines, brand voice, social bios, and downloadable brand guidelines.",
  keywords: [
    "brand kit generator",
    "AI brand kit",
    "color palette generator",
    "font pairing",
    "brand guideline generator",
    "logo usage guide",
    "startup branding tool"
  ],
  openGraph: {
    title: "Brandix — AI Brand Kit Generator by Nebulix",
    description:
      "Create professional brand kits with colors, fonts, taglines, brand voice, social bios, and downloadable brand guidelines.",
    type: "website",
    siteName: "Brandix"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
