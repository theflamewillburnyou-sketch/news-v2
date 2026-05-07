import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  isVault?: boolean;
}

export function Layout({ children, isVault = false }: LayoutProps) {
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      // Blur when app goes to background (Android Recents)
      setIsBlurred(document.visibilityState === 'hidden');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  return (
    <div className={cn(
      "min-h-screen transition-all duration-500 bg-luxury-bg text-white font-sans selection:bg-stealth-accent/30",
      isBlurred && "filter blur-3xl scale-105"
    )}>
      <main className="max-w-xl mx-auto px-4 pb-24 pt-8">
        {children}
      </main>
    </div>
  );
}
