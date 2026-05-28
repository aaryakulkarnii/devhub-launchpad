export interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  category: 'AI' | 'Web' | 'App' | 'Coding' | 'Cybersecurity' | 'Open Source' | 'Data Science';
}

export interface Opportunity {
  id: string;
  title: string;
  type: 'Hackathon' | 'Open Source' | 'Internship' | 'Freelance' | 'AI Challenge';
  rewardXp: number;
  organizer: string;
  description: string;
  rewardDetails: string;
  tags: string[];
  actionUrl: string;
}

export interface FeedItem {
  id: string;
  name: string;
  photoUrl?: string;
  activityType: 'log_created' | 'mission_completed' | 'achievement_unlocked' | 'milestone_reached';
  text: string;
  timestamp: string;
  applauds: number;
  hasApplauded?: boolean;
}

export interface BuildLog {
  id: string;
  content: string;
  timestamp: string;
  date: string;
  applauds: number;
  hasApplauded?: boolean;
  commentsCount: number;
}

export interface BuilderDNA {
  hacker: number;
  creator: number;
  explorer: number;
  researcher: number;
  leader: number;
  builder: number;
}

export interface RadarMetrics {
  coding: number;
  consistency: number;
  community: number;
  learning: number;
  building: number;
}

export interface TimelineMilestone {
  dayNumber: number;
  title: string;
  description: string;
}

export interface BuilderProfile {
  name: string;
  photoUrl: string;
  builderTitle: string;
  currentStage: string;
  focusArea: string;
  excitementFactor: string;
  xp: number;
  level: number;
  momentumScore: number;
  currentStreak: number;
  maxStreak: number;
  radar: RadarMetrics;
  dna: BuilderDNA;
  timeline: TimelineMilestone[];
  logs: BuildLog[];
}

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm1',
    title: 'Integrate your first AI Model API',
    description: 'Call Gemini API or OpenAI API from a serverless Next.js endpoint and print the response.',
    xpReward: 50,
    category: 'AI'
  },
  {
    id: 'm2',
    title: 'Deploy to Vercel in 1-Click',
    description: 'Set up an repository on Github and push it to Vercel production hosting.',
    xpReward: 50,
    category: 'Web'
  },
  {
    id: 'm3',
    title: 'Create a Glassmorphic Mobile Card UI',
    description: 'Create a beautiful card with border-white/10 and backdrop-blur CSS properties.',
    xpReward: 40,
    category: 'Web'
  },
  {
    id: 'm4',
    title: 'Implement dynamic map or filter JS logic',
    description: 'Solve 2 array manipulation practice questions on Leetcode or HackerRank.',
    xpReward: 30,
    category: 'Coding'
  },
  {
    id: 'm5',
    title: 'Fix one open bug in a community library',
    description: 'Contribute a typo fix or a bug fix pull request in a GitHub repo.',
    xpReward: 60,
    category: 'Open Source'
  }
];

