import type { BrandColor, BrandKitGenerated } from "@/types/brand";

type JsPdfDoc = {
  internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
  addPage: () => void;
  addImage: (...args: unknown[]) => void;
  circle: (...args: unknown[]) => void;
  line: (...args: unknown[]) => void;
  output: (type: "blob") => Blob;
  rect: (...args: unknown[]) => void;
  roundedRect: (...args: unknown[]) => void;
  setDrawColor: (...args: number[]) => void;
  setFillColor: (...args: number[]) => void;
  setFont: (name: string, style?: string) => void;
  setFontSize: (size: number) => void;
  setLineWidth: (width: number) => void;
  setPage: (page: number) => void;
  setTextColor: (...args: number[]) => void;
  splitTextToSize: (text: string, width: number) => string[];
  text: (text: string | string[], x: number, y: number, options?: unknown) => void;
  getNumberOfPages: () => number;
};

const ink = [17, 24, 39] as const;
const muted = [100, 116, 139] as const;
const paper = [249, 250, 251] as const;
const violet = [124, 58, 237] as const;
const amber = [245, 158, 11] as const;

function rgbFromHex(hex: string) {
  const clean = hex.replace("#", "");
  return [
    Number.parseInt(clean.slice(0, 2), 16),
    Number.parseInt(clean.slice(2, 4), 16),
    Number.parseInt(clean.slice(4, 6), 16)
  ] as const;
}

function cleanFilename(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function socialText(generated: BrandKitGenerated) {
  return Object.entries(generated.socialBios)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

function strategyOf(generated: BrandKitGenerated) {
  return generated.strategy || {
    essence: "Clear brand confidence.",
    mission: generated.summary.description,
    vision: generated.summary.positioning,
    promise: generated.summary.audience,
    attributes: generated.voice.wordsToUse
  };
}

function positioningOf(generated: BrandKitGenerated) {
  return generated.positioningManual || {
    oneLiner: generated.summary.positioning,
    valueProposition: generated.summary.description,
    differentiators: generated.guideline.exportChecklist.slice(0, 3),
    proofPoints: generated.guideline.exportChecklist.slice(0, 3),
    personas: [],
    messagingPillars: []
  };
}

function visualOf(generated: BrandKitGenerated) {
  return generated.visualDirection || {
    creativeDirection: "Use a polished visual system with clear hierarchy, purposeful color, and generous spacing.",
    layoutRules: generated.guideline.exportChecklist.slice(0, 4),
    imageryStyle: "Use clean, relevant visuals that show the product, customer outcome, or working context.",
    accessibilityNotes: ["Use strong contrast for text.", "Reserve accent colors for highlights.", "Keep body copy on calm neutral surfaces."]
  };
}

async function logoDataUrl(logoUrl?: string | null) {
  if (!logoUrl || logoUrl.endsWith(".svg")) return null;
  try {
    const response = await fetch(logoUrl);
    const blob = await response.blob();
    const reader = new FileReader();
    return await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("Logo could not be read."));
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function drawFooter(doc: JsPdfDoc, page: number, watermark: boolean) {
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  doc.setDrawColor(226, 232, 240);
  doc.line(44, height - 44, width - 44, height - 44);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text(`Brandix by Nebulix  /  ${String(page).padStart(2, "0")}`, 44, height - 24);
  if (watermark) doc.text("Created with Brandix by Nebulix", width - 178, height - 24);
}

function drawPageHeader(doc: JsPdfDoc, eyebrow: string, title: string, page: number, watermark: boolean) {
  doc.addPage();
  doc.setFillColor(...paper);
  doc.rect(0, 0, 595, 842, "F");
  doc.setFillColor(...violet);
  doc.rect(0, 0, 595, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...violet);
  doc.text(eyebrow.toUpperCase(), 44, 58);
  doc.setFontSize(25);
  doc.setTextColor(...ink);
  doc.text(title, 44, 90);
  drawFooter(doc, page, watermark);
}

function paragraph(doc: JsPdfDoc, text: string, x: number, y: number, width: number, size = 10) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(size);
  doc.setTextColor(...muted);
  const lines = doc.splitTextToSize(text, width);
  doc.text(lines, x, y);
  return y + lines.length * (size + 4);
}

function card(doc: JsPdfDoc, x: number, y: number, width: number, height: number, title: string, body: string) {
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(x, y, width, height, 10, 10, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ink);
  doc.text(title, x + 16, y + 24);
  paragraph(doc, body, x + 16, y + 44, width - 32, 9);
}

function colorSwatch(doc: JsPdfDoc, color: BrandColor, x: number, y: number, width: number) {
  doc.setFillColor(...rgbFromHex(color.hex));
  doc.roundedRect(x, y, width, 58, 8, 8, "F");
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(x, y + 48, width, 78, 8, 8, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(x, y, width, 126, 8, 8, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...ink);
  doc.text(color.name, x + 12, y + 72);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...violet);
  doc.text(color.hex, x + 12, y + 88);
  doc.setTextColor(...muted);
  doc.text(`RGB ${color.rgb}`, x + 12, y + 103);
  paragraph(doc, color.usage, x + 12, y + 117, width - 24, 7);
}

function listBlock(doc: JsPdfDoc, title: string, items: string[], x: number, y: number, width: number) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...ink);
  doc.text(title, x, y);
  let nextY = y + 22;
  items.forEach((item) => {
    doc.setFillColor(...violet);
    doc.circle(x + 4, nextY - 4, 2, "F");
    nextY = paragraph(doc, item, x + 16, nextY, width - 16, 9) + 6;
  });
  return nextY;
}

