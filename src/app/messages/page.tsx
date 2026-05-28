'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  MessageSquare, Volume2, Paperclip, Send, Hash, Users, Sparkles, Folder
} from 'lucide-react';
import { useUserState } from '../../context/UserStateContext';

export default function MessagesPage() {
  const router = useRouter();
  const { profile, isOnboarded } = useUserState();

  const [activeChannel, setActiveChannel] = useState('#general');
  const [chatInput, setChatInput] = useState('');
  
  // Interactive chat messages state
  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'Rohan Sharma', text: 'Hey Parth, are we syncing on the Tether hackathon contract today?', time: '12:05 PM', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Rohan' },
    { id: 'm2', sender: 'Ananya Iyer', text: 'I completed the mock UI draft. Check out the shared design resources!', time: '12:10 PM', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Ananya' }
  ]);

  // Guard onboarding
  useEffect(() => {
    if (!isOnboarded || !profile) {
      router.push('/');
    }
  }, [isOnboarded, profile, router]);

  if (!profile) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: profile.name,
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      avatar: profile.photoUrl
    };

    setMessages([...messages, newMsg]);
    setChatInput('');
  };

  const channels = ['#general', '#hackathon-prep', '#ai-agents'];
  
  const activeVoiceMates = [
    { name: 'Rohan Sharma', status: 'Speaking' },
    { name: 'Ananya Iyer', status: 'Muted' }
  ];

  const sharedFiles = [
    { name: 'Tether_India_Pitch.pdf', size: '4.2 MB' },
    { name: 'index_styles.css', size: '12 KB' }
  ];

  return (
    <div className="flex-1 flex flex-col px-4 py-5 select-none relative z-10 gap-6 pb-20 max-w-5xl mx-auto w-full text-left">
      
      {/* Title Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
          <MessageSquare className="text-brand-xp" /> Collaboration Board
        </h1>
        <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1 font-medium leading-relaxed">
          Slack-style channels, voice huddles, and shared project documents.
        </p>
      </div>

      {/* Main Container panel */}
      <div className="glass-panel rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10 overflow-hidden flex h-[500px]">
        
        {/* 1. Left Channel Sidebar */}
        <div className="w-[180px] border-r border-brand-border bg-zinc-50/50 dark:bg-zinc-950/20 p-4 flex flex-col gap-5 select-none shrink-0">
          <div className="flex flex-col gap-2">
            <span className="text-[9px] text-zinc-450 dark:text-zinc-500 font-black uppercase tracking-wider pl-1">Channels</span>
            {channels.map(c => (
              <button
                key={c}
                onClick={() => setActiveChannel(c)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeChannel === c ? 'bg-zinc-200/60 dark:bg-white/10 text-zinc-900 dark:text-white font-extrabold' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-350'}`}
              >
                <Hash size={13} /> {c.substring(1)}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Middle Chat Box */}
        <div className="flex-1 flex flex-col justify-between h-full bg-white dark:bg-zinc-900/5">
          {/* Channel Name Header */}
          <div className="border-b border-brand-border p-3.5 flex items-center justify-between bg-zinc-50/30">
            <span className="text-xs font-black text-zinc-900 dark:text-white flex items-center gap-1.5"><Hash size={13} /> {activeChannel.substring(1)}</span>
            <span className="text-[9px] text-zinc-450 font-bold uppercase">2 Members Online</span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
            {messages.map(m => (
              <div key={m.id} className="flex items-start gap-3 text-left">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-brand-border bg-zinc-100 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-zinc-850 dark:text-white">{m.sender}</span>
                    <span className="text-[8px] text-zinc-450 dark:text-zinc-550 font-semibold">{m.time}</span>
                  </div>
                  <p className="text-xs text-zinc-700 dark:text-zinc-250 font-semibold leading-relaxed mt-0.5">{m.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat text box sender form */}
          <form onSubmit={handleSendMessage} className="border-t border-brand-border p-3 flex items-center gap-2 bg-zinc-50/30">
            <button type="button" className="p-2 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/5 text-zinc-550 shrink-0">
              <Paperclip size={14} />
            </button>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={`Message ${activeChannel}...`}
              className="flex-1 bg-zinc-50 dark:bg-black/20 border border-brand-border rounded-xl px-3.5 py-2 text-xs text-zinc-900 dark:text-white placeholder-zinc-450 focus:outline-none"
            />
            <button type="submit" className="p-2 rounded-lg bg-brand-xp text-white dark:text-black hover:opacity-95 shrink-0">
              <Send size={14} className="stroke-[2.5]" />
            </button>
          </form>
        </div>

        {/* 3. Right Voice Room & Documents pane (hidden on mobile) */}
        <div className="w-[180px] border-l border-brand-border bg-zinc-50/50 dark:bg-zinc-950/20 p-4 flex flex-col gap-6 select-none shrink-0 hidden md:flex">
          {/* Voice huddles */}
          <div className="flex flex-col gap-2 text-left">
            <span className="text-[9px] text-zinc-450 dark:text-zinc-550 font-black uppercase tracking-wider flex items-center gap-1"><Volume2 size={11} /> Voice Room</span>
            <div className="flex flex-col gap-2 mt-1">
              {activeVoiceMates.map(vm => (
                <div key={vm.name} className="flex items-center justify-between text-[10px] bg-zinc-150/40 dark:bg-white/5 p-1.5 rounded-lg border border-brand-border">
                  <span className="font-black text-zinc-800 dark:text-white truncate">{vm.name}</span>
                  <span className="text-[8px] text-brand-cyber font-semibold">{vm.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shared files list */}
          <div className="flex flex-col gap-2 text-left">
            <span className="text-[9px] text-zinc-450 dark:text-zinc-550 font-black uppercase tracking-wider flex items-center gap-1"><Folder size={11} /> Shared Files</span>
            <div className="flex flex-col gap-2 mt-1">
              {sharedFiles.map(f => (
                <div key={f.name} className="flex flex-col p-1.5 bg-zinc-150/40 dark:bg-white/5 border border-brand-border rounded-lg text-left">
                  <span className="text-[9px] font-black text-zinc-800 dark:text-zinc-200 truncate">{f.name}</span>
                  <span className="text-[8px] text-zinc-450 dark:text-zinc-550 mt-0.5">{f.size}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
