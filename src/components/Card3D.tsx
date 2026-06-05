import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Wifi } from "lucide-react";
import { formatMoney, type Currency } from "../utils/currency";

interface Card3DProps {
  variant?: "default" | "compact";
  cardNumber?: string;
  cardHolder?: string;
  cardExpiry?: string;
  cardType?: string;
  balance?: number;
  currency?: Currency;
  color?: CardColor;
  pattern?: CardPattern;
  frozen?: boolean;
  hideBalance?: boolean;
  onToggleFreeze?: () => void;
}

export type CardColor = "midnight" | "slate" | "graphite" | "crimson" | "emerald" | "sky" | "violet" | "rose";
export type CardPattern = "solid";

const colorMap: Record<CardColor, { bg: string; glow: string; text: string }> = {
  midnight: { bg: "from-black via-slate-900 to-blue-800", glow: "shadow-blue-700/35", text: "text-white" },
  slate: { bg: "from-zinc-900 via-slate-700 to-zinc-500", glow: "shadow-zinc-700/30", text: "text-white" },
  graphite: { bg: "from-black via-zinc-800 to-neutral-600", glow: "shadow-black/35", text: "text-white" },
  crimson: { bg: "from-black via-red-800 to-rose-500", glow: "shadow-red-700/35", text: "text-white" },
  emerald: { bg: "from-black via-emerald-800 to-lime-500", glow: "shadow-emerald-700/35", text: "text-white" },
  sky: { bg: "from-black via-blue-800 to-cyan-400", glow: "shadow-blue-700/35", text: "text-white" },
  violet: { bg: "from-black via-violet-800 to-fuchsia-500", glow: "shadow-violet-700/35", text: "text-white" },
  rose: { bg: "from-black via-pink-800 to-rose-400", glow: "shadow-pink-700/35", text: "text-white" },
};

export function Card3D({
  variant = "default",
  cardNumber = "**** **** **** ****",
  cardHolder = "Card Holder",
  cardExpiry = "**/**",
  balance = 0,
  currency = "USD",
  color = "graphite",
  frozen = false,
  hideBalance = false,
  onToggleFreeze,
}: Card3DProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const colors = colorMap[color] || colorMap.graphite;
  const digits = cardNumber.replace(/\D/g, "");
  const displayNumber = digits.length >= 4 ? `**** **** **** ${digits.slice(-4)}` : "**** **** **** ****";

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRotateY((x / rect.width - 0.5) * 18);
    setRotateX((y / rect.height - 0.5) * -18);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX, rotateY }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`
        relative w-full rounded-2xl overflow-hidden cursor-pointer select-none border border-white/20
        bg-gradient-to-br ${colors.bg}
        shadow-2xl ${colors.glow}
        ${frozen ? "opacity-70" : ""}
        ${variant === "compact" ? "p-4" : "p-5 sm:p-6"}
      `}
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
    >
      {/* Gloss overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.28),transparent_35%),linear-gradient(135deg,rgba(255,255,255,0.16),transparent_40%)] pointer-events-none" />
      <motion.div
        className="absolute inset-y-[-40%] -left-[45%] w-[34%] rotate-12 bg-white/30 blur-xl"
        animate={{ left: ["-45%", "125%"] }}
        transition={{ duration: 1.05, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
      />

      {/* Chip */}
      <div className="relative z-10 mb-3 sm:mb-4 flex items-start justify-between">
        <div className="w-10 h-8 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center shadow-inner">
          <Wifi className="w-5 h-5 text-yellow-800 rotate-90" />
        </div>
        {onToggleFreeze && (
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFreeze(); }}
            className={`text-[10px] px-2.5 py-1 rounded-full font-semibold transition-all ${
              frozen ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white/60 hover:bg-white/20"
            }`}
          >
            {frozen ? "FROZEN" : "FREEZE"}
          </button>
        )}
      </div>

      {/* Balance */}
      <div className="relative z-10 mb-3 sm:mb-4">
        <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Balance</p>
        <p className="text-xl sm:text-2xl font-bold text-white">
          {hideBalance ? "****" : formatMoney(balance, currency)}
        </p>
      </div>

      {/* Card Number */}
      <div className="relative z-10 mb-3">
        <p className="text-lg sm:text-xl font-mono tracking-widest text-white/90">
          {displayNumber}
        </p>
      </div>

      {/* Bottom info */}
      <div className="relative z-10 flex items-end justify-between">
        <div className="flex-1 min-w-0 mr-2">
          <p className="text-[10px] uppercase tracking-widest text-white/50 mb-0.5">
            {variant === "compact" ? "Holder" : "Card Holder"}
          </p>
          <p className={`text-xs sm:text-sm font-semibold truncate ${colors.text}`}>
            {cardHolder || "Card Holder"}
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-[10px] uppercase tracking-widest text-white/50 mb-0.5">Expires</p>
          <p className={`text-xs sm:text-sm font-semibold ${colors.text}`}>{cardExpiry}</p>
        </div>
      </div>
    </motion.div>
  );
}
