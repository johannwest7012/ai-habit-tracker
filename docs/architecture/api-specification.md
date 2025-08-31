# API Specification

Since we're using Supabase Auto-API, most CRUD operations are automatically generated from our database schema with Row Level Security policies. However, we need custom Edge Functions for AI-powered features and complex business logic.

## REST API Specification

```yaml
openapi: 3.0.0
info:
  title: AI Habit Tracker API
  version: 1.0.0
  description: API for AI-powered habit tracking with goal breakdown and progress management
servers:
  - url: https://{project-id}.supabase.co/rest/v1
    description: Supabase Auto-API (CRUD operations)
  - url: https://{project-id}.supabase.co/functions/v1
    description: Supabase Edge Functions (AI & business logic)

paths:
  # Auto-generated CRUD endpoints (via Supabase)
  /users:
    get:
      summary: Get user profile
      security: [Bearer: []]
      responses:
        200:
          description: User profile data
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

  /journeys:
    get:
      summary: List user's journeys
      security: [Bearer: []]
      responses:
        200:
          description: Array of user journeys
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Journey'
    post:
      summary: Create new journey (calls AI generation)
      security: [Bearer: []]
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                title:
                  type: string
                  example: "Learn Spanish"
                description:
                  type: string
                  example: "I want to become conversational in Spanish for my trip to Mexico"
      responses:
        201:
          description: Journey created with AI-generated plan
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Journey'

  # Custom Edge Functions
  /functions/v1/generate-journey:
    post:
      summary: AI-powered journey generation
      security: [Bearer: []]
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                goal_description:
                  type: string
                user_context:
                  type: object
      responses:
        200:
          description: AI-generated journey plan
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AIGeneratedPlan'

  /functions/v1/replan-journey:
    post:
      summary: AI-powered journey replanning
      security: [Bearer: []]
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                journey_id:
                  type: string
                failure_reason:
                  type: string
      responses:
        200:
          description: Updated journey plan

  /functions/v1/check-stage-progression:
    post:
      summary: Evaluate if user can advance to next stage
      security: [Bearer: []]
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                stage_id:
                  type: string
      responses:
        200:
          description: Progression evaluation result
          content:
            application/json:
              schema:
                type: object
                properties:
                  can_advance:
                    type: boolean
                  next_action:
                    type: string
                    enum: [advance, retry, replan]
```

**Key Authentication Notes:**
- All endpoints require JWT authentication via Supabase Auth
- Row Level Security policies enforce user data isolation
- Edge Functions validate JWT tokens and user permissions

**Error Handling:**
- Standard HTTP status codes (400, 401, 403, 404, 500)
- Consistent error response format following Supabase conventions
- AI service errors are handled gracefully with fallback responses
