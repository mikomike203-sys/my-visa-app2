import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, ArrowDownLeft, Bell, Headphones, ReceiptText } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Currency, formatMoney } from "../utils/currency";
import type { Transaction } from "../types/database";

interface Props {
  currency: Currency;
  transactions: Transaction[];
  onNotifications: () => void;
}

export function AnalyticsScreen({ currency, transactions, onNotifications }: Props) {
  const income = transactions.filter((t) => t.type === "receive" || t.type === "topup").reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions.filter((t) => t.type === "send" || t.type === "withdraw" || t.type === "payment").reduce((sum, t) => sum + t.amount, 0);
  const net = income - expenses;

  const byDay = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toLocaleDateString();
    const dayTx = transactions.filter((t) => new Date(t.created_at).toLocaleDateString() === key);
    return {
      day: date.toLocaleDateString(undefined, { weekday: "short" }),
      income: dayTx.filter((t) => t.type === "receive" || t.type === "topup").reduce((sum, t) => sum + t.amount, 0),
      expense: dayTx.filter((t) => t.type === "send" || t.type === "withdraw" || t.type === "payment").reduce((sum, t) => sum + t.amount, 0),
    };
  });

  const stats = [
    { label: "Total Income", value: income, tone: "text-emerald-600 bg-emerald-50", icon: ArrowDownLeft },
    { label: "Total Expenses", value: expenses, tone: "text-red-500 bg-red-50", icon: ArrowUpRight },
    { label: "Net Savings", value: net, tone: "text-blue-700 bg-blue-50", icon: TrendingUp },
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-44 bg-white">
      <div className="px-4 min-[390px]:px-6 pt-6 pb-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-blue-600 font-extrabold">Live insights</p>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Analytics</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
            <Headphones className="w-4 h-4 text-black" strokeWidth={2.7} />
          </div>
          <button onClick={onNotifications} className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
            <Bell className="w-4 h-4 text-black" strokeWidth={2.7} />
          </button>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="mx-4 min-[390px]:mx-6 rounded-3xl border border-black bg-[#f7f7f4] p-8 text-center shadow-[6px_6px_0_#000]">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-black bg-[#d7ff5f]">
            <ReceiptText className="h-7 w-7 text-black" />
          </div>
          <h2 className="text-lg font-black text-black">No analytics yet</h2>
          <p className="mt-2 text-sm font-medium leading-6 text-zinc-600">Send, receive, or top up your wallet and this page will build real charts from your transactions.</p>
        </div>
      ) : (
        <>
          <div className="px-4 min-[390px]:px-6 mb-6 space-y-3">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-black" strokeWidth={2.7} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{stat.label}</p>
                    <p className="text-lg font-extrabold text-slate-900">{formatMoney(stat.value, currency, { minimumFractionDigits: 0 })}</p>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${stat.tone}`}>Live</span>
                </motion.div>
              );
            })}
          </div>

          <div className="px-4 min-[390px]:px-6 mb-6">
            <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Last 7 Days</h3>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byDay} barGap={4}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                    <YAxis hide />
                    <Tooltip formatter={(value: any) => [formatMoney(Number(value), currency, { minimumFractionDigits: 0 }), ""]} />
                    <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="expense" fill="#f87171" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
