import {
  Dna,
  GraduationCap,
  Microscope,
  Pill,
  UserCheck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { InstitutionKind } from "@/lib/copy";

export const institutionIcons: Record<InstitutionKind, LucideIcon> = {
  university: GraduationCap,
  owner: Dna,
  lab: Microscope,
  pharma: Pill,
  kyc: UserCheck,
  investor: Wallet,
};

export function InstitutionIcon({
  kind,
  className,
}: {
  kind: InstitutionKind;
  className?: string;
}) {
  const Icon = institutionIcons[kind];
  return <Icon className={className} aria-hidden="true" />;
}
