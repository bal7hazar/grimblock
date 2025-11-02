import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ComboPopupProps {
  combo: number;
  id: string;
  onComplete: (id: string) => void;
}

export const ComboPopup: React.FC<ComboPopupProps> = ({ combo, id, onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{ 
        opacity: [0, 1, 1, 0], 
        y: -120, 
        scale: [0.5, 1.2, 1, 0.8] 
      }}
      transition={{ 
        duration: 3,
        ease: "easeOut",
        opacity: { 
          times: [0, 0.15, 0.7, 1],
          duration: 3 
        },
        scale: { 
          times: [0, 0.2, 0.5, 1],
          duration: 3
        },
        y: {
          duration: 3,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }}
      onAnimationComplete={() => onComplete(id)}
      className="absolute pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      <div className="text-7xl font-bold text-yellow-400 drop-shadow-[0_0_30px_rgba(251,191,36,1)]">
        +{combo * 10}
      </div>
      <div className="text-3xl font-semibold text-white text-center mt-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
        {combo}x Combo!
      </div>
    </motion.div>
  );
};

interface ComboPopupsContainerProps {
  combos: Array<{ id: string; combo: number }>;
  onRemove: (id: string) => void;
}

export const ComboPopupsContainer: React.FC<ComboPopupsContainerProps> = ({ combos, onRemove }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      <AnimatePresence>
        {combos.map(({ id, combo }) => (
          <ComboPopup key={id} combo={combo} id={id} onComplete={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
};

