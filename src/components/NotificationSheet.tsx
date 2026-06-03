import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, CheckCircle2, Clock, X } from "lucide-react";
import type { Currency } from "../utils/currency";
import { formatMoney } from "../utils/currency";

interface Props {
  open: boolean;
  currency: Currency;
  onClose: () => void;
}

const notifications = [
  { id: 1, type: "in", name: "Freelance Payment", person: "Mika Studio", amount: 850, time: "2 min ago", source: "Bank transfer" },
  { id: 2, type: "out", name: "Amazon.com", person: "Online purchase", amount: 89.71, time: "24 min ago", source: "Visa card" },
  { id: 3, type: "out", name: "Starbucks", person: "Food & Drink", amount: 6.4, time: "1 hr ago", source: "Tap to pay" },
  { id: 4, type: "in", name: "Refund", person: "Temu.com", amount: 30.45, time: "Yesterday", source: "Merchant refund" },
];

export function NotificationSheet({ open, currency, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-end justify-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40" onClick={onClose} />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="relative w-full max-w-md bg-white rounded-t-3xl max-h-[82vh] overflow-hidden flex flex-col"
            style={{ boxShadow: "0 -12px 46px rgba(15,23,42,0.2)" }}
          >
            <div className="flex justify-center pt-3 pb-2"><div className="w-10 h-1 rounded-full bg-slate-200" /></div>
            <div className="flex items-center justify-between px-6 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-black">Notifications</h2>
                <p className="text-xs text-slate-500">Money movement and card alerts</p>
              </div>
              <motion.button whileTap={{ scale: 0.86 }} onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                <X className="w-4 h-4 text-black" strokeWidth={2.8} />
              </motion.button>
            </div>
            <div className="px-6 pb-8 overflow-y-auto space-y-3">
              {notifications.map((item, index) => {
                const incoming = item.type === "in";
                const Icon = incoming ? ArrowDownLeft : ArrowUpRight;
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06 }}
                    className="p-4 rounded-2xl bg-white border border-slate-100 flex gap-3"
                    style={{ boxShadow: "0 8px 24px rgba(15,23,42,0.06)" }}
                  >
                    <div className={`w-11 h-11 rounded-2xl ${incoming ? "bg-emerald-50" : "bg-red-50"} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5 text-black" strokeWidth={2.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-extrabold text-black truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-500">{item.person}</p>
                        </div>
                        <p className={`text-sm font-extrabold whitespace-nowrap ${incoming ? "text-emerald-600" : "text-red-500"}`}>
                          {incoming ? "+" : "-"}{formatMoney(item.amount, currency)}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-3 text-[10px] text-slate-500 font-bold">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                          <CheckCircle2 className="w-3 h-3 text-black" strokeWidth={2.6} /> {item.source}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
                          <Clock className="w-3 h-3 text-black" strokeWidth={2.6} /> {item.time}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
