import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Lock, AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

interface AuthVaultProps {
  onSuccess: (type: 'main' | 'decoy') => void;
}

export function AuthVault({ onSuccess }: AuthVaultProps) {
  const [pin, setPin] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [isFakeError, setIsFakeError] = useState(false);
  const [status, setStatus] = useState<'idle' | 'checking' | 'error'>('idle');

  // Hardcoded for demo - in production these would be hashed in Firestore
  const MAIN_PIN = '1234';
  const DECOY_PIN = '0000';

  const handleInput = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit;
      setPin(newPin);
      
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const verifyPin = (submittedPin: string) => {
    setStatus('checking');
    setTimeout(() => {
      if (submittedPin === MAIN_PIN) {
        onSuccess('main');
      } else if (submittedPin === DECOY_PIN) {
        onSuccess('decoy');
      } else {
        const newCount = errorCount + 1;
        setErrorCount(newCount);
        setStatus('error');
        setPin('');
        
        if (newCount >= 3) {
          setIsFakeError(true);
        }

        setTimeout(() => setStatus('idle'), 1000);
      }
    }, 800);
  };

  if (isFakeError) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-8"
      >
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold tracking-tighter">Connection error (404)</h2>
        <p className="text-white/40 text-sm leading-relaxed">
          The requested news source configuration could not be synchronized with the remote server. 
          Please check your network settings and try again later.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-8 px-6 py-2 border border-white/10 rounded-sm text-xs tracking-widest uppercase hover:bg-white/5 transition-colors"
        >
          Retry Connection
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-6">
          <motion.div
            animate={status === 'error' ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          >
            <Shield className={cn(
              "w-12 h-12 transition-colors",
              status === 'error' ? "text-red-500" : "text-stealth-accent"
            )} />
          </motion.div>
        </div>
        <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-white/40">Configuration</h2>
        <h3 className="text-2xl font-black tracking-tighter">Enter Source ID</h3>
      </div>

      <div className="flex gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={cn(
              "w-4 h-4 rounded-full border-2 transition-all duration-300",
              pin.length > i ? "bg-stealth-accent border-stealth-accent scale-110 shadow-[0_0_15px_rgba(0,255,157,0.5)]" : "border-white/10"
            )} 
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-8 max-w-[280px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleInput(num.toString())}
            disabled={status === 'checking'}
            className="w-16 h-16 text-2xl font-light hover:bg-white/5 rounded-full transition-colors flex items-center justify-center"
          >
            {num}
          </button>
        ))}
        <div />
        <button
          onClick={() => handleInput('0')}
          disabled={status === 'checking'}
          className="w-16 h-16 text-2xl font-light hover:bg-white/5 rounded-full transition-colors flex items-center justify-center"
        >
          0
        </button>
        <button
          onClick={() => setPin('')}
          className="w-16 h-16 flex items-center justify-center text-white/20 hover:text-white transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <p className="text-[10px] uppercase tracking-[0.2em] text-white/20 font-bold">
        Session encrypted • AES-256
      </p>
    </div>
  );
}
