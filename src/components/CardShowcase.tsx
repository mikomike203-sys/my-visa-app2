import { motion } from "framer-motion";
import { Lock, Wifi, CreditCard } from "lucide-react";
import { CardData, themeConfigs } from "../types/card";

interface Props {
  cards: CardData[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function CardShowcase({ cards, activeIndex, onSelect }: Props) {
  const card = cards[activeIndex];
  const theme = themeConfigs[card.theme];

  return (
    <div className="space-y-5">
      <motion.div
        key={card.id + card.theme}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`relative w-full aspect-[1.586/1] rounded-2xl ${theme.cardBg} p-6 sm:p-8 overflow-hidden shadow-xl`}
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-1/3 w-40 h-40 rounded-full bg-white/5" />

        {card.frozen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl"
          >
            <div className="flex flex-col items-center gap-2 text-white">
              <Lock className="w-7 h-7" />
              <span className="text-base font-bold tracking-wide">Card Frozen</span>
              <span className="text-xs text-white/60">All transactions blocked</span>
            </div>
          </motion.div>
        )}

        <div className="relative z-0 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-9 rounded-md ${theme.chipBg} shadow-inner`} />
              <CreditCard className="w-5 h-5 text-white/30" />
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-white/40 rotate-90" />
              <span className="text-xs tracking-[0.25em] text-white/50 uppercase font-semibold">
                {card.type}
              </span>
            </div>
          </div>

          <div className="text-xl sm:text-2xl tracking-[0.2em] font-light text-white font-mono">
            {card.number}
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-0.5">Card Holder</p>
              <p className="text-sm font-semibold tracking-wider text-white/90">{card.holder}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.15em] text-white/40 mb-0.5">Expires</p>
              <p className="text-sm font-semibold text-white/90">{card.expiry}</p>
            </div>
            <div className="flex items-center -space-x-2">
              <div className="w-8 h-8 rounded-full bg-red-400/80 border-2 border-white/20" />
              <div className="w-8 h-8 rounded-full bg-yellow-400/60 border-2 border-white/20" />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex gap-3">
        {cards.map((c, i) => {
          const t = themeConfigs[c.theme];
          return (
            <motion.button
              key={c.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => onSelect(i)}
              className={`flex-1 rounded-xl p-4 border-2 transition-all duration-200 text-left ${
                i === activeIndex
                  ? `border-indigo-200 bg-white ring-2 ${t.ring} shadow-sm`
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2.5 h-2.5 rounded-full ${t.accent}`} />
                <p className={`text-xs font-bold ${i === activeIndex ? t.accentText : "text-slate-400"}`}>
                  {c.type}
                </p>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">{c.number}</p>
              {c.frozen && (
                <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  <Lock className="w-2.5 h-2.5" /> Frozen
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-700">Available Balance</p>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${theme.badgeBg} ${theme.badgeText}`}>
            {card.type}
          </span>
        </div>
        <p className="text-3xl font-extrabold tracking-tight text-slate-900 mb-4">
          ${card.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Utilized</span>
          <span>${card.limit.toLocaleString()} limit</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            key={card.id}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((card.balance / card.limit) * 100, 100)}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${theme.barFrom} ${theme.barTo}`}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">
          {((card.balance / card.limit) * 100).toFixed(1)}% of limit · ${(card.limit - card.balance).toLocaleString("en-US", { minimumFractionDigits: 2 })} remaining
        </p>
      </div>
    </div>
  );
}