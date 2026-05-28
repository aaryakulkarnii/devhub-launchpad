import { BuilderProfile, Teammate, Opportunity } from './dummy-data';

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  actionType: 'build' | 'profile' | 'opportunities' | 'practice';
  xpReward: number;
  highlight: string;
}

export interface GrowthMetric {
  name: string;
  change: string;
  positive: boolean;
  status: string;
}

export interface InterviewInsight {
  readinessScore: number;
  confidence: 'High' | 'Medium' | 'Low';
  companyFit: string;
  fitReason: string;
  missingSkills: string[];
  suggestions: string[];
}

export interface ResumeReport {
  score: number;
  missingSkills: string[];
  keywordsRecommended: string[];
  weakSections: string[];
  formattingScore: number;
  suggestions: string[];
}

export interface AIDailyGoal {
  id: string;
  text: string;
  xp: number;
  done: boolean;
}

// 1. Generate intelligent, contextual recommendation cards
export function getAIRecommendations(profile: BuilderProfile): AIRecommendation[] {
  const recs: AIRecommendation[] = [];
  const focus = profile.focusArea.toLowerCase();
  const hasReact = profile.techStack?.includes('React') || profile.techStack?.includes('Next.js');
  const logsCount = profile.logs.length;

  if (logsCount === 0) {
    recs.push({
      id: 'rec-1',
      title: 'Ship your first proof-of-work log',
      description: 'Document a micro-achievement from your current project to unlock active streak multipliers.',
      actionType: 'build',
      xpReward: 25,
      highlight: 'First Shipment'
    });
  } else if (profile.currentStreak < 3) {
    recs.push({
      id: 'rec-streak',
      title: 'Maintain your shipping streak',
      description: 'Post today\'s update to cement consistency habits and lock in streak XP boosts.',
      actionType: 'build',
      xpReward: 15,
      highlight: 'Streak Lock'
    });
  }

  if (profile.radar.coding < 50) {
    recs.push({
      id: 'rec-dsa',
      title: 'Practice coding algorithms',
      description: 'Solve two dynamic programming or array exercises to improve interview readiness scoring.',
      actionType: 'practice',
      xpReward: 30,
      highlight: 'DSA Practice'
    });
  }

  if (focus.includes('ai')) {
    recs.push({
      id: 'rec-ai-deploy',
      title: 'Deploy serverless LLM router',
      description: 'Implement a prompt processing route with schema validation using Google GenAI SDK.',
      actionType: 'build',
      xpReward: 50,
      highlight: 'AI Integration'
    });
  } else {
    recs.push({
      id: 'rec-web-opt',
      title: 'Optimize Lighthouse core web vitals',
      description: 'Audit paint timings (LCP) and lazy load non-critical image files to secure high UX ratings.',
      actionType: 'build',
      xpReward: 40,
      highlight: 'Web Optimization'
    });
  }

  if (profile.goals?.includes('Get Internship') && profile.level < 5) {
    recs.push({
      id: 'rec-resume',
      title: 'Polish and analyze your builder resume',
      description: 'Use DevHub Resume Intelligence to check alignment for startup checkouts internships.',
      actionType: 'profile',
      xpReward: 50,
      highlight: 'ATS Alignment'
    });
  }

  if (hasReact) {
    recs.push({
      id: 'rec-framer',
      title: 'Create fluid glassmorphic interactive cards',
      description: 'Add layout animations and physics-based hover transitions to web navigation containers.',
      actionType: 'build',
      xpReward: 35,
      highlight: 'UI Design'
    });
  }

  // Fallback default
  if (recs.length < 3) {
    recs.push({
      id: 'rec-readme',
      title: 'Improve your profile README page',
      description: 'Add live deploy links and clean project architecture breakdown graphics.',
      actionType: 'profile',
      xpReward: 20,
      highlight: 'Public Profile'
    });
  }

  return recs.slice(0, 3);
}

