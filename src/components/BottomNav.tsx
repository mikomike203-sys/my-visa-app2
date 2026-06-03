import { useState } from "react";
import { motion } from "framer-motion";
import { Home, CreditCard, TrendingUp } from "lucide-react";

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: "home", icon: Home, label: "Home" },
  { id: "wallet", icon: CreditCard, label: "Wallet" },
  { id: "progress", icon: TrendingUp, label: "Progress" },
];

export function BottomNav({ activeTab, onTabChange }: Props) {
  const [pressedTab, setPressedTab] = useState<string | null>(null);

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
      <div
        className="bg-white/75 backdrop-blur-2xl rounded-t-3xl overflow-hidden"
        style={{
          boxShadow:
            "0 -8px 32px rgba(0,0,0,0.08), 0 -2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {/* Subtle top divider */}
        <div className="mx-6 h-px bg-slate-200/50" />

        <div className="flex items-center justify-around pt-3 pb-8">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isPressed = pressedTab === tab.id;
            const Icon = tab.icon;

            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                onMouseDown={() => setPressedTab(tab.id)}
                onMouseUp={() => setPressedTab(null)}
                onMouseLeave={() => setPressedTab(null)}
                onTouchStart={() => setPressedTab(tab.id)}
                onTouchEnd={() => setPressedTab(null)}
                animate={{
                  y: isPressed ? 1 : 0,
                  scale: isPressed ? 0.9 : 1,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="flex flex-col items-center gap-1 py-2 px-6 rounded-2xl cursor-pointer select-none relative"
                style={{
                  boxShadow: isPressed
                    ? "inset 0 2px 6px rgba(0,0,0,0.06)"
                    : "none",
                }}
              >
                <Icon
                  className={`w-6 h-6 transition-all duration-200 ${
                    isActive ? "text-slate-900" : "text-slate-400"
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.5}
                  fill={isActive ? "currentColor" : "none"}
                />

                <span
                  className={`text-[10px] tracking-tight transition-colors duration-200 ${
                    isActive
                      ? "text-slate-900 font-bold"
                      : "text-slate-400 font-medium"
                  }`}
                >
                  {tab.label}
                </span>

                {/* Active dot indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeDot"
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-slate-900"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}