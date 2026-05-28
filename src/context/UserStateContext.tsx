'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  BuilderProfile, Mission, Opportunity, FeedItem, BuildLog, BuilderDNA, RadarMetrics, TimelineMilestone,
  Teammate, MomentumAISuggestion, MOCK_TEAMMATES,
  LeaderboardUser, MOCK_LEADERBOARD,
  INITIAL_MISSIONS, INITIAL_FEED, SUGGESTED_OPPORTUNITIES, SYNTHETIC_NAMES, SYNTHETIC_LOGS 
} from '../lib/dummy-data';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface UserStateContextType {
  profile: BuilderProfile | null;
  missions: Mission[];
  completedMissionIds: string[];
  opportunities: Opportunity[];
  feed: FeedItem[];
  teammates: Teammate[];
  aiSuggestions: MomentumAISuggestion[];
  leaderboard: LeaderboardUser[];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isOnboarded: boolean;
  justLeveledUp: boolean;
  xpEarnedAlert: number | null;
  setJustLeveledUp: (val: boolean) => void;
  setXpEarnedAlert: (val: number | null) => void;
  onboardUser: (
    name: string,
    focusArea: string,
    stage: string,
    excites: string,
    techStack: string[],
    goals: string[],
    interests: string[]
  ) => void;
  postBuildLog: (content: string) => void;
  completeMission: (missionId: string) => void;
  applaudFeedItem: (id: string) => void;
  joinOpportunity: (id: string) => void;
  resetApp: () => void;
}

const UserStateContext = createContext<UserStateContextType | undefined>(undefined);

