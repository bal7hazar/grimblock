import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownOverlayProps {
  isActive: boolean;
  onComplete: () => void;
}

const COUNTDOWN_MESSAGES: Record<number, string> = {
  5: "Synchronizing with blockchain...",
  4: "Loading grid and pieces...",
  3: "Validating game state...",
  2: "Almost ready...",
  1: "Get ready to play!",
  0: "Let's go!",
};

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ isActive, onComplete }) => {
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (!isActive) {
      setCount(5);
      return;
    }

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          setTimeout(onComplete, 1000); // Longer delay to see the "Let's go!" message
          return 0; // Stay at 0
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onComplete]);

  if (!isActive || count < 0) return null;

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={count}
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 1.5, opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <div className="text-9xl font-bold text-white drop-shadow-[0_0_40px_rgba(255,255,255,0.8)]">
            {count}
          </div>
          <div className="text-2xl text-white/90 tracking-wider text-center px-8">
            {COUNTDOWN_MESSAGES[count]}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

