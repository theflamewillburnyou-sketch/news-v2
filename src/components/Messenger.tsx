import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, Shield, Settings, UserPlus, 
  Trash2, Eye, EyeOff, LogOut, 
  Search, MessageSquare, ChevronLeft 
} from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import { nanoid } from 'nanoid';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  burnOnRead?: boolean;
  isSelf: boolean;
}

interface Chat {
  id: string;
  contactName: string;
  lastMessage: string;
  unread?: boolean;
}

export function Messenger({ onExit }: { onExit: () => void }) {
  const [view, setView] = useState<'chats' | 'chat' | 'settings' | 'add'>('chats');
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [shadowId] = useState(() => `MID-${nanoid(6).toUpperCase()}`);
  const [burnOnRead, setBurnOnRead] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chats: Chat[] = [
    { id: '1', contactName: 'Agent X', lastMessage: 'The package is secure.', unread: true },
    { id: '2', contactName: 'Shadow Oracle', lastMessage: 'Awaiting confirmation.' },
  ];

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const msg: Message = {
      id: Date.now().toString(),
      senderId: 'me',
      text: newMessage,
      timestamp: Date.now(),
      burnOnRead,
      isSelf: true
    };

    setMessages([...messages, msg]);
    setNewMessage('');
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, view]);

  const renderHeader = (title: string, backView?: 'chats' | 'chat' | 'settings' | 'add') => (
    <div className="flex items-center justify-between p-4 border-b border-luxury-border bg-luxury-bg/80 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-3">
        {backView && (
          <button onClick={() => setView(backView)} className="p-1 hover:bg-white/5 rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-sm font-bold tracking-widest uppercase">{title}</h2>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setView('settings')} className="p-2 hover:bg-white/5 rounded-full">
          <Settings className="w-5 h-5 opacity-40 hover:opacity-100 transition-opacity" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-luxury-bg border border-luxury-border rounded-md overflow-hidden shadow-2xl relative">
      {/* Messenger Views */}
      <AnimatePresence mode="wait">
        {view === 'chats' && (
          <motion.div 
            key="chats"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            {renderHeader('Messages')}
            <div className="p-4">
              <button 
                onClick={() => setView('add')}
                className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase hover:bg-white/10 transition-colors"
              >
                <UserPlus className="w-4 h-4" /> New Contact
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chats.map(chat => (
                <button 
                  key={chat.id}
                  onClick={() => { setActiveChat(chat); setView('chat'); }}
                  className="w-full p-4 flex items-start gap-4 border-b border-luxury-border/50 hover:bg-white/5 transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-stealth-accent/10 border border-stealth-accent/20 flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-stealth-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm">{chat.contactName}</span>
                      {chat.unread && <div className="w-2 h-2 rounded-full bg-stealth-accent" />}
                    </div>
                    <p className="text-xs text-white/40 truncate">{chat.lastMessage}</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {view === 'chat' && activeChat && (
          <motion.div 
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col h-full"
          >
            {renderHeader(activeChat.contactName, 'chats')}
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="text-center py-8">
                <div className="inline-block px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase tracking-widest text-white/30">
                  Secure Connection Established
                </div>
              </div>
              {messages.map(msg => (
                <div key={msg.id} className={cn("flex flex-col", msg.isSelf ? "items-end" : "items-start")}>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-sm text-sm break-words",
                    msg.isSelf ? "bg-stealth-accent text-black font-medium" : "bg-luxury-surface border border-luxury-border text-white"
                  )}>
                    {msg.text}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[9px] text-white/30 uppercase tracking-tighter">
                    {msg.burnOnRead && <Trash2 className="w-2.5 h-2.5" />}
                    {formatDate(msg.timestamp)}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-luxury-surface border-t border-luxury-border gap-2">
              <div className="flex items-center gap-2 mb-2">
                <button 
                  onClick={() => setBurnOnRead(!burnOnRead)}
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded text-[9px] uppercase tracking-widest font-bold border transition-colors",
                    burnOnRead ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-white/5 border-white/10 text-white/30"
                  )}
                >
                   {burnOnRead ? <Trash2 className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} Burn on Read
                </button>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Midnight signal..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-stealth-accent/50"
                />
                <button 
                  onClick={sendMessage}
                  className="p-3 bg-stealth-accent text-black rounded-sm hover:bg-stealth-accent/80 transition-all active:scale-90"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'settings' && (
          <motion.div 
            key="settings"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col p-6 space-y-8"
          >
             {renderHeader('Vault Settings', 'chats')}
             
             <section className="space-y-4">
               <div>
                 <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-2 block">Shadow Identity</label>
                 <div className="p-4 bg-white/5 border border-dashed border-white/10 rounded flex justify-between items-center">
                    <span className="font-mono text-stealth-accent tracking-wider">{shadowId}</span>
                    <button className="text-[10px] text-white/40 hover:text-white uppercase font-bold">Copy</button>
                 </div>
               </div>

               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-2 block">System Controls</label>
                 {[
                   { icon: Shield, label: 'Screenshot Block', active: true },
                   { icon: Trash2, label: 'Auto-Purge (30d)', active: true },
                 ].map((opt, i) => (
                   <div key={i} className="flex justify-between items-center p-4 bg-white/5 border border-white/10 rounded">
                     <div className="flex items-center gap-3">
                       <opt.icon className="w-4 h-4 text-white/60" />
                       <span className="text-sm font-medium">{opt.label}</span>
                     </div>
                     <div className={cn("w-2 h-2 rounded-full", opt.active ? "bg-stealth-accent" : "bg-white/10")} />
                   </div>
                 ))}
               </div>
             </section>

             <button 
                onClick={onExit}
                className="w-full py-4 mt-auto border border-red-500/20 text-red-500 text-xs font-bold tracking-[0.2em] uppercase hover:bg-red-500/5 transition-all flex items-center justify-center gap-2"
             >
               <LogOut className="w-4 h-4" /> Terminate Session
             </button>
          </motion.div>
        )}

        {view === 'add' && (
           <motion.div 
            key="add"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 flex flex-col"
          >
             {renderHeader('Add Shadow', 'chats')}
             <div className="p-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-white/30">Target Shadow ID</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. MID-XJ9L2"
                      className="flex-1 bg-white/5 border border-white/10 rounded-sm px-4 py-3 text-sm focus:outline-none focus:border-stealth-accent/50"
                    />
                    <button className="p-3 bg-white/10 rounded-sm">
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-white/30 uppercase leading-relaxed font-medium">
                  Adding a contact sends a one-time handshake request. Your Identity remains hidden until confirmed.
                </p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
