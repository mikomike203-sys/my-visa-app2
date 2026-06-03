import { Home, CreditCard, TrendingUp, BarChart3, Layers, Send, MoreHorizontal } from "lucide-react";
import { NavTab, ExpandedOption } from "../types/navigation";

export const mainTabs: NavTab[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "wallet", label: "Wallet", icon: CreditCard },
  { id: "progress", label: "Progress", icon: TrendingUp },
];

export const expandedOptions: ExpandedOption[] = [
  { id: "analytics", label: "Analytics", icon: BarChart3, color: "text-indigo-600", bg: "bg-indigo-50" },
  { id: "cards", label: "Cards", icon: Layers, color: "text-violet-600", bg: "bg-violet-50" },
  { id: "payments", label: "Payments", icon: Send, color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "more", label: "More", icon: MoreHorizontal, color: "text-slate-600", bg: "bg-slate-100" },
];