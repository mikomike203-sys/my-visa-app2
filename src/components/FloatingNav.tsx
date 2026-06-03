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
        <motion.div whileTap={{ scale: 0.97 }} className="rounded-[30px] overflow-hidden">
          <div
            className="grid grid-cols-4 items-center gap-1.5 py-2.5 px-3"
            style={{
              background: "linear-gradient(180deg, rgba(20,24,33,0.98) 0%, rgba(8,10,15,0.98) 100%)",
              backdropFilter: "blur(40px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 18px 38px rgba(0,0,0,0.26), inset 0 1px 1px rgba(255,255,255,0.1)",
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
                  {isActive && <motion.div layoutId="footerActive" className="absolute w-10 h-10 rounded-2xl bg-blue-600 shadow-[0_0_18px_rgba(37,99,235,0.55)]" transition={{ type: "spring", stiffness: 500, damping: 30 }} />}
                  <Icon
                    className={`w-[22px] h-[22px] relative z-10 transition-all duration-300 ${isActive ? "text-white" : "text-white/62"}`}
                    strokeWidth={isActive ? 2.75 : 2.35}
                  />
                </motion.button>
              );
            })}
            <motion.button whileTap={{ scale: 0.85 }} onClick={onMoreOpen} className="relative flex items-center justify-center h-12 rounded-2xl cursor-pointer select-none" aria-label="More">
              <Menu className="w-[22px] h-[22px] relative z-10 text-white/62" strokeWidth={2.35} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
