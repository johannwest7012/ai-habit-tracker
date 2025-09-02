# API Specification

## REST API Specification

```yaml
openapi: 3.0.0
info:
  title: AI Habit Tracker API
  version: 1.0.0
  description: REST API for AI Habit Tracker mobile application
servers:
  - url: https://{project-id}.supabase.co/rest/v1
    description: Supabase REST API
  - url: https://{project-id}.supabase.co/functions/v1
    description: Supabase Edge Functions

paths:
  # Authentication (handled by Supabase Auth)
  /auth/v1/signup:
    post:
      summary: Register new user
      tags: [Authentication]
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                email: 
                  type: string
                password: 
                  type: string
                
  # Goals
  /rest/v1/goals:
    get:
      summary: Get user's goals
      tags: [Goals]
      parameters:
        - name: status
          in: query
          schema:
            type: string
            enum: [active, paused, completed, abandoned]
      responses:
        200:
          description: List of goals
          
    post:
      summary: Create new goal
      tags: [Goals]
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/GoalInput'
              
  /rest/v1/goals/{id}:
    get:
      summary: Get specific goal with roadmap
      tags: [Goals]
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
            
    patch:
      summary: Update goal status
      tags: [Goals]
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                status:
                  type: string
                  enum: [active, paused, completed, abandoned]
                  
  # Weekly Stages
  /rest/v1/weekly_stages:
    get:
      summary: Get stages for a goal
      tags: [Stages]
      parameters:
        - name: goal_id
          in: query
          required: true
          schema:
            type: string
        - name: status
          in: query
          schema:
            type: string
            enum: [upcoming, active, completed, failed]
            
  /rest/v1/weekly_stages/{id}:
    patch:
      summary: Update stage status
      tags: [Stages]
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                status:
                  type: string
                  enum: [active, completed, failed]
                  
  # Habit Logs
  /rest/v1/habit_logs:
    get:
      summary: Get habit logs
      tags: [Habits]
      parameters:
        - name: stage_id
          in: query
          schema:
            type: string
        - name: date
          in: query
          schema:
            type: string
            format: date
        - name: date_gte
          in: query
          schema:
            type: string
            format: date
        - name: date_lte
          in: query
          schema:
            type: string
            format: date
            
    post:
      summary: Log daily habit
      tags: [Habits]
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/HabitLogInput'
              
    patch:
      summary: Update existing log
      tags: [Habits]
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                status:
                  type: string
                  enum: [completed, skipped, missed]
                notes:
                  type: string
                  
  # Edge Functions
  /functions/v1/generate-roadmap:
    post:
      summary: Generate AI roadmap for goal
      tags: [AI]
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [title, description, target_date]
              properties:
                title:
                  type: string
                description:
                  type: string
                target_date:
                  type: string
                  format: date
                experience_level:
                  type: string
                  enum: [beginner, intermediate, advanced]
      responses:
        200:
          description: Generated roadmap
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Roadmap'
                
  /functions/v1/recalibrate-roadmap:
    post:
      summary: Adjust roadmap based on progress
      tags: [AI]
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [goal_id, reason]
              properties:
                goal_id:
                  type: string
                reason:
                  type: string
                  enum: [repeated_failure, user_requested, pace_adjustment]
      responses:
        200:
          description: Recalibrated roadmap
          
  /functions/v1/edit-roadmap:
    patch:
      summary: User edits to AI-generated roadmap
      tags: [AI]
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [goal_id, stages]
              properties:
                goal_id:
                  type: string
                stages:
                  type: array
                  items:
                    $ref: '#/components/schemas/WeeklyStage'
      responses:
        200:
          description: Updated roadmap saved

  /functions/v1/check-weekly-progress:
    post:
      summary: Evaluate if user completed weekly stage
      tags: [Progress]
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [stage_id]
              properties:
                stage_id:
                  type: string
      responses:
        200:
          description: Progress result
          content:
            application/json:
              schema:
                type: object
                properties:
                  completed:
                    type: boolean
                  days_completed:
                    type: integer
                  days_required:
                    type: integer
                  next_action:
                    type: string
                    enum: [advance, retry, recalibrate]

  /rest/v1/stage_tips:
    get:
      summary: Get educational content for stage
      tags: [Content]
      parameters:
        - name: stage_id
          in: query
          required: true
          schema:
            type: string
      responses:
        200:
          description: Tips and guidance
          
  /functions/v1/weekly-summary:
    post:
      summary: Generate weekly progress summary
      tags: [Analytics]
      requestBody:
        content:
          application/json:
            schema:
              type: object
              required: [stage_id]
              properties:
                stage_id:
                  type: string

components:
  schemas:
    GoalInput:
      type: object
      required: [title, description, target_date]
      properties:
        title:
          type: string
        description:
          type: string
        target_date:
          type: string
          format: date
          
    HabitLogInput:
      type: object
      required: [stage_id, date, status]
      properties:
        stage_id:
          type: string
        date:
          type: string
          format: date
        status:
          type: string
          enum: [completed, skipped, missed]
        notes:
          type: string
          
    Roadmap:
      type: object
      properties:
        stages:
          type: array
          items:
            $ref: '#/components/schemas/WeeklyStage'
        total_weeks:
          type: integer
        difficulty_level:
          type: string
          
    WeeklyStage:
      type: object
      properties:
        week_number:
          type: integer
        title:
          type: string
        description:
          type: string
        daily_habit:
          type: object
          properties:
            action:
              type: string
            tips:
              type: array
              items:
                type: string
                
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      
security:
  - bearerAuth: []
```

## Realtime Subscriptions

```typescript
// Realtime subscription channels
interface RealtimeChannels {
  // Subscribe to habit log changes for current week
  habitLogs: {
    channel: 'habit_logs:stage_id=eq.{stageId}',
    events: ['INSERT', 'UPDATE', 'DELETE']
  },
  
  // Subscribe to goal status changes
  goalStatus: {
    channel: 'goals:id=eq.{goalId}',
    events: ['UPDATE']
  },
  
  // Subscribe to stage transitions
  stageProgress: {
    channel: 'weekly_stages:goal_id=eq.{goalId}',
    events: ['UPDATE']
  }
}

// Example subscription usage
const habitLogSubscription = supabase
  .channel('habit-logs-{stageId}')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'habit_logs',
    filter: `stage_id=eq.${stageId}`
  }, handleHabitLogChange)
  .subscribe();
```

**Authentication Requirements:**
- All endpoints require JWT bearer token from Supabase Auth
- Row Level Security policies enforce user data isolation
- Edge Functions validate auth token before processing

**Rate Limiting:**
- `/functions/v1/generate-roadmap`: 10 requests per hour per user
- `/functions/v1/recalibrate-roadmap`: 5 requests per day per user
- Standard REST endpoints: 1000 requests per hour per user
