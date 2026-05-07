import React from 'react';
import { ChevronLeft, Inbox, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export function DecoyVault({ onExit }: { onExit: () => void }) {
  return (
    <div className="min-h-screen bg-[#F0F0F0] text-gray-800 p-6 font-serif">
      <header className="flex items-center justify-between mb-12 pb-4 border-b border-gray-300">
        <button onClick={onExit} className="flex items-center gap-2 text-gray-500 hover:text-black">
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs uppercase tracking-widest font-sans">Return</span>
        </button>
        <span className="text-[10px] uppercase tracking-widest font-sans text-gray-400">Archive Node #12</span>
      </header>

      <div className="max-w-md mx-auto space-y-12">
        <div className="text-center space-y-2">
          <Clock className="w-8 h-8 text-gray-300 mx-auto" />
          <h1 className="text-3xl italic tracking-tight text-gray-900">Historical Records</h1>
          <p className="text-sm font-sans text-gray-500">Local cached headlines from previous sessions.</p>
        </div>

        <div className="space-y-6">
          {[
            { date: 'Oct 12, 2023', title: 'Major Urban Development Project Approved' },
            { date: 'Dec 05, 2023', title: 'Global Tech Summit Highlights AI Growth' },
            { date: 'Jan 15, 2024', title: 'Regional Climate Patterns Show Deviation' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 bg-white border border-gray-200 shadow-sm rounded-sm"
            >
              <span className="text-[10px] text-gray-400 font-sans uppercase tracking-widest block mb-1">{item.date}</span>
              <h2 className="text-lg leading-tight">{item.title}</h2>
              <button className="mt-3 text-[10px] font-sans font-bold text-blue-600 uppercase tracking-widest">
                Read Abstract
              </button>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 pt-12">
          <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center">
            <Inbox className="w-5 h-5 text-gray-300" />
          </div>
          <p className="text-[10px] text-center font-sans uppercase tracking-[0.2em] text-gray-400">End of Cached Data</p>
        </div>
      </div>
    </div>
  );
}
