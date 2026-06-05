import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, Check, Sparkles, LockKeyhole } from "lucide-react";
import type { CardColor, CardPattern } from "./Card3D";

const colors: { label: string; value: CardColor; bg: string }[] = [
  { label: "Graphite", value: "graphite", bg: "bg-zinc-800" },
  { label: "Sky", value: "sky", bg: "bg-blue-600" },
  { label: "Emerald", value: "emerald", bg: "bg-emerald-600" },
  { label: "Violet", value: "violet", bg: "bg-purple-600" },
  { label: "Rose", value: "rose", bg: "bg-rose-600" },
];

interface Props {
  open: boolean;
  userId: string;
  email: string;
  cardColor: CardColor;
  cardPattern: CardPattern;
  cardCount: number;
  onCreateCard: (color: CardColor) => void;
  onClose: () => void;
}

export function AddCardSheet({ open, userId, email, cardColor, cardPattern, cardCount, onCreateCard, onClose }: Props) {
  const [selectedColor, setSelectedColor] = useState<CardColor>(cardColor);
  const [slotPaid, setSlotPaid] = useState(false);
  const [slotError, setSlotError] = useState("");
  const [authAmount, setAuthAmount] = useState("5");
  const [savingCard, setSavingCard] = useState(false);
  const needsSlotPayment = cardCount >= 2 && !slotPaid;

  const startPaystackAuthorization = () => {
    const amountUsd = Number(authAmount);
    if (!Number.isFinite(amountUsd) || amountUsd < 5) {
      setSlotError("Enter at least $5 to authorize and save this card.");
      return;
    }
    setSavingCard(true);
    setSlotError("");
    fetch("/api/paystack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        amountUsd,
        callbackUrl: window.location.href,
        metadata: { kind: "save_card", userId, selectedColor },
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not start transaction");
        sessionStorage.setItem("pendingPaystackKind", "save_card");
        sessionStorage.setItem("pendingTopupUsd", String(amountUsd));
        sessionStorage.setItem("pendingTopupReference", data.reference);
        window.location.href = data.authorizationUrl;
      })
      .catch((err) => {
        setSavingCard(false);
        setSlotError(err.message || "Could not start transaction");
      });
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/35"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-[430px] max-h-[92dvh] overflow-y-auto rounded-t-3xl bg-white p-4 min-[390px]:p-6 pb-[max(24px,env(safe-area-inset-bottom))]"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-black">Add a Card</h3>
                  <p className="text-xs text-slate-500">Choose your card design</p>
                </div>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                <X className="w-4 h-4 text-black" />
              </button>
            </div>

            <div className="space-y-5">
              <div className={`relative overflow-hidden rounded-[26px] border border-black bg-gradient-to-br ${
                selectedColor === "sky" ? "from-black via-blue-800 to-cyan-400" :
                selectedColor === "emerald" ? "from-black via-emerald-800 to-lime-500" :
                selectedColor === "violet" ? "from-black via-violet-800 to-fuchsia-500" :
                selectedColor === "rose" ? "from-black via-pink-800 to-rose-400" :
                "from-black via-zinc-800 to-neutral-600"
              } p-5 text-white shadow-[6px_6px_0_#000]`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,255,255,.28),transparent_35%)]" />
                <div className="relative flex items-center justify-between">
                  <p className="text-xs font-black uppercase text-white/70">New virtual card</p>
                  <LockKeyhole className="h-5 w-5" />
                </div>
                <p className="relative mt-12 font-mono text-lg tracking-[0.18em]">4928 0000 0000</p>
                <div className="relative mt-6 flex justify-between text-xs font-black uppercase">
                  <span>Visa Kenya</span>
                  <span>Solid Gradient</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-3 block">Card Color</label>
                <div className="flex flex-wrap gap-3">
                  {colors.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setSelectedColor(c.value)}
                      className={`w-14 h-20 rounded-xl ${c.bg} relative flex items-center justify-center transition-all ${
                        selectedColor === c.value ? "ring-2 ring-blue-500 ring-offset-2 scale-105" : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      {selectedColor === c.value && (
                        <Check className="w-5 h-5 text-white" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {colors.map((c) => (
                    <span
                      key={c.value}
                      className={`text-xs font-medium ${
                        selectedColor === c.value ? "text-blue-600" : "text-slate-400"
                      }`}
                    >
                      {c.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-black bg-[#d7ff5f] p-4 text-xs font-black text-black">
                <Sparkles className="mr-2 inline h-4 w-4" />
                You have {cardCount} card{cardCount === 1 ? "" : "s"}. First 2 slots are included. Extra slots cost $5 each.
              </div>
              <div className="rounded-2xl border border-black bg-white p-4">
                <p className="text-sm font-black text-black">Save card with Paystack</p>
                <p className="mt-1 text-xs font-bold text-slate-500">Paystack verifies the card and returns a secure authorization token. No raw card number or CVV is stored.</p>
                <input
                  value={authAmount}
                  onChange={(e) => setAuthAmount(e.target.value)}
                  type="number"
                  min={5}
                  step="0.01"
                  className="mt-3 w-full rounded-2xl border border-black px-4 py-3 text-xl font-black text-black outline-none"
                  placeholder="Authorization amount"
                />
                {needsSlotPayment && <p className="mt-2 text-xs font-bold text-amber-700">Extra card slots require this authorization payment first.</p>}
                {slotError && <p className="mt-2 text-xs font-bold text-red-500">{slotError}</p>}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  startPaystackAuthorization();
                }}
                disabled={savingCard}
                className="w-full py-3.5 rounded-2xl border border-black bg-black text-white font-extrabold flex items-center justify-center gap-2 shadow-[4px_4px_0_#d7ff5f]"
              >
                <CreditCard className="w-4 h-4" /> {savingCard ? "Opening Paystack..." : "Authorize & Save Card"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
