# Epic 2 Details: AI Roadmap Generation & Display

**Epic Goal:** Enable users to input long-term goals and receive AI-generated 8-12 week progression roadmaps with visual timeline display. Users can preview their personalized journey, understand the reasoning behind each weekly stage, and make adjustments before beginning their habit formation process, delivering the core product differentiator.

## Story 2.1: AI Roadmap Generation Service
As a user who has articulated a long-term goal,
I want the system to generate a personalized 8-12 week progression roadmap,
so that I have a clear, expert-designed path to achieve my objective.

**Acceptance Criteria:**
1. Supabase Edge Function integrating OpenAI GPT-4 API for roadmap generation
2. Prompt engineering that converts user goals into structured weekly progressions
3. Generated roadmaps include: weekly stage titles, daily habit descriptions, success criteria, and rationale
4. Response parsing that converts AI output into structured JSON for database storage
5. Error handling for AI API failures with user-friendly messaging
6. Rate limiting implementation to manage API costs and prevent abuse
7. Roadmap generation completes within 3-second performance requirement
8. Generated roadmaps stored in PostgreSQL with JSON column structure

## Story 2.2: Roadmap Preview & Review Interface
As a user receiving an AI-generated roadmap,
I want to preview my entire progression journey before committing to it,
so that I can understand the approach and feel confident in the plan.

**Acceptance Criteria:**
1. Scrollable timeline view showing all weekly stages from start to completion
2. Each stage displays: week number, stage title, daily habits, and brief explanation
3. Visual progress indicators showing current position in overall journey
4. Expandable stage details with full rationale for why this progression makes sense
5. Clear visual distinction between completed, current, and upcoming stages
6. Estimated timeline display (e.g., "Week 1-3: Foundation Building")
7. Option to regenerate roadmap if user is unsatisfied with initial result
8. Confirmation flow to accept roadmap and begin daily tracking

## Story 2.3: Roadmap Editing & Customization
As a user reviewing my AI-generated roadmap,
I want to make adjustments to stages that don't fit my circumstances,
so that the plan feels personally relevant and achievable.

**Acceptance Criteria:**
1. Edit mode allowing users to modify daily habit descriptions and success criteria
2. Ability to adjust weekly stage durations (e.g., extend foundation week from 7 to 10 days)
3. Option to swap positions of stages that seem logically reversible
4. Warning system alerting users when edits might affect progression logic
5. Undo/redo functionality for roadmap modifications
6. Save modified roadmap with user customization flags for future analysis
7. Explanation tooltips helping users understand why certain progressions are recommended
8. Final review screen confirming all customizations before starting habit tracking

## Story 2.4: Roadmap Context & Education
As a user beginning my habit formation journey,
I want to understand the methodology behind my roadmap,
so that I trust the approach and stay committed during difficult periods.

**Acceptance Criteria:**
1. Educational content explaining weekly progression philosophy and habit formation science
2. Stage-specific guidance showing why each week builds toward the long-term goal
3. Tips and encouragement messaging tailored to the user's specific goal type
4. FAQ section addressing common concerns about AI-generated habit plans
5. Progress philosophy explanation (why 5/7 days, why weekly stages, why binary tracking)
6. Success stories or examples relevant to user's goal category
7. Access to methodology explanation from any point in the roadmap view
8. Clear messaging about when and how roadmap recalibration works
