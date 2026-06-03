import { useState, useCallback, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  Check,
  Wifi,
  Shield,
  Sparkles,
  ArrowUpRight,
  Truck,
  Smartphone,
} from "lucide-react";
import { Card3D } from "./Card3D";
import type { CardColor, CardPattern } from "./Card3D";

interface Props {
  open: boolean;
  cardColor: CardColor;
  cardPattern: CardPattern;
  onClose: () => void;
}

const cardTypes = [
  {
    id: "physical",
    title: "Physical Card",
    desc: "Ships in 3-5 business days",
    icon: Truck,
  },
  {
    id: "virtual",
    title: "Virtual Card",
    desc: "Instant digital card",
    icon: Smartphone,
  },
];

const themes = [
  { id: "graphite", label: "Silver", gradient: "from-slate-900 via-slate-600 to-slate-300" },
  { id: "blue", label: "Blue", gradient: "from-slate-950 via-blue-700 to-sky-400" },
  { id: "green", label: "Green", gradient: "from-slate-950 via-emerald-700 to-lime-300" },
  { id: "purple", label: "Purple", gradient: "from-slate-950 via-violet-700 to-fuchsia-300" },
  { id: "rose", label: "Rose", gradient: "from-slate-950 via-rose-700 to-orange-300" },
];

const patternOptions: { id: CardPattern; label: string; style: CSSProperties }[] = [
  { id: "spear", label: "Spear", style: { backgroundImage: "linear-gradient(60deg, transparent 0 42%, rgba(250,204,21,.8) 43% 47%, transparent 48%), linear-gradient(135deg,#020304,#111827)", backgroundSize: "18px 18px, 100% 100%" } },
  { id: "shield", label: "Shield", style: { backgroundImage: "radial-gradient(circle, transparent 0 28%, rgba(250,204,21,.75) 29% 34%, transparent 35%), linear-gradient(135deg,#020304,#1f2937)", backgroundSize: "24px 24px, 100% 100%" } },
  { id: "kente", label: "Kente", style: { backgroundImage: "linear-gradient(90deg, rgba(250,204,21,.65) 2px, transparent 2px), linear-gradient(0deg, rgba(96,165,250,.45) 2px, transparent 2px), linear-gradient(135deg,#020304,#0f172a)", backgroundSize: "16px 16px, 16px 16px, 100% 100%" } },
  { id: "panther", label: "Panther", style: { backgroundImage: "radial-gradient(ellipse at 50% 30%, rgba(250,204,21,.75) 0 16%, transparent 17%), linear-gradient(135deg,#020304,#18181b)", backgroundSize: "28px 20px, 100% 100%" } },
  { id: "circuit", label: "Circuit", style: { backgroundImage: "linear-gradient(90deg, rgba(250,204,21,.55) 1px, transparent 1px), linear-gradient(0deg, rgba(255,255,255,.3) 1px, transparent 1px), radial-gradient(circle, rgba(250,204,21,.9) 0 2px, transparent 3px), linear-gradient(135deg,#020304,#172554)", backgroundSize: "18px 18px, 18px 18px, 18px 18px, 100% 100%" } },
];

