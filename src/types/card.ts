export interface CardData {
  id: number;
  type: string;
  number: string;
  holder: string;
  expiry: string;
  balance: number;
  limit: number;
  theme: CardTheme;
  frozen?: boolean;
}

export type CardTheme = "midnight" | "gold" | "emerald";

export interface ThemeConfig {
  cardBg: string;
  chipBg: string;
  accent: string;
  accentText: string;
  ring: string;
  barFrom: string;
  barTo: string;
  badgeBg: string;
  badgeText: string;
  btnBg: string;
  btnHover: string;
  btnText: string;
  glow: string;
  shadowColor: string;
  softHighlight: string;
  softShadow: string;
  softPressed: string;
}

export const themeConfigs: Record<CardTheme, ThemeConfig> = {
  midnight: {
    cardBg: "bg-indigo-600",
    chipBg: "bg-amber-300",
    accent: "bg-indigo-500",
    accentText: "text-indigo-400",
    ring: "ring-indigo-500/40",
    barFrom: "from-indigo-500",
    barTo: "to-indigo-400",
    badgeBg: "bg-indigo-500/20",
    badgeText: "text-indigo-400",
    btnBg: "bg-indigo-600",
    btnHover: "hover:bg-indigo-500",
    btnText: "text-white",
    glow: "shadow-indigo-600/30",
    shadowColor: "rgba(79,70,229,0.35)",
    softHighlight: "shadow-[0_-2px_8px_rgba(129,140,248,0.3)]",
    softShadow: "shadow-[0_4px_14px_rgba(0,0,0,0.5)]",
    softPressed: "shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)]",
  },
  gold: {
    cardBg: "bg-amber-500",
    chipBg: "bg-yellow-200",
    accent: "bg-amber-500",
    accentText: "text-amber-400",
    ring: "ring-amber-500/40",
    barFrom: "from-amber-400",
    barTo: "to-amber-300",
    badgeBg: "bg-amber-500/20",
    badgeText: "text-amber-400",
    btnBg: "bg-amber-500",
    btnHover: "hover:bg-amber-400",
    btnText: "text-white",
    glow: "shadow-amber-500/30",
    shadowColor: "rgba(245,158,11,0.35)",
    softHighlight: "shadow-[0_-2px_8px_rgba(252,211,77,0.3)]",
    softShadow: "shadow-[0_4px_14px_rgba(0,0,0,0.5)]",
    softPressed: "shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)]",
  },
  emerald: {
    cardBg: "bg-emerald-600",
    chipBg: "bg-emerald-200",
    accent: "bg-emerald-500",
    accentText: "text-emerald-400",
    ring: "ring-emerald-500/40",
    barFrom: "from-emerald-400",
    barTo: "to-emerald-300",
    badgeBg: "bg-emerald-500/20",
    badgeText: "text-emerald-400",
    btnBg: "bg-emerald-600",
    btnHover: "hover:bg-emerald-500",
    btnText: "text-white",
    glow: "shadow-emerald-600/30",
    shadowColor: "rgba(5,150,105,0.35)",
    softHighlight: "shadow-[0_-2px_8px_rgba(52,211,153,0.3)]",
    softShadow: "shadow-[0_4px_14px_rgba(0,0,0,0.5)]",
    softPressed: "shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)]",
  },
};

export interface Transaction {
  id: number;
  merchant: string;
  category: string;
  amount: number;
  date: string;
  icon: string;
}