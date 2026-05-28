import { BuilderProfile, Opportunity } from './dummy-data';

export interface SkillDetail {
  name: string;
  confidence: number; // 0-100
  level: 'Expert' | 'Intermediate' | 'Beginner';
}

export interface CompanyMatch {
  name: string;
  reason: string;
  matchScore: number;
}

export interface RecommendedProject {
  title: string;
  description: string;
  stack: string[];
}

export interface ParsedResumeData {
  score: number;
  label: string;
  skillsCompleted: SkillDetail[];
  skillsNeeded: string[];
  readiness: {
    frontend: number;
    backend: number;
    ai: number;
    startup: number;
  };
  companyFits: CompanyMatch[];
  missingKeywords: string[];
  growthRecommendations: string[];
  recommendedProjects: RecommendedProject[];
}

// Full List of known skills we can detect in a resume text
const KNOWN_SKILLS = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Solidity', 
  'PostgreSQL', 'Tailwind', 'Framer Motion', 'PyTorch', 'Docker', 
  'Kubernetes', 'AWS', 'System Design', 'CI/CD', 'Git', 'JavaScript', 
  'HTML', 'CSS', 'GraphQL', 'MongoDB', 'Go', 'Rust'
];

export function parseResumeContent(text: string, profile: BuilderProfile): ParsedResumeData {
  const cleaned = text.toLowerCase();
  
  // 1. Extract completed skills from text
  const skillsCompleted: SkillDetail[] = [];
  KNOWN_SKILLS.forEach(skill => {
    if (cleaned.includes(skill.toLowerCase())) {
      // Base confidence off occurrences or profile levels
      const baseConfidence = cleaned.split(skill.toLowerCase()).length > 2 ? 85 : 65;
      skillsCompleted.push({
        name: skill,
        confidence: baseConfidence,
        level: baseConfidence > 80 ? 'Expert' : 'Intermediate'
      });
    }
  });

  // Fallback to profile tech stack if none found
  if (skillsCompleted.length === 0 && profile.techStack) {
    profile.techStack.forEach(skill => {
      skillsCompleted.push({
        name: skill,
        confidence: 70,
        level: 'Intermediate'
      });
    });
  }

  // 2. Compute missing skills
  const completedNames = skillsCompleted.map(s => s.name.toLowerCase());
  const focus = profile.focusArea.toLowerCase();
  
  const targetSkills = focus.includes('ai') 
    ? ['Python', 'PyTorch', 'Gemini API', 'Node.js', 'Docker', 'System Design']
    : ['Next.js', 'React', 'TypeScript', 'Tailwind', 'Node.js', 'PostgreSQL', 'Docker'];
  
  const skillsNeeded = targetSkills.filter(s => !completedNames.includes(s.toLowerCase()));
  if (skillsNeeded.length === 0) {
    skillsNeeded.push('System Design', 'Kubernetes', 'AWS Cloud Infrastructure');
  }

  // 3. Compute readiness scores
  let frontendScore = 40;
  let backendScore = 40;
  let aiScore = 30;
  let startupScore = 50;

  if (completedNames.includes('react') || completedNames.includes('next.js') || completedNames.includes('tailwind')) {
    frontendScore += 40;
  }
  if (completedNames.includes('typescript')) frontendScore += 10;

  if (completedNames.includes('node.js') || completedNames.includes('postgresql') || completedNames.includes('mongodb')) {
    backendScore += 40;
  }
  if (completedNames.includes('go') || completedNames.includes('rust')) backendScore += 15;

  if (completedNames.includes('python') || completedNames.includes('pytorch')) {
    aiScore += 50;
  }

  if (skillsCompleted.length > 5) startupScore += 25;
  if (cleaned.includes('intern') || cleaned.includes('shipped') || cleaned.includes('deployed')) {
    startupScore += 15;
  }

  // 4. Score calculation
  const totalScore = Math.min(98, Math.max(30, Math.floor(
    (frontendScore * 0.3) + (backendScore * 0.3) + (aiScore * 0.2) + (startupScore * 0.2)
  )));

  let label = 'Needs Technical Proof-of-Work';
  if (totalScore > 80) {
    label = 'Interview Ready & High Impact';
  } else if (totalScore > 60) {
    label = 'Strong Intermediate Core';
  }

  // 5. Company fits
  const companyFits: CompanyMatch[] = [];
  if (frontendScore > 75) {
    companyFits.push({
      name: 'Vercel',
      reason: 'Your portfolio highlights premium React/Next.js skills and fluid layout interactions.',
      matchScore: 92
    });
    companyFits.push({
      name: 'Notion',
      reason: 'Aligned with product-oriented frontend architecture and rich responsive interface engineering.',
      matchScore: 88
    });
  }
  if (aiScore > 70) {
    companyFits.push({
      name: 'Google Gemini Team',
      reason: 'Demonstrated experience in Python model interfaces and embedding workflows.',
      matchScore: 85
    });
  }
  if (backendScore > 70) {
    companyFits.push({
      name: 'Stripe',
      reason: 'Clean backend integration signals; high algorithmic security and solid SQL ledger records.',
      matchScore: 89
    });
  }

  if (companyFits.length === 0) {
    companyFits.push({
      name: 'Early-stage Startup Incubators',
      reason: 'Perfect for fast prototyping, feature iteration, and rapid shipping feedback loops.',
      matchScore: 75
    });
  }

  // 6. Missing keywords
  const missingKeywords: string[] = [];
  const requiredKeywords = ['scalability', 'optimization', 'performance', 'deployment', 'testing', 'ci/cd', 'system design'];
  requiredKeywords.forEach(kw => {
    if (!cleaned.includes(kw)) {
      missingKeywords.push(kw);
    }
  });

  // 7. Growth recommendations
  const growthRecommendations: string[] = [];
  if (backendScore < 60) {
    growthRecommendations.push('Build one full-stack platform exposing a secure REST/GraphQL backend.');
  }
  if (frontendScore < 60) {
    growthRecommendations.push('Add modern glassmorphic Tailwind dashboards or high-performance CSS grids.');
  }
  if (!cleaned.includes('metric') && !cleaned.includes('%')) {
    growthRecommendations.push('Add measurable impact metrics (e.g. bundle size reduced by 30%, LCP optimized).');
  }
  if (growthRecommendations.length === 0) {
    growthRecommendations.push('Contribute a bug fix or feature mapping to community open-source modules.');
  }

  // 8. Recommended projects
  const recommendedProjects: RecommendedProject[] = [];
  if (aiScore < 50 && focus.includes('ai')) {
    recommendedProjects.push({
      title: 'Contextual LLM Wrapper Dashboard',
      description: 'A platform leveraging model parameters that saves prompts history and streams audio/video responses.',
      stack: ['Next.js', 'Python', 'Gemini API', 'Tailwind']
    });
  } else if (backendScore < 60) {
    recommendedProjects.push({
      title: 'Scalable Real-time Collaboration SaaS',
      description: 'Create document sync servers using sockets and database locking triggers.',
      stack: ['Node.js', 'PostgreSQL', 'Docker', 'Next.js']
    });
  } else {
    recommendedProjects.push({
      title: 'Lighthouse Devops Shipping Portal',
      description: 'Build a server monitoring tool checking bundle sizes, speed index, and deploy timelines.',
      stack: ['TypeScript', 'CI/CD', 'Next.js', 'Docker']
    });
  }

  return {
    score: totalScore,
    label,
    skillsCompleted,
    skillsNeeded,
    readiness: {
      frontend: Math.min(100, frontendScore),
      backend: Math.min(100, backendScore),
      ai: Math.min(100, aiScore),
      startup: Math.min(100, startupScore)
    },
    companyFits: companyFits.sort((a, b) => b.matchScore - a.matchScore),
    missingKeywords,
    growthRecommendations,
    recommendedProjects
  };
}
