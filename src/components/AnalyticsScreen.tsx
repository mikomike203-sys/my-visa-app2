import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, ArrowDownLeft, CreditCard, Wallet, Bell, Headphones } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Currency, formatMoney } from "../utils/currency";

const weeklyData = [
  { day: "Mon", income: 4200, expense: 1800 },
  { day: "Tue", income: 3100, expense: 2400 },
  { day: "Wed", income: 5600, expense: 1200 },
  { day: "Thu", income: 2800, expense: 3200 },
  { day: "Fri", income: 6400, expense: 2100 },
  { day: "Sat", income: 1900, expense: 4500 },
  { day: "Sun", income: 3700, expense: 1600 },
];

const monthlyData = [
  { month: "Sep", amount: 12400 },
  { month: "Oct", amount: 18200 },
  { month: "Nov", amount: 15800 },
  { month: "Dec", amount: 22100 },
  { month: "Jan", amount: 19400 },
  { month: "Feb", amount: 24800 },
];

const stats = [
  { label: "Total Income", value: 27700, change: "+18.2%", tone: "text-emerald-600 bg-emerald-50", icon: ArrowDownLeft },
  { label: "Total Expenses", value: 16800, change: "-4.5%", tone: "text-red-500 bg-red-50", icon: ArrowUpRight },
  { label: "Net Savings", value: 10900, change: "+32.1%", tone: "text-blue-700 bg-blue-50", icon: TrendingUp },
];

const topCategories = [
  { name: "Shopping", amount: 4820, percent: 35 },
  { name: "Food & Drink", amount: 2340, percent: 25 },
  { name: "Entertainment", amount: 1680, percent: 18 },
  { name: "Utilities", amount: 1245, percent: 13 },
  { name: "Transport", amount: 715, percent: 9 },
];

interface Props {
  currency: Currency;
  onNotifications: () => void;
}

export function AnalyticsScreen({ currency, onNotifications }: Props) {
  return (
    <div className="flex-1 overflow-y-auto pb-44 bg-white">
      <div className="px-4 min-[390px]:px-6 pt-6 pb-5 flex items-center justify-between">
        <div>
          <p className="text-xs text-blue-600 font-extrabold">Insights</p>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Analytics</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center" style={{ boxShadow: "0 3px 10px rgba(0,0,0,0.06)" }}>
            <Headphones className="w-4 h-4 text-black" strokeWidth={2.7} />
          </div>
          <div className="relative">
            <button onClick={onNotifications} className="w-10 h-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center" style={{ boxShadow: "0 3px 10px rgba(0,0,0,0.06)" }}>
              <Bell className="w-4 h-4 text-black" strokeWidth={2.7} />
            </button>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-black rounded-full border-2 border-slate-50" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 min-[390px]:px-6 mb-6 space-y-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.35 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-100"
              style={{ boxShadow: "0 10px 28px rgba(15,23,42,0.07), inset 0 1px 1px rgba(255,255,255,0.8)" }}
            >
              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0" style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
                <Icon className="w-5 h-5 text-black" strokeWidth={2.7} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{stat.label}</p>
                <p className="text-lg font-extrabold text-slate-900">{formatMoney(stat.value, currency, { minimumFractionDigits: 0 })}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${stat.tone}`}>
                {stat.change}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Weekly Chart */}
      <div className="px-4 min-[390px]:px-6 mb-6">
        <div className="p-4 rounded-2xl bg-white border border-blue-100" style={{ boxShadow: "0 12px 32px rgba(37,99,235,0.09), inset 0 1px 1px rgba(255,255,255,0.8)" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Weekly Overview</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[10px] text-slate-400">Income</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-[10px] text-slate-400">Expense</span></div>
            </div>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barGap={4}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", fontSize: 12 }}
                  formatter={(value: number) => [formatMoney(value, currency, { minimumFractionDigits: 0 }), ""]}
                />
                <Bar dataKey="income" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expense" fill="#f87171" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="px-4 min-[390px]:px-6 mb-6">
        <div className="p-4 rounded-2xl bg-gradient-to-b from-blue-50 to-white border border-blue-100" style={{ boxShadow: "0 12px 32px rgba(37,99,235,0.1), inset 0 1px 1px rgba(255,255,255,0.9)" }}>
          <h3 className="text-sm font-bold text-slate-800 mb-4">Monthly Trend</h3>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#94a3b8" }} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", fontSize: 12 }}
                  formatter={(value: number) => [formatMoney(value, currency, { minimumFractionDigits: 0 }), ""]}
                />
                <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} fill="url(#colorAmount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Categories */}
      <div className="px-4 min-[390px]:px-6 mb-6">
        <div className="p-4 rounded-2xl bg-white border border-slate-100" style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.8)" }}>
          <h3 className="text-sm font-bold text-slate-800 mb-4">Top Categories</h3>
          <div className="space-y-3">
            {topCategories.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-700">{cat.name}</span>
                  <span className="text-xs font-bold text-slate-900">{formatMoney(cat.amount, currency, { minimumFractionDigits: 0 })}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden" style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.06)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.percent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-400"
                    style={{ boxShadow: "0 0 10px rgba(37,99,235,0.22)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
