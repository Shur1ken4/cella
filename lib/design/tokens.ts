/**
 * Token NAMES for the /design swatch grid. Values are read at runtime from the
 * CSS variables in app/globals.css (the single source of truth).
 */
export const colourGroups = [
  {
    title: "Backgrounds",
    tokens: [
      { name: "bg-deep", use: "Page background" },
      { name: "bg", use: "Main background" },
      { name: "surface-1", use: "Cards" },
      { name: "surface-2", use: "Raised cards, inputs" },
      { name: "surface-3", use: "Hover states" },
      { name: "border", use: "Hairlines" },
      { name: "border-strong", use: "Inputs, emphasis" },
    ],
  },
  {
    title: "Text",
    tokens: [
      { name: "text", use: "Primary text" },
      { name: "text-muted", use: "Secondary text" },
      { name: "text-faint", use: "Labels, captions (never on surface-3)" },
    ],
  },
  {
    title: "Brand",
    tokens: [
      { name: "green", use: "Actions, verified" },
      { name: "green-hover", use: "Primary hover" },
      { name: "green-deep", use: "Pressed, borders on green" },
      { name: "green-glow", use: "Verified glow" },
      { name: "green-tint", use: "Subtle fills, badges" },
      { name: "cyan", use: "Data, links, addresses" },
      { name: "cyan-tint", use: "Info fills" },
    ],
  },
  {
    title: "Status",
    tokens: [
      { name: "success", use: "Success (= green)" },
      { name: "warning", use: "Warnings, demo mode" },
      { name: "danger", use: "Errors, destructive" },
      { name: "info", use: "Info (= cyan)" },
    ],
  },
] as const;

export const typeScale = [
  { cls: "type-display", name: "Display", spec: "Space Grotesk 700 · 56/60" },
  { cls: "type-h1", name: "H1", spec: "Space Grotesk 700 · 40/48" },
  { cls: "type-h2", name: "H2", spec: "Space Grotesk 600 · 30/38" },
  { cls: "type-h3", name: "H3", spec: "Space Grotesk 600 · 22/30" },
  { cls: "type-body", name: "Body", spec: "IBM Plex Sans 400 · 16/26" },
  { cls: "type-small", name: "Small", spec: "IBM Plex Sans 400 · 14/22" },
  { cls: "type-caption", name: "Caption", spec: "IBM Plex Sans 400 · 12/18" },
  { cls: "type-label", name: "Label", spec: "Space Grotesk 600 · 12/18 · caps" },
] as const;

export const spacingScale = [4, 8, 12, 16, 24, 32, 48, 64, 96] as const;

export const radiusScale = [
  { cls: "rounded-sm", name: "sm · 6px", use: "Badges, inputs" },
  { cls: "rounded-md", name: "md · 10px", use: "Buttons" },
  { cls: "rounded-lg", name: "lg · 16px", use: "Cards" },
  { cls: "rounded-xl", name: "xl · 24px", use: "Hero panels" },
] as const;
