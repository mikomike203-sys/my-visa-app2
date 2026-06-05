import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, BadgeCheck, BellOff, X } from "lucide-react";
import type { Currency } from "../utils/currency";
import { formatMoney } from "../utils/currency";
import type { Transaction } from "../types/database";

interface Props {
  open: boolean;
  currency: Currency;
  transactions: Transaction[];
  kycStatus: "pending" | "verified" | "rejected" | "not_submitted";
  onClose: () => void;
}

export function NotificationSheet({ open, currency, transactions, kycStatus, onClose }: Props) {
  const recent = transactions.slice(0, 8);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40" onClick={onClose} />
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative w-full max-w-md bg-white rounded-t-3xl max-h-[82vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1 rounded-full bg-slate-200" /></div>
            <div className="flex items-center justify-between px-6 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-black">Notifications</h2>
                <p className="text-xs text-slate-500">Money movement, KYC, and card alerts</p>
              </div>
              <motion.button whileTap={{ scale: 0.86 }} onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                <X className="w-4 h-4 text-black" strokeWidth={2.8} />
              </motion.button>
            </div>
            <div className="px-6 pb-8 overflow-y-auto space-y-3">
              {kycStatus !== "not_submitted" && (
                <div className="rounded-2xl border border-black bg-[#d7ff5f] p-4">
                  <BadgeCheck className="mb-2 h-5 w-5 text-black" />
                  <p className="text-sm font-black text-black">KYC status: {kycStatus.replace("_", " ")}</p>
                  <p className="text-xs font-bold text-black/70">Admin review updates appear here.</p>
                </div>
              )}
              {recent.length === 0 ? (
                <div className="rounded-3xl border border-black bg-[#f7f7f4] p-8 text-center shadow-[5px_5px_0_#000]">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-black bg-[#d7ff5f]">
                    <BellOff className="h-7 w-7 text-black" />
                  </div>
                  <h3 className="text-base font-black text-black">No notifications yet</h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-zinc-600">You will see real wallet alerts here after transfers, top ups, KYC reviews, and card changes.</p>
                </div>
              ) : (
                recent.map((tx) => {
                  const incoming = tx.type === "receive" || tx.type === "topup";
                  const Icon = incoming ? ArrowDownLeft : ArrowUpRight;
                  return (
                    <div key={tx.id} className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${incoming ? "bg-emerald-50" : "bg-red-50"}`}>
                        <Icon className="h-5 w-5 text-black" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-black">{tx.description || tx.type}</p>
                        <p className="text-xs font-bold text-slate-500">{new Date(tx.created_at).toLocaleString()}</p>
                      </div>
                      <p className={`text-sm font-black ${incoming ? "text-emerald-600" : "text-red-500"}`}>
                        {incoming ? "+" : "-"}{formatMoney(tx.amount, currency)}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
