import { useState, useEffect, useCallback } from "react";
import type { Profile, Transaction } from "../types/database";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, ArrowUpDown, Search, Shield, DollarSign, ClipboardCheck } from "lucide-react";

export function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<"users" | "transactions">("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdjustModal, setShowAdjustModal] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [session, setSession] = useState<{ username: string; password: string } | null>(null);

  const adminRequest = useCallback(async (action: string, payload: Record<string, unknown> = {}) => {
    const credentials = session || { username, password };
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...credentials, ...payload }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Admin action failed");
    return data as { profiles?: Profile[]; transactions?: Transaction[]; ok?: boolean };
  }, [password, session, username]);

  const loadData = useCallback(async () => {
    try {
      const data = await adminRequest("list");
      setProfiles(data.profiles || []);
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [adminRequest]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    // Simple admin auth - check against stored admin
    try {
      const data = await adminRequest("login");
      setSession({ username, password });
      setProfiles(data.profiles || []);
      setTransactions(data.transactions || []);
      setAuthenticated(true);
      setLoading(false);
    } catch (err: any) {
      setLoginError(err.message || "Invalid credentials");
    }
  };

  const handleAdjustBalance = async () => {
    if (!showAdjustModal || !adjustAmount) return;
    const amount = parseFloat(adjustAmount);
    if (isNaN(amount) || amount === 0) return;
    try {
      await adminRequest("adjust", { userId: showAdjustModal, amount, reason: adjustReason });
      setShowAdjustModal(null);
      setAdjustAmount("");
      setAdjustReason("");
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleKycStatus = async (userId: string, status: Profile["kyc_status"]) => {
    try {
      await adminRequest("kyc", { userId, status });
      await loadData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredProfiles = profiles.filter(p =>
    p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!authenticated) {
    return (
      <div className="min-h-dvh bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl mb-4 shadow-lg shadow-red-500/25">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">Admin Panel</h1>
            <p className="text-slate-400 mt-1 text-sm">Authorized access only</p>
          </div>
          {loginError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-xl mb-4">
              {loginError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-orange-700 transition-all shadow-lg shadow-red-500/20"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-slate-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Audit users, balances, and transactions</p>
          </div>
          <button
            onClick={() => setAuthenticated(false)}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Users</p>
                <p className="text-xl font-bold text-white">{profiles.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Balance</p>
                <p className="text-xl font-bold text-white">
                  ${profiles.reduce((sum, p) => sum + p.balance, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <ArrowUpDown className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Audit Events</p>
                <p className="text-xl font-bold text-white">{transactions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedTab("users")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              selectedTab === "users"
                ? "bg-indigo-500 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setSelectedTab("transactions")}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              selectedTab === "transactions"
                ? "bg-indigo-500 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            Transactions
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users or emails..."
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Users Table */}
        {selectedTab === "users" && (
          <div className="space-y-3">
            {filteredProfiles.map((p) => (
              <div key={p.id} className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {p.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-white">{p.full_name}</p>
                      <p className="text-sm text-slate-400">{p.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">${p.balance.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      p.kyc_status === "verified" ? "bg-emerald-500/20 text-emerald-400" :
                      p.kyc_status === "pending" ? "bg-amber-500/20 text-amber-400" :
                      p.kyc_status === "rejected" ? "bg-red-500/20 text-red-400" :
                      "bg-slate-500/20 text-slate-400"
                    }`}>
                      {p.kyc_status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700/50">
                  <button
                    onClick={() => {
                      setSelectedUser(p);
                      setShowAdjustModal(p.id);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-medium hover:bg-indigo-500/20 transition-colors"
                  >
                    <ClipboardCheck className="w-3 h-3" /> Audit Amount
                  </button>
                  <button
                    onClick={async () => {
                      await adminRequest("adjust", { userId: p.id, amount: 1000, reason: "Admin quick credit" });
                      await loadData();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-colors"
                  >
                    <DollarSign className="w-3 h-3" /> Credit $1,000
                  </button>
                  <button
                    onClick={() => handleKycStatus(p.id, "verified")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-500/10 text-lime-300 text-xs font-medium hover:bg-lime-500/20 transition-colors"
                  >
                    Verify KYC
                  </button>
                  <button
                    onClick={() => handleKycStatus(p.id, "rejected")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-300 text-xs font-medium hover:bg-red-500/20 transition-colors"
                  >
                    Reject KYC
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Transactions Table */}
        {selectedTab === "transactions" && (
          <div className="space-y-3">
            {transactions.map((t) => (
              <div key={t.id} className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white capitalize">{t.type}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {t.description || "No description"} · {new Date(t.created_at).toLocaleString()}
                    </p>
                    {t.recipient_name && (
                      <p className="text-xs text-slate-500 mt-0.5">To: {t.recipient_name} ({t.recipient_email})</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      t.type === "receive" || t.type === "topup" ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {t.type === "receive" || t.type === "topup" ? "+" : "-"}${t.amount.toLocaleString()}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      t.status === "completed" ? "bg-emerald-500/20 text-emerald-400" :
                      t.status === "pending" ? "bg-amber-500/20 text-amber-400" :
                      "bg-red-500/20 text-red-400"
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Adjust Balance Modal */}
        <AnimatePresence>
          {showAdjustModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Audit / Adjust Balance</h3>
                  <button onClick={() => setShowAdjustModal(null)} className="text-slate-500 hover:text-slate-300">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {selectedUser && (
                  <p className="text-sm text-slate-400 mb-4">
                    User: <strong className="text-white">{selectedUser.full_name}</strong> · Current: <strong className="text-white">${selectedUser.balance.toLocaleString()}</strong>
                  </p>
                )}
                <div className="space-y-4">
                  <input
                    type="number"
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    placeholder="Amount (positive to credit, negative to debit)"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    placeholder="Audit note or reason (optional)"
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAdjustModal(null)}
                      className="flex-1 py-3 rounded-xl bg-slate-700 text-slate-300 font-bold hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAdjustBalance}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold hover:from-indigo-600 hover:to-purple-700 transition-all"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