export function AddCardSheet({ open, cardColor, cardPattern, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [cardType, setCardType] = useState<string>("physical");
  const [name, setName] = useState("");
  const [spendingLimit, setSpendingLimit] = useState(5000);
  const [theme, setTheme] = useState<CardColor>(cardColor);
  const [pattern, setPattern] = useState<CardPattern>(cardPattern);
  const [success, setSuccess] = useState(false);

  const handleClose = useCallback(() => {
    setStep(0);
    setCardType("physical");
    setName("");
    setSpendingLimit(5000);
    setTheme(cardColor);
    setPattern(cardPattern);
    setSuccess(false);
    onClose();
  }, [cardColor, cardPattern, onClose]);

  const handleNext = useCallback(() => {
    if (step < 2) setStep(step + 1);
    else {
      setSuccess(true);
      setTimeout(() => handleClose(), 2200);
    }
  }, [step, handleClose]);

  const canProceed = step === 0 ? true : step === 1 ? name.trim().length > 0 : true;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/45"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 18 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-[390px] bg-white rounded-3xl max-h-[94dvh] overflow-hidden flex flex-col"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.24)" }}
          >
            <div className="flex items-center justify-between px-4 min-[390px]:px-6 pt-5 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-black">Add New Card</h2>
                <p className="text-xs text-slate-500 font-bold">
                  {step === 0 && "Choose card type"}
                  {step === 1 && "Personalize your card"}
                  {step === 2 && "Set your spending limit"}
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleClose}
                className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4 text-black" strokeWidth={2.8} />
              </motion.button>
            </div>

            <div className="px-4 min-[390px]:px-6 mb-4 flex gap-2">
              {[0, 1, 2].map((s) => (
                <div
                  key={s}
                  className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                    step >= s ? "bg-black" : "bg-slate-200"
                  }`}
                />
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-4 min-[390px]:px-6 pb-8">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                      className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center mb-5 shadow-xl shadow-blue-600/20"
                    >
                      <Check className="w-10 h-10 text-white" strokeWidth={3} />
                    </motion.div>
                    <h3 className="text-xl font-extrabold text-black mb-1">Card Created!</h3>
                    <p className="text-sm text-slate-500 text-center max-w-xs">
                      Your new {cardType === "virtual" ? "virtual" : "physical"} card is ready to use.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {step === 0 && (
                      <div className="space-y-3">
                        {cardTypes.map((t) => {
                          const Icon = t.icon;
                          const isActive = cardType === t.id;
                          return (
                            <motion.button
                              key={t.id}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setCardType(t.id)}
                              className={`w-full p-4 rounded-2xl border-2 cursor-pointer text-left transition-all ${
                                isActive ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                                  <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-extrabold text-black">{t.title}</p>
                                  <p className="text-[11px] text-slate-500">{t.desc}</p>
                                </div>
                                {isActive && (
                                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                  </div>
                                )}
                              </div>
                            </motion.button>
                          );
                        })}

                        <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                          <Shield className="w-4 h-4 text-black shrink-0 mt-0.5" strokeWidth={2.5} />
                          <div>
                            <p className="text-xs font-extrabold text-black">Bank-grade security</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Every card is protected with 256-bit encryption and instant freeze.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 1 && (
                      <div className="space-y-5">
                        <div className="mb-2">
                          <Card3D cardHolder={name || "YOUR NAME HERE"} colorTheme={theme} patternTheme={pattern} />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold mb-2 block">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold mb-2 block">
                            Card Finish
                          </label>
                          <div className="grid grid-cols-5 gap-2">
                            {themes.map((t) => {
                              const isActive = theme === t.id;
                              return (
                                <motion.button
                                  key={t.id}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setTheme(t.id)}
                                  className={`p-1.5 rounded-xl border-2 cursor-pointer transition-all ${
                                    isActive ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white"
                                  }`}
                                >
                                  <div
                                    className={`w-full aspect-square rounded-lg mb-1.5 bg-gradient-to-br ${t.gradient}`}
                                  />
                                  <p className={`text-[10px] font-extrabold text-center ${isActive ? "text-black" : "text-slate-500"}`}>
                                    {t.label}
                                  </p>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold mb-2 block">
                            Card Pattern
                          </label>
                          <div className="grid grid-cols-5 gap-2">
                            {patternOptions.map((p) => {
                              const isActive = pattern === p.id;
                              return (
                                <motion.button
                                  key={p.id}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => setPattern(p.id)}
                                  className={`aspect-square rounded-xl border-2 cursor-pointer transition-all ${
                                    isActive ? "border-blue-600 ring-2 ring-blue-200" : "border-slate-200"
                                  }`}
                                  style={p.style}
                                  title={p.label}
                                />
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <Wifi className="w-4 h-4 text-black rotate-90" strokeWidth={2.5} />
                          <div>
                            <p className="text-xs font-extrabold text-black">Contactless enabled</p>
                            <p className="text-[10px] text-slate-500">Tap to pay anywhere</p>
                          </div>
                          <div className="ml-auto w-9 h-5 bg-blue-600 rounded-full p-0.5">
                            <div className="w-4 h-4 bg-white rounded-full ml-auto" />
                          </div>
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="space-y-5">
                        <div className="text-center py-4">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold mb-2">
                            Monthly Spending Limit
                          </p>
                          <p className="text-5xl font-extrabold tracking-tight text-black">
                            ${spendingLimit.toLocaleString()}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1">per month</p>
                        </div>

                        <div className="px-1">
                          <input
                            type="range"
                            min={500}
                            max={25000}
                            step={500}
                            value={spendingLimit}
                            onChange={(e) => setSpendingLimit(Number(e.target.value))}
                            className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                          />
                          <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-extrabold">
                            <span>$500</span>
                            <span>$25,000</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                          {[1000, 5000, 10000, 20000].map((v) => (
                            <motion.button
                              key={v}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSpendingLimit(v)}
                              className={`py-2.5 rounded-xl text-xs font-extrabold border cursor-pointer transition-all ${
                                spendingLimit === v
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white text-slate-600 border-slate-200"
                              }`}
                            >
                              ${v >= 1000 ? `${v / 1000}k` : v}
                            </motion.button>
                          ))}
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">Card type</span>
                            <span className="font-extrabold text-black capitalize">{cardType}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">Cardholder</span>
                            <span className="font-extrabold text-black">{name || "-"}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">Annual fee</span>
                            <span className="font-extrabold text-black">$0.00</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">FX fee</span>
                            <span className="font-extrabold text-black">0%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!success && (
              <div className="px-4 min-[390px]:px-6 py-4 border-t border-slate-200 bg-white">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={!canProceed}
                  onClick={handleNext}
                  animate={canProceed ? { boxShadow: ["0 0 0 rgba(37,99,235,0)", "0 0 30px rgba(37,99,235,0.32)", "0 0 0 rgba(37,99,235,0)"] } : undefined}
                  transition={canProceed ? { duration: 3.5, repeat: Infinity, ease: "easeInOut" } : undefined}
                  className={`w-full py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
                    canProceed
                      ? "bg-blue-600 text-white cursor-pointer shadow-lg shadow-blue-600/20"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {step < 2 ? (
                    <>
                      Continue <ArrowUpRight className="w-4 h-4" strokeWidth={2.8} />
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" strokeWidth={2.8} /> Create Card
                    </>
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