export const SUGGESTED_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Tether India Hackathon 2026',
    type: 'Hackathon',
    rewardXp: 150,
    organizer: 'Devfolio India',
    description: 'A 36-hour physical hackathon in Bengaluru focused on building decentralized applications and AI wrappers.',
    rewardDetails: '₹2,500,000 Pool + Travel Reimbursements',
    tags: ['Next.js', 'Solidity', 'AI Wrappers', 'Bengaluru'],
    actionUrl: 'https://devfolio.co/tether'
  },
  {
    id: 'opp-2',
    title: 'Next-Gen AI Chat Agent Wrapper',
    type: 'AI Challenge',
    rewardXp: 100,
    organizer: 'Hyperflow AI (YC W25)',
    description: 'Build a personalized dynamic voice or agent wrapper using Gemini API in a weekend challenge.',
    rewardDetails: '₹15,000 Cash + Direct Interview Call',
    tags: ['Gemini API', 'Next.js', 'Framer Motion'],
    actionUrl: 'https://hyperflow.ai/challenge'
  },
  {
    id: 'opp-3',
    title: 'Lucide React Premium UI Library',
    type: 'Open Source',
    rewardXp: 80,
    organizer: 'Lucide Community',
    description: 'Contribute a clean Tailwind template or SVG icon mapping that can be leveraged by 10k+ active developers globally.',
    rewardDetails: 'Official Github Contributor Badge + Developer Kit',
    tags: ['React', 'SVGs', 'Tailwind', 'Github'],
    actionUrl: 'https://github.com/lucide-icons'
  },
  {
    id: 'opp-4',
    title: 'Founding Frontend Engineer Intern',
    type: 'Internship',
    organizer: 'Razorpay Labs (India)',
    description: 'Work with the incubation team at Razorpay building mobile-first checkouts. High autonomy, immediate ship cycles.',
    rewardXp: 200,
    rewardDetails: '₹35,000/month stipend + Conversion Offer',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Remote'],
    actionUrl: 'https://razorpay.com/careers'
  },
  {
    id: 'opp-5',
    title: 'Framer Motion Interactive Landing Page',
    type: 'Freelance',
    organizer: 'Koramangala VC Fund',
    description: 'Develop a liquid-feeling landing page for a new portfolio startup using Next.js and advanced Framer Motion transitions.',
    rewardXp: 120,
    rewardDetails: '₹12,000 Cash contract (3-day delivery)',
    tags: ['Next.js', 'Framer Motion', '390px Mobile Viewport'],
    actionUrl: 'https://kstart.in/contracts'
  }
];

export const INITIAL_FEED: FeedItem[] = [
  {
    id: 'f1',
    name: 'Rohan Sharma',
    activityType: 'mission_completed',
    text: 'completed the mission "Integrate your first AI Model API" and leveled up to Level 2! 🚀',
    timestamp: '2 mins ago',
    applauds: 14,
    hasApplauded: false
  },
  {
    id: 'f2',
    name: 'Ananya Iyer',
    activityType: 'log_created',
    text: 'shipped build log: "Configured beautiful custom scrollbars and dark mode using HSL variables in Tailwind!" 💎',
    timestamp: '5 mins ago',
    applauds: 8,
    hasApplauded: false
  },
  {
    id: 'f3',
    name: 'Priya Patel',
    activityType: 'milestone_reached',
    text: 'registered for the Razorpay Labs Founding Intern opportunity! Wish her luck! 🎯',
    timestamp: '15 mins ago',
    applauds: 23,
    hasApplauded: false
  },
  {
    id: 'f4',
    name: 'Aarav Gupta',
    activityType: 'achievement_unlocked',
    text: 'unlocked "3-Day Streak Fire" and earned +25 Bonus XP! 🔥',
    timestamp: '32 mins ago',
    applauds: 19,
    hasApplauded: false
  },
  {
    id: 'f5',
    name: 'Kabir Das',
    activityType: 'log_created',
    text: 'shipped build log: "Solved 3 array manipulations on Leetcode under 40 mins. Momentum is real!" 💻',
    timestamp: '1 hour ago',
    applauds: 5,
    hasApplauded: false
  }
];

export const SYNTHETIC_NAMES = [
  'Pranav Rao', 'Riya Sen', 'Ishaan Mehta', 'Sneha Reddy', 
  'Vikram Bose', 'Aditi Nair', 'Siddharth Rao', 'Pooja Hegde', 
  'Devendra Pal', 'Tanvi Joshi', 'Arjun Saxena', 'Kriti Verma'
];

export const SYNTHETIC_LOGS = [
  'Solved 2 Leetcode problems on HashMaps in 20 minutes! Let\'s go!',
  'Wrote custom glassmorphism card templates in Tailwind CSS v4.',
  'Learned SQL INNER/OUTER JOINs and wrote a simple local database schema.',
  'Added beautiful hover effects using Framer Motion to my navigation bar.',
  'Completed first coding challenge using the Gemini API. AI-wrapping is fun!',
  'Deployed my portfolio project directly on Vercel with zero downtime.',
  'Fixed a critical React hydration mismatch inside the bottom tab components.',
  'Pushed my first pull request to Lucide-React codebase. Typo fixed!',
  'Created an animated progress ring SVG from scratch with smooth CSS transitions.'
];
