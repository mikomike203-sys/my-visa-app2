import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, LogOut, Share2, Eye, EyeOff, Send, PlusCircle, BadgeCheck, Palette, ShieldCheck, Zap, QrCode, CreditCard, KeyRound, Smartphone, Gauge, UsersRound } from "lucide-react";
import type { Currency } from "../utils/currency";
import type { CardColor, CardPattern } from "./Card3D";
import type { Card, PublicPerson } from "../types/database";

const currencies: { label: string; value: Currency }[] = [
  { label: "USD", value: "USD" },
  { label: "EUR", value: "EUR" },
  { label: "GBP", value: "GBP" },
  { label: "KES", value: "KES" },
  { label: "NGN", value: "NGN" },
];

interface Props {
  open: boolean;
  currency: Currency;
  cardColor: CardColor;
  cardPattern: CardPattern;
  hideBalance: boolean;
  onCurrencyChange: (c: Currency) => void;
  onCardColorChange: (c: CardColor) => void;
  onCardPatternChange: (c: CardPattern) => void;
  onHideBalanceChange: (h: boolean) => void;
  onClose: () => void;
  onNavigate: (tab: string) => void;
  onAddCard: () => void;
  onSend: () => void;
  userCards: Card[];
  people: PublicPerson[];
  onOpenShare: () => void;
  onLogout: () => void;
  onSubmitKyc: (documentUrl: string) => Promise<void>;
  kycStatus: "pending" | "verified" | "rejected" | "not_submitted";
}

