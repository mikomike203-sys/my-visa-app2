import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Headphones, ArrowUpRight, Plus, Send, Download, X, Check } from "lucide-react";
import { TransactionIcon } from "./TransactionIcon";
import type { IconName } from "./icons/FintechIcons";
import { AnimatedAmount } from "./AnimatedAmount";
import { Currency, formatMoney } from "../utils/currency";

interface TxItem {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
  icon: IconName;
}

const todayTx: TxItem[] = [
  { id: 1, name: "Amazon.com", category: "Shopping", amount: -89.71, date: "Today", icon: "shopping" },
  { id: 2, name: "Temu.com", category: "Shopping", amount: -30.45, date: "Today", icon: "shopping" },
];
const yesterdayTx: TxItem[] = [
  { id: 3, name: "Apple Music", category: "Subscription", amount: -14.99, date: "Yesterday", icon: "subscription" },
  { id: 4, name: "Starbucks", category: "Food & Drink", amount: -6.40, date: "Yesterday", icon: "restaurant" },
  { id: 5, name: "Electric Bill", category: "Utilities", amount: -124.50, date: "Yesterday", icon: "utilities" },
  { id: 6, name: "Freelance Payment", category: "Income", amount: 850.0, date: "Yesterday", icon: "income" },
];

interface Props {
  currency: Currency;
  hideBalance: boolean;
  onSend: () => void;
  onReceive: () => void;
  onNotifications: () => void;
}

