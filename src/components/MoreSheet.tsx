import { useCallback, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart3, Layers, Send, Shield, Settings, HelpCircle, LogOut, Bell, Receipt, Globe, Zap, Gift, EyeOff } from "lucide-react";
import type { Currency } from "../utils/currency";
import type { CardColor, CardPattern } from "./Card3D";

const cardColorOptions: { id: CardColor; label: string; gradient: string }[] = [
  { id: "graphite", label: "Silver", gradient: "from-slate-900 via-slate-600 to-slate-300" },
  { id: "blue", label: "Blue", gradient: "from-slate-950 via-blue-700 to-sky-400" },
  { id: "green", label: "Green", gradient: "from-slate-950 via-emerald-700 to-lime-300" },
  { id: "purple", label: "Purple", gradient: "from-slate-950 via-violet-700 to-fuchsia-300" },
  { id: "rose", label: "Rose", gradient: "from-slate-950 via-rose-700 to-orange-300" },
];

const cardPatternOptions: { id: CardPattern; label: string; style: CSSProperties }[] = [
  {
    id: "spear",
    label: "Spear",
    style: {
      backgroundImage:
        "linear-gradient(60deg, transparent 0 42%, rgba(250,204,21,0.75) 43% 47%, transparent 48% 100%), linear-gradient(120deg, transparent 0 42%, rgba(255,255,255,0.35) 43% 47%, transparent 48% 100%), linear-gradient(135deg,#020304,#111827)",
      backgroundSize: "18px 18px, 18px 18px, 100% 100%",
    },
  },
  {
    id: "shield",
    label: "Shield",
    style: {
      backgroundImage:
        "radial-gradient(circle at 50% 50%, transparent 0 28%, rgba(250,204,21,0.7) 29% 34%, transparent 35% 100%), linear-gradient(135deg,#020304,#1f2937)",
      backgroundSize: "24px 24px, 100% 100%",
    },
  },
  {
    id: "kente",
    label: "Kente",
    style: {
      backgroundImage:
        "linear-gradient(90deg, rgba(250,204,21,0.65) 2px, transparent 2px), linear-gradient(0deg, rgba(96,165,250,0.45) 2px, transparent 2px), linear-gradient(135deg,#020304,#0f172a)",
      backgroundSize: "16px 16px, 16px 16px, 100% 100%",
    },
  },
  {
    id: "panther",
    label: "Panther",
    style: {
      backgroundImage:
        "radial-gradient(ellipse at 50% 30%, rgba(250,204,21,0.72) 0 16%, transparent 17% 100%), linear-gradient(135deg, transparent 0 42%, rgba(255,255,255,0.3) 43% 46%, transparent 47% 100%), linear-gradient(135deg,#020304,#18181b)",
      backgroundSize: "28px 20px, 24px 24px, 100% 100%",
    },
  },
  {
    id: "circuit",
    label: "Circuit",
    style: {
      backgroundImage:
        "linear-gradient(90deg, rgba(250,204,21,0.55) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.3) 1px, transparent 1px), radial-gradient(circle, rgba(250,204,21,0.9) 0 2px, transparent 3px), linear-gradient(135deg,#020304,#172554)",
      backgroundSize: "18px 18px, 18px 18px, 18px 18px, 100% 100%",
    },
  },
];

