// Generates the fictional sample PDFs in public/demo-docs and a manifest of their
// SHA-256 fingerprints (lib/data/demo-docs.json). Run: node scripts/make-demo-docs.mjs
// Output is deterministic, so hashes only change if the text below changes.
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "demo-docs");
mkdirSync(outDir, { recursive: true });

const DISCLAIMER = "FICTIONAL DEMO DOCUMENT - Colosseum hackathon - not a real legal or clinical record.";

const docs = [
  {
    file: "patent-filing-bap-001.pdf",
    label: "Patent filing",
    lines: [
      "NORTHBRIDGE UNIVERSITY - TECHNOLOGY TRANSFER OFFICE",
      "Provisional patent filing summary",
      "",
      "Asset: Cancer Drug X (code BAP-001)",
      "Title: Small-molecule inhibitors for solid tumour indications",
      "Inventors: Northbridge University oncology lab (fictional)",
      "Filing reference: NBU-PRV-2026-0114",
      "Filing date: 14 January 2026",
      "",
      DISCLAIMER,
    ],
  },
  {
    file: "licence-agreement-bap-001.pdf",
    label: "Exclusive licence agreement",
    lines: [
      "EXCLUSIVE LICENCE AGREEMENT - SUMMARY",
      "",
      "Licensor: Northbridge University",
      "Licensee: Helix Oncology Ltd",
      "Asset: Cancer Drug X (code BAP-001)",
      "Field: Oncology, worldwide",
      "Royalty: 4% of net sales; milestones payable on IND and Phase I",
      "Effective date: 2 March 2026",
      "",
      DISCLAIMER,
    ],
  },
  {
    file: "preclinical-report-bap-001.pdf",
    label: "Preclinical study report",
    lines: [
      "MERIDIAN CLINICAL RESEARCH",
      "Preclinical study report - summary",
      "",
      "Asset: Cancer Drug X (code BAP-001)",
      "Study: GLP toxicology and efficacy in xenograft models",
      "Outcome: Well tolerated; dose-dependent tumour growth inhibition",
      "Report date: 20 May 2026",
      "",
      DISCLAIMER,
    ],
  },
];

function escapePdf(s) {
  return s.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildPdf(lines) {
  const content = [
    "BT",
    "/F1 12 Tf",
    "16 TL",
    "72 760 Td",
    ...lines.map((l) => `(${escapePdf(l)}) '`),
    "ET",
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [];
  objects.forEach((obj, i) => {
    offsets.push(Buffer.byteLength(pdf));
    pdf += `${i + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(pdf);
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  pdf += offsets.map((o) => `${String(o).padStart(10, "0")} 00000 n \n`).join("");
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return Buffer.from(pdf, "latin1");
}

const manifest = docs.map(({ file, label, lines }) => {
  const bytes = buildPdf(lines);
  writeFileSync(join(outDir, file), bytes);
  return {
    file,
    label,
    path: `/demo-docs/${file}`,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
});

writeFileSync(join(root, "lib", "data", "demo-docs.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(manifest.map((m) => `${m.sha256}  ${m.file}`).join("\n"));
