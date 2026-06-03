import {
  Banknote,
  Building2,
  Camera,
  Car,
  CircleDollarSign,
  Clapperboard,
  Coins,
  CreditCard,
  HandCoins,
  Image,
  Landmark,
  Package,
  ReceiptText,
  Repeat,
  Send,
  ShoppingBag,
  Store,
  Utensils,
  Wallet,
  Zap,
} from "lucide-react";
import type { ElementType } from "react";
import type { IconName } from "./icons/FintechIcons";

interface Props {
  icon: IconName;
  size?: number;
  color?: string;
  bg?: string;
  strokeWidth?: number;
}

const fallback: IconName = "wallet";

const lucideIconMap: Record<IconName, ElementType> = {
  shopping: ShoppingBag,
  streaming: Clapperboard,
  subscription: Repeat,
  restaurant: Utensils,
  grocery: Package,
  transport: Car,
  utilities: Zap,
  refund: HandCoins,
  atm: Landmark,
  "bank-transfer": Building2,
  merchant: Store,
  recurring: Repeat,
  send: Send,
  receive: HandCoins,
  pay: ReceiptText,
  wallet: Wallet,
  income: Banknote,
  coins: Coins,
  card: CreditCard,
  bills: ReceiptText,
  cash: Banknote,
  dollar: CircleDollarSign,
  camera: Camera,
  gallery: Image,
};

export function TransactionIcon({ icon, size = 20, color = "#000000", bg = "bg-slate-100", strokeWidth = 2.4 }: Props) {
  const IconComponent = lucideIconMap[icon] || lucideIconMap[fallback];

  return (
    <div
      className={`${bg} rounded-xl flex items-center justify-center`}
      style={{ width: size + 16, height: size + 16 }}
    >
      <IconComponent
        size={size}
        strokeWidth={strokeWidth}
        color={color}
      />
    </div>
  );
}