export const UserStateProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<BuilderProfile | null>(null);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [completedMissionIds, setCompletedMissionIds] = useState<string[]>([]);
  const [teammates, setTeammates] = useState<Teammate[]>(MOCK_TEAMMATES);
  const [aiSuggestions, setAiSuggestions] = useState<MomentumAISuggestion[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load and apply theme on client mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('devhub_theme') as 'light' | 'dark' | null;
    const systemPrefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const activeTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(activeTheme);
    if (activeTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('devhub_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Generate dynamic, competitive rankings combining mocks with active user stats
  const getLeaderboardList = (): LeaderboardUser[] => {
    if (!profile) return MOCK_LEADERBOARD;
    
    const userRole = profile.focusArea.replace(' Builder', '').replace(' Developer', '');
    const userEntry: LeaderboardUser = {
      rank: 0,
      name: profile.name,
      avatar: profile.photoUrl,
      level: profile.level,
      xp: profile.xp,
      reputation: profile.reputation || 100,
      streak: profile.currentStreak,
      role: userRole
    };
    
    const combined = [...MOCK_LEADERBOARD.filter(x => x.name.toLowerCase() !== profile.name.toLowerCase()), userEntry];
    combined.sort((a, b) => b.xp - a.xp);
    return combined.map((entry, idx) => ({
      ...entry,
      rank: idx + 1
    }));
  };

  const leaderboard = getLeaderboardList();


  useEffect(() => {
    if (profile) {
      const suggestions: MomentumAISuggestion[] = [];
      const today = new Date().toDateString();
      const todayLog = profile.logs.find(log => new Date(log.date).toDateString() === today);

      if (!todayLog) {
        suggestions.push({
          id: 'sug-log',
          title: 'Ship Today\'s Progress',
          description: 'Post a daily build log to keep your streak multiplier active and claim XP.',
          highlight: 'Streak Multiplier',
          actionText: 'Post Build Log',
          xpReward: 15
        });
      }

      if (profile.focusArea.includes('AI')) {
        suggestions.push({
          id: 'sug-ai-1',
          title: 'Integrate Gemini API',
          description: 'Build a serverless Next.js endpoint processing unstructured prompt text.',
          highlight: 'Skill Acquisition',
          actionText: 'Start Mission',
          xpReward: 50
        });
      } else {
        suggestions.push({
          id: 'sug-web-1',
          title: 'Optimize Core Web Vitals',
          description: 'Deploy to Vercel and optimize LCP/FID to secure perfect Lighthouse scoring.',
          highlight: 'Vercel Deployment',
          actionText: 'Start Mission',
          xpReward: 50
        });
      }

      if (profile.techStack && profile.techStack.includes('React')) {
        suggestions.push({
          id: 'sug-react',
          title: 'Contribute to Lucide React',
          description: 'Open a pull request mapping SVGs on the official icons library repo.',
          highlight: 'Open Source',
          actionText: 'Explore Moves',
          xpReward: 80
        });
      }

      if (profile.goals && profile.goals.includes('Get Internship')) {
        suggestions.push({
          id: 'sug-intern',
          title: 'Optimize Builder Resume',
          description: 'Add Vercel live URLs & Github proof of work items to get immediate shortlists.',
          highlight: 'Career Readiness',
          actionText: 'Optimize Resume',
          xpReward: 100
        });
      }

      // Default suggestions if list is sparse
      if (suggestions.length < 3) {
        suggestions.push({
          id: 'sug-dsa',
          title: 'Practice DSA Challenge',
          description: 'Solve 2 array manipulation practice questions on Leetcode to level up coding.',
          highlight: 'Interview Prep',
          actionText: 'Practice DSA',
          xpReward: 30
        });
      }

      setAiSuggestions(suggestions.slice(0, 3));
    } else {
      setAiSuggestions([]);
    }
  }, [profile]);

  const [opportunities, setOpportunities] = useState<Opportunity[]>(SUGGESTED_OPPORTUNITIES);
  const [feed, setFeed] = useState<FeedItem[]>(INITIAL_FEED);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [justLeveledUp, setJustLeveledUp] = useState<boolean>(false);
  const [xpEarnedAlert, setXpEarnedAlert] = useState<number | null>(null);


  // 1. Load data from LocalStorage/Supabase on mount
  useEffect(() => {
    const loadLocalData = () => {
      const savedProfile = localStorage.getItem('devhub_profile');
      const savedOnboarded = localStorage.getItem('devhub_onboarded');
      const savedFeed = localStorage.getItem('devhub_feed');
      const savedCompletedMissions = localStorage.getItem('devhub_completed_missions');

      if (savedProfile && savedOnboarded === 'true') {
        setProfile(JSON.parse(savedProfile));
        setIsOnboarded(true);
      }
      if (savedFeed) {
        setFeed(JSON.parse(savedFeed));
      }
      if (savedCompletedMissions) {
        setCompletedMissionIds(JSON.parse(savedCompletedMissions));
      }
    };

    if (!isSupabaseConfigured || !supabase) {
      loadLocalData();
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!supabase) return;
      if (session?.user) {
        const userId = session.user.id;
        
        const { data: dbProfile, error } = await supabase
          .from('builder_profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (dbProfile) {
          const formattedProfile: BuilderProfile = {
            name: dbProfile.name,
            photoUrl: dbProfile.photo_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(dbProfile.name)}`,
            builderTitle: dbProfile.builder_title || 'Level 1 Explorer',
            currentStage: dbProfile.current_stage,
            focusArea: dbProfile.focus_area,
            excitementFactor: dbProfile.excitement_factor,
            xp: dbProfile.xp,
            level: dbProfile.level,
            momentumScore: dbProfile.momentum_score,
            currentStreak: dbProfile.current_streak,
            maxStreak: dbProfile.max_streak,
            radar: {
              coding: dbProfile.radar_coding,
              consistency: dbProfile.radar_consistency,
              community: dbProfile.radar_community,
              learning: dbProfile.radar_learning,
              building: dbProfile.radar_building
            },
            dna: {
              hacker: dbProfile.dna_hacker,
              creator: dbProfile.dna_creator,
              explorer: dbProfile.dna_explorer,
              researcher: dbProfile.dna_researcher,
              leader: dbProfile.dna_leader,
              builder: dbProfile.dna_builder
            },
            timeline: [],
            logs: []
          };

          // Fetch logs
          const { data: dbLogs } = await supabase
            .from('daily_logs')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (dbLogs) {
            formattedProfile.logs = dbLogs.map((log: any) => ({
              id: log.id,
              content: log.content,
              timestamp: new Date(log.created_at).toLocaleDateString() || 'Just now',
              date: log.created_at,
              applauds: log.applause_count,
              commentsCount: 0
            }));
          }

          // Fetch completed missions
          const { data: dbMissions } = await supabase
            .from('user_missions')
            .select('mission_id')
            .eq('user_id', userId)
            .eq('status', 'completed');
          
          if (dbMissions) {
            const completedIds = dbMissions.map((m: any) => m.mission_id);
            setCompletedMissionIds(completedIds);
          }

          // Fetch timeline milestones
          const { data: dbTimeline } = await supabase
            .from('momentum_timeline')
            .select('*')
            .eq('user_id', userId)
            .order('day_number', { ascending: false });

          if (dbTimeline) {
            formattedProfile.timeline = dbTimeline.map((item: any) => ({
              dayNumber: item.day_number,
              title: item.title,
              description: item.description || ''
            }));
          }

          setProfile(formattedProfile);
          setIsOnboarded(true);
        } else {
          setIsOnboarded(false);
          setProfile(null);
        }
      } else {
        loadLocalData();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 2. Save state helper
  const saveState = (newProfile: BuilderProfile, newFeed?: FeedItem[], newCompletedMissions?: string[]) => {
    setProfile(newProfile);
    localStorage.setItem('devhub_profile', JSON.stringify(newProfile));
    
    if (newFeed) {
      setFeed(newFeed);
      localStorage.setItem('devhub_feed', JSON.stringify(newFeed));
    }
    if (newCompletedMissions) {
      setCompletedMissionIds(newCompletedMissions);
      localStorage.setItem('devhub_completed_missions', JSON.stringify(newCompletedMissions));
    }
  };

  // 3. Periodic synthetic activity generator to keep feed feeling alive!
  useEffect(() => {
    if (!isOnboarded) return;

    const interval = setInterval(() => {
      // 30% chance every 12 seconds to inject a synthetic action
      if (Math.random() > 0.4) return;

      const randomName = SYNTHETIC_NAMES[Math.floor(Math.random() * SYNTHETIC_NAMES.length)];
      const isLog = Math.random() > 0.4;
      
      let text = '';
      let type: FeedItem['activityType'] = 'log_created';

      if (isLog) {
        const randomLog = SYNTHETIC_LOGS[Math.floor(Math.random() * SYNTHETIC_LOGS.length)];
        text = `shipped build log: "${randomLog}" 🚀`;
        type = 'log_created';
      } else {
        const randomMission = INITIAL_MISSIONS[Math.floor(Math.random() * INITIAL_MISSIONS.length)];
        const achievementsList = ['Level Up', '1-Day Streak', '3-Day Streak', 'Clean Code Ship'];
        const isMission = Math.random() > 0.5;
        if (isMission) {
          text = `completed the mission "${randomMission.title}" and gained +${randomMission.xpReward} XP! ⚡`;
          type = 'mission_completed';
        } else {
          const ach = achievementsList[Math.floor(Math.random() * achievementsList.length)];
          text = `unlocked the milestone achievement "${ach}"! 🎯`;
          type = 'achievement_unlocked';
        }
      }

      const newItem: FeedItem = {
        id: `synthetic-${Date.now()}`,
        name: randomName,
        activityType: type,
        text: text,
        timestamp: 'Just now',
        applauds: Math.floor(Math.random() * 5) + 1,
        hasApplauded: false
      };

      setFeed(prev => {
        const updated = [newItem, ...prev.slice(0, 19)]; // Cap feed at 20 items
        localStorage.setItem('devhub_feed', JSON.stringify(updated));
        return updated;
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [isOnboarded]);

  // Math for Level Progression
  // Level 1: 0 XP
  // Level 2: 100 XP
  // Level 3: 250 XP
  // Level 4: 450 XP
  // Level 5: 700 XP
  // Level L: Level L-1 + 100 + (L-2)*50
  const getLevelInfo = (xp: number) => {
    const thresholds = [0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700];
    // Dynamic generation above Level 10
    for (let i = 10; i <= 50; i++) {
      thresholds.push(thresholds[i - 1] + 500);
    }

    let level = 1;
    for (let i = 0; i < thresholds.length; i++) {
      if (xp >= thresholds[i]) {
        level = i + 1;
      } else {
        break;
      }
    }

    const currentThreshold = thresholds[level - 1];
    const nextThreshold = thresholds[level] || thresholds[level - 1] + 500;
    const progress = ((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100;

    return { level, progress, currentThreshold, nextThreshold };
  };

  // Helper to trigger XP burst animations
  const awardXP = (currentProfile: BuilderProfile, amount: number, activityTextForFeed?: string, type?: FeedItem['activityType']) => {
    const newXP = currentProfile.xp + amount;
    const prevLevelInfo = getLevelInfo(currentProfile.xp);
    const newLevelInfo = getLevelInfo(newXP);
    
    // Trigger visual XP alerts
    setXpEarnedAlert(amount);
    setTimeout(() => setXpEarnedAlert(null), 3000);

    let levelUpOccurred = false;
    if (newLevelInfo.level > prevLevelInfo.level) {
      levelUpOccurred = true;
      setJustLeveledUp(true);
    }

    // Dynamic Title Generation based on Level
    let baseTitle = currentProfile.builderTitle.split(' ').slice(1).join(' ') || 'Builder';
    if (currentProfile.builderTitle.includes('Explorer')) baseTitle = 'Explorer';
    if (currentProfile.builderTitle.includes('Hacker')) baseTitle = 'Hacker';
    if (currentProfile.builderTitle.includes('Creator')) baseTitle = 'Creator';
    if (currentProfile.builderTitle.includes('Architect')) baseTitle = 'Architect';
    
    const levelPrefixes = ['Starting', 'Novice', 'Rising', 'Agile', 'Vanguard', 'Elite', 'Mythic', 'Legendary'];
    const titleIdx = Math.min(Math.floor(newLevelInfo.level / 2), levelPrefixes.length - 1);
    const newTitle = `${levelPrefixes[titleIdx]} ${baseTitle}`;

    const updatedProfile: BuilderProfile = {
      ...currentProfile,
      xp: newXP,
      level: newLevelInfo.level,
      builderTitle: newTitle,
      momentumScore: Math.min(100, currentProfile.momentumScore + Math.floor(amount / 5))
    };

    let updatedFeed = [...feed];
    if (activityTextForFeed) {
      const userFeedItem: FeedItem = {
        id: `user-event-${Date.now()}`,
        name: currentProfile.name,
        activityType: type || 'log_created',
        text: activityTextForFeed,
        timestamp: 'Just now',
        applauds: 0,
        hasApplauded: false
      };
      updatedFeed = [userFeedItem, ...updatedFeed];
    }

    if (levelUpOccurred) {
      const levelUpFeedItem: FeedItem = {
        id: `user-levelup-${Date.now()}`,
        name: currentProfile.name,
        activityType: 'achievement_unlocked',
        text: `leveled up to Level ${newLevelInfo.level}! 🎉 Double growth velocity.`,
        timestamp: 'Just now',
        applauds: 0,
        hasApplauded: false
      };
      updatedFeed = [levelUpFeedItem, ...updatedFeed];
      
      // Add milestone to growth timeline
      updatedProfile.timeline = [
        {
          dayNumber: currentProfile.currentStreak || 1,
          title: `Leveled Up to Lvl ${newLevelInfo.level}`,
          description: `Crossed ${newXP} Total XP milestones!`
        },
        ...currentProfile.timeline
      ];
    }

    return { updatedProfile, updatedFeed };
  };

  // 4. Onboard Action
  const onboardUser = async (
    name: string,
    focusArea: string,
    stage: string,
    excites: string,
    techStack: string[],
    goals: string[],
    interests: string[]
  ) => {
    // Determine dynamic Title & Starter Mission
    let dynamicTitle = 'Level 1 Explorer';
    let startingRadar: RadarMetrics = { coding: 20, consistency: 10, community: 10, learning: 15, building: 15 };
    let startingDNA: BuilderDNA = { hacker: 16, creator: 16, explorer: 20, researcher: 16, leader: 16, builder: 16 };

    // Set title and DNA based on choices
    if (focusArea === 'AI Builder') {
      dynamicTitle = 'AI Explorer';
      startingDNA.researcher += 15;
      startingDNA.explorer += 10;
      startingRadar.learning += 15;
    } else if (focusArea === 'Web Builder') {
      dynamicTitle = 'Fullstack Creator';
      startingDNA.creator += 15;
      startingDNA.builder += 10;
      startingRadar.building += 15;
    } else if (focusArea === 'Cybersecurity') {
      dynamicTitle = 'Security Hacker';
      startingDNA.hacker += 20;
      startingRadar.coding += 10;
    } else if (focusArea === 'App Developer') {
      dynamicTitle = 'Mobile Creator';
      startingDNA.creator += 15;
      startingDNA.builder += 15;
    } else if (focusArea === 'Data Science') {
      dynamicTitle = 'Data Explorer';
      startingDNA.researcher += 20;
      startingDNA.explorer += 10;
      startingRadar.learning += 15;
    }

    // Adapt radar to developer's stage
    if (stage === 'Just Starting') {
      startingRadar.coding = 25;
    } else if (stage === 'Built Some Projects') {
      startingRadar.coding = 45;
      startingRadar.building += 10;
    } else if (stage === 'Hackathon Builder') {
      startingRadar.coding = 60;
      startingRadar.building += 15;
      startingRadar.consistency += 10;
    } else if (stage === 'Freelancer') {
      startingRadar.coding = 50;
      startingRadar.building += 20;
      startingRadar.community += 15;
    } else if (stage === 'Internship Ready') {
      startingRadar.coding = 65;
      startingRadar.building += 20;
      startingRadar.learning += 15;
    }

    const defaultProfile: BuilderProfile = {
      name,
      photoUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(name)}`,
      builderTitle: `Starting ${dynamicTitle}`,
      currentStage: stage,
      focusArea,
      excitementFactor: excites,
      xp: 0,
      level: 1,
      momentumScore: 25, // start high!
      currentStreak: 1, // generated profile day 1
      maxStreak: 1,
      radar: startingRadar,
      dna: startingDNA,
      timeline: [
        {
          dayNumber: 1,
          title: 'Joined DevHub Launchpad',
          description: `Unlocked dynamic starting identity: ${dynamicTitle}!`
        }
      ],
      logs: [],
      techStack,
      interests,
      goals,
      reputation: 100
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userId = session.user.id;
          
          // 1. Ensure user registry entry exists
          await supabase.from('users').upsert({
            id: userId,
            email: session.user.email || ''
          });

          // 2. Insert profile
          const { error: profileErr } = await supabase.from('builder_profiles').insert({
            id: userId,
            name,
            photo_url: defaultProfile.photoUrl,
            builder_title: defaultProfile.builderTitle,
            current_stage: stage,
            focus_area: focusArea,
            excitement_factor: excites,
            xp: 0,
            level: 1,
            momentum_score: 25,
            current_streak: 1,
            max_streak: 1,
            radar_coding: startingRadar.coding,
            radar_consistency: startingRadar.consistency,
            radar_community: startingRadar.community,
            radar_learning: startingRadar.learning,
            radar_building: startingRadar.building,
            dna_hacker: startingDNA.hacker,
            dna_creator: startingDNA.creator,
            dna_explorer: startingDNA.explorer,
            dna_researcher: startingDNA.researcher,
            dna_leader: startingDNA.leader,
            dna_builder: startingDNA.builder
          });

          if (profileErr) throw profileErr;

          // 3. Add timeline entry
          await supabase.from('momentum_timeline').insert({
            user_id: userId,
            day_number: 1,
            title: 'Joined DevHub Launchpad',
            description: `Unlocked dynamic starting identity: ${dynamicTitle}!`
          });
        }
      } catch (err: any) {
        console.error('Error synchronizing onboarding to Supabase:', err.message);
      }
    }

    setIsOnboarded(true);
    localStorage.setItem('devhub_onboarded', 'true');
    saveState(defaultProfile);
  };

  // 5. Post Build Log
  const postBuildLog = async (content: string) => {
    if (!profile) return;

    const now = new Date();
    const timestampStr = now.toLocaleDateString();
    const newLog: BuildLog = {
      id: `log-${Date.now()}`,
      content,
      timestamp: timestampStr,
      date: now.toISOString(),
      applauds: 0,
      commentsCount: 0
    };

    // Calculate Streak updates
    let updatedStreak = profile.currentStreak;
    let updatedMaxStreak = profile.maxStreak;
    
    // Simulating streak increment
    const lastActiveDateStr = localStorage.getItem('devhub_last_active_date');
    const todayStr = new Date().toDateString();
    
    if (lastActiveDateStr !== todayStr) {
      updatedStreak = profile.currentStreak + 1;
      if (updatedStreak > profile.maxStreak) {
        updatedMaxStreak = updatedStreak;
      }
      localStorage.setItem('devhub_last_active_date', todayStr);
    }

    // Dynamic radar metrics additions
    const newRadar = {
      coding: Math.min(100, profile.radar.coding + 4),
      consistency: Math.min(100, profile.radar.consistency + 6),
      community: profile.radar.community,
      learning: Math.min(100, profile.radar.learning + 2),
      building: Math.min(100, profile.radar.building + 5)
    };

    // Dynamic DNA adjustments: build logs shift creator + builder
    const newDNA = {
      ...profile.dna,
      creator: Math.min(100, profile.dna.creator + 2),
      builder: Math.min(100, profile.dna.builder + 2)
    };

    // Apply baseline profile changes
    const preModifiedProfile: BuilderProfile = {
      ...profile,
      logs: [newLog, ...profile.logs],
      currentStreak: updatedStreak,
      maxStreak: updatedMaxStreak,
      radar: newRadar,
      dna: newDNA
    };

    // Award +25 XP for first log, or +15 XP for normal daily log
    const xpReward = profile.logs.length === 0 ? 25 : 15;
    const feedText = profile.logs.length === 0 
      ? `shipped their FIRST build log: "${content}" +25 XP! 🏆` 
      : `shipped build log: "${content}" +15 XP! 🔥`;

    const { updatedProfile, updatedFeed } = awardXP(preModifiedProfile, xpReward, feedText, 'log_created');

    // Add milestones at crucial streak targets
    if (updatedStreak === 3 && profile.currentStreak < 3) {
      updatedProfile.timeline = [
        {
          dayNumber: 3,
          title: '3-Day Fire Streak',
          description: 'Logged consecutive momentum logs. Consistency locked!'
        },
        ...updatedProfile.timeline
      ];
    } else if (profile.logs.length === 0) {
      updatedProfile.timeline = [
        {
          dayNumber: 1,
          title: 'Shipped First Build Log',
          description: `Commited: "${content}"`
        },
        ...updatedProfile.timeline
      ];
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userId = session.user.id;

          // 1. Insert daily log
          const { data: logRow, error: logErr } = await supabase
            .from('daily_logs')
            .insert({
              user_id: userId,
              content
            })
            .select()
            .single();

          if (logErr) throw logErr;

          // 2. Insert XP Transaction
          await supabase.from('xp_transactions').insert({
            user_id: userId,
            amount: xpReward,
            activity_type: profile.logs.length === 0 ? 'first_build_log' : 'daily_log',
            description: feedText
          });

          // 3. Update profile stats on DB
          await supabase.from('builder_profiles').update({
            builder_title: updatedProfile.builderTitle,
            xp: updatedProfile.xp,
            level: updatedProfile.level,
            momentum_score: updatedProfile.momentumScore,
            current_streak: updatedProfile.currentStreak,
            max_streak: updatedProfile.maxStreak,
            radar_coding: updatedProfile.radar.coding,
            radar_consistency: updatedProfile.radar.consistency,
            radar_learning: updatedProfile.radar.learning,
            radar_building: updatedProfile.radar.building,
            dna_creator: updatedProfile.dna.creator,
            dna_builder: updatedProfile.dna.builder
          }).eq('id', userId);

          // 4. Feed activity insert
          await supabase.from('activity_feed').insert({
            user_id: userId,
            activity_type: 'log_created',
            payload: { text: feedText, log_id: logRow?.id || '' }
          });

          // 5. Timeline milestone sync
          if (profile.logs.length === 0) {
            await supabase.from('momentum_timeline').insert({
              user_id: userId,
              day_number: 1,
              title: 'Shipped First Build Log',
              description: `Commited: "${content}"`
            });
          } else if (updatedStreak === 3 && profile.currentStreak < 3) {
            await supabase.from('momentum_timeline').insert({
              user_id: userId,
              day_number: 3,
              title: '3-Day Fire Streak',
              description: 'Logged consecutive momentum logs. Consistency locked!'
            });
          }
        }
      } catch (err: any) {
        console.error('Error syncing build log to Supabase:', err.message);
      }
    }

    saveState(updatedProfile, updatedFeed);
  };

  // 6. Complete Mission
  const completeMission = async (missionId: string) => {
    if (!profile || completedMissionIds.includes(missionId)) return;

    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;

    const newCompleted = [...completedMissionIds, missionId];
    
    const newRadar = {
      ...profile.radar,
      coding: Math.min(100, profile.radar.coding + 6),
      learning: Math.min(100, profile.radar.learning + 8),
      building: Math.min(100, profile.radar.building + 4)
    };

    const newDNA = {
      ...profile.dna,
      explorer: Math.min(100, profile.dna.explorer + 3),
      hacker: Math.min(100, profile.dna.hacker + 2)
    };

    const preModifiedProfile: BuilderProfile = {
      ...profile,
      radar: newRadar,
      dna: newDNA,
      timeline: [
        {
          dayNumber: profile.currentStreak || 1,
          title: `Mission Completed: ${mission.title}`,
          description: `Acquired +${mission.xpReward} XP for building skills.`
        },
        ...profile.timeline
      ]
    };

    const feedText = `completed the mission: "${mission.title}" (+${mission.xpReward} XP)! ⚡`;
    const { updatedProfile, updatedFeed } = awardXP(preModifiedProfile, mission.xpReward, feedText, 'mission_completed');

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userId = session.user.id;

          // Ensure mission exists in DB first
          await supabase.from('missions').upsert({
            id: mission.id,
            title: mission.title,
            description: mission.description,
            xp_reward: mission.xpReward,
            category: mission.category
          });

          // Insert user completed mission
          await supabase.from('user_missions').upsert({
            user_id: userId,
            mission_id: missionId,
            status: 'completed',
            completed_at: new Date().toISOString()
          });

          // XP transaction ledger record
          await supabase.from('xp_transactions').insert({
            user_id: userId,
            amount: mission.xpReward,
            activity_type: 'mission_complete',
            description: feedText
          });

          // Update profile properties on DB
          await supabase.from('builder_profiles').update({
            builder_title: updatedProfile.builderTitle,
            xp: updatedProfile.xp,
            level: updatedProfile.level,
            momentum_score: updatedProfile.momentumScore,
            radar_coding: updatedProfile.radar.coding,
            radar_learning: updatedProfile.radar.learning,
            radar_building: updatedProfile.radar.building,
            dna_explorer: updatedProfile.dna.explorer,
            dna_hacker: updatedProfile.dna.hacker
          }).eq('id', userId);

          // Insert timeline element
          await supabase.from('momentum_timeline').insert({
            user_id: userId,
            day_number: profile.currentStreak || 1,
            title: `Mission Completed: ${mission.title}`,
            description: `Acquired +${mission.xpReward} XP for building skills.`
          });

          // Feed sync
          await supabase.from('activity_feed').insert({
            user_id: userId,
            activity_type: 'mission_completed',
            payload: { text: feedText, mission_id: missionId }
          });
        }
      } catch (err: any) {
        console.error('Error syncing completed mission to Supabase:', err.message);
      }
    }

    saveState(updatedProfile, updatedFeed, newCompleted);
  };

  // 7. Applaud Feed Item
  const applaudFeedItem = async (id: string) => {
    const updatedFeed = feed.map(item => {
      if (item.id === id) {
        const alreadyApplauded = item.hasApplauded;
        return {
          ...item,
          applauds: alreadyApplauded ? item.applauds - 1 : item.applauds + 1,
          hasApplauded: !alreadyApplauded
        };
      }
      return item;
    });

    setFeed(updatedFeed);
    localStorage.setItem('devhub_feed', JSON.stringify(updatedFeed));

    // Boost profile community radar metrics when user applauds others
    if (profile) {
      const activeItem = feed.find(i => i.id === id);
      const isPostApplaud = activeItem && !activeItem.hasApplauded;
      const newRadar = {
        ...profile.radar,
        community: Math.min(100, profile.radar.community + (isPostApplaud ? 2 : 0))
      };
      const updatedProfile = { ...profile, radar: newRadar };
      setProfile(updatedProfile);
      localStorage.setItem('devhub_profile', JSON.stringify(updatedProfile));

      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const userId = session.user.id;

            // Increment profile community radar
            await supabase.from('builder_profiles').update({
              radar_community: newRadar.community
            }).eq('id', userId);

            // Increment daily log applause if not synthetic
            const isSynthetic = id.startsWith('synthetic-');
            if (!isSynthetic) {
              const logId = id.replace('log-', '').replace('user-event-', '');
              const incrementVal = isPostApplaud ? 1 : -1;
              const { data: currentLog } = await supabase
                .from('daily_logs')
                .select('applause_count')
                .eq('id', logId)
                .single();
              
              if (currentLog) {
                await supabase.from('daily_logs').update({
                  applause_count: Math.max(0, currentLog.applause_count + incrementVal)
                }).eq('id', logId);
              }
            }
          }
        } catch (err: any) {
          console.error('Error saving applause to Supabase:', err.message);
        }
      }
    }
  };

  // 8. Join Opportunity / Curated Moves
  const joinOpportunity = async (id: string) => {
    if (!profile) return;

    const opp = opportunities.find(o => o.id === id);
    if (!opp) return;

    // Award +50 XP or specific reward XP for joining/doing
    const rewardXP = Math.floor(opp.rewardXp / 2); // get half up-front!
    
    const newRadar = {
      ...profile.radar,
      community: Math.min(100, profile.radar.community + 8),
      building: Math.min(100, profile.radar.building + 10)
    };

    const preModifiedProfile: BuilderProfile = {
      ...profile,
      radar: newRadar,
      timeline: [
        {
          dayNumber: profile.currentStreak || 1,
          title: `Registered: ${opp.title}`,
          description: `Applied for ${opp.type} organized by ${opp.organizer}!`
        },
        ...profile.timeline
      ]
    };

    const feedText = `joined the recommended move: "${opp.title}" (+${rewardXP} XP starting momentum)! 🎯`;
    const { updatedProfile, updatedFeed } = awardXP(preModifiedProfile, rewardXP, feedText, 'milestone_reached');

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userId = session.user.id;

          // Seed opportunity
          await supabase.from('opportunities').upsert({
            id: opp.id,
            title: opp.title,
            type: opp.type,
            reward_xp: opp.rewardXp,
            organizer: opp.organizer,
            description: opp.description,
            action_url: opp.actionUrl,
            tags: opp.tags
          });

          // Add XP transaction ledger
          await supabase.from('xp_transactions').insert({
            user_id: userId,
            amount: rewardXP,
            activity_type: 'hackathon_joined',
            description: feedText
          });

          // Update profile on DB
          await supabase.from('builder_profiles').update({
            builder_title: updatedProfile.builderTitle,
            xp: updatedProfile.xp,
            level: updatedProfile.level,
            momentum_score: updatedProfile.momentumScore,
            radar_community: updatedProfile.radar.community,
            radar_building: updatedProfile.radar.building
          }).eq('id', userId);

          // Add timeline entry
          await supabase.from('momentum_timeline').insert({
            user_id: userId,
            day_number: profile.currentStreak || 1,
            title: `Registered: ${opp.title}`,
            description: `Applied for ${opp.type} organized by ${opp.organizer}!`
          });

          // Feed sync
          await supabase.from('activity_feed').insert({
            user_id: userId,
            activity_type: 'milestone_reached',
            payload: { text: feedText, opportunity_id: opp.id }
          });
        }
      } catch (err: any) {
        console.error('Error syncing joined opportunity to Supabase:', err.message);
      }
    }

    saveState(updatedProfile, updatedFeed);
  };

  // 9. Reset Application
  const resetApp = async () => {
    localStorage.clear();
    setProfile(null);
    setIsOnboarded(false);
    setFeed(INITIAL_FEED);
    setCompletedMissionIds([]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err: any) {
        console.error('Error logging out from Supabase:', err.message);
      }
    }

    window.location.href = '/';
  };


  return (
    <UserStateContext.Provider value={{
      profile,
      missions,
      completedMissionIds,
      opportunities,
      feed,
      teammates,
      aiSuggestions,
      leaderboard,
      theme,
      toggleTheme,
      isOnboarded,
      justLeveledUp,
      xpEarnedAlert,
      setJustLeveledUp,
      setXpEarnedAlert,
      onboardUser,
      postBuildLog,
      completeMission,
      applaudFeedItem,
      joinOpportunity,
      resetApp
    }}>
      {children}
    </UserStateContext.Provider>
  );
};

export const useUserState = () => {
  const context = useContext(UserStateContext);
  if (context === undefined) {
    throw new Error('useUserState must be used within a UserStateProvider');
  }
  return context;
};