const menuSections = [
  {
    title: "Account",
    items: [
      { id: "analytics", label: "Analytics", icon: BarChart3, desc: "View spending insights" },
      { id: "cards", label: "Card Management", icon: Layers, desc: "Manage your cards" },
      { id: "payments", label: "Payments", icon: Send, desc: "Scheduled & recurring" },
      { id: "transactions", label: "Transactions", icon: Receipt, desc: "Full transaction history" },
    ],
  },
  {
    title: "Services",
    items: [
      { id: "rewards", label: "Rewards", icon: Gift, desc: "Points & cashback" },
      { id: "bills", label: "Bill Pay", icon: Zap, desc: "Pay bills instantly" },
      { id: "international", label: "International", icon: Globe, desc: "FX rates & transfers" },
      { id: "security", label: "Security", icon: Shield, desc: "Protect your account" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { id: "notifications", label: "Notifications", icon: Bell, desc: "Alert preferences" },
      { id: "settings", label: "Settings", icon: Settings, desc: "App configuration" },
      { id: "help", label: "Help & Support", icon: HelpCircle, desc: "Get assistance" },
    ],
  },
];

interface Props {
  open: boolean;
  currency: Currency;
  cardColor: CardColor;
  cardPattern: CardPattern;
  hideBalance: boolean;
  onClose: () => void;
  onCurrencyChange: (currency: Currency) => void;
  onCardColorChange: (color: CardColor) => void;
  onCardPatternChange: (pattern: CardPattern) => void;
  onHideBalanceChange: (hide: boolean) => void;
  onNavigate: (tab: string) => void;
  onAddCard: () => void;
  onSend: () => void;
}

export function MoreSheet({ open, currency, cardColor, cardPattern, hideBalance, onClose, onCurrencyChange, onCardColorChange, onCardPatternChange, onHideBalanceChange, onNavigate, onAddCard, onSend }: Props) {
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleItem = useCallback((id: string) => {
    if (id === "analytics") onNavigate("progress");
    else if (id === "cards") {
      onClose();
      onAddCard();
    } else if (id === "payments") {
      onClose();
      onSend();
    } else if (id === "transactions") onNavigate("wallet");
  }, [onAddCard, onClose, onNavigate, onSend]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40"
            onClick={handleClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-t-3xl max-h-[85vh] overflow-hidden flex flex-col"
            style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}
          >
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-slate-200" />
            </div>

            <div className="flex items-center justify-between px-6 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">More</h2>
                <p className="text-xs text-slate-400">All features & settings</p>
              </div>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleClose}
                className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-slate-500" />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-8">
              {menuSections.map((section) => (
                <div key={section.title} className="mb-6">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mb-3">
                    {section.title}
                  </p>
                  <div className="space-y-2">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.id}
                          whileTap={{ scale: 0.98, y: 1 }}
                          onClick={() => handleItem(item.id)}
                          className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 cursor-pointer hover:bg-blue-50 hover:border-blue-100 transition-colors"
                          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.03)" }}
                        >
                          <div
                            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0"
                            style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}
                          >
                            <Icon className="w-5 h-5 text-black" strokeWidth={2.7} />
                          </div>
                          <div className="text-left flex-1">
                            <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                            <p className="text-[10px] text-slate-400">{item.desc}</p>
                          </div>
                          <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center">
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-slate-300">
                              <path d="M3 1.5L5.5 4L3 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="mb-6 rounded-2xl bg-blue-50 border border-blue-100 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                    <Settings className="w-5 h-5 text-black" strokeWidth={2.7} />
                  </div>
                  <div>
                    <p className="text-sm font-extrabold text-black">Settings</p>
                    <p className="text-[10px] text-slate-500">Display currency</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-1 border border-blue-100">
                  {(["USD", "KSH"] as Currency[]).map((option) => (
                    <motion.button
                      key={option}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onCurrencyChange(option)}
                      className={`py-2.5 rounded-xl text-xs font-extrabold transition-colors ${
                        currency === option ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-500"
                      }`}
                    >
                      {option}
                    </motion.button>
                  ))}
                </div>
                <button
                  onClick={() => onHideBalanceChange(!hideBalance)}
                  className="mt-3 w-full p-3 rounded-2xl bg-white border border-blue-100 flex items-center justify-between"
                >
                  <span className="inline-flex items-center gap-2 text-xs font-extrabold text-black">
                    <EyeOff className="w-4 h-4 text-black" strokeWidth={2.7} />
                    Hide balance
                  </span>
                  <span className={`w-10 h-6 rounded-full p-1 transition-colors ${hideBalance ? "bg-blue-600" : "bg-slate-200"}`}>
                    <span className={`block w-4 h-4 rounded-full bg-white transition-transform ${hideBalance ? "translate-x-4" : "translate-x-0"}`} />
                  </span>
                </button>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold mt-4 mb-2">Card color</p>
                <div className="grid grid-cols-5 gap-2">
                  {cardColorOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => onCardColorChange(option.id)}
                      className={`h-12 rounded-2xl bg-gradient-to-br ${option.gradient} border-2 transition-all ${
                        cardColor === option.id ? "border-blue-600 ring-4 ring-blue-200" : "border-white"
                      }`}
                      title={option.label}
                    />
                  ))}
                </div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold mt-4 mb-2">Card pattern</p>
                <div className="grid grid-cols-5 gap-2">
                  {cardPatternOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => onCardPatternChange(option.id)}
                      className={`h-12 rounded-2xl border-2 transition-all ${
                        cardPattern === option.id ? "border-blue-600 ring-4 ring-blue-200" : "border-white"
                      }`}
                      style={option.style}
                      title={option.label}
                    />
                  ))}
                </div>
              </div>

              {/* Log Out */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                  <LogOut className="w-5 h-5 text-black" strokeWidth={2.7} />
                </div>
                <div className="text-left flex-1">
                  <p className="text-sm font-semibold text-slate-800">Log Out</p>
                  <p className="text-[10px] text-slate-400">Sign out of your account</p>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
