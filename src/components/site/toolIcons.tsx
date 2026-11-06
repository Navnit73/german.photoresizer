import {
  Minimize2,
  FileArchive,
  FileImage,
  Image as ImageIcon,
  Film,
  Scaling,
  RefreshCcw,
  Eraser,
  Scissors,
  Crop,
  Wand2,
  Sparkles,
  Palette,
  Layers,
  type LucideIcon,
} from "lucide-react";
import type { GroupId } from "@/lib/tools";

const BY_ID: Record<string, LucideIcon> = {
  P1: Minimize2,
  P2: FileArchive,
  P3: FileImage,
  P4: ImageIcon,
  P5: Film,
  P21: Scaling,
  P27: RefreshCcw,
  P40: Eraser,
  P41: Scissors,
  P51: Crop,
};

const BY_GROUP: Record<GroupId, LucideIcon> = {
  verkleinern: Minimize2,
  groesse: Scaling,
  formate: RefreshCcw,
  hintergrund: Eraser,
  zuschneiden: Crop,
  qualitaet: Wand2,
  kreativ: Palette,
  allgemein: Layers,
};

export function toolIcon(id: string, group: GroupId): LucideIcon {
  return BY_ID[id] ?? BY_GROUP[group] ?? Sparkles;
}