function codePanel(doc: JsPdfDoc, title: string, code: string, x: number, y: number, width: number, height: number) {
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(x, y, width, height, 8, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(title, x + 14, y + 24);
  doc.setFont("courier", "normal");
  doc.setFontSize(7);
  doc.setTextColor(203, 213, 225);
  const lines = doc.splitTextToSize(code, width - 28).slice(0, 18);
  doc.text(lines, x + 14, y + 44);
}

function cover(doc: JsPdfDoc, companyName: string, generated: BrandKitGenerated, dataUrl: string | null) {
  const strategy = strategyOf(generated);
  const positioning = positioningOf(generated);
  doc.setFillColor(...ink);
  doc.rect(0, 0, 595, 842, "F");
  doc.setFillColor(...violet);
  doc.rect(0, 0, 36, 842, "F");
  doc.setFillColor(...amber);
  doc.circle(505, 112, 58, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("BRANDIX BY NEBULIX", 72, 82);
  doc.setFontSize(36);
  doc.text(`${companyName}`, 72, 162);
  doc.setFontSize(22);
  doc.text("Professional Brand Toolkit", 72, 198);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(203, 213, 225);
  doc.text("Brand identity, positioning, style, messaging, social, and implementation assets.", 72, 230);
  if (dataUrl) doc.addImage(dataUrl, "PNG", 426, 300, 94, 64, undefined, "FAST");
  card(doc, 72, 318, 200, 120, "Brand Essence", strategy.essence);
  card(doc, 296, 318, 200, 120, "Positioning", positioning.oneLiner);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Included Toolkits", 72, 510);
  const items = [
    "Brand Identity Toolkit",
    "Brand Positioning Manual",
    "Brand Style Toolkit",
    "Logo Usage Manual",
    "Voice and Messaging Toolkit",
    "Social Profile Toolkit",
    "Implementation Assets"
  ];
  items.forEach((item, index) => {
    const y = 548 + index * 28;
    doc.setFillColor(255, 255, 255);
    doc.circle(78, y - 4, 2, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(item, 94, y);
  });
}

export async function buildProfessionalBrandPdf(
  companyName: string,
  generated: BrandKitGenerated,
  watermark: boolean,
  logoUrl?: string | null
) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" }) as JsPdfDoc;
  const dataUrl = await logoDataUrl(logoUrl);
  const strategy = strategyOf(generated);
  const positioning = positioningOf(generated);
  const visual = visualOf(generated);

  cover(doc, companyName, generated, dataUrl);
  drawFooter(doc, 1, watermark);

  drawPageHeader(doc, "Toolkit 01", "Brand Identity Toolkit", 2, watermark);
  card(doc, 44, 130, 242, 116, "Brand Essence", strategy.essence);
  card(doc, 310, 130, 242, 116, "Brand Promise", strategy.promise);
  card(doc, 44, 276, 242, 126, "Mission", strategy.mission);
  card(doc, 310, 276, 242, 126, "Vision", strategy.vision);
  listBlock(doc, "Brand Attributes", strategy.attributes, 56, 456, 460);

  drawPageHeader(doc, "Manual 02", "Brand Positioning Manual", 3, watermark);
  card(doc, 44, 130, 508, 94, "One-Liner", positioning.oneLiner);
  card(doc, 44, 254, 508, 116, "Value Proposition", positioning.valueProposition);
  listBlock(doc, "Differentiators", positioning.differentiators, 56, 424, 220);
  listBlock(doc, "Proof Points", positioning.proofPoints, 316, 424, 220);

  drawPageHeader(doc, "Toolkit 03", "Brand Style Toolkit", 4, watermark);
  generated.colors.slice(0, 6).forEach((color, index) => {
    const x = 44 + (index % 3) * 172;
    const y = 130 + Math.floor(index / 3) * 154;
    colorSwatch(doc, color, x, y, 148);
  });
  card(doc, 44, 470, 158, 130, "Heading Font", `${generated.typography.heading.name}\n${generated.typography.heading.usage}\nWeights: ${generated.typography.heading.weights}`);
  card(doc, 218, 470, 158, 130, "Body Font", `${generated.typography.body.name}\n${generated.typography.body.usage}\nWeights: ${generated.typography.body.weights}`);
  card(doc, 392, 470, 160, 130, "Accent Font", `${generated.typography.accent.name}\n${generated.typography.accent.usage}\nWeights: ${generated.typography.accent.weights}`);

  drawPageHeader(doc, "Toolkit 04", "Visual Direction System", 5, watermark);
  card(doc, 44, 130, 508, 110, "Creative Direction", visual.creativeDirection);
  card(doc, 44, 270, 508, 92, "Imagery Style", visual.imageryStyle);
  listBlock(doc, "Layout Rules", visual.layoutRules, 56, 416, 220);
  listBlock(doc, "Accessibility Notes", visual.accessibilityNotes, 316, 416, 220);

  drawPageHeader(doc, "Manual 05", "Logo Usage Manual", 6, watermark);
  if (dataUrl) doc.addImage(dataUrl, "PNG", 44, 126, 112, 76, undefined, "FAST");
  card(doc, 184, 126, 368, 98, "Logo Rules", `${generated.logoUsage.clearSpace} ${generated.logoUsage.minimumSize}`);
  card(doc, 44, 256, 508, 92, "Background Usage", generated.logoUsage.backgroundUsage);
  listBlock(doc, "Do", generated.logoUsage.dos, 56, 398, 220);
  listBlock(doc, "Don't", generated.logoUsage.donts, 316, 398, 220);

  drawPageHeader(doc, "Toolkit 06", "Voice and Messaging Toolkit", 7, watermark);
  card(doc, 44, 130, 508, 124, "Brand Voice", `${generated.voice.personality} ${generated.voice.tone} ${generated.voice.writingStyle}`);
  positioning.messagingPillars.slice(0, 3).forEach((pillar, index) => {
    card(doc, 44 + index * 174, 286, 154, 126, pillar.title, `${pillar.message} ${pillar.proof}`);
  });
  listBlock(doc, "Tagline Options", generated.taglines, 56, 466, 460);

  drawPageHeader(doc, "Toolkit 07", "Audience and Social Toolkit", 8, watermark);
  if (positioning.personas.length) {
    positioning.personas.slice(0, 2).forEach((persona, index) => {
      card(doc, 44 + index * 266, 128, 242, 142, persona.name, `${persona.needs} ${persona.message}`);
    });
  }
  paragraph(doc, socialText(generated), 56, 328, 470, 10);

  drawPageHeader(doc, "Toolkit 08", "Implementation Assets", 9, watermark);
  codePanel(doc, "CSS Variables", generated.tokens.css, 44, 132, 244, 220);
  codePanel(doc, "Tailwind Color Snippet", generated.tokens.tailwind, 308, 132, 244, 220);
  codePanel(doc, "JSON Tokens", generated.tokens.json, 44, 382, 508, 270);

  return {
    blob: doc.output("blob"),
    filename: `${cleanFilename(companyName)}-professional-brand-toolkit.pdf`
  };
}
