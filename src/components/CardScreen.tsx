import { motion } from "framer-motion";
import { ChevronRight, Plus } from "lucide-react";
import type { CardData, CardTheme } from "../types/card";

interface Props {
  cards: CardData[];
  activeIndex: number;
  onSelect: (index: number) => void;
  activeCard: CardData;
  onToggleFreeze: () => void;
  onChangeTheme: (theme: CardTheme) => void;
  cardTheme: CardTheme;
  activeTab: string;
  onAddCard?: () => void;
}

export function CardScreen({ cards, onAddCard }: Props) {
  return (
    <div className="flex-1 overflow-y-auto pb-28 bg-white">
      <div className="px-6 pt-6 pb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-black tracking-tight">My Cards</h1>
          <p className="text-xs text-slate-500 mt-0.5">{cards.length} active</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-extrabold text-black">
          AM
        </div>
      </div>

      <div className="px-6 mb-5">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onAddCard}
          className="w-full p-4 rounded-2xl border-2 border-dashed border-slate-300 bg-white flex items-center gap-3 cursor-pointer hover:border-black transition-colors"
        >
          <div className="w-11 h-11 rounded-xl bg-black flex items-center justify-center">
            <Plus className="w-5 h-5 text-white" strokeWidth={3} />
          </div>
          <div className="text-left flex-1">
            <p className="text-sm font-extrabold text-black">Add a Card</p>
            <p className="text-[11px] text-slate-500">Physical or virtual, ready in seconds</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" strokeWidth={2.7} />
        </motion.button>
      </div>
    </div>
  );
}
