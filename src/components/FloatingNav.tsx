import { motion } from "framer-motion";
import { ChartSpline, CreditCard, House, Menu } from "lucide-react";

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onMoreOpen: () => void;
}

const tabs = [
  { id: "home", label: "Home", icon: House },
  { id: "wallet", label: "Wallet", icon: CreditCard },
  { id: "progress", label: "Progress", icon: ChartSpline },
];

export function FloatingNav({ activeTab, onTabChange, onMoreOpen }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-[430px] px-5 min-[390px]:px-8 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 pointer-events-auto">
        <motion.div whileTap={{ scale: 0.97 }} className="rounded-[24px] overflow-hidden border border-black shadow-[6px_6px_0_#000]">
          <div
            className="grid grid-cols-4 items-center gap-1.5 py-2.5 px-3"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(244,244,244,0.98) 100%)",
              backdropFilter: "blur(30px) saturate(160%)",
            }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  whileTap={{ scale: 0.85 }}
                  className="relative flex items-center justify-center h-12 rounded-2xl cursor-pointer select-none"
                  aria-label={tab.label}
                >
                  {isActive && <motion.div layoutId="footerActive" className="absolute w-10 h-10 rounded-2xl border border-black bg-[#d7ff5f] shadow-[3px_3px_0_#000]" transition={{ type: "spring", stiffness: 500, damping: 30 }} />}
                  <Icon
                    className={`w-[22px] h-[22px] relative z-10 transition-all duration-300 ${isActive ? "text-black" : "text-zinc-600"}`}
                    strokeWidth={isActive ? 3 : 2.55}
                    fill={isActive ? "currentColor" : "none"}
                  />
                </motion.button>
              );
            })}
            <motion.button whileTap={{ scale: 0.85 }} onClick={onMoreOpen} className="relative flex items-center justify-center h-12 rounded-2xl cursor-pointer select-none" aria-label="More">
              <Menu className="w-[22px] h-[22px] relative z-10 text-zinc-700" strokeWidth={2.7} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
