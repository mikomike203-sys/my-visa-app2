import { useState, useCallback } from "react";
import { HomeScreen } from "./components/HomeScreen";
import { WalletScreen } from "./components/WalletScreen";
import { AnalyticsScreen } from "./components/AnalyticsScreen";
import { FloatingNav } from "./components/FloatingNav";
import { SendSheet } from "./components/SendSheet";
import { ReceiveSheet } from "./components/ReceiveSheet";
import { MoreSheet } from "./components/MoreSheet";
import { AddCardSheet } from "./components/AddCardSheet";
import { NotificationSheet } from "./components/NotificationSheet";
import type { Currency } from "./utils/currency";
import type { CardColor, CardPattern } from "./components/Card3D";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [showSend, setShowSend] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [cardColor, setCardColor] = useState<CardColor>("graphite");
  const [cardPattern, setCardPattern] = useState<CardPattern>("spear");
  const [hideBalance, setHideBalance] = useState(false);

  const openSend = useCallback(() => setShowSend(true), []);
  const closeSend = useCallback(() => setShowSend(false), []);
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

  return (
    <div className="min-h-dvh bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
        * { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        @media (max-width: 360px) {
          html { font-size: 14px; }
        }
        @media (max-height: 700px) {
          .compact-y .home-card-wrap { margin-bottom: 0.75rem; }
          .compact-y .quick-actions { margin-bottom: 1rem; }
        }
      `}</style>

      <div className="compact-y w-full max-w-[430px] mx-auto bg-white min-h-dvh flex flex-col relative overflow-x-hidden">
        <div className="flex-1 overflow-y-auto">
          {activeTab === "home" && <HomeScreen currency={currency} cardColor={cardColor} cardPattern={cardPattern} hideBalance={hideBalance} onSend={openSend} onReceive={openReceive} onAddCard={openAddCard} onNotifications={openNotifications} />}
          {activeTab === "wallet" && <WalletScreen currency={currency} hideBalance={hideBalance} onSend={openSend} onReceive={openReceive} onNotifications={openNotifications} />}
          {activeTab === "progress" && <AnalyticsScreen currency={currency} onNotifications={openNotifications} />}
        </div>

        <FloatingNav activeTab={activeTab} onTabChange={handleTabChange} onMoreOpen={openMore} />
        <SendSheet open={showSend} currency={currency} onClose={closeSend} />
        <ReceiveSheet open={showReceive} currency={currency} onClose={closeReceive} />
        <MoreSheet
          open={showMore}
          currency={currency}
          cardColor={cardColor}
          cardPattern={cardPattern}
          hideBalance={hideBalance}
          onCurrencyChange={setCurrency}
          onCardColorChange={setCardColor}
          onCardPatternChange={setCardPattern}
          onHideBalanceChange={setHideBalance}
          onClose={closeMore}
          onNavigate={handleNavigate}
          onAddCard={openAddCard}
          onSend={openSend}
        />
        <NotificationSheet open={showNotifications} currency={currency} onClose={closeNotifications} />
        <AddCardSheet open={showAddCard} cardColor={cardColor} cardPattern={cardPattern} onClose={closeAddCard} />
      </div>
    </div>
  );
}

export default App;
