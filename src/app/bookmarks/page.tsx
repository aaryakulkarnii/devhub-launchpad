'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bookmark, ExternalLink, Trash2, Users, Compass, Laptop, FolderGit2
} from 'lucide-react';
import { useUserState } from '../../context/UserStateContext';

export default function BookmarksPage() {
  const router = useRouter();
  const { profile, isOnboarded } = useUserState();

  const [activeTab, setActiveTab] = useState<'opportunities' | 'builders' | 'projects'>('opportunities');

  // Interactive bookmarks lists state
  const [savedOpps, setSavedOpps] = useState([
    { id: 'so-1', title: 'Tether India Hackathon 2026', host: 'Devfolio India', type: 'Hackathon', stipend: '₹2.5M prize pool' },
    { id: 'so-2', title: 'Founding Frontend Intern', host: 'Razorpay Labs', type: 'Internship', stipend: '₹35,000/mo' }
  ]);

  const [savedBuilders, setSavedBuilders] = useState([
    { id: 'sb-1', name: 'Vivek Singh', role: 'Fullstack Dev', match: '92% Match', avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Vivek' }
  ]);

  const [savedProjects, setSavedProjects] = useState([
    { id: 'sp-1', name: 'AI Interview Copilot', creator: 'Ananya Sharma', status: 'Building' }
  ]);

  // Guard onboarding
  useEffect(() => {
    if (!isOnboarded || !profile) {
      router.push('/');
    }
  }, [isOnboarded, profile, router]);

  if (!profile) return null;

  const handleRemoveOpp = (id: string) => {
    setSavedOpps(savedOpps.filter(o => o.id !== id));
  };

  const handleRemoveBuilder = (id: string) => {
    setSavedBuilders(savedBuilders.filter(b => b.id !== id));
  };

  const handleRemoveProject = (id: string) => {
    setSavedProjects(savedProjects.filter(p => p.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col px-4 py-5 select-none relative z-10 gap-6 pb-20 max-w-5xl mx-auto w-full text-left">
      
      {/* Title Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
          <Bookmark className="text-brand-xp" /> Bookmarks Vault
        </h1>
        <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1 font-medium leading-relaxed">
          Manage your saved opportunities, builder connections, and active projects.
        </p>
      </div>

      {/* Tab select buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 select-none border-b border-brand-border">
        <button
          onClick={() => setActiveTab('opportunities')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 -mb-[1px] ${activeTab === 'opportunities' ? 'border-brand-xp text-zinc-900 dark:text-white font-extrabold' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
        >
          Saved Opportunities
        </button>
        <button
          onClick={() => setActiveTab('builders')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 -mb-[1px] ${activeTab === 'builders' ? 'border-brand-xp text-zinc-900 dark:text-white font-extrabold' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
        >
          Saved Builders
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all border-b-2 -mb-[1px] ${activeTab === 'projects' ? 'border-brand-xp text-zinc-900 dark:text-white font-extrabold' : 'border-transparent text-zinc-500 hover:text-zinc-800'}`}
        >
          Saved Projects
        </button>
      </div>

      {/* Tab grid lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          
          {/* Opportunities tab */}
          {activeTab === 'opportunities' && savedOpps.map(o => (
            <motion.div
              key={o.id}
              layout
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-5 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] bg-zinc-100 dark:bg-zinc-805 border border-brand-border text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full font-bold uppercase">{o.type}</span>
                  <span className="text-xs font-black text-brand-xp">{o.stipend}</span>
                </div>
                <h3 className="text-sm font-black text-zinc-900 dark:text-white mt-3">{o.title}</h3>
                <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold uppercase mt-1 block">by {o.host}</span>
              </div>
              
              <div className="flex items-center justify-between mt-5 pt-3 border-t border-brand-border">
                <button 
                  onClick={() => router.push('/opportunities')}
                  className="text-[9px] font-black uppercase tracking-wider text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-1"
                >
                  View Details <ExternalLink size={10} />
                </button>
                <button 
                  onClick={() => handleRemoveOpp(o.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 border border-transparent hover:border-red-500/20"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Builders tab */}
          {activeTab === 'builders' && savedBuilders.map(b => (
            <motion.div
              key={b.id}
              layout
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-4 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 text-left">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-brand-border bg-zinc-100" />
                <div className="flex flex-col">
                  <span className="text-xs font-black text-zinc-950 dark:text-white">{b.name}</span>
                  <span className="text-[9px] text-brand-level font-black uppercase">{b.role} • {b.match}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => router.push('/people')}
                  className="py-1 px-2.5 rounded bg-zinc-150 dark:bg-zinc-800 text-zinc-800 dark:text-white text-[9px] font-black uppercase tracking-wider border border-brand-border"
                >
                  Invite
                </button>
                <button 
                  onClick={() => handleRemoveBuilder(b.id)}
                  className="p-1.5 rounded hover:bg-red-500/10 text-red-500"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </motion.div>
          ))}

          {/* Projects tab */}
          {activeTab === 'projects' && savedProjects.map(p => (
            <motion.div
              key={p.id}
              layout
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-4 rounded-3xl border border-brand-border bg-white dark:bg-zinc-900/10 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-brand-border flex items-center justify-center text-zinc-500">
                  <FolderGit2 size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black text-zinc-950 dark:text-white">{p.name}</span>
                  <span className="text-[9px] text-zinc-500 dark:text-zinc-450 font-semibold">Created by {p.creator} • {p.status}</span>
                </div>
              </div>

              <button 
                onClick={() => handleRemoveProject(p.id)}
                className="p-1.5 rounded hover:bg-red-500/10 text-red-500"
              >
                <Trash2 size={12} />
              </button>
            </motion.div>
          ))}

        </AnimatePresence>
      </div>

    </div>
  );
}
