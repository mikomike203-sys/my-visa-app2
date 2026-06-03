import React from "react";

interface IconProps {
  size?: number;
  className?: string;
}

// --- Transaction / Vendor Icons ---

export const IconShopping: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="8" cy="16" r="1.5" fill="currentColor" />
    <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    <path d="M3 9h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M7 6V4a1 1 0 011-1h8a1 1 0 011 1v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconStreaming: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

export const IconSubscription: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 2l-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M16 2l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconRestaurant: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 2v20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M18 2v20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M6 8h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M6 14h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M6 2c-2 0-3 1.5-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M6 2c2 0 3 1.5 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M18 2c-2 0-3 1.5-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M18 2c2 0 3 1.5 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconGrocery: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M3 6h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M8 10a4 4 0 008 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const IconTransport: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="9" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="7.5" cy="17" r="1.5" fill="currentColor" />
    <circle cx="16.5" cy="17" r="1.5" fill="currentColor" />
    <path d="M6 9V7a2 2 0 012-2h8a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 12h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M19 12h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconUtilities: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="8" y="2" width="8" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M8 8h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M10 12h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M10 16h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M12 8V4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconRefund: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 14l-2 2 2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 16h4a4 4 0 004-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconATM: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M8 6h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="14" r="3" stroke="currentColor" strokeWidth="1.6" />
    <path d="M12 11v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M12 17v-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconBankTransfer: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2l10 6v2H2V8z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M2 10h20v10a2 2 0 01-2 2H4a2 2 0 01-2-2V10z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M8 14h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M8 18h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconMerchant: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <circle cx="9" cy="13" r="1.5" fill="currentColor" />
    <circle cx="15" cy="13" r="1.5" fill="currentColor" />
    <path d="M9 17a3 3 0 016 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconRecurring: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7.5 3.5l-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M16.5 3.5l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// --- Money / Finance Icons ---

export const IconSend: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 7v10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 11l4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconReceive: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 17V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 13l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconPay: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="9" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M15 10h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M15 14h2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconWallet: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M2 8h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="17" cy="13" r="2" fill="currentColor" />
  </svg>
);

export const IconIncome: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2v20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M18 8l-6-6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 16l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
  </svg>
);

export const IconCoins: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="8" r="6" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="12" cy="8" r="2" fill="currentColor" />
    <path d="M6 14c0 2.2 2.7 4 6 4s6-1.8 6-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M6 18c0 2.2 2.7 4 6 4s6-1.8 6-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconCard: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M2 9h20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M6 16h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
  </svg>
);

export const IconBills: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 4h16v16H4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M8 8h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M8 12h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M8 16h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconCash: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
    <path d="M2 9h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M19 9h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M2 15h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M19 15h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export const IconDollar: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M12 6v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M15 9c0-1.1-1.34-2-3-2s-3 .9-3 2c0 2 3 2.5 3 4 0 1.1-1.34 2-3 2s-3-.9-3-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// --- Utility Icons ---

export const IconCamera: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="12" cy="13" r="4" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

export const IconGallery: React.FC<IconProps> = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
    <path d="M21 15l-5-5-7 7-4-4-2 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export type IconName =
  | "shopping" | "streaming" | "subscription" | "restaurant" | "grocery"
  | "transport" | "utilities" | "refund" | "atm" | "bank-transfer"
  | "merchant" | "recurring" | "send" | "receive" | "pay" | "wallet"
  | "income" | "coins" | "card" | "bills" | "cash" | "dollar" | "camera" | "gallery";

export const iconMap: Record<IconName, React.ComponentType<IconProps>> = {
  shopping: IconShopping,
  streaming: IconStreaming,
  subscription: IconSubscription,
  restaurant: IconRestaurant,
  grocery: IconGrocery,
  transport: IconTransport,
  utilities: IconUtilities,
  refund: IconRefund,
  atm: IconATM,
  "bank-transfer": IconBankTransfer,
  merchant: IconMerchant,
  recurring: IconRecurring,
  send: IconSend,
  receive: IconReceive,
  pay: IconPay,
  wallet: IconWallet,
  income: IconIncome,
  coins: IconCoins,
  card: IconCard,
  bills: IconBills,
  cash: IconCash,
  dollar: IconDollar,
  camera: IconCamera,
  gallery: IconGallery,
};

export const iconBgColors: Record<IconName, string> = {
  shopping: "bg-blue-50",
  streaming: "bg-purple-50",
  subscription: "bg-indigo-50",
  restaurant: "bg-orange-50",
  grocery: "bg-green-50",
  transport: "bg-amber-50",
  utilities: "bg-slate-100",
  refund: "bg-emerald-50",
  atm: "bg-rose-50",
  "bank-transfer": "bg-cyan-50",
  merchant: "bg-violet-50",
  recurring: "bg-pink-50",
  send: "bg-blue-50",
  receive: "bg-emerald-50",
  pay: "bg-teal-50",
  wallet: "bg-slate-50",
  income: "bg-emerald-50",
  coins: "bg-yellow-50",
  card: "bg-blue-50",
  bills: "bg-red-50",
  cash: "bg-green-50",
  dollar: "bg-yellow-50",
  camera: "bg-sky-50",
  gallery: "bg-fuchsia-50",
};

export const iconTextColors: Record<IconName, string> = {
  shopping: "text-blue-600",
  streaming: "text-purple-600",
  subscription: "text-indigo-600",
  restaurant: "text-orange-600",
  grocery: "text-green-600",
  transport: "text-amber-600",
  utilities: "text-slate-600",
  refund: "text-emerald-600",
  atm: "text-rose-600",
  "bank-transfer": "text-cyan-600",
  merchant: "text-violet-600",
  recurring: "text-pink-600",
  send: "text-blue-600",
  receive: "text-emerald-600",
  pay: "text-teal-600",
  wallet: "text-slate-600",
  income: "text-emerald-600",
  coins: "text-yellow-600",
  card: "text-blue-600",
  bills: "text-red-600",
  cash: "text-green-600",
  dollar: "text-yellow-600",
  camera: "text-sky-600",
  gallery: "text-fuchsia-600",
};