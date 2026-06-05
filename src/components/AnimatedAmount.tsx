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
  const motionValue = useMotionValue(value);
  const previousValue = useRef(value);
  const [display, setDisplay] = useState(formatMoney(value, currency, { minimumFractionDigits }));
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const nextDirection = value >= previousValue.current ? -1 : 1;
    setDirection(nextDirection);

    const unsubscribe = motionValue.on("change", (latest) => {
      setDisplay(formatMoney(latest, currency, { minimumFractionDigits }));
    });

    const controls = animate(motionValue, value, {
      duration: 0.9,
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
      key={`${currency}-${value}-${minimumFractionDigits ?? "auto"}`}
      className={`inline-block whitespace-nowrap ${className}`}
      initial={{ y: direction * 10, opacity: 0.7 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
    >
      {display}
    </motion.span>
  );
}
