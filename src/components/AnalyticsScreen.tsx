import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Bell, CircleDollarSign, Headphones, Landmark, ReceiptText, TrendingUp, WalletCards } from "lucide-react";
import { Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Currency, formatMoney } from "../utils/currency";
import type { Transaction } from "../types/database";
import { AnimatedAmount } from "./AnimatedAmount";

interface Props {
  currency: Currency;
  transactions: Transaction[];
  onNotifications: () => void;
}

const incomingTypes = new Set(["receive", "topup"]);
const spendingTypes = new Set(["send", "withdraw", "payment"]);
const categoryColors: Record<string, string> = {
  send: "#2563eb",
  receive: "#111827",
  topup: "#0ea5e9",
  withdraw: "#ef4444",
  payment: "#f59e0b",
};

function sumTransactions(transactions: Transaction[], types: Set<string>) {
  return transactions.filter((t) => types.has(t.type)).reduce((sum, t) => sum + Number(t.amount), 0);
}

export function AnalyticsScreen({ currency, transactions, onNotifications }: Props) {
  const income = sumTransactions(transactions, incomingTypes);
  const expenses = sumTransactions(transactions, spendingTypes);
  const net = income - expenses;
  const completed = transactions.filter((t) => t.status === "completed").length;
  const avgTransaction = transactions.length ? transactions.reduce((sum, t) => sum + Number(t.amount), 0) / transactions.length : 0;
  const savingsRate = income > 0 ? Math.max(0, Math.min(100, (net / income) * 100)) : 0;
  const biggest = transactions.slice().sort((a, b) => Number(b.amount) - Number(a.amount))[0];

  const byDay = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toLocaleDateString();
    const dayTx = transactions.filter((t) => new Date(t.created_at).toLocaleDateString() === key);
    return {
      day: date.toLocaleDateString(undefined, { weekday: "short" }),
      in: sumTransactions(dayTx, incomingTypes),
      out: sumTransactions(dayTx, spendingTypes),
    };
  });

  const categories = ["send", "receive", "topup", "withdraw", "payment"]
    .map((type) => ({
      name: type,
      value: transactions.filter((t) => t.type === type).reduce((sum, t) => sum + Number(t.amount), 0),
    }))
    .filter((item) => item.value > 0);

  const stats = [
    { label: "Inflow", value: income, icon: ArrowDownLeft, detail: `${transactions.filter((t) => incomingTypes.has(t.type)).length} incoming` },
    { label: "Outflow", value: expenses, icon: ArrowUpRight, detail: `${transactions.filter((t) => spendingTypes.has(t.type)).length} outgoing` },
    { label: "Net", value: net, icon: TrendingUp, detail: `${savingsRate.toFixed(0)}% retained` },
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-44 bg-white">
      <div className="px-4 min-[390px]:px-6 pt-6 pb-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-blue-600 font-extrabold">Live wallet intelligence</p>
          <h1 className="text-2xl font-extrabold text-black tracking-tight">Analytics</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
            <Headphones className="w-[18px] h-[18px] text-black" strokeWidth={2.6} />
          </div>
          <button onClick={onNotifications} className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
            <Bell className="w-[18px] h-[18px] text-black" strokeWidth={2.6} />
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
          <div className="px-4 min-[390px]:px-6 mb-5">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] border border-black bg-black p-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Net movement</p>
                  <p className="mt-2 font-mono text-3xl font-black tabular-nums">
                    <AnimatedAmount value={net} currency={currency} minimumFractionDigits={0} />
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white">
                  <Landmark className="h-6 w-6 text-black" />
                </div>
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15">
                <motion.div initial={{ width: 0 }} animate={{ width: `${savingsRate}%` }} transition={{ duration: 0.9 }} className="h-full rounded-full bg-white" />
              </div>
              <p className="mt-2 text-xs font-bold text-white/60">{savingsRate.toFixed(0)}% retained from total inflow</p>
            </motion.div>
          </div>

          <div className="px-4 min-[390px]:px-6 mb-5 grid grid-cols-3 gap-2.5">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }} className="rounded-2xl border border-slate-200 bg-white p-3">
                  <Icon className="mb-2 h-4 w-4 text-black" />
                  <p className="text-[10px] font-black uppercase text-slate-400">{stat.label}</p>
                  <p className="mt-1 truncate font-mono text-sm font-black tabular-nums text-black">{formatMoney(stat.value, currency, { minimumFractionDigits: 0 })}</p>
                  <p className="mt-1 truncate text-[10px] font-bold text-slate-500">{stat.detail}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="px-4 min-[390px]:px-6 mb-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-black">Last 7 days</h3>
                  <p className="text-xs font-bold text-slate-500">Inflow vs outflow</p>
                </div>
                <WalletCards className="h-5 w-5 text-black" />
              </div>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byDay} barGap={5}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#64748b", fontWeight: 700 }} />
                    <YAxis hide />
                    <Tooltip formatter={(value: any) => [formatMoney(Number(value), currency, { minimumFractionDigits: 0 }), ""]} cursor={{ fill: "rgba(37,99,235,0.06)" }} />
                    <Bar dataKey="in" fill="#111827" radius={[7, 7, 0, 0]} />
                    <Bar dataKey="out" fill="#2563eb" radius={[7, 7, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="px-4 min-[390px]:px-6 mb-5 grid grid-cols-2 gap-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <h3 className="text-sm font-black text-black">Breakdown</h3>
              <div className="mt-3 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categories} innerRadius={38} outerRadius={58} dataKey="value" stroke="none">
                      {categories.map((entry) => <Cell key={entry.name} fill={categoryColors[entry.name] || "#64748b"} />)}
                    </Pie>
                    <Tooltip formatter={(value: any) => [formatMoney(Number(value), currency, { minimumFractionDigits: 0 }), ""]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-3xl border border-black bg-[#f7f7f4] p-4">
              <CircleDollarSign className="mb-3 h-5 w-5 text-black" />
              <p className="text-[10px] font-black uppercase text-slate-500">Average transaction</p>
              <p className="mt-1 font-mono text-lg font-black text-black tabular-nums">{formatMoney(avgTransaction, currency, { minimumFractionDigits: 0 })}</p>
              <p className="mt-3 text-[10px] font-black uppercase text-slate-500">Completed</p>
              <p className="mt-1 text-sm font-black text-black">{completed} of {transactions.length}</p>
            </div>
          </div>

          <div className="px-4 min-[390px]:px-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-black text-black">Recent signals</h3>
                <ReceiptText className="h-4 w-4 text-black" />
              </div>
              <div className="space-y-2">
                {biggest && (
                  <div className="rounded-2xl bg-blue-50 p-3">
                    <p className="text-xs font-black text-blue-700">Largest movement</p>
                    <p className="mt-1 truncate text-sm font-bold text-black">{biggest.description || biggest.type}</p>
                    <p className="font-mono text-sm font-black text-black">{formatMoney(biggest.amount, currency, { minimumFractionDigits: 0 })}</p>
                  </div>
                )}
                {transactions.slice(0, 3).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between rounded-2xl border border-slate-100 p-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-black">{tx.description || tx.type}</p>
                      <p className="text-[10px] font-bold text-slate-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                    </div>
                    <p className="font-mono text-sm font-black text-black">{formatMoney(tx.amount, currency, { minimumFractionDigits: 0 })}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
