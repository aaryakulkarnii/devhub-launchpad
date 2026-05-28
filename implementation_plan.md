# Implementation Plan - DevHub Builder OS Evolution

Evolve the current DevHub Launchpad project into a premium, cohesive, and intelligent builder operating system. This plan shifts the app from separate widgets and isolated mobile pages into a responsive, unified, and connected workspace inspired by Linear, Vercel, and GitHub.

---

## User Review Required

> [!IMPORTANT]
> **Key Architecture Decisions:**
> - **Unified Layout & Responsiveness:** On desktop (`lg` and above), we will leverage a responsive, multi-column dashboard grid to replace the narrow `max-w-[720px]` container inside the `DesktopShell`, allowing it to feel like a full-screen desktop application while maintaining the simulated phone framing for mobile/tablet resolutions.
> - **State Expansion:** We will update `UserStateContext.tsx` and `dummy-data.ts` to persist user-selected tech stacks, interests, teammates, and dynamically updated Momentum AI suggestion states.

---

## Proposed Changes

### 1. Core State & Schema Evolution

#### [MODIFY] [dummy-data.ts](file:///c:/Users/aarya/Downloads/devhub/src/lib/dummy-data.ts)
- Add new data interfaces for:
  - `Teammate` (name, role, skills, matchingScore, status, avatar)
  - `MomentumAISuggestion` (id, type, title, description, actionText, actionLink, difficulty)
- Extend `BuilderProfile` to hold `techStack` (string[]), `interests` (string[]), `goals` (string[]), and `reputation` (number).
- Define initial mocks for teammates and dynamic suggestions.

#### [MODIFY] [UserStateContext.tsx](file:///c:/Users/aarya/Downloads/devhub/src/context/UserStateContext.tsx)
- Expose `teammates`, `aiSuggestions`, and `onboardUser` updates to accept tech stack, goals, and interests.
- Create helper functions to automatically generate personalized AI recommendations based on the user's focus area and current level.

---

### 2. Immersive Step-Based Onboarding

#### [MODIFY] [page.tsx](file:///c:/Users/aarya/Downloads/devhub/src/app/onboarding/page.tsx)
- Redesign onboarding to feel like an interactive, step-by-step game setup.
- **Steps:**
  1. *Welcome & Name*: Immersive introduction.
  2. *Focus Area & Experience Level*: Card-based selections.
  3. *Tech Stack & Goals*: Multi-select tags (e.g., React, Gemini API, Solidity, Hackathons, Internships).
  4. *Compilation & Identity Reveal*: An animated terminal compile state followed by a high-fidelity "Builder ID Card" revealing starting Level, customized DNA breakdown, radar stats, and first milestone.
- Add smoother Framer Motion slide and scale transitions.

---

### 3. Connected Builder Workspace (Dashboard)

#### [MODIFY] [page.tsx](file:///c:/Users/aarya/Downloads/devhub/src/app/home/page.tsx)
- Redesign the workspace into a responsive grid.
- **Grid Layout (Desktop):**
  - **Left Area (Main Feed & Log Shipping):**
    - Quick Log Drawer/Form inline or as an interactive modal with autocomplete prompts.
    - Active daily goal and current missions list.
    - Community feed/Activity logs showing proof of work.
  - **Right Sidebar Area (Progress & Stats):**
    - **Momentum AI:** Tailored, actionable recommendation cards (e.g., "Deploy project to Vercel", "Improve GitHub profile", "Match with Aarav for Hackathon").
    - **Builder Identity Widget:** Visual Level indicator, XP progress bar, and Streaks.
    - **Radar Chart & DNA Archetype:** Interactive charts showcasing skill composition.
    - **Suggested Teammates:** Purpose-driven builder networking feed.
    - **Consistency Heatmap:** Calendar grid tracking shipping behavior.
- Apply a premium glassmorphic theme: softer gray-zinc card backdrops (`bg-zinc-900/40`), subtle glowing borders (`border-white/5`), clear typography hierarchy, and smooth hover translations.

---

### 4. Smart AI-Matched Opportunities

#### [MODIFY] [page.tsx](file:///c:/Users/aarya/Downloads/devhub/src/app/opportunities/page.tsx)
- Shift layout from a simple list to a curated match card view.
- Add **Match Percentage** display badge (e.g., "96% Fit") with a breakdown explanation (e.g., "Why it matches: High overlap with your Next.js and AI focus areas").
- Display required skills as clean badges.
- Introduce a "Recommended Teammates" widget directly on the opportunity card, suggesting other builders from the platform who complement the required skills.

---

### 5. Layout and Navigation Polish

#### [MODIFY] [DesktopShell.tsx](file:///c:/Users/aarya/Downloads/devhub/src/components/DesktopShell.tsx)
- Expand main content container limit on desktop from `max-w-[720px]` to `max-w-[1280px]` or full-width grid to support the multi-column layout.
- Clean up sidebar elements with persistent builder mini-status (XP progress, Level, Streak).

#### [MODIFY] [BottomNav.tsx](file:///c:/Users/aarya/Downloads/devhub/src/components/BottomNav.tsx)
- Update styling to align with the new glassmorphic theme.

---

## Verification Plan

### Manual Verification
1. Run local development environment: `npm run dev`
2. Test the onboarding flow: complete steps, select tech stack and goals, verify the compiling sequence and final Builder Identity generation.
3. Verify dashboard layout responsiveness by resizing the window from mobile (`390px` mockup) to desktop layout.
4. Verify Momentum AI cards correctly render context-aware recommendations.
5. Click "Accept Move" on opportunities, verify XP increments, and verify achievements list update.
