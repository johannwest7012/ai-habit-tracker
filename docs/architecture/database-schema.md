# Database Schema

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase Auth)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    profile_data JSONB DEFAULT '{
        "onboarding_completed": false,
        "timezone": "UTC"
    }'::jsonb,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
    notification_preferences JSONB DEFAULT '{
        "daily_reminder": true,
        "reminder_time": "09:00",
        "weekly_summary": true
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Goals table
CREATE TABLE public.goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    target_date DATE NOT NULL,
    roadmap JSONB NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
    current_stage_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    -- JSON schema validation
    CONSTRAINT roadmap_schema CHECK (
        jsonb_typeof(roadmap->'stages') = 'array' AND
        (roadmap->>'total_weeks')::int > 0 AND
        (roadmap->>'total_weeks')::int <= 52
    )
);

-- Weekly stages table
CREATE TABLE public.weekly_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL CHECK (week_number > 0 AND week_number <= 52),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    daily_habit JSONB NOT NULL DEFAULT '{
        "action": "",
        "tips": [],
        "skip_allowed": true
    }'::jsonb,
    success_criteria JSONB NOT NULL DEFAULT '{
        "required_days": 5,
        "total_days": 7
    }'::jsonb,
    status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'failed')),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(goal_id, week_number),
    -- Date validation
    CONSTRAINT check_dates CHECK (
        (start_date IS NULL AND end_date IS NULL) OR 
        (start_date IS NOT NULL AND end_date IS NOT NULL AND end_date > start_date)
    )
);

-- Add foreign key for current_stage_id after weekly_stages exists
ALTER TABLE public.goals 
ADD CONSTRAINT fk_current_stage 
FOREIGN KEY (current_stage_id) 
REFERENCES public.weekly_stages(id) ON DELETE SET NULL;

-- Habit logs table with UPSERT support
CREATE TABLE public.habit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    stage_id UUID NOT NULL REFERENCES public.weekly_stages(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('completed', 'skipped', 'missed')),
    notes TEXT,
    logged_at TIMESTAMPTZ DEFAULT NOW(),
    synced_at TIMESTAMPTZ,
    UNIQUE(stage_id, date)
);

-- Recalibrations table
CREATE TABLE public.recalibrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    goal_id UUID NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
    trigger_stage_id UUID REFERENCES public.weekly_stages(id),
    original_roadmap JSONB NOT NULL,
    new_roadmap JSONB NOT NULL,
    reason TEXT CHECK (reason IN ('repeated_failure', 'user_requested', 'pace_adjustment')),
    accepted_by_user BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stage tips table
CREATE TABLE public.stage_tips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage_id UUID NOT NULL REFERENCES public.weekly_stages(id) ON DELETE CASCADE,
    tips JSONB DEFAULT '[]'::jsonb,
    resources JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_goals_user_id ON public.goals(user_id);
CREATE INDEX idx_goals_status ON public.goals(status);
CREATE INDEX idx_weekly_stages_goal_id ON public.weekly_stages(goal_id);
CREATE INDEX idx_weekly_stages_status ON public.weekly_stages(status);
CREATE INDEX idx_habit_logs_user_id ON public.habit_logs(user_id);
CREATE INDEX idx_habit_logs_stage_id ON public.habit_logs(stage_id);
CREATE INDEX idx_habit_logs_date ON public.habit_logs(date);
CREATE INDEX idx_habit_logs_stage_date ON public.habit_logs(stage_id, date);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recalibrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stage_tips ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Goals policies
CREATE POLICY "Users can view own goals" ON public.goals
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own goals" ON public.goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON public.goals
    FOR UPDATE USING (auth.uid() = user_id);

-- Weekly stages policies
CREATE POLICY "Users can view own stages" ON public.weekly_stages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.goals 
            WHERE goals.id = weekly_stages.goal_id 
            AND goals.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update own stages" ON public.weekly_stages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.goals 
            WHERE goals.id = weekly_stages.goal_id 
            AND goals.user_id = auth.uid()
        )
    );

-- Habit logs policies
CREATE POLICY "Users can view own logs" ON public.habit_logs
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own logs" ON public.habit_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own logs" ON public.habit_logs
    FOR UPDATE USING (auth.uid() = user_id);

-- Recalibrations policies
CREATE POLICY "Users can view own recalibrations" ON public.recalibrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.goals 
            WHERE goals.id = recalibrations.goal_id 
            AND goals.user_id = auth.uid()
        )
    );

-- Stage tips policies
CREATE POLICY "Anyone can view tips" ON public.stage_tips
    FOR SELECT USING (true);

-- Functions for automated operations
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_weekly_stages_updated_at BEFORE UPDATE ON public.weekly_stages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Ensure only one active stage per goal
CREATE OR REPLACE FUNCTION ensure_single_active_stage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'active' THEN
        UPDATE public.weekly_stages
        SET status = 'completed'
        WHERE goal_id = NEW.goal_id
        AND id != NEW.id
        AND status = 'active';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER single_active_stage
BEFORE UPDATE ON public.weekly_stages
FOR EACH ROW
WHEN (NEW.status = 'active')
EXECUTE FUNCTION ensure_single_active_stage();

-- Function to check weekly progress
CREATE OR REPLACE FUNCTION public.check_weekly_progress(p_stage_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
    v_days_completed INTEGER;
    v_required_days INTEGER;
    v_total_days INTEGER;
BEGIN
    SELECT 
        (success_criteria->>'required_days')::INTEGER,
        (success_criteria->>'total_days')::INTEGER
    INTO v_required_days, v_total_days
    FROM public.weekly_stages
    WHERE id = p_stage_id;
    
    SELECT COUNT(*)
    INTO v_days_completed
    FROM public.habit_logs
    WHERE stage_id = p_stage_id
    AND status = 'completed';
    
    v_result := jsonb_build_object(
        'completed', v_days_completed >= v_required_days,
        'days_completed', v_days_completed,
        'days_required', v_required_days,
        'percentage', ROUND((v_days_completed::NUMERIC / v_total_days) * 100)
    );
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function for UPSERT pattern in habit logs
CREATE OR REPLACE FUNCTION public.log_habit(
    p_user_id UUID,
    p_stage_id UUID,
    p_date DATE,
    p_status TEXT,
    p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO public.habit_logs (user_id, stage_id, date, status, notes)
    VALUES (p_user_id, p_stage_id, p_date, p_status, p_notes)
    ON CONFLICT (stage_id, date) 
    DO UPDATE SET 
        status = EXCLUDED.status,
        notes = EXCLUDED.notes,
        logged_at = NOW(),
        synced_at = NOW()
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```
