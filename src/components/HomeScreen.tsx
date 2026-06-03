import { motion } from "framer-motion";
import { Bell, Headphones, Plus, ArrowUpRight, ChevronRight, Send, Download } from "lucide-react";
import { Card3D } from "./Card3D";
import type { CardColor, CardPattern } from "./Card3D";
import { TransactionIcon } from "./TransactionIcon";
import type { IconName } from "./icons/FintechIcons";
import { Currency, formatMoney } from "../utils/currency";

const quickActions: { icon: IconName; label: string; action?: string }[] = [
  { icon: "send", label: "Send", action: "send" },
  { icon: "receive", label: "Receive", action: "receive" },
  { icon: "wallet", label: "Top Up" },
  { icon: "bills", label: "Bills" },
];

interface TxItem {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
  icon: IconName;
}

const recentTx: TxItem[] = [
  { id: 1, name: "Amazon.com", category: "Shopping", amount: -89.71, date: "Today, 2:14 PM", icon: "shopping" },
  { id: 2, name: "Starbucks", category: "Food & Drink", amount: -6.40, date: "Today, 9:42 AM", icon: "restaurant" },
  { id: 3, name: "Salary Deposit", category: "Income", amount: 4500.0, date: "Yesterday", icon: "income" },
  { id: 4, name: "Netflix", category: "Entertainment", amount: -15.99, date: "Yesterday", icon: "streaming" },
];

const features: { icon: IconName; title: string; desc: string }[] = [
  { icon: "card", title: "Bank-Grade Security", desc: "256-bit encryption protects every transaction" },
  { icon: "recurring", title: "Instant Transfers", desc: "Send money anywhere in seconds" },
  { icon: "coins", title: "Cashback Rewards", desc: "Earn up to 5% on every purchase" },
];

interface Props {
  currency: Currency;
  cardColor: CardColor;
  cardPattern: CardPattern;
  hideBalance: boolean;
  onSend: () => void;
  onReceive: () => void;
  onAddCard: () => void;
  onNotifications: () => void;
}

export function HomeScreen({ currency, cardColor, cardPattern, hideBalance, onSend, onReceive, onAddCard, onNotifications }: Props) {
  return (
    <div className="pb-44 bg-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight">Sarah Mitchell</h1>
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

      {/* 3D Card (black/grey/silver) */}
      <div className="home-card-wrap px-4 min-[390px]:px-6 mb-5">
        <Card3D colorTheme={cardColor} patternTheme={cardPattern} balance={hideBalance ? "******" : undefined} />
      </div>

      {/* Add Card button only */}
      <div className="px-4 min-[390px]:px-6 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-black uppercase tracking-wider">My Cards</h3>
          <span className="text-[10px] font-semibold text-slate-400">Tap to manage</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onAddCard}
          className="relative mx-auto h-[42px] px-4 rounded-xl bg-[#020304] text-white flex items-center justify-center gap-2.5 cursor-pointer overflow-hidden shadow-[0_10px_24px_rgba(2,3,4,0.22)]"
          animate={{ boxShadow: ["0 0 0 rgba(2,3,4,0)", "0 0 28px rgba(2,3,4,0.34)", "0 0 0 rgba(2,3,4,0)"] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute inset-y-[-35%] -left-[55%] w-[58%] rotate-12 bg-white/28 blur-[5px]"
            animate={{ left: ["-55%", "120%"] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative w-7 h-7 rounded-lg bg-white/12 flex items-center justify-center">
            <Plus className="w-4 h-4 text-white" strokeWidth={3.2} />
          </div>
          <span className="relative text-xs font-extrabold">Add a Card</span>
        </motion.button>
      </div>

      {/* Quick Actions (B&W) */}
      <div className="quick-actions px-4 min-[390px]:px-6 mb-6">
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <motion.button
              key={action.label}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                if (action.action === "send") onSend();
                else if (action.action === "receive") onReceive();
                else if (action.action === "addCard") onAddCard();
              }}
              className="flex flex-col items-center gap-2 py-3.5 px-2 rounded-2xl bg-white border border-slate-200 cursor-pointer select-none hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <TransactionIcon icon={action.icon} size={22} color="#000000" />
              <span className="text-[11px] font-bold text-black">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quick action row with Send/Receive (B&W) */}
      <div className="px-6 mb-6 flex gap-2.5">
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
          onClick={onAddCard}
          className="w-12 py-3.5 rounded-2xl bg-blue-50 flex items-center justify-center"
        >
          <Plus className="w-4 h-4 text-black" strokeWidth={3} />
        </motion.button>
      </div>

      {/* Recent Transactions */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-black">Recent Transactions</h3>
          <button className="text-[11px] font-bold text-black inline-flex items-center gap-0.5">
            View all <ArrowUpRight className="w-3 h-3" strokeWidth={2.8} />
          </button>
        </div>
        <div className="space-y-2.5">
          {recentTx.map((tx) => {
            const isPositive = tx.amount > 0;
            return (
              <motion.div
                key={tx.id}
                whileTap={{ scale: 0.98, y: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 cursor-pointer"
              >
                <TransactionIcon icon={tx.icon} size={20} color="#000000" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-black truncate">
                    {tx.name}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {tx.category} - {tx.date}
                  </p>
                </div>
                <p
                  className={`text-sm font-extrabold ${isPositive ? "text-emerald-600" : "text-red-500"}`}
                >
                  {isPositive ? "+" : "-"}{formatMoney(Math.abs(tx.amount), currency)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Features */}
      <div className="px-6 mb-6">
        <h3 className="text-sm font-extrabold text-black mb-4">Why Visa Limit Card</h3>
        <div className="space-y-3">
          {features.map((feat) => (
            <motion.div
              key={feat.title}
              whileTap={{ scale: 0.98 }}
              className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200"
            >
              <TransactionIcon icon={feat.icon} size={22} color="#000000" />
              <div>
                <p className="text-sm font-extrabold text-black mb-0.5">
                  {feat.title}
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Explore all CTA */}
      <div className="px-6">
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full p-4 rounded-2xl bg-blue-600 text-white flex items-center justify-between shadow-xl shadow-blue-600/20"
        >
          <div className="text-left">
            <p className="text-sm font-extrabold">Explore all features</p>
            <p className="text-[11px] text-white/60 mt-0.5">Loans, investments, and more</p>
          </div>
          <ChevronRight className="w-5 h-5 text-white" strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  );
}



