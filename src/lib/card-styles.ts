import type { LucideIcon } from "lucide-react";
import { Plus, Utensils, Wrench, Handshake, Check, Clock } from "lucide-react";

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
  badgeBorder: string;
  icon: LucideIcon;
}

export const CATEGORY_STYLES: Record<CategoryType, CategoryStyle> = {
  "Medis & Darurat": {
    circleBg: "bg-emerald-100",
    iconColor: "text-emerald-700",
    textColor: "text-emerald-800",
    icon: Plus,
  },
  Sembako: {
    circleBg: "bg-amber-100",
    iconColor: "text-amber-700",
    textColor: "text-amber-800",
    icon: Utensils,
  },
  "Peminjaman Alat": {
    circleBg: "bg-rose-100",
    iconColor: "text-rose-700",
    textColor: "text-rose-800",
    icon: Wrench,
  },
  "Tenaga Relawan": {
    circleBg: "bg-indigo-100",
    iconColor: "text-indigo-700",
    textColor: "text-indigo-800",
    icon: Handshake,
  },
};

export const STATUS_STYLES: Record<StatusType, StatusStyle> = {
  Menunggu: {
    badgeBg: "bg-status-waiting-bg",
    badgeText: "text-status-waiting-text",
    badgeBorder: "border-amber-300",
    icon: Clock,
  },
  Selesai: {
    badgeBg: "bg-status-done-bg",
    badgeText: "text-status-done-text",
    badgeBorder: "border-green-300",
    icon: Check,
  },
};