// 2. Generate growth tracking metrics
export function getGrowthMetrics(profile: BuilderProfile): GrowthMetric[] {
  const codingScore = profile.radar.coding;
  const consistencyScore = profile.radar.consistency;
  const buildingScore = profile.radar.building;

  return [
    {
      name: 'Skill Coding Score',
      change: `+${Math.floor(codingScore * 0.15)}% growth`,
      positive: true,
      status: codingScore > 60 ? 'Strong shipping velocity' : 'Need regular exercises'
    },
    {
      name: 'Consistency Factor',
      change: profile.currentStreak > 2 ? '+22% momentum' : '+5% starting',
      positive: profile.currentStreak > 1,
      status: profile.currentStreak > 2 ? 'Streak multiplier active' : 'Log builds to improve score'
    },
    {
      name: 'Ecosystem Collaborations',
      change: 'Active match analysis',
      positive: true,
      status: 'Teammates suggested'
    },
    {
      name: 'Project Architecting',
      change: `+${Math.floor(buildingScore * 0.12)}% progress`,
      positive: true,
      status: buildingScore > 50 ? 'Scalable structure' : 'Build fullstack projects'
    }
  ];
}

// 3. Generate interview readiness insights
export function getInterviewInsights(profile: BuilderProfile): InterviewInsight {
  const coding = profile.radar.coding;
  const building = profile.radar.building;
  const consistency = profile.radar.consistency;

  const score = Math.min(100, Math.floor((coding * 0.4) + (building * 0.4) + (consistency * 0.2)));
  const confidence = score > 75 ? 'High' : score > 50 ? 'Medium' : 'Low';

  let companyFit = 'Product-Focused Startups';
  let fitReason = 'Your rapid project ship cycle and self-directed building align perfectly with early-stage autonomy.';
  if (coding > 75 && building < 50) {
    companyFit = 'Scale-ups & Infrastructure Teams';
    fitReason = 'High algorithmic efficiency focus; strong fit for scalability bottlenecks and core service design.';
  } else if (consistency > 80 && building > 75) {
    companyFit = 'Founding Engineer / Accelerator Hackers';
    fitReason = 'Persistent shipping consistency and end-to-end full-stack assembly makes you ideal for prototyping teams.';
  }

  const missingSkills: string[] = [];
  const suggestions: string[] = [];

  const focus = profile.focusArea.toLowerCase();
  const stack = profile.techStack || [];

  if (focus.includes('ai')) {
    if (!stack.includes('Python') && !stack.includes('PyTorch')) {
      missingSkills.push('Python / PyTorch');
      suggestions.push('Build one model training or fine-tuning pipeline to consolidate AI fundamentals.');
    }
    if (!stack.includes('Gemini API') && !stack.includes('OpenAI API')) {
      missingSkills.push('LLM Web Routing');
      suggestions.push('Expose a backend web route call streaming dynamic prompt inputs.');
    }
  } else {
    if (!stack.includes('Next.js') && !stack.includes('React')) {
      missingSkills.push('Modern UI Frameworks (React/Next.js)');
      suggestions.push('Rebuild your landing screen template using standard Tailwind client components.');
    }
  }

  if (building < 45) {
    missingSkills.push('Database Migrations');
    suggestions.push('Connect Supabase or a local SQL engine to record structured project configurations.');
  }

  if (suggestions.length === 0) {
    suggestions.push('Host full-stack projects using custom proxy layers to demonstrate enterprise scalability.');
  }

  return {
    readinessScore: score,
    confidence,
    companyFit,
    fitReason,
    missingSkills: missingSkills.slice(0, 3),
    suggestions: suggestions.slice(0, 2)
  };
}

