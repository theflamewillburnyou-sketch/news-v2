import React, { useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SecretGateProps {
  onLongPress: () => void;
  onTap: () => void;
}

export function SecretGate({ onLongPress, onTap }: SecretGateProps) {
  const [isPressing, setIsPressing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startPress = () => {
    setIsPressing(true);
    timerRef.current = setTimeout(() => {
      onLongPress();
      setIsPressing(false);
    }, 3000); // 3-second long press
  };

  const endPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      if (isPressing) {
        onTap();
      }
    }
    setIsPressing(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isPressing && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 bg-stealth-accent/20 rounded-full -m-4 blur-xl"
          />
        )}
      </AnimatePresence>
      <button
        onMouseDown={startPress}
        onMouseUp={endPress}
        onTouchStart={startPress}
        onTouchEnd={endPress}
        className={cn(
          "w-12 h-12 flex items-center justify-center rounded-full transition-all active:scale-95",
          "bg-luxury-surface border border-luxury-border shadow-xl hover:border-white/20",
          isPressing && "animate-pulse"
        )}
      >
        <MoreVertical className="w-5 h-5 text-white/60" />
      </button>
    </div>
  );
}
