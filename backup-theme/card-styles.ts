import type { LucideIcon } from "lucide-react";
import { Plus, Utensils, Wrench, Handshake } from "lucide-react";

export type CategoryType =
  | "Medis & Darurat"
  | "Sembako"
  | "Peminjaman Alat"
  | "Tenaga Relawan";

export type StatusType = "Menunggu" | "Selesai";

export interface CategoryStyle {
  circleBg: string;
  iconColor: string;
  textColor: string;
  icon: LucideIcon;
}

export interface StatusStyle {
  badgeBg: string;
  badgeText: string;
}

export const CATEGORY_STYLES: Record<CategoryType, CategoryStyle> = {
  "Medis & Darurat": {
    circleBg: "bg-[#C8FFD4]",
    iconColor: "text-[#3DC522]",
    textColor: "text-[#1E7B10]",
    icon: Plus,
  },
  Sembako: {
    circleBg: "bg-[#FBFFC8]",
    iconColor: "text-[#C4B921]",
    textColor: "text-[#7A7308]",
    icon: Utensils,
  },
  "Peminjaman Alat": {
    circleBg: "bg-[#FFCCC8]",
    iconColor: "text-[#C42121]",
    textColor: "text-[#C42121]",
    icon: Wrench,
  },
  "Tenaga Relawan": {
    circleBg: "bg-[#CAC8FF]",
    iconColor: "text-[#3A21C4]",
    textColor: "text-[#3A21C4]",
    icon: Handshake,
  },
};

export const STATUS_STYLES: Record<StatusType, StatusStyle> = {
  Menunggu: {
    badgeBg: "bg-yellow-100",
    badgeText: "text-yellow-800",
  },
  Selesai: {
    badgeBg: "bg-green-100",
    badgeText: "text-green-800",
  },
};