// 4. Analyze pasted resume data
export function getResumeReport(content: string, profile: BuilderProfile): ResumeReport {
  const cleaned = content.toLowerCase();
  let score = 55;
  const missingSkills: string[] = [];
  const keywordsRecommended: string[] = [];
  const weakSections: string[] = [];
  const suggestions: string[] = [];

  // Match resume text with core builder stack
  const stack = profile.techStack || [];
  stack.forEach(tech => {
    if (cleaned.includes(tech.toLowerCase())) {
      score += 5;
    } else {
      missingSkills.push(tech);
    }
  });

  // Check metrics & impact focus
  const hasImpactMetrics = /\b(percent|%|saved|increased|million|thousand|users|reduced|revenue|optimized)\b/g.test(cleaned);
  if (hasImpactMetrics) {
    score += 15;
  } else {
    weakSections.push('Impact Statements & Measurable Results');
    suggestions.push('Include numbers to quantify achievements (e.g., "Optimized bundle size by 35% resulting in faster LCP").');
  }

  // Check deployment/git items
  if (!cleaned.includes('github') && !cleaned.includes('git')) {
    weakSections.push('Proof-of-work Links');
    suggestions.push('Add clickable GitHub profile links and live deployment URLs directly into project headings.');
  }

  if (!cleaned.includes('vercel') && !cleaned.includes('docker') && !cleaned.includes('aws') && !cleaned.includes('deploy')) {
    keywordsRecommended.push('Vercel Deployments', 'CI/CD Pipelines');
    suggestions.push('Explicitly describe where your apps are hosted (e.g., Vercel, Netlify, AWS).');
  }

  if (cleaned.length < 200) {
    score = Math.min(score, 45);
    weakSections.push('Content Length & Depth');
    suggestions.push('Flesh out core professional project modules. Bullet points look thin.');
  }

  const finalScore = Math.max(25, Math.min(98, score));
  return {
    score: finalScore,
    missingSkills: missingSkills.slice(0, 3),
    keywordsRecommended: keywordsRecommended.slice(0, 2),
    weakSections,
    formattingScore: finalScore > 75 ? 90 : 70,
    suggestions: suggestions.slice(0, 3)
  };
}

// 5. Generate dynamic Daily Momentum Goals
export function generateDailyGoals(profile: BuilderProfile): AIDailyGoal[] {
  const focus = profile.focusArea.toLowerCase();
  const goalsList: AIDailyGoal[] = [];

  // Goal 1: Consistency log (standard)
  goalsList.push({
    id: 'goal-log',
    text: 'Log a daily build updates log (+15 XP)',
    xp: 15,
    done: false
  });

  // Goal 2: Tech stack/Focus specific
  if (focus.includes('ai')) {
    goalsList.push({
      id: 'goal-ai-dsa',
      text: 'Expose dynamic agent schema call (+30 XP)',
      xp: 30,
      done: false
    });
  } else {
    goalsList.push({
      id: 'goal-web-dsa',
      text: 'Solve one array manipulation DSA logic (+30 XP)',
      xp: 30,
      done: false
    });
  }

  // Goal 3: Opportunities/Networking
  goalsList.push({
    id: 'goal-connect',
    text: 'Connect with a suggested builder profile (+15 XP)',
    xp: 15,
    done: false
  });

  // Goal 4: Profile/Resume
  if (profile.radar.building < 50) {
    goalsList.push({
      id: 'goal-deploy',
      text: 'Commit project updates to public GitHub (+20 XP)',
      xp: 20,
      done: false
    });
  } else {
    goalsList.push({
      id: 'goal-resume-check',
      text: 'Perform an AI resume ATS alignment review (+20 XP)',
      xp: 20,
      done: false
    });
  }

  return goalsList;
}

// 6. Generate Builder Profile Summary
export function getBuilderSummary(profile: BuilderProfile): string {
  const focus = profile.focusArea;
  const coding = profile.radar.coding;
  const consistency = profile.radar.consistency;

  let builderType = 'ambitious explorer';
  if (coding > 70 && consistency > 70) {
    builderType = 'high-momentum, highly reliable engineer';
  } else if (coding > 70) {
    builderType = 'technically deep programmer';
  } else if (consistency > 75) {
    builderType = 'extraordinarily consistent builder';
  }

  const stackStr = profile.techStack && profile.techStack.length > 0 
    ? ` working with ${profile.techStack.slice(0, 3).join(', ')}` 
    : '';

  return `A ${builderType}${stackStr}. Shows a strong preference for ${focus.toLowerCase()} tasks. Demonstrates exceptional speed in shipping micro-features, though collaboration and community engagement can be expanded.`;
}
