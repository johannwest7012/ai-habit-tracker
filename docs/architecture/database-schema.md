# Database Schema

Transform the conceptual data models into concrete PostgreSQL schemas with proper constraints, indexes, and relationships:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  notification_preferences JSONB NOT NULL DEFAULT '{
    "daily_reminder": true,
    "weekly_summary": true,
    "level_up_celebration": true,
    "preferred_time": "08:00"
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Journeys table
CREATE TABLE public.journeys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL CHECK (length(title) <= 100),
  description TEXT NOT NULL CHECK (length(description) <= 1000),
  ai_generated_plan JSONB NOT NULL,
  current_stage_id UUID,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Stages table
CREATE TABLE public.stages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  journey_id UUID REFERENCES public.journeys(id) ON DELETE CASCADE NOT NULL,
  stage_number INTEGER NOT NULL CHECK (stage_number > 0),
  title TEXT NOT NULL CHECK (length(title) <= 200),
  description TEXT NOT NULL CHECK (length(description) <= 500),
  daily_habit_prompt TEXT NOT NULL CHECK (length(daily_habit_prompt) <= 300),
  success_criteria JSONB NOT NULL DEFAULT '{
    "target_days_per_week": 3,
    "required_consecutive_weeks": 2
  }'::jsonb,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'failed', 'replanning')),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(journey_id, stage_number)
);

-- Tasks table
CREATE TABLE public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  stage_id UUID REFERENCES public.stages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  response TEXT CHECK (response IN ('yes', 'no', 'skip')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(stage_id, date)
);

-- Add foreign key constraint for current_stage_id after stages table is created
ALTER TABLE public.journeys 
ADD CONSTRAINT fk_current_stage 
FOREIGN KEY (current_stage_id) REFERENCES public.stages(id);

-- Indexes for performance
CREATE INDEX idx_journeys_user_id ON public.journeys(user_id);
CREATE INDEX idx_journeys_status ON public.journeys(status);
CREATE INDEX idx_stages_journey_id ON public.stages(journey_id);
CREATE INDEX idx_stages_status ON public.stages(status);
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_stage_id ON public.stages(stage_id);
CREATE INDEX idx_tasks_date ON public.tasks(date);
CREATE INDEX idx_tasks_user_date ON public.tasks(user_id, date);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_journeys_updated_at BEFORE UPDATE ON public.journeys 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Journey policies
CREATE POLICY "Users can view own journeys" ON public.journeys
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own journeys" ON public.journeys
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own journeys" ON public.journeys
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own journeys" ON public.journeys
    FOR DELETE USING (auth.uid() = user_id);

-- Stage policies (inherit from journey ownership)
CREATE POLICY "Users can view own stages" ON public.stages
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.journeys WHERE id = journey_id AND user_id = auth.uid())
    );
CREATE POLICY "Users can manage own stages" ON public.stages
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.journeys WHERE id = journey_id AND user_id = auth.uid())
    );

-- Task policies
CREATE POLICY "Users can view own tasks" ON public.tasks
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own tasks" ON public.tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON public.tasks
    FOR UPDATE USING (auth.uid() = user_id);
```

**Schema Design Considerations:**
- **RLS Policies:** Ensure complete data isolation between users
- **Constraints:** Prevent invalid data entry with CHECK constraints
- **Indexes:** Optimized for common query patterns (user-specific data, date ranges)
- **Triggers:** Automatic timestamp management for audit trails
- **JSONB Fields:** Flexible storage for AI-generated content and user preferences
- **Cascading Deletes:** Maintain referential integrity when journeys are deleted