export function WalletScreen({ currency, hideBalance, onSend, onReceive, onNotifications }: Props) {
  const totalBalance = 248967.83;
  const paymentNext = 43093.0;
  const paymentCompleted = 274825.01;
  const todayUsed = 614.93;
  const [todayLimit, setTodayLimit] = useState(43093);
  const [draftLimit, setDraftLimit] = useState(43093);
  const [showLimits, setShowLimits] = useState(false);
  const limitPercent = (todayUsed / todayLimit) * 100;
  const limitPresets = [5000, 10000, 25000, 50000];

  const openLimitEditor = () => {
    setDraftLimit(todayLimit);
    setShowLimits(true);
  };

  const saveLimit = () => {
    setTodayLimit(draftLimit);
    setShowLimits(false);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-44 bg-white">
      {/* Header */}
      <div className="px-4 min-[390px]:px-6 pt-6 pb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 font-medium">My Wallet</p>
          <h1 className="text-2xl font-extrabold text-black tracking-tight">Total Balance</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center cursor-pointer">
            <Headphones className="w-[18px] h-[18px] text-black" strokeWidth={2.5} />
          </div>
          <div className="relative">
            <button onClick={onNotifications} className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center cursor-pointer">
              <Bell className="w-[18px] h-[18px] text-black" strokeWidth={2.5} />
            </button>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-black rounded-full border-2 border-white" />
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="px-4 min-[390px]:px-6 mb-6">
        <h2 className="text-4xl font-extrabold tracking-tight text-black mb-1">
          {hideBalance ? "******" : <AnimatedAmount value={totalBalance} currency={currency} />}
        </h2>
        <p className="text-xs text-emerald-600 font-bold">+12.4% from last month</p>

        {/* Quick action buttons */}
        <div className="mt-5 flex gap-2.5">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onSend}
            className="flex-1 py-3.5 rounded-2xl bg-blue-600 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <Send className="w-4 h-4" strokeWidth={2.8} /> Send
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onReceive}
            className="flex-1 py-3.5 rounded-2xl bg-white border border-blue-200 text-blue-700 text-xs font-extrabold flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" strokeWidth={2.8} /> Receive
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            className="w-12 py-3.5 rounded-2xl bg-blue-50 flex items-center justify-center"
          >
            <Plus className="w-4 h-4 text-black" strokeWidth={3} />
          </motion.button>
        </div>
      </div>

      {/* Two Status Cards (B&W) */}
      <div className="px-4 min-[390px]:px-6 mb-5 flex gap-3">
        <motion.div
          whileTap={{ scale: 0.97 }}
          className="flex-1 p-4 rounded-2xl bg-blue-600 text-white cursor-pointer shadow-xl shadow-blue-600/20"
        >
          <p className="text-[10px] uppercase tracking-wider text-white/60 mb-1 font-bold">Payment Next</p>
          <p className="text-lg font-extrabold">{hideBalance ? "******" : formatMoney(paymentNext, currency)}</p>
        </motion.div>
        <motion.div
          whileTap={{ scale: 0.97 }}
          className="flex-1 p-4 rounded-2xl bg-white border border-slate-200 cursor-pointer"
        >
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 font-bold">Completed</p>
          <p className="text-lg font-extrabold text-black">{hideBalance ? "******" : formatMoney(paymentCompleted, currency, { minimumFractionDigits: 0 })}</p>
        </motion.div>
      </div>

      {/* Card Limits */}
      <div className="px-4 min-[390px]:px-6 mb-6">
        <div className="p-4 rounded-2xl bg-white border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-extrabold text-black">Spending Limit</h3>
            <button onClick={openLimitEditor} className="flex items-center gap-1 text-[11px] font-bold text-blue-700">
              Set limits <ArrowUpRight className="w-3 h-3" strokeWidth={2.8} />
            </button>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(limitPercent, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-blue-700"
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              <span className="font-extrabold text-black">{formatMoney(todayUsed, currency)}</span> / {formatMoney(todayLimit, currency)}
            </p>
            <p className="text-[10px] text-black font-extrabold">{Math.min(limitPercent, 100).toFixed(1)}% used</p>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-4 min-[390px]:px-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-black">Transactions</h3>
          <button className="text-[11px] font-bold text-black">View all</button>
        </div>

        {/* Today */}
        <div className="mb-5">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5">Today</p>
          <div className="space-y-2">
            {todayTx.map((tx) => {
              const isPositive = tx.amount > 0;
              return (
                <motion.div
                  key={tx.id}
                  whileTap={{ scale: 0.98, y: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 cursor-pointer"
                >
                  <TransactionIcon icon={tx.icon} size={20} color="#000000" bg="bg-slate-100" strokeWidth={2.4} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-black">{tx.name}</p>
                    <p className="text-[10px] text-slate-500">{tx.category}</p>
                  </div>
                  <p className={`text-sm font-extrabold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
                    {isPositive ? "+" : "-"}{formatMoney(Math.abs(tx.amount), currency)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Yesterday */}
        <div className="mb-5">
          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2.5">Yesterday</p>
          <div className="space-y-2">
            {yesterdayTx.map((tx) => {
              const isPositive = tx.amount > 0;
              return (
                <motion.div
                  key={tx.id}
                  whileTap={{ scale: 0.98, y: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 cursor-pointer"
                >
                  <TransactionIcon icon={tx.icon} size={20} color="#000000" bg="bg-slate-100" strokeWidth={2.4} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-black">{tx.name}</p>
                    <p className="text-[10px] text-slate-500">{tx.category}</p>
                  </div>
                  <p className={`text-sm font-extrabold ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
                    {isPositive ? "+" : "-"}{formatMoney(Math.abs(tx.amount), currency)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showLimits && (
          <div className="fixed inset-0 z-[120] flex items-end justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/35" onClick={() => setShowLimits(false)} />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full max-w-[430px] rounded-t-3xl bg-white p-4 min-[390px]:p-6"
              style={{ boxShadow: "0 -12px 44px rgba(15,23,42,0.18)" }}
            >
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-extrabold text-black">Set spending limit</h3>
                  <p className="text-xs text-slate-500">Control card usage for today</p>
                </div>
                <button onClick={() => setShowLimits(false)} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                  <X className="w-4 h-4 text-black" strokeWidth={2.8} />
                </button>
              </div>

              <div className="rounded-3xl bg-blue-50 border border-blue-100 p-5 mb-4">
                <p className="text-[10px] uppercase tracking-wider text-blue-700 font-extrabold mb-1">New limit</p>
                <p className="text-3xl font-extrabold text-black mb-4">{formatMoney(draftLimit, currency, { minimumFractionDigits: 0 })}</p>
                <input
                  type="range"
                  min={1000}
                  max={100000}
                  step={1000}
                  value={draftLimit}
                  onChange={(e) => setDraftLimit(Number(e.target.value))}
                  className="w-full h-2 rounded-full accent-blue-600"
                />
                <div className="flex justify-between mt-2 text-[10px] text-slate-500 font-bold">
                  <span>{formatMoney(1000, currency, { minimumFractionDigits: 0 })}</span>
                  <span>{formatMoney(100000, currency, { minimumFractionDigits: 0 })}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 min-[390px]:grid-cols-4 gap-2 mb-5">
                {limitPresets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setDraftLimit(preset)}
                    className={`py-2.5 rounded-xl text-xs font-extrabold border ${
                      draftLimit === preset ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-200"
                    }`}
                  >
                    {formatMoney(preset, currency, { minimumFractionDigits: 0 })}
                  </button>
                ))}
              </div>

              <motion.button whileTap={{ scale: 0.97 }} onClick={saveLimit} className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20">
                <Check className="w-4 h-4" strokeWidth={2.8} /> Save limit
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

