import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Bell, Headphones, Plus, ArrowUpRight, ChevronRight, Send, Download, LogOut, ReceiptText, RotateCcw, LockKeyhole } from "lucide-react";
import { Card3D } from "./Card3D";
import type { CardColor, CardPattern } from "./Card3D";
import { TransactionIcon } from "./TransactionIcon";
import type { IconName } from "./icons/FintechIcons";
import { Currency, formatMoney, toBaseCurrency } from "../utils/currency";
import type { Card, Transaction } from "../types/database";
import { AnimatedAmount } from "./AnimatedAmount";

const quickActions: { icon: IconName; label: string; action?: string }[] = [
  { icon: "send", label: "Send", action: "send" },
  { icon: "receive", label: "Receive", action: "receive" },
  { icon: "wallet", label: "Top Up" },
  { icon: "bills", label: "Withdraw" },
];

const labelForPerson = (name?: string | null, email?: string | null) => name || email?.split("@")[0] || "Visa user";

interface Props {
  currency: Currency;
  cardColor: CardColor;
  cardPattern: CardPattern;
  hideBalance: boolean;
  greeting: string;
  userCards: Card[];
  activeCardIndex: number;
  balance: number;
  fullName: string;
  email: string;
  avatarUrl: string;
  kycStatus: "pending" | "verified" | "rejected" | "not_submitted";
  transactions: Transaction[];
  onToggleFreeze: (cardId: string, frozen: boolean) => void;
  onCardChange: (index: number) => void;
  onSend: (recipient?: string) => void;
  onReceive: () => void;
  onTopUp: (amount: number, reference: string) => Promise<void>;
  onAddCard: () => void;
  onNotifications: () => void;
  onLogout: () => void;
}

