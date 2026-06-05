import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "./lib/AuthContext";
import { HomeScreen } from "./components/HomeScreen";
import { WalletScreen } from "./components/WalletScreen";
import { AnalyticsScreen } from "./components/AnalyticsScreen";
import { FloatingNav } from "./components/FloatingNav";
import { SendSheet } from "./components/SendSheet";
import { ReceiveSheet } from "./components/ReceiveSheet";
import { MoreSheet } from "./components/MoreSheet";
import { AddCardSheet } from "./components/AddCardSheet";
import { NotificationSheet } from "./components/NotificationSheet";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { LandingPage } from "./components/LandingPage";
import { AdminPage } from "./components/AdminPage";
import { SharePage } from "./components/SharePage";
import { getUserCards, getUserTransactions, createCard, sendMoney, updateCard, submitKyc, topUpBalance } from "./lib/auth";
import type { Currency } from "./utils/currency";
import type { CardColor, CardPattern } from "./components/Card3D";
import type { Card, PublicPerson, Transaction } from "./types/database";

const isAdminRoute = () => window.location.pathname.replace(/\/+$/, "") === "/admin";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
}

function App() {
  const { user, profile, loading, logout, refreshProfile } = useAuth();
  const [authPage, setAuthPage] = useState<"landing" | "login" | "register">("landing");
  const [showWalletSplash, setShowWalletSplash] = useState(false);
  const [hasShownWalletSplash, setHasShownWalletSplash] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [showSend, setShowSend] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [sendRecipient, setSendRecipient] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [cardColor, setCardColor] = useState<CardColor>("graphite");
  const [cardPattern, setCardPattern] = useState<CardPattern>("solid");
  const [hideBalance, setHideBalance] = useState(false);
  const [userCards, setUserCards] = useState<Card[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [people, setPeople] = useState<PublicPerson[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [greeting] = useState(getGreeting);

  const loadUserData = useCallback(async () => {
    if (!user) return;
    try {
      const [cards, txns] = await Promise.all([
        getUserCards(user.id),
        getUserTransactions(user.id),
      ]);
      setUserCards(cards);
      setTransactions(txns);
    } catch (err) {
      console.error("Failed to load user data:", err);
    }
  }, [user]);

  useEffect(() => {
    if (user) loadUserData();
  }, [user, loadUserData]);

  useEffect(() => {
    if (!user) {
      setHasShownWalletSplash(false);
      setShowWalletSplash(false);
      sessionStorage.removeItem("visa-show-wallet-splash");
      return;
    }
    const shouldShowSplash = sessionStorage.getItem("visa-show-wallet-splash") === "true";
    if (!shouldShowSplash) {
      setShowWalletSplash(false);
      return;
    }
    if (loading || hasShownWalletSplash) return;
    setShowWalletSplash(true);
    const timer = window.setTimeout(() => {
      setShowWalletSplash(false);
      setHasShownWalletSplash(true);
      sessionStorage.removeItem("visa-show-wallet-splash");
    }, 3300);
    return () => window.clearTimeout(timer);
  }, [hasShownWalletSplash, loading, user]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/people")
      .then((res) => res.json())
      .then((data) => setPeople(data.people || []))
      .catch((err) => console.error("Failed to load people:", err));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const refreshAll = () => Promise.all([loadUserData(), refreshProfile()]).catch((err) => console.error("Refresh failed:", err));
    const onFocus = () => { refreshAll(); };
    window.addEventListener("focus", onFocus);
    const timer = window.setInterval(refreshAll, 30000);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.clearInterval(timer);
    };
  }, [loadUserData, refreshProfile, user]);

  useEffect(() => {
    if (!user) return;
    const savedColor = localStorage.getItem(`visa-card-look-${user.id}`) as CardColor | null;
    const pendingColor = localStorage.getItem("pending-card-look") as CardColor | null;
    const savedCurrency = localStorage.getItem(`visa-currency-${user.id}`) as Currency | null;
    const savedHideBalance = localStorage.getItem(`visa-hide-balance-${user.id}`);
    if (pendingColor) {
      setCardColor(pendingColor);
      localStorage.setItem(`visa-card-look-${user.id}`, pendingColor);
      localStorage.removeItem("pending-card-look");
    } else if (savedColor) setCardColor(savedColor);
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedHideBalance) setHideBalance(savedHideBalance === "true");
  }, [user]);

  useEffect(() => {
    if (!user || userCards.length === 0) return;
    const savedColor = localStorage.getItem(`visa-card-look-${user.id}`) as CardColor | null;
    if (savedColor && userCards[0].color !== savedColor) {
      updateCard(userCards[0].id, { color: savedColor }).then(loadUserData);
    }
  }, [loadUserData, user, userCards]);

  const handleCurrencyChange = useCallback((nextCurrency: Currency) => {
    setCurrency(nextCurrency);
    if (user) localStorage.setItem(`visa-currency-${user.id}`, nextCurrency);
  }, [user]);

  const handleHideBalanceChange = useCallback((nextHide: boolean) => {
    setHideBalance(nextHide);
    if (user) localStorage.setItem(`visa-hide-balance-${user.id}`, String(nextHide));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const params = new URLSearchParams(window.location.search);
    const send = params.get("send");
    if (send) {
      setSendRecipient(send);
      setSendAmount(params.get("amount") || "");
      setShowSend(true);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const params = new URLSearchParams(window.location.search);
    const reference = params.get("reference") || params.get("trxref");
    const pendingAmount = sessionStorage.getItem("pendingTopupUsd");
    const pendingReference = sessionStorage.getItem("pendingTopupReference") || reference;
    const pendingKind = sessionStorage.getItem("pendingPaystackKind");
    if (reference && pendingKind === "save_card") {
      fetch("/api/paystack-verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, reference, createVirtualCard: true }),
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to save card");
          sessionStorage.removeItem("pendingPaystackKind");
          sessionStorage.removeItem("pendingTopupUsd");
          sessionStorage.removeItem("pendingTopupReference");
          await Promise.all([loadUserData(), refreshProfile()]);
          window.history.replaceState({}, "", window.location.pathname);
        })
        .catch((err) => console.error("Failed to verify saved card:", err));
    } else if (reference && pendingAmount) {
      topUpBalance(user.id, Number(pendingAmount), pendingReference || reference)
        .then(async () => {
          sessionStorage.removeItem("pendingPaystackKind");
          sessionStorage.removeItem("pendingTopupUsd");
          sessionStorage.removeItem("pendingTopupReference");
          await Promise.all([loadUserData(), refreshProfile()]);
          window.history.replaceState({}, "", window.location.pathname);
        })
        .catch((err) => console.error("Failed to finalize top up:", err));
    }
  }, [loadUserData, refreshProfile, user]);

  const openSend = useCallback((recipient?: string) => {
    if (recipient) setSendRecipient(recipient);
    setShowSend(true);
  }, []);
  const closeSend = useCallback(() => { setShowSend(false); setSendRecipient(""); setSendAmount(""); }, []);
  const openReceive = useCallback(() => setShowReceive(true), []);
  const closeReceive = useCallback(() => setShowReceive(false), []);
  const openMore = useCallback(() => setShowMore(true), []);
  const closeMore = useCallback(() => setShowMore(false), []);
  const openAddCard = useCallback(() => setShowAddCard(true), []);
  const closeAddCard = useCallback(() => setShowAddCard(false), []);
  const openNotifications = useCallback(() => setShowNotifications(true), []);
  const closeNotifications = useCallback(() => setShowNotifications(false), []);
  const handleTabChange = useCallback((tab: string) => setActiveTab(tab), []);
  const handleNavigate = useCallback((tab: string) => {
    setActiveTab(tab);
    setShowMore(false);
  }, []);

  const handleSendMoney = useCallback(async (toEmail: string, amount: number, description?: string, cardId?: string) => {
    if (!user) return;
    await sendMoney(user.id, toEmail, amount, description, cardId);
    await Promise.all([loadUserData(), refreshProfile()]);
  }, [user, loadUserData, refreshProfile]);

  const handleTopUp = useCallback(async (amount: number, reference: string) => {
    if (!user) return;
    await topUpBalance(user.id, amount, reference);
    await Promise.all([loadUserData(), refreshProfile()]);
  }, [user, loadUserData, refreshProfile]);

  const handleSubmitKyc = useCallback(async (documentUrl: string) => {
    if (!user) return;
    await submitKyc(user.id, documentUrl);
    await refreshProfile();
  }, [user, refreshProfile]);

  const handleCreateCard = useCallback(async (color: CardColor) => {
    if (!user || !profile) return;
    const newCard = await createCard(user.id, {
      label: `Visa ${color.charAt(0).toUpperCase() + color.slice(1)}`,
      card_number: `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
      card_holder: profile.full_name,
      expiry: "09/28",
      balance: 5000,
      color,
      frozen: false,
      is_virtual: true,
    });
    setUserCards((prev) => [...prev, newCard]);
  }, [user, profile]);

  const handleToggleFreeze = useCallback(async (cardId: string, frozen: boolean) => {
    await updateCard(cardId, { frozen });
    await loadUserData();
  }, [loadUserData]);

  const handleCardColorChange = useCallback(async (color: CardColor) => {
    setCardColor(color);
    if (user) localStorage.setItem(`visa-card-look-${user.id}`, color);
    const activeCard = userCards[activeCardIndex];
    if (activeCard) {
      await updateCard(activeCard.id, { color });
      await loadUserData();
    }
  }, [activeCardIndex, loadUserData, user, userCards]);

  const handleCardChange = useCallback((index: number) => {
    setActiveCardIndex(index);
    if (userCards[index]?.color) {
      setCardColor(userCards[index].color as CardColor);
    }
  }, [userCards]);

  const walletSplash = (
    <div className="min-h-dvh bg-black flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 1.03 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative h-dvh w-full max-w-[430px] bg-black"
      >
        <img
          src="/vv.jpg"
          alt="Introducing the future"
          className="h-full w-full object-cover"
          loading="eager"
          decoding="sync"
        />
        <motion.div
          className="absolute inset-x-8 bottom-[max(28px,env(safe-area-inset-bottom))] h-1 overflow-hidden rounded-full bg-white/25"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="h-full rounded-full bg-white"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.3, ease: "linear" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );

  if (loading) {
    return <div className="min-h-dvh bg-black" />;
  }

  if (showWalletSplash) {
    return walletSplash;
  }

  if (isAdminRoute()) {
    return <AdminPage />;
  }

  if (!user) {
    if (authPage === "landing") {
      return (
        <LandingPage
          onGetStarted={() => setAuthPage("register")}
          onSignIn={() => setAuthPage("login")}
        />
      );
    }
    if (authPage === "login") {
      return <LoginPage onSwitchToRegister={() => setAuthPage("register")} />;
    }
    return <RegisterPage onSwitchToLogin={() => setAuthPage("login")} />;
  }

  if (showShare) {
    return <SharePage onBack={() => setShowShare(false)} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-dvh bg-white"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        @media (max-width: 360px) { html { font-size: 14px; } }
        @media (max-height: 700px) {
          .compact-y .home-card-wrap { margin-bottom: 0.75rem; }
          .compact-y .quick-actions { margin-bottom: 1rem; }
        }
      `}</style>

      <div className="compact-y w-full max-w-[430px] mx-auto bg-white min-h-dvh flex flex-col relative overflow-x-hidden">
        <div className="flex-1 overflow-y-auto">
          {activeTab === "home" && (
            <HomeScreen
              currency={currency}
              cardColor={cardColor}
              cardPattern={cardPattern}
              hideBalance={hideBalance}
              greeting={greeting}
              userCards={userCards}
              activeCardIndex={activeCardIndex}
              balance={profile?.balance || 0}
              fullName={profile?.full_name || ""}
              transactions={transactions}
              people={people}
              avatarUrl={profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture || ""}
              email={user.email || ""}
              kycStatus={profile?.kyc_status || "not_submitted"}
              onToggleFreeze={handleToggleFreeze}
              onCardChange={handleCardChange}
              onSend={openSend}
              onReceive={openReceive}
              onTopUp={handleTopUp}
              onAddCard={openAddCard}
              onNotifications={openNotifications}
              onLogout={logout}
            />
          )}
          {activeTab === "wallet" && (
            <WalletScreen
              currency={currency}
              hideBalance={hideBalance}
              balance={profile?.balance || 0}
              fullName={profile?.full_name || ""}
              transactions={transactions}
              userCards={userCards}
              onSend={openSend}
              onReceive={openReceive}
              onNotifications={openNotifications}
              onToggleFreeze={handleToggleFreeze}
              onAddCard={openAddCard}
            />
          )}
          {activeTab === "progress" && (
            <AnalyticsScreen currency={currency} transactions={transactions} onNotifications={openNotifications} />
          )}
        </div>

        <FloatingNav activeTab={activeTab} onTabChange={handleTabChange} onMoreOpen={openMore} />
        <SendSheet open={showSend} currency={currency} balance={profile?.balance || 0} userCards={userCards} people={people} kycStatus={profile?.kyc_status || "not_submitted"} initialRecipient={sendRecipient} initialAmount={sendAmount} onSend={handleSendMoney} onClose={closeSend} />
        <ReceiveSheet open={showReceive} currency={currency} email={user.email || ""} fullName={profile?.full_name || ""} walletAddress={user.id} onClose={closeReceive} onSendToMe={(target) => { setSendRecipient(target); setShowReceive(false); setShowSend(true); }} />
        <MoreSheet
          open={showMore} currency={currency} cardColor={cardColor} cardPattern={cardPattern} hideBalance={hideBalance}
          onCurrencyChange={handleCurrencyChange} onCardColorChange={handleCardColorChange} onCardPatternChange={setCardPattern}
          onHideBalanceChange={handleHideBalanceChange} onClose={closeMore} onNavigate={handleNavigate}
          onAddCard={openAddCard} onSend={openSend}
          userCards={userCards}
          people={people}
          onSubmitKyc={handleSubmitKyc}
          kycStatus={profile?.kyc_status || "not_submitted"}
          onOpenShare={() => { setShowMore(false); setShowShare(true); }}
          onLogout={logout}
        />
        <NotificationSheet open={showNotifications} currency={currency} transactions={transactions} kycStatus={profile?.kyc_status || "not_submitted"} onClose={closeNotifications} />
        <AddCardSheet open={showAddCard} userId={user.id} email={user.email || ""} cardColor={cardColor} cardPattern={cardPattern} cardCount={userCards.length} onCreateCard={handleCreateCard} onClose={closeAddCard} />
      </div>
    </motion.div>
  );
}

export default App;
