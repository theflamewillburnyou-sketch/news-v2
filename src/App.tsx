/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NewsFeed } from './components/NewsFeed';
import { Layout } from './components/Layout';
import { SecretGate } from './components/SecretGate';
import { AuthVault } from './components/AuthVault';
import { Messenger } from './components/Messenger';
import { DecoyVault } from './components/DecoyVault';
import { useDevicePanic } from './hooks/useDevicePanic';
import { AnimatePresence, motion } from 'motion/react';

type AppMode = 'news' | 'gate' | 'vault' | 'decoy';

export default function App() {
  const [mode, setMode] = useState<AppMode>('news');

  // Device-level panic: Shake or Flip to kill
  useDevicePanic(() => {
    if (mode !== 'news') {
      console.log('PANIC TRIGGERED: Clearing session');
      setMode('news');
      // Force reload to completely wipe memory state
      window.location.reload();
    }
  });

  const handleVaultSuccess = (type: 'main' | 'decoy') => {
    setMode(type === 'main' ? 'vault' : 'decoy');
  };

  return (
    <AnimatePresence mode="wait">
      {mode === 'news' && (
        <motion.div
          key="news"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Layout>
            <NewsFeed />
            <SecretGate 
              onTap={() => {}} // News refresh handled inside NewsFeed
              onLongPress={() => setMode('gate')}
            />
          </Layout>
        </motion.div>
      )}

      {mode === 'gate' && (
        <motion.div
          key="gate"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-black fixed inset-0 z-[100] flex items-center justify-center"
        >
          <AuthVault onSuccess={handleVaultSuccess} />
          {/* Hidden Exit button for emergency if needed during dev */}
          <button 
            onClick={() => setMode('news')}
            className="fixed bottom-8 text-[10px] uppercase tracking-widest text-white/10 hover:text-white/40"
          >
            Cancel
          </button>
        </motion.div>
      )}

      {mode === 'vault' && (
        <motion.div
          key="vault"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="bg-black fixed inset-0 z-[100] p-4"
        >
          <Messenger onExit={() => setMode('news')} />
        </motion.div>
      )}

      {mode === 'decoy' && (
        <motion.div
           key="decoy"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-[100]"
        >
          <DecoyVault onExit={() => setMode('news')} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
