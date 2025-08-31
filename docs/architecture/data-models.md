# Data Models

Based on PRD requirements, these are the core data models that represent the key business entities for the AI Habit Tracker:

## User
**Purpose:** Represents an individual user with their profile information and preferences

**Key Attributes:**
- `id`: string (UUID) - Unique user identifier from Supabase Auth
- `email`: string - User's email address
- `name`: string | null - Display name (optional)
- `avatar_url`: string | null - Profile picture URL
- `created_at`: Date - Account creation timestamp
- `updated_at`: Date - Last profile update
- `timezone`: string - User's timezone for habit scheduling
- `notification_preferences`: NotificationSettings - Push notification preferences

**TypeScript Interface:**
```typescript
interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
  timezone: string;
  notification_preferences: NotificationSettings;
}

interface NotificationSettings {
  daily_reminder: boolean;
  weekly_summary: boolean;
  level_up_celebration: boolean;
  preferred_time: string; // HH:MM format
}
```

**Relationships:**
- One-to-many with Journey (a user can have multiple goals/journeys)

## Journey
**Purpose:** Represents a user's long-term goal broken down by AI into a structured roadmap

**Key Attributes:**
- `id`: string (UUID) - Unique journey identifier
- `user_id`: string - Foreign key to User
- `title`: string - Goal title (e.g., "Learn Spanish", "Get Fit")
- `description`: string - Original goal description from user
- `ai_generated_plan`: AIGeneratedPlan - Complete roadmap from AI
- `current_stage_id`: string | null - Current active stage
- `status`: JourneyStatus - Current journey state
- `created_at`: Date - Journey creation date
- `updated_at`: Date - Last modification
- `completed_at`: Date | null - Completion timestamp

**TypeScript Interface:**
```typescript
interface Journey {
  id: string;
  user_id: string;
  title: string;
  description: string;
  ai_generated_plan: AIGeneratedPlan;
  current_stage_id: string | null;
  status: JourneyStatus;
  created_at: Date;
  updated_at: Date;
  completed_at: Date | null;
}

type JourneyStatus = 'active' | 'paused' | 'completed' | 'abandoned';

interface AIGeneratedPlan {
  total_stages: number;
  estimated_duration_weeks: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  ai_reasoning: string;
}
```

**Relationships:**
- Many-to-one with User
- One-to-many with Stage

## Stage
**Purpose:** Represents a weekly unit in the journey with specific success criteria

**Key Attributes:**
- `id`: string (UUID) - Unique stage identifier
- `journey_id`: string - Foreign key to Journey
- `stage_number`: number - Sequential order (1, 2, 3...)
- `title`: string - Week's focus (e.g., "Week 1: Basic Vocabulary")
- `description`: string - What user should accomplish this week
- `daily_habit_prompt`: string - The yes/no question for daily tracking
- `success_criteria`: SuccessCriteria - Rules for advancing to next stage
- `status`: StageStatus - Current stage state
- `started_at`: Date | null - When user began this stage
- `completed_at`: Date | null - When stage was completed

**TypeScript Interface:**
```typescript
interface Stage {
  id: string;
  journey_id: string;
  stage_number: number;
  title: string;
  description: string;
  daily_habit_prompt: string;
  success_criteria: SuccessCriteria;
  status: StageStatus;
  started_at: Date | null;
  completed_at: Date | null;
}

type StageStatus = 'upcoming' | 'active' | 'completed' | 'failed' | 'replanning';

interface SuccessCriteria {
  target_days_per_week: number; // e.g., 3 out of 7 days
  required_consecutive_weeks: number; // e.g., 2 weeks in a row
}
```

**Relationships:**
- Many-to-one with Journey
- One-to-many with Task (daily check-ins)

## Task
**Purpose:** Represents a daily binary check-in (Yes/No/Skip) for habit tracking

**Key Attributes:**
- `id`: string (UUID) - Unique task identifier
- `stage_id`: string - Foreign key to Stage
- `user_id`: string - Foreign key to User (for easy querying)
- `date`: Date - The specific day this task is for
- `response`: TaskResponse | null - User's response (null if not completed)
- `completed_at`: Date | null - When user responded
- `created_at`: Date - Task creation timestamp

**TypeScript Interface:**
```typescript
interface Task {
  id: string;
  stage_id: string;
  user_id: string;
  date: Date;
  response: TaskResponse | null;
  completed_at: Date | null;
  created_at: Date;
}

type TaskResponse = 'yes' | 'no' | 'skip';
```

**Relationships:**
- Many-to-one with Stage
- Many-to-one with User

**Design Rationale:**
- **UUID Primary Keys:** Ensures global uniqueness and security (non-guessable IDs)
- **Denormalized user_id in Task:** Enables efficient user-specific queries without joins
- **JSON Fields for Metadata:** AI plan data and notification preferences stored as JSON for flexibility
- **Enum Types:** Clear, type-safe status values that prevent invalid states
- **Nullable Fields:** Supports optional data and different lifecycle states