export function MoreSheet({
  open, currency, cardColor, cardPattern, hideBalance,
  onCurrencyChange, onCardColorChange, onCardPatternChange,
  onHideBalanceChange, onClose, onNavigate, onAddCard, onSend, userCards, people, onOpenShare, onLogout,
  onSubmitKyc, kycStatus
}: Props) {
  const [kycDocument, setKycDocument] = useState("");
  const [kycMessage, setKycMessage] = useState("");
  const [showCardDetails, setShowCardDetails] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const activeCard = userCards[0];
  const virtualCvv = activeCard ? String(Math.abs(activeCard.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0)) % 900 + 100) : "***";
  const cardLooks: { label: string; value: CardColor; swatch: string }[] = [
    { label: "Graphite", value: "graphite", swatch: "bg-zinc-900" },
    { label: "Sky", value: "sky", swatch: "bg-blue-600" },
    { label: "Emerald", value: "emerald", swatch: "bg-emerald-600" },
    { label: "Violet", value: "violet", swatch: "bg-violet-600" },
    { label: "Rose", value: "rose", swatch: "bg-rose-600" },
  ];

  const submitKyc = async () => {
    if (!kycDocument.trim()) {
      setKycMessage("Paste a document link or reference first.");
      return;
    }
    await onSubmitKyc(kycDocument.trim());
    setKycDocument("");
    setKycMessage("KYC submitted for admin review.");
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
              <div>
                <h3 className="text-lg font-extrabold text-black">Settings</h3>
                <p className="text-xs font-bold text-slate-500">Cards, limits, KYC, and wallet controls</p>
              </div>
              <button onClick={onClose} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                <X className="w-4 h-4 text-black" />
              </button>
            </div>

            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden rounded-[26px] border border-black bg-black shadow-[5px_5px_0_#000]"
              >
                <img
                  src="/vv.jpg"
                  alt="Introducing the future"
                  className="h-72 w-full object-cover object-center"
                  loading="eager"
                  decoding="async"
                />
              </motion.div>

              <div className="rounded-[24px] border border-black bg-black p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Wallet status</p>
                    <p className="mt-1 text-lg font-black">{kycStatus === "verified" ? "Verified account" : "Verification needed"}</p>
                    <p className="mt-1 text-xs font-bold text-white/60">{userCards.length} active card{userCards.length === 1 ? "" : "s"} - {people.length} profiles available</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-black">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {[
                    { label: "Send", action: () => { onSend(); onClose(); } },
                    { label: "Add card", action: () => { onAddCard(); onClose(); } },
                    { label: "Share", action: onOpenShare },
                  ].map((item) => (
                    <button key={item.label} onClick={item.action} className="rounded-xl border border-white/15 bg-white/10 px-2 py-2 text-[10px] font-black text-white">
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Currency */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <label className="text-xs font-bold text-slate-600 mb-2 block">Currency</label>
                <div className="flex gap-2">
                  {currencies.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => onCurrencyChange(c.value)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        currency === c.value
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hide Balance */}
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-3">
                  {hideBalance ? <EyeOff className="w-5 h-5 text-slate-600" /> : <Eye className="w-5 h-5 text-slate-600" />}
                  <div>
                    <p className="text-sm font-bold text-black">Hide Balance</p>
                    <p className="text-xs text-slate-500">Keep your balance private</p>
                  </div>
                </div>
                <button
                  onClick={() => onHideBalanceChange(!hideBalance)}
                  className={`w-12 h-7 rounded-full transition-all ${
                    hideBalance ? "bg-blue-600" : "bg-slate-300"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all transform ${
                    hideBalance ? "translate-x-6" : "translate-x-1"
                  }`} />
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UsersRound className="h-4 w-4 text-black" />
                    <p className="text-sm font-black text-black">People profiles</p>
                  </div>
                  <span className="text-[10px] font-black text-slate-500">{people.length} users</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {people.map((person) => (
                    <div key={person.id} className="w-[92px] shrink-0 text-center">
                      <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-black bg-[#d7ff5f]">
                        {person.avatarUrl ? (
                          <img src={person.avatarUrl} alt={person.fullName} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-lg font-black text-black">{person.fullName.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <p className="truncate text-xs font-black text-black">{person.fullName}</p>
                      <p className="truncate text-[10px] font-bold text-slate-500">Visa profile</p>
                    </div>
                  ))}
                  {people.length === 0 && <p className="text-xs font-bold text-slate-500">No people found yet.</p>}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Palette className="h-4 w-4 text-black" />
                  <p className="text-sm font-black text-black">Card look</p>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {cardLooks.map((look) => (
                    <button
                      key={look.value}
                      onClick={() => onCardColorChange(look.value)}
                      className={`h-12 rounded-2xl border border-black ${look.swatch} ${cardColor === look.value ? "ring-2 ring-[#d7ff5f] ring-offset-2" : ""}`}
                      aria-label={look.label}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <h4 className="mb-3 text-sm font-black text-black">Why Visa Limit Card</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: ShieldCheck, label: "KYC secured" },
                    { icon: Zap, label: "Fast transfers" },
                    { icon: QrCode, label: "Scan to send" },
                    { icon: CreditCard, label: "Card looks" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="rounded-xl border border-black/15 bg-[#f7f7f4] p-3">
                        <Icon className="mb-2 h-4 w-4 text-black" />
                        <p className="text-[11px] font-black text-black">{item.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-black" />
                    <p className="text-sm font-black text-black">Card details</p>
                  </div>
                  <button onClick={() => setShowCardDetails(!showCardDetails)} className="rounded-xl bg-slate-100 px-3 py-1.5 text-[10px] font-black text-black">
                    {showCardDetails ? "Hide" : "View"}
                  </button>
                </div>
                {activeCard ? (
                  <div className="space-y-2 rounded-2xl bg-[#f7f7f4] p-3 font-mono text-xs font-black text-black">
                    <div className="flex justify-between gap-3"><span className="text-slate-500">Number</span><span>{showCardDetails ? activeCard.card_number : `**** **** **** ${activeCard.card_number.slice(-4)}`}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-slate-500">Expiry</span><span>{showCardDetails ? activeCard.expiry : "**/**"}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-slate-500">CVV</span><span>{showCardDetails ? virtualCvv : "***"}</span></div>
                    <div className="flex justify-between gap-3"><span className="text-slate-500">Holder</span><span className="truncate">{activeCard.card_holder}</span></div>
                  </div>
                ) : (
                  <p className="text-xs font-bold text-slate-500">No card available yet.</p>
                )}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f7f7f4] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <KeyRound className="h-4 w-4 text-black" />
                  <p className="text-sm font-black text-black">Financial security</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { icon: KeyRound, label: "Change wallet password", note: "Password reset opens from Supabase email flow" },
                    { icon: Smartphone, label: "Trusted device session", note: "Stay logged in on this device" },
                    { icon: Gauge, label: "Transaction controls", note: "Limits, card privacy, and KYC controls" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        onClick={() => setPasswordMessage(item.note)}
                        className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-3 text-left"
                      >
                        <Icon className="h-4 w-4 text-black" />
                        <div>
                          <p className="text-xs font-black text-black">{item.label}</p>
                          <p className="text-[10px] font-bold text-slate-500">{item.note}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {passwordMessage && <p className="mt-2 text-xs font-bold text-slate-600">{passwordMessage}</p>}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f7f7f4] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-black" />
                    <p className="text-sm font-black text-black">KYC submission</p>
                  </div>
                  <span className="rounded-full bg-black px-2 py-1 text-[10px] font-black uppercase text-white">{kycStatus.replace("_", " ")}</span>
                </div>
                <input
                  value={kycDocument}
                  onChange={(e) => setKycDocument(e.target.value)}
                  placeholder="Paste document link or ID reference"
                  className="mb-3 w-full rounded-xl border border-black bg-white px-3 py-2 text-xs font-bold text-black outline-none"
                />
                <label className="mb-3 flex cursor-pointer items-center justify-center rounded-xl border border-black bg-white px-3 py-2 text-xs font-black text-black">
                  Upload or capture document
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setKycDocument(`Uploaded: ${file.name}`);
                    }}
                  />
                </label>
                <button onClick={submitKyc} className="w-full rounded-xl border border-black bg-[#d7ff5f] py-2 text-xs font-black text-black shadow-[3px_3px_0_#000]">
                  Submit KYC for review
                </button>
                {kycMessage && <p className="mt-2 text-xs font-bold text-slate-600">{kycMessage}</p>}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => { onSend(); onClose(); }}
                  className="p-3 rounded-xl bg-blue-50 text-blue-700 text-sm font-bold text-left hover:bg-blue-100 transition-colors"
                >
                  <Send className="w-4 h-4 inline mr-1" />
                  Send Money
                </button>
                <button
                  onClick={() => { onAddCard(); onClose(); }}
                  className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold text-left hover:bg-emerald-100 transition-colors"
                >
                  <PlusCircle className="w-4 h-4 inline mr-1" />
                  Add Card
                </button>
                <button
                  onClick={() => { onOpenShare(); }}
                  className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-sm font-bold text-left hover:bg-emerald-100 transition-colors"
                >
                  <Share2 className="w-4 h-4 inline mr-1" />
                  Share & Earn
                </button>
                <button
                  onClick={onLogout}
                  className="p-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-bold text-left hover:bg-slate-200 transition-colors"
                >
                  <LogOut className="w-4 h-4 inline mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
