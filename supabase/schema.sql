-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users table (linked to Supabase auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Builder Profiles
create table public.builder_profiles (
  id uuid references public.users on delete cascade primary key,
  name text not null,
  photo_url text,
  builder_title text default 'Level 1 Explorer',
  current_stage text not null, -- 'Just Starting', 'Built Some Projects', etc.
  focus_area text not null, -- 'AI Builder', 'Web Builder', etc.
  excitement_factor text not null, -- 'Building Products', 'Winning Hackathons', etc.
  xp integer default 0 not null,
  level integer default 1 not null,
  momentum_score integer default 10 not null,
  current_streak integer default 0 not null,
  max_streak integer default 0 not null,
  last_active_at timestamp with time zone default timezone('utc'::text, now()),
  
  -- Radar values (0-100 scale)
  radar_coding integer default 20 not null,
  radar_consistency integer default 10 not null,
  radar_community integer default 10 not null,
  radar_learning integer default 15 not null,
  radar_building integer default 15 not null,
  
  -- DNA percentages (Hacker, Creator, Explorer, Researcher, Leader, Builder)
  dna_hacker integer default 16 not null,
  dna_creator integer default 16 not null,
  dna_explorer integer default 20 not null,
  dna_researcher integer default 16 not null,
  dna_leader integer default 16 not null,
  dna_builder integer default 16 not null,
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Daily Build Logs (Daily habit feature)
create table public.daily_logs (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.builder_profiles on delete cascade not null,
  content text not null, -- "Solved 2 Leetcode problems", "Built navbar", etc.
  applause_count integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. XP Transactions (Gamification Ledger)
create table public.xp_transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.builder_profiles on delete cascade not null,
  amount integer not null,
  activity_type text not null, -- 'first_build_log', 'daily_log', 'mission_complete', 'hackathon_joined', 'portfolio_added'
  description text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Missions (Dynamic Daily Builder Challenges)
create table public.missions (
  id uuid default uuid_generate_v4() primary key,
  title text not null, -- "Build one AI feature", "Deploy to Vercel", "Integrate Supabase"
  description text not null,
  xp_reward integer not null,
  category text not null, -- 'AI', 'Web', 'Data', etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User-Mission Junction table
create table public.user_missions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.builder_profiles on delete cascade not null,
  mission_id uuid references public.missions on delete cascade not null,
  status text default 'assigned' not null, -- 'assigned', 'in_progress', 'completed'
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, mission_id)
);

-- 6. Achievements
create table public.achievements (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text not null,
  icon_name text not null,
  xp_award integer not null,
  requirement_type text not null -- 'streak_5', 'logs_10', 'level_10', etc.
);

-- User-Achievement Junction table
create table public.user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.builder_profiles on delete cascade not null,
  achievement_id uuid references public.achievements on delete cascade not null,
  unlocked_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_id)
);

-- 7. Live Activity Feed (Momentum Feed)
create table public.activity_feed (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.builder_profiles on delete cascade not null,
  activity_type text not null, -- 'log_created', 'mission_completed', 'achievement_unlocked', 'milestone_reached'
  payload jsonb not null, -- metadata like {"log_id": "...", "text": "..."}
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Streaks tracking
create table public.streaks (
  user_id uuid references public.builder_profiles on delete cascade primary key,
  current_streak integer default 0 not null,
  longest_streak integer default 0 not null,
  last_log_date date,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Recommended Opportunities (Curated "Next Moves")
create table public.opportunities (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  type text not null, -- 'Hackathon', 'Open Source', 'Internship', 'Freelance', 'AI Challenge'
  reward_xp integer default 100 not null,
  organizer text not null,
  description text not null,
  action_url text not null,
  tags text[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Followers
create table public.followers (
  id uuid default uuid_generate_v4() primary key,
  follower_id uuid references public.builder_profiles on delete cascade not null,
  following_id uuid references public.builder_profiles on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(follower_id, following_id)
);

-- 11. Comments for Daily Logs
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  log_id uuid references public.daily_logs on delete cascade not null,
  user_id uuid references public.builder_profiles on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. Notifications (Gamified notifications)
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.builder_profiles on delete cascade not null,
  type text not null, -- 'applause', 'comment', 'streak_alert', 'level_up', 'new_mission'
  sender_id uuid references public.builder_profiles on delete cascade,
  message text not null,
  read boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 13. Momentum Timeline (The growth journey ledger)
create table public.momentum_timeline (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.builder_profiles on delete cascade not null,
  day_number integer not null, -- Day 1, Day 3, Day 7...
  title text not null, -- "Joined DevHub", "First Build Log", etc.
  description text,
  event_date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- TRIGGERS AND FUNCTIONS
-- ==========================================

-- Function to automatically recalculate level based on XP on transactions
create or replace function public.recalculate_level()
returns trigger as $$
declare
  new_level integer;
  current_xp integer;
begin
  -- Get user's current XP sum
  select sum(amount) into current_xp from public.xp_transactions where user_id = NEW.user_id;
  if current_xp is null then
    current_xp := 0;
  end if;

  -- Math Step Thresholds:
  -- Level 1: <100 XP
  -- Level 2: 100-249 XP
  -- Level 3: 250-449 XP
  -- Level 4: 450-699 XP
  -- Level 5: 700-999 XP
  -- Scale Level: 5 + floor((current_xp - 1000) / 400) capped at level 50
  if current_xp < 100 then
    new_level := 1;
  elsif current_xp < 250 then
    new_level := 2;
  elsif current_xp < 450 then
    new_level := 3;
  elsif current_xp < 700 then
    new_level := 4;
  elsif current_xp < 1000 then
    new_level := 5;
  else
    new_level := 5 + floor((current_xp - 1000) / 400);
  end if;
  
  if new_level > 50 then
    new_level := 50;
  end if;

  -- Update builder profile
  update public.builder_profiles
  set xp = current_xp, level = new_level
  where id = NEW.user_id;

  return NEW;
end;
$$ language plpgsql security definer;

create trigger trigger_xp_added
  after insert on public.xp_transactions
  for each row execute function public.recalculate_level();
