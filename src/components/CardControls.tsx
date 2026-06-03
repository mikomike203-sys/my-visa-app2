import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Palette, Bell, Shield, Settings, Check, Send, Receipt, Repeat } from "lucide-react";
import { Button } from "./ui/button";
import { CardData, CardTheme, themeConfigs } from "../types/card";

interface Props {
  card: CardData;
  onToggleFreeze: () => void;
  onChangeTheme: (theme: CardTheme) => void;
  cardTheme: CardTheme;
}

const quickActions = [
  { icon: Send, label: "Send", desc: "Transfer funds", color: "text-indigo-600", bg: "bg-indigo-50" },
  { icon: Receipt, label: "Pay", desc: "Pay bills", color: "text-emerald-600", bg: "bg-emerald-50" },
  { icon: Repeat, label: "Exchange", desc: "Convert currency", color: "text-amber-600", bg: "bg-amber-50" },
  { icon: Shield, label: "Secure", desc: "Card security", color: "text-rose-600", bg: "bg-rose-50" },
];

const themes: { key: CardTheme; label: string }[] = [
  { key: "midnight", label: "Midnight" },
  { key: "gold", label: "Gold" },
  { key: "emerald", label: "Emerald" },
];

export function CardControls({ card, onToggleFreeze, onChangeTheme, cardTheme }: Props) {
  const [spendingLimit, setSpendingLimit] = useState(5000);
  const currentTheme = themeConfigs[card.theme];

  return (
    <div className="space-y-5">
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all text-left group"
            >
              <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                <action.icon className={`w-5 h-5 ${action.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-700 truncate">{action.label}</p>
                <p className="text-[11px] text-slate-400 truncate">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Card Status</h3>
        <Button
          onClick={onToggleFreeze}
          className={`w-full h-11 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm ${
            card.frozen
              ? "bg-slate-800 hover:bg-slate-700 text-white"
              : `${currentTheme.btnBg} ${currentTheme.btnHover} ${currentTheme.btnText}`
          }`}
        >
          {card.frozen ? (
            <span className="flex items-center gap-2"><Unlock className="w-4 h-4" /> Unfreeze Card</span>
          ) : (
            <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Freeze Card</span>
          )}
        </Button>
        <AnimatePresence>
          {card.frozen ? (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="text-xs text-slate-500 mt-3 text-center"
            >
              Card is frozen. Tap to reactivate.
            </motion.p>
          ) : (
            <p className="text-xs text-slate-400 mt-3 text-center">Temporarily block all transactions.</p>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-bold text-slate-800">Card Theme</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => {
            const config = themeConfigs[t.key];
            const isActive = cardTheme === t.key;
            return (
              <motion.button
                key={t.key}
                whileTap={{ scale: 0.96 }}
                onClick={() => onChangeTheme(t.key)}
                className={`relative rounded-xl p-3 border-2 transition-all duration-200 ${
                  isActive ? "border-indigo-300 bg-indigo-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="themeCheck"
                    className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
                <div className={`w-full aspect-[1.6/1] rounded-lg ${config.cardBg} mb-2 shadow-sm`} />
                <p className={`text-xs font-semibold ${isActive ? "text-indigo-600" : "text-slate-500"}`}>{t.label}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-1">Spending Limit</h3>
        <p className="text-xs text-slate-400 mb-4">Monthly transaction cap</p>
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">${spendingLimit.toLocaleString()}</span>
          <span className="text-xs text-slate-400 font-medium">/ month</span>
        </div>
        <input
          type="range"
          min={500}
          max={25000}
          step={500}
          value={spendingLimit}
          onChange={(e) => setSpendingLimit(Number(e.target.value))}
          className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
          <span>$500</span>
          <span>$25,000</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {[
          { icon: Bell, label: "Notifications", desc: "Alert preferences" },
          { icon: Shield, label: "Security", desc: "PIN & verification" },
          { icon: Settings, label: "Settings", desc: "Card preferences" },
        ].map((item, idx) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors text-left ${
              idx !== 0 ? "border-t border-slate-100" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
              <item.icon className="w-4 h-4 text-slate-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-700">{item.label}</p>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
            <span className="text-slate-300 text-lg">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}