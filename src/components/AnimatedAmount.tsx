import { useEffect, useState } from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { Currency, formatMoney } from "../utils/currency";

interface Props {
  value: number;
  currency: Currency;
  className?: string;
  minimumFractionDigits?: number;
}

export function AnimatedAmount({ value, currency, className = "", minimumFractionDigits }: Props) {
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(formatMoney(0, currency, { minimumFractionDigits }));

  useEffect(() => {
    const unsubscribe = motionValue.on("change", (latest) => {
      setDisplay(formatMoney(latest, currency, { minimumFractionDigits }));
    });

    const controls = animate(motionValue, value, {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [currency, minimumFractionDigits, motionValue, value]);

  return <motion.span className={className}>{display}</motion.span>;
}
