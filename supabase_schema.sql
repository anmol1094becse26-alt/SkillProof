-- ==============================================================================
-- SkillProof: Production-Grade Supabase Schema with Realtime Subscriptions
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/wosrzuibwgtvulnrrhte/sql
-- ==============================================================================

-- 1. Challenges Table
CREATE TABLE IF NOT EXISTS public.challenges (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    duration TEXT NOT NULL DEFAULT '30m',
    skills TEXT[] NOT NULL DEFAULT '{}',
    description TEXT NOT NULL DEFAULT '',
    starter_code TEXT NOT NULL DEFAULT '',
    test_cases JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_by TEXT DEFAULT 'system',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    role TEXT NOT NULL CHECK (role IN ('student', 'employer', 'university')),
    university TEXT,
    company TEXT,
    bio TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_university TEXT,
    challenge_id TEXT NOT NULL,
    challenge_title TEXT NOT NULL,
    category TEXT NOT NULL,
    code TEXT NOT NULL,
    explanation TEXT,
    followup_answer TEXT,
    status TEXT NOT NULL DEFAULT 'Verified' CHECK (status IN ('Verified', 'Under Review', 'Failed')),
    score NUMERIC NOT NULL DEFAULT 0,
    passed_tests INTEGER NOT NULL DEFAULT 0,
    total_tests INTEGER NOT NULL DEFAULT 0,
    duration_ms NUMERIC DEFAULT 1.0,
    ast_uniqueness NUMERIC DEFAULT 95.0,
    skills_evaluated JSONB DEFAULT '[]'::jsonb,
    cryptographic_seal TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Skill Passports Table
CREATE TABLE IF NOT EXISTS public.skill_passports (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL UNIQUE,
    student_name TEXT NOT NULL,
    student_university TEXT,
    trust_score NUMERIC NOT NULL DEFAULT 0,
    verified_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_challenges_passed INTEGER NOT NULL DEFAULT 0,
    cryptographic_seal TEXT,
    last_verified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Interview Invites Table
CREATE TABLE IF NOT EXISTS public.interview_invites (
    id TEXT PRIMARY KEY,
    employer_id TEXT NOT NULL,
    employer_name TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'Invited' CHECK (status IN ('Invited', 'Scheduled', 'Accepted', 'Declined')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_passports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_invites ENABLE ROW LEVEL SECURITY;

-- Allow Public/Anon Access Policies (Full access for app demo)
CREATE POLICY "Public Read/Write Challenges" ON public.challenges FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write Profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write Submissions" ON public.submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write Passports" ON public.skill_passports FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write Invites" ON public.interview_invites FOR ALL USING (true) WITH CHECK (true);

-- Enable Realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.challenges;
ALTER PUBLICATION supabase_realtime ADD TABLE public.submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.skill_passports;
ALTER PUBLICATION supabase_realtime ADD TABLE public.interview_invites;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
