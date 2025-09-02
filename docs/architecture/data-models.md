# Data Models

## User Model

**Purpose:** Core user account and authentication data

**Key Attributes:**
- id: UUID - Unique user identifier (Supabase Auth UUID)
- email: string - User email for authentication
- created_at: timestamp - Account creation date
- profile_data: JSON - Flexible profile information (name, avatar_url, timezone)
- subscription_tier: enum - 'free' | 'premium' (for future monetization)
- notification_preferences: JSON - Push notification settings

**TypeScript Interface:**
```typescript
interface User {
  id: string;
  email: string;
  created_at: Date;
  profile_data: {
    name?: string;
    avatar_url?: string;
    timezone: string;
    onboarding_completed: boolean;
  };
  subscription_tier: 'free' | 'premium';
  notification_preferences: {
    daily_reminder: boolean;
    reminder_time: string; // "09:00"
    weekly_summary: boolean;
  };
}
```

**Relationships:**
- Has many Goals
- Has many HabitLogs

## Goal Model

**Purpose:** Represents a long-term user goal with AI-generated roadmap

**Key Attributes:**
- id: UUID - Unique goal identifier
- user_id: UUID - Owner of the goal
- title: string - User's stated goal ("Learn Spanish")
- description: text - Detailed goal context
- target_date: date - Expected completion date
- roadmap: JSON - AI-generated progression plan
- status: enum - 'active' | 'paused' | 'completed' | 'abandoned'
- created_at: timestamp - Goal creation date

**TypeScript Interface:**
```typescript
interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  target_date: Date;
  roadmap: Roadmap;
  status: 'active' | 'paused' | 'completed' | 'abandoned';
  created_at: Date;
  current_stage_id?: string;
}

interface Roadmap {
  stages: WeeklyStage[];
  total_weeks: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  ai_generation_params: {
    model: string;
    prompt_version: string;
    generated_at: Date;
  };
}
```

**Relationships:**
- Belongs to User
- Has many WeeklyStages
- Has many HabitLogs (through stages)

## WeeklyStage Model

**Purpose:** Represents one week's habits and progression within a goal

**Key Attributes:**
- id: UUID - Unique stage identifier
- goal_id: UUID - Parent goal
- week_number: integer - Sequential week (1, 2, 3...)
- title: string - Stage name ("Foundation Building")
- description: text - What user will achieve this week
- daily_habit: JSON - The specific daily action
- success_criteria: JSON - Completion requirements
- status: enum - 'upcoming' | 'active' | 'completed' | 'failed'

**TypeScript Interface:**
```typescript
interface WeeklyStage {
  id: string;
  goal_id: string;
  week_number: number;
  title: string;
  description: string;
  daily_habit: {
    action: string; // "Read Spanish for 15 minutes"
    tips: string[]; // Helpful hints
    skip_allowed: boolean; // Can user skip days
  };
  success_criteria: {
    required_days: number; // e.g., 5 out of 7
    total_days: number; // 7
  };
  status: 'upcoming' | 'active' | 'completed' | 'failed';
  start_date?: Date;
  end_date?: Date;
}
```

**Relationships:**
- Belongs to Goal
- Has many HabitLogs

## HabitLog Model

**Purpose:** Records daily habit completion (the core tracking data)

**Key Attributes:**
- id: UUID - Unique log identifier
- user_id: UUID - User who logged
- stage_id: UUID - Associated weekly stage
- date: date - Date of habit execution
- status: enum - 'completed' | 'skipped' | 'missed'
- logged_at: timestamp - When user recorded this
- notes: text - Optional user notes

**TypeScript Interface:**
```typescript
interface HabitLog {
  id: string;
  user_id: string;
  stage_id: string;
  date: string; // "2024-03-15"
  status: 'completed' | 'skipped' | 'missed';
  logged_at: Date;
  notes?: string;
}
```

**Relationships:**
- Belongs to User
- Belongs to WeeklyStage

## Recalibration Model

**Purpose:** Tracks AI adjustments when users struggle with stages

**Key Attributes:**
- id: UUID - Unique recalibration identifier
- goal_id: UUID - Affected goal
- trigger_stage_id: UUID - Stage that triggered recalibration
- original_roadmap: JSON - Roadmap before adjustment
- new_roadmap: JSON - Adjusted roadmap
- reason: string - Why recalibration occurred
- created_at: timestamp - When adjustment happened

**TypeScript Interface:**
```typescript
interface Recalibration {
  id: string;
  goal_id: string;
  trigger_stage_id: string;
  original_roadmap: Roadmap;
  new_roadmap: Roadmap;
  reason: 'repeated_failure' | 'user_requested' | 'pace_adjustment';
  created_at: Date;
  accepted_by_user: boolean;
}
```

**Relationships:**
- Belongs to Goal
- References WeeklyStage (trigger)
