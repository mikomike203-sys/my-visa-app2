import { useState, ReactNode } from "react";
import { motion } from "framer-motion";

interface SoftButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "light" | "dark";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<string, string> = {
  primary: "bg-blue-600 text-white border-blue-600",
  secondary: "bg-white text-slate-700 border-slate-200/80",
  ghost: "bg-transparent text-slate-500 border-transparent",
  danger: "bg-red-500 text-white border-red-500",
  light: "bg-white text-black border-white/50",
  dark: "bg-slate-900 text-white border-slate-800/30",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-[11px] rounded-xl gap-1",
  md: "px-4 py-2.5 text-xs rounded-2xl gap-1.5",
  lg: "px-5 py-3 text-sm rounded-2xl gap-2",
};

export function SoftButton({ children, onClick, className = "", variant = "primary", size = "md", disabled = false, fullWidth = false }: SoftButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      animate={{ y: isPressed ? 2 : 0, scale: isPressed ? 0.97 : 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
      className={`relative font-semibold inline-flex items-center justify-center border select-none ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? "w-full" : ""} ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      style={{
        boxShadow: isPressed
          ? "inset 0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)"
          : variant === "primary"
            ? "0 4px 14px rgba(0,0,0,0.22), 0 1px 3px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.15)"
            : variant === "dark"
              ? "0 4px 14px rgba(15,23,42,0.3), 0 1px 3px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.1)"
              : "0 4px 14px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06), inset 0 1px 1px rgba(255,255,255,0.8)",
      }}
    >
      {children}
    </motion.button>
  );
}