export function HomeScreen({
  currency, cardColor, cardPattern, hideBalance, greeting, userCards,
  activeCardIndex, balance, fullName, email, avatarUrl, kycStatus, transactions,
  onSend, onReceive, onTopUp, onAddCard, onNotifications, onLogout
}: Props) {
  const [topUpError, setTopUpError] = useState("");
  const [showTopUp, setShowTopUp] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [receiptTx, setReceiptTx] = useState<Transaction | null>(null);
  const [withdrawMessage, setWithdrawMessage] = useState("");

  const startTopUp = () => {
    const displayAmount = Number(topUpAmount);
    const amountUsd = toBaseCurrency(displayAmount, currency);
    if (!Number.isFinite(displayAmount) || amountUsd < 5) {
      setTopUpError(`Top up must be at least ${formatMoney(5, currency)}.`);
      return;
    }
    fetch("/api/paystack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email || "wallet@visakenya.app",
        amountUsd,
        callbackUrl: window.location.origin,
        metadata: { kind: "wallet_topup" },
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not start transaction");
        sessionStorage.setItem("pendingTopupUsd", String(amountUsd));
        sessionStorage.setItem("pendingTopupReference", data.reference);
        setShowTopUp(false);
        setTopUpAmount("");
        setTopUpError("");
        window.location.href = data.authorizationUrl;
      })
      .catch((err) => setTopUpError(err.message || "Could not start transaction"));
  };

  const recentTx = transactions.slice(0, 5).map(t => ({
    id: t.id,
    name: t.type === "receive"
      ? `Confirmed you received from ${t.recipient_name || "someone"}`
      : t.type === "send"
        ? `Sent to ${t.recipient_name || "recipient"}`
        : t.description || t.type,
    subtitle: t.type === "receive"
      ? "Money received"
      : t.type === "send"
        ? "Money sent"
        : t.description || t.type,
    category: t.type,
    amount: t.type === "receive" || t.type === "topup" ? t.amount : -t.amount,
    date: new Date(t.created_at).toLocaleDateString(),
    icon: (t.type === "send" ? "send" : t.type === "receive" ? "income" : t.type === "payment" ? "shopping" : "card") as IconName,
    avatarUrl: t.recipient_avatar_url,
    person: labelForPerson(t.recipient_name, t.recipient_email),
  }));
  const previousRecipients = Array.from(new Map(
    transactions
      .filter((t) => t.type === "send" && (t.recipient_email || t.recipient_name))
      .map((t) => [t.recipient_email || t.recipient_name || t.id, t])
  ).values()).slice(0, 6);

  const downloadReceipt = (tx: Transaction) => {
    const content = [
      "Visa Kenya Receipt",
      `Transaction: ${tx.id}`,
      `Type: ${tx.type}`,
      `Amount: ${formatMoney(tx.amount, currency)}`,
      `Description: ${tx.description || "N/A"}`,
      `Recipient: ${labelForPerson(tx.recipient_name, tx.recipient_email)}`,
      `Date: ${new Date(tx.created_at).toLocaleString()}`,
      `Status: ${tx.status}`,
    ].join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `visa-kenya-receipt-${tx.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pb-44 bg-white">
      {/* Header */}
      <div className="px-6 pt-6 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight">{greeting}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{fullName}</p>
        </div>
        <div className="flex items-center gap-2.5">
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} className="h-10 w-10 rounded-2xl border border-black object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-2xl border border-black bg-[#d7ff5f] flex items-center justify-center text-sm font-black text-black">{fullName.charAt(0) || "V"}</div>
          )}
          <button onClick={onLogout} className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-red-50 hover:border-red-200 transition-colors">
            <LogOut className="w-[18px] h-[18px] text-slate-600" strokeWidth={2.5} />
          </button>
          <div className="relative">
            <button onClick={onNotifications} className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center cursor-pointer">
              <Bell className="w-[18px] h-[18px] text-black" strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      {/* Balance */}
      <div className="px-6 mb-4">
        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Total Balance</p>
        <p className="font-mono text-4xl font-black text-black tracking-tight mt-1 tabular-nums">
          {hideBalance ? "******" : <AnimatedAmount value={balance} currency={currency} />}
        </p>
      </div>

      {/* 3D Card */}
      <div className="home-card-wrap px-4 min-[390px]:px-6 mb-5">
        <Card3D
          color={(userCards[activeCardIndex]?.color as CardColor) || cardColor}
          cardNumber={userCards[activeCardIndex]?.card_number}
          cardHolder={userCards[activeCardIndex]?.card_holder || fullName}
          cardExpiry={userCards[activeCardIndex]?.expiry}
          balance={balance}
          currency={currency}
          hideBalance={hideBalance}
        />
      </div>

      {/* Add Card button */}
      <div className="px-4 min-[390px]:px-6 mb-5">
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

      {/* Quick Actions */}
      <div className="quick-actions px-4 min-[390px]:px-6 mb-6">
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <motion.button
              key={action.label}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                if (action.action === "send") onSend();
                else if (action.action === "receive") onReceive();
                else if (action.label === "Top Up") setShowTopUp(true);
                else if (action.label === "Withdraw") {
                  setWithdrawMessage(kycStatus === "verified" ? "Withdrawals are coming next." : "Submit and verify KYC to unlock withdrawals.");
                }
              }}
              className="flex flex-col items-center gap-2 py-3.5 px-2 rounded-2xl bg-white border border-slate-200 cursor-pointer select-none hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <TransactionIcon icon={action.icon} size={22} color="#000000" />
              <span className="text-[11px] font-bold text-black">{action.label}</span>
            </motion.button>
          ))}
        </div>
        {topUpError && <p className="mt-3 text-xs font-bold text-red-500">{topUpError}</p>}
        {withdrawMessage && <p className="mt-3 text-xs font-bold text-amber-700">{withdrawMessage}</p>}
      </div>

      {previousRecipients.length > 0 && (
        <div className="px-6 mb-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-black">Send again</h3>
            <RotateCcw className="h-4 w-4 text-black" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {previousRecipients.map((tx) => {
              const recipient = tx.recipient_email || tx.recipient_name || "";
              const label = labelForPerson(tx.recipient_name, tx.recipient_email);
              return (
              <button key={tx.id} onClick={() => onSend(recipient)} className="min-w-[72px] text-center">
                <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-black bg-[#d7ff5f] text-sm font-black text-black">
                  {tx.recipient_avatar_url ? (
                    <img src={tx.recipient_avatar_url} alt={tx.recipient_name || recipient} className="h-full w-full object-cover" />
                  ) : (
                    label.charAt(0).toUpperCase()
                  )}
                </div>
                <p className="truncate text-[10px] font-bold text-black">{label}</p>
              </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Send/Receive buttons */}
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
          {recentTx.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">No transactions yet</p>
          )}
          {recentTx.map((tx) => {
            const isPositive = tx.amount > 0;
            return (
              <motion.div
                key={tx.id}
                onClick={() => setReceiptTx(transactions.find((item) => item.id === tx.id) || null)}
                whileTap={{ scale: 0.98, y: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 cursor-pointer"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black bg-[#d7ff5f]">
                  {tx.avatarUrl ? (
                    <img src={tx.avatarUrl} alt={tx.person || tx.category} className="h-full w-full object-cover" />
                  ) : tx.person ? (
                        <span className="text-sm font-black text-black">{tx.person.charAt(0).toUpperCase()}</span>
                  ) : (
                    <TransactionIcon icon={tx.icon} size={20} color="#000000" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-black truncate capitalize">
                    {tx.name}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {tx.subtitle} - {tx.date}
                  </p>
                </div>
                <p className={`font-mono text-sm font-black tabular-nums ${isPositive ? "text-emerald-600" : "text-red-500"}`}>
                  {isPositive ? "+" : "-"}{formatMoney(Math.abs(tx.amount), currency)}
                </p>
              </motion.div>
            );
          })}
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
      <AnimatePresence>
        {showTopUp && (
          <div className="fixed inset-0 z-[130] flex items-end justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40" onClick={() => setShowTopUp(false)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="relative w-full max-w-[430px] max-h-[92dvh] overflow-y-auto rounded-t-3xl bg-white p-4 min-[390px]:p-6 pb-[max(24px,env(safe-area-inset-bottom))]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-black">Top up with Paystack</h3>
                  <p className="text-xs font-bold text-slate-500">Minimum amount is {formatMoney(5, currency)}</p>
                </div>
                <button onClick={() => setShowTopUp(false)} className="rounded-xl bg-slate-100 p-2"><Plus className="h-4 w-4 rotate-45 text-black" /></button>
              </div>
              <input value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} type="number" min={5} step="0.01" placeholder="Enter amount" className="mb-3 w-full rounded-2xl border border-black px-4 py-4 text-2xl font-black text-black outline-none" />
              {topUpError && <p className="mb-3 text-xs font-bold text-red-500">{topUpError}</p>}
              <button onClick={startTopUp} className="w-full rounded-2xl border border-black bg-[#d7ff5f] py-4 text-sm font-black text-black shadow-[4px_4px_0_#000]">Continue to Paystack</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {receiptTx && (
          <div className="fixed inset-0 z-[130] flex items-end justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40" onClick={() => setReceiptTx(null)} />
            <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="relative w-full max-w-[430px] max-h-[92dvh] overflow-y-auto rounded-t-3xl bg-white p-4 min-[390px]:p-6 pb-[max(24px,env(safe-area-inset-bottom))]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-black">Receipt</h3>
                  <p className="text-xs font-bold text-slate-500">{new Date(receiptTx.created_at).toLocaleString()}</p>
                </div>
                <ReceiptText className="h-6 w-6 text-black" />
              </div>
              <div className="space-y-3 rounded-2xl border border-black bg-[#f7f7f4] p-4 text-sm font-bold text-black">
                <p>{receiptTx.type === "receive" ? `Confirmed you received from ${receiptTx.recipient_name || "sender"}` : receiptTx.type === "send" ? `Confirmed you sent to ${receiptTx.recipient_name || "recipient"}` : `Type: ${receiptTx.type}`}</p>
                <p>Amount: {formatMoney(receiptTx.amount, currency)}</p>
                <p>Status: {receiptTx.status}</p>
                <p>Details: {receiptTx.description || "N/A"}</p>
              </div>
              <button onClick={() => downloadReceipt(receiptTx)} className="mt-4 w-full rounded-2xl border border-black bg-[#d7ff5f] py-3 text-sm font-black text-black shadow-[4px_4px_0_#000]">
                Download receipt
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
