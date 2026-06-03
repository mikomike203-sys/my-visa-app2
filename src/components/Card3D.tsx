import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Wifi, CreditCard } from "lucide-react";

interface Card3DProps {
  variant?: "default" | "compact";
  cardNumber?: string;
  cardHolder?: string;
  cardExpiry?: string;
  cardType?: string;
  balance?: string;
  colorTheme?: CardColor;
  patternTheme?: CardPattern;
}

export type CardColor = "graphite" | "blue" | "green" | "purple" | "rose";
export type CardPattern = "spear" | "shield" | "kente" | "panther" | "circuit";

const cardColors: Record<CardColor, { base: string; glow: string; rim: string; markA: string; markB: string }> = {
  graphite: {
    base: "linear-gradient(135deg, #030712 0%, #111827 36%, #0f172a 58%, #020617 100%)",
    glow: "rgba(96,165,250,0.22)",
    rim: "rgba(96,165,250,0.18)",
    markA: "#facc15",
    markB: "#b45309",
  },
  blue: {
    base: "linear-gradient(135deg, #020617 0%, #1d4ed8 38%, #0f172a 72%, #020617 100%)",
    glow: "rgba(59,130,246,0.34)",
    rim: "rgba(59,130,246,0.34)",
    markA: "#facc15",
    markB: "#b45309",
  },
  green: {
    base: "linear-gradient(135deg, #020617 0%, #047857 42%, #0f172a 72%, #020617 100%)",
    glow: "rgba(16,185,129,0.32)",
    rim: "rgba(16,185,129,0.3)",
    markA: "#facc15",
    markB: "#b45309",
  },
  purple: {
    base: "linear-gradient(135deg, #020617 0%, #6d28d9 42%, #111827 72%, #020617 100%)",
    glow: "rgba(168,85,247,0.32)",
    rim: "rgba(168,85,247,0.3)",
    markA: "#facc15",
    markB: "#b45309",
  },
  rose: {
    base: "linear-gradient(135deg, #020617 0%, #be123c 42%, #111827 72%, #020617 100%)",
    glow: "rgba(244,63,94,0.3)",
    rim: "rgba(244,63,94,0.28)",
    markA: "#facc15",
    markB: "#b45309",
  },
};

const cardPatterns: Record<CardPattern, { label: string; background: string; size: string; move: string[] }> = {
  spear: {
    label: "Spear",
    background:
      "linear-gradient(60deg, transparent 0 44%, rgba(250,204,21,0.28) 45% 47%, transparent 48% 100%), linear-gradient(120deg, transparent 0 44%, rgba(255,255,255,0.16) 45% 47%, transparent 48% 100%)",
    size: "46px 46px",
    move: ["0px 0px", "92px 46px"],
  },
  shield: {
    label: "Shield",
    background:
      "radial-gradient(circle at 50% 50%, transparent 0 30%, rgba(250,204,21,0.2) 31% 33%, transparent 34% 100%), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
    size: "52px 52px",
    move: ["0px 0px", "52px 104px"],
  },
  kente: {
    label: "Kente",
    background:
      "linear-gradient(90deg, rgba(250,204,21,0.2) 2px, transparent 2px), linear-gradient(0deg, rgba(96,165,250,0.14) 2px, transparent 2px), linear-gradient(45deg, transparent 0 48%, rgba(255,255,255,0.12) 49% 51%, transparent 52% 100%)",
    size: "34px 34px",
    move: ["0px 0px", "68px 34px"],
  },
  panther: {
    label: "Panther",
    background:
      "radial-gradient(ellipse at 50% 30%, rgba(250,204,21,0.24) 0 12%, transparent 13% 100%), linear-gradient(135deg, transparent 0 42%, rgba(255,255,255,0.13) 43% 45%, transparent 46% 100%)",
    size: "58px 42px",
    move: ["0px 0px", "116px 84px"],
  },
  circuit: {
    label: "Circuit",
    background:
      "linear-gradient(90deg, rgba(250,204,21,0.2) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,0.12) 1px, transparent 1px), radial-gradient(circle, rgba(250,204,21,0.34) 0 2px, transparent 3px)",
    size: "40px 40px",
    move: ["0px 0px", "80px 80px"],
  },
};

