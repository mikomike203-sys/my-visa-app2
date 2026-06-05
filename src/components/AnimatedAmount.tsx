import { useEffect, useRef, useState } from "react";
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
  const previousValue = useRef(0);
  const direction = value >= previousValue.current ? -1 : 1;

  useEffect(() => {
    const unsubscribe = motionValue.on("change", (latest) => {
      setDisplay(formatMoney(latest, currency, { minimumFractionDigits }));
    });

    const controls = animate(motionValue, value, {
      duration: 1.15,
      ease: [0.16, 1, 0.3, 1],
    });
    previousValue.current = value;

    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [currency, minimumFractionDigits, motionValue, value]);

  return (
    <motion.span
      className={`inline-flex overflow-hidden align-baseline ${className}`}
      initial={false}
      animate={{ scale: [1, 1.018, 1] }}
      transition={{ duration: 0.45 }}
    >
      {display.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}-${display}`}
          initial={{ y: direction * 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.34, delay: Math.min(index * 0.012, 0.16), ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
        >
          {char === " " ? "\u00a0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}
