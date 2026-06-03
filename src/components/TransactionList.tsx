import { ArrowDownLeft, Coffee, ShoppingBag, Zap, Film } from "lucide-react";
import { Transaction } from "../types/card";

const transactions: Transaction[] = [
  { id: 1, merchant: "Starbucks", category: "Food & Drink", amount: -5.40, date: "Today, 9:42 AM", icon: "coffee" },
  { id: 2, merchant: "Amazon", category: "Shopping", amount: -89.99, date: "Today, 8:15 AM", icon: "shopping" },
  { id: 3, merchant: "Salary Deposit", category: "Income", amount: 4500.00, date: "Yesterday", icon: "income" },
  { id: 4, merchant: "Netflix", category: "Entertainment", amount: -15.99, date: "Yesterday", icon: "entertainment" },
  { id: 5, merchant: "Electric Bill", category: "Utilities", amount: -124.50, date: "Jan 15", icon: "utilities" },
  { id: 6, merchant: "Freelance Payment", category: "Income", amount: 850.00, date: "Jan 14", icon: "income" },
];

const iconMap: Record<string, React.ElementType> = {
  coffee: Coffee,
  shopping: ShoppingBag,
  income: ArrowDownLeft,
  entertainment: Film,
  utilities: Zap,
};

const iconBgMap: Record<string, { bg: string; text: string }> = {
  coffee: { bg: "bg-slate-100", text: "text-black" },
  shopping: { bg: "bg-slate-100", text: "text-black" },
  income: { bg: "bg-slate-100", text: "text-black" },
  entertainment: { bg: "bg-slate-100", text: "text-black" },
  utilities: { bg: "bg-slate-100", text: "text-black" },
};

export function TransactionList() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-800">Recent Transactions</h3>
        <button className="text-xs font-semibold text-black transition-colors">
          View all
        </button>
      </div>
      <div className="divide-y divide-slate-50">
        {transactions.map((tx) => {
          const Icon = iconMap[tx.icon] || ArrowDownLeft;
          const colors = iconBgMap[tx.icon] || { bg: "bg-slate-50", text: "text-slate-600" };
          const isPositive = tx.amount > 0;
          return (
            <div key={tx.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/50 transition-colors">
              <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-5 h-5 ${colors.text}`} strokeWidth={2.7} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-700 truncate">{tx.merchant}</p>
                <p className="text-xs text-slate-400">{tx.category} · {tx.date}</p>
              </div>
              <p className="text-sm font-bold text-slate-800">
                {isPositive ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