export function Card3D({
  variant = "default",
  cardNumber = "8287 4928 4703",
  cardHolder = "SARAH MITCHELL",
  cardExpiry = "09/28",
  cardType = "VISA LIMIT",
  balance = "$43,093.00",
  colorTheme = "graphite",
  patternTheme = "spear",
}: Card3DProps) {
  const theme = cardColors[colorTheme];
  const pattern = cardPatterns[patternTheme];
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = ((y - centerY) / centerY) * -12;
    const rotY = ((x - centerX) / centerX) * 12;
    setRotation({ x: rotX, y: rotY });
    setTiltX(rotX);
    setTiltY(rotY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const rotX = ((y - rect.height / 2) / (rect.height / 2)) * -10;
    const rotY = ((x - rect.width / 2) / (rect.width / 2)) * 10;
    setRotation({ x: rotX, y: rotY });
    setTiltX(rotX);
    setTiltY(rotY);
  };

  const resetRotation = () => {
    setRotation({ x: 0, y: 0 });
    setTiltX(0);
    setTiltY(0);
    setIsHovering(false);
  };

  return (
    <div className="perspective-[1400px] w-full max-w-[390px] mx-auto">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseLeave={resetRotation}
        onMouseEnter={() => setIsHovering(true)}
        onTouchEnd={resetRotation}
        animate={{
          rotateX: rotation.x,
          rotateY: rotation.y,
          scale: isHovering ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 250, damping: 28 }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full aspect-[1.586/1] rounded-[22px] min-[390px]:rounded-[24px] overflow-hidden cursor-grab active:cursor-grabbing"
      >
        {/* Graphite base with a blue edge glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              theme.base,
          }}
        />

        {/* Subtle grey mesh that follows tilt */}
        <motion.div
          className="absolute inset-0 opacity-80"
          animate={{
            background: `radial-gradient(circle at ${
              50 + tiltY * 2
            }% ${50 + tiltX * 2}%, rgba(148, 163, 184, 0.18) 0%, rgba(100, 116, 139, 0.08) 30%, transparent 60%)`,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />

        {/* Diagonal sheen */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.04) 50%, transparent 70%)",
          }}
        />

        {/* Smooth silver-blue satin, no thin crossing lines */}
        <motion.div
          className="absolute inset-0 opacity-70"
          animate={{
            background: `radial-gradient(circle at ${22 + tiltY}% ${18 + tiltX}%, ${theme.glow}, transparent 34%),
              radial-gradient(circle at ${80 - tiltY}% ${78 - tiltX}%, rgba(226,232,240,0.18), transparent 36%)`,
          }}
          transition={{ type: "spring", stiffness: 180, damping: 24 }}
        />

        <motion.div
          className="absolute inset-0 opacity-[0.18] pointer-events-none"
          animate={{ backgroundPosition: pattern.move }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage: pattern.background,
            backgroundSize: pattern.size,
            mixBlendMode: "screen",
          }}
        />

        {/* Silver corner accents */}
        <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full opacity-60 blur-3xl"
             style={{ background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)` }} />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full opacity-50 blur-3xl"
             style={{ background: "radial-gradient(circle, rgba(148,163,184,0.25) 0%, transparent 70%)" }} />

        {/* Top row: Chip + Brand */}
        <div
          className="absolute top-0 left-0 right-0 p-4 min-[390px]:p-5 sm:p-7 flex items-start justify-between"
          style={{ transform: "translateZ(40px)" }}
        >
          <div className="flex items-center gap-3">
            {/* Premium silver EMV chip */}
            <div
              className="w-10 h-8 min-[390px]:w-12 min-[390px]:h-9 rounded-lg relative overflow-hidden"
              style={{
                background:
              `linear-gradient(135deg, ${theme.markA} 0%, #fef3c7 32%, ${theme.markB} 100%)`,
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,255,0.5), inset 0 -1px 2px rgba(0,0,0,0.3)",
              }}
            >
              <div className="absolute inset-1 grid grid-cols-3 gap-px opacity-50">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-slate-700/40 rounded-[1px]" />
                ))}
              </div>
              <div className="absolute inset-x-1 top-1/2 h-px bg-slate-700/40" />
              <div className="absolute inset-y-1 left-1/2 w-px bg-slate-700/40" />
              <motion.div
                className="absolute inset-y-0 -left-6 w-4 rotate-12 bg-white/55 blur-[2px]"
                animate={{ x: [0, 80] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <CreditCard className="w-3.5 h-3.5 min-[390px]:w-4 min-[390px]:h-4 text-white/40" strokeWidth={2.2} />
          </div>

          <div className="flex flex-col items-end gap-1">
            <Wifi
              className="w-5 h-5 min-[390px]:w-6 min-[390px]:h-6 text-white/50 rotate-90"
              strokeWidth={2.2}
            />
            <span className="text-[8px] min-[390px]:text-[10px] tracking-[0.22em] min-[390px]:tracking-[0.25em] text-white/60 uppercase font-extrabold">
              {cardType}
            </span>
          </div>
        </div>

        {/* Center: Card number + balance */}
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 px-4 min-[390px]:px-5 sm:px-7"
          style={{ transform: "translateZ(50px)" }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[9px] uppercase tracking-[0.2em] text-white/40 font-bold">
              Balance
            </span>
          </div>
          <p className="text-[1.55rem] min-[390px]:text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2 min-[390px]:mb-3 drop-shadow-lg">
            {balance}
          </p>
          <p className="text-xs min-[390px]:text-sm sm:text-base tracking-[0.16em] min-[390px]:tracking-[0.18em] font-light text-white/80 font-mono drop-shadow">
            {cardNumber}
          </p>
        </div>

        {/* Bottom row: Holder + Expiry + Logo */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4 min-[390px]:p-5 sm:p-7 flex items-end justify-between"
          style={{ transform: "translateZ(40px)" }}
        >
          <div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1 font-bold">
              Card Holder
            </p>
            <p className="text-xs min-[390px]:text-sm font-extrabold tracking-wider text-white/95">
              {cardHolder}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/40 mb-1 font-bold">
              Expires
            </p>
            <p className="text-xs min-[390px]:text-sm font-extrabold text-white/95 font-mono">{cardExpiry}</p>
          </div>
          {/* Silver/grey network mark */}
          <div className="flex items-center -space-x-2.5">
            <div
              className="w-8 h-8 min-[390px]:w-9 min-[390px]:h-9 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #ff7a18 0%, #eb001b 72%, #7f1d1d 100%)",
                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.4)",
              }}
            />
            <div
              className="w-8 h-8 min-[390px]:w-9 min-[390px]:h-9 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, #ffd66b 0%, #f79e1b 70%, #92400e 100%)",
                boxShadow: "inset 0 1px 2px rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.4)",
              }}
            />
          </div>
        </div>

        {/* Wide gold pattern reveal */}
        <motion.div
          className="absolute inset-y-[-35%] -left-[65%] w-[62%] rotate-12 pointer-events-none"
          animate={{ left: ["-65%", "120%"], backgroundPosition: pattern.move }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background:
              `linear-gradient(90deg, rgba(250,204,21,0) 0%, rgba(250,204,21,0.16) 18%, rgba(255,255,255,0.32) 48%, rgba(250,204,21,0.16) 78%, rgba(250,204,21,0) 100%), ${pattern.background}`,
            backgroundSize: `100% 100%, ${pattern.size}`,
            filter: "blur(6px)",
            opacity: 0.85,
            mixBlendMode: "screen",
            transform: "translateZ(58px)",
          }}
        />
        <motion.div
          className="absolute inset-0 rounded-[24px] pointer-events-none"
          animate={{
            opacity: isHovering ? 1 : 0.55,
            background: `linear-gradient(${
              105 + tiltY * 3
            }deg, rgba(255,255,255,0) 0%, rgba(96,165,250,0.06) 30%, rgba(255,255,255,0.16) 50%, rgba(96,165,250,0.06) 70%, rgba(255,255,255,0) 100%)`,
          }}
          transition={{ duration: 0.2 }}
          style={{ transform: "translateZ(60px)" }}
        />

        {/* Outer rim highlight */}
        <div
          className="absolute inset-0 rounded-[24px] pointer-events-none"
          style={{
            boxShadow:
              `inset 0 1px 1px rgba(255,255,255,0.18), inset 0 -1px 1px rgba(0,0,0,0.5), 0 20px 60px rgba(15,23,42,0.3), 0 0 0 1px ${theme.rim}`,
          }}
        />
      </motion.div>
    </div>
  );
}
