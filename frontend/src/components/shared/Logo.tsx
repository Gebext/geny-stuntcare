"use client";

import { motion } from "framer-motion";

export const Logo = ({
  size = "default",
}: {
  size?: "small" | "default" | "large";
}) => {
  const sizes = {
    small: "text-xl",
    default: "text-2xl",
    large: "text-4xl",
  };

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 text-primary-foreground"
            fill="currentColor"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
      <div className="flex flex-col">
        <span className={`font-bold text-gradient ${sizes[size]}`}>GENY</span>
        <span className="text-xs text-muted-foreground -mt-1">StuntCare</span>
      </div>
    </motion.div>
  );
};
