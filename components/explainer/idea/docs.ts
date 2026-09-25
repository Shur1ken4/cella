import { Banknote, FileSignature, FlaskConical, Handshake, Mail, ScrollText, type LucideIcon } from "lucide-react";
import { copy } from "@/lib/copy";

/** The six scattered documents used by scenes 1 and 3 (positions in stage px). */
export const DOCS: { icon: LucideIcon; label: string; x: number; y: number; tilt: number }[] = [
  { icon: ScrollText, x: 190, y: 120, tilt: -8 },
  { icon: FileSignature, x: 770, y: 115, tilt: 6 },
  { icon: Mail, x: 150, y: 300, tilt: -5 },
  { icon: Banknote, x: 815, y: 300, tilt: 7 },
  { icon: FlaskConical, x: 300, y: 455, tilt: -6 },
  { icon: Handshake, x: 660, y: 455, tilt: 5 },
].map((d, i) => ({ ...d, label: copy.explainer.labels.docs[i] }));

export const CENTER = { x: 480, y: 270 };
