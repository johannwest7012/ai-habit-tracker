# AI Habit Tracker Product Requirements Document (PRD)

## Goals and Background Context

### Goals
- Provide a frictionless daily habit tracker that works across any goal category
- Help users transform long-term ambitions into achievable daily actions  
- Leverage AI to reduce decision fatigue and create adaptive, personalized habit journeys
- Encourage consistency and reduce abandonment through clear progression and feedback
- Validate product-market fit with early user behavior and feedback

### Background Context
AI Habit Tracker addresses the common problem of goal abandonment by transforming vague long-term aspirations into concrete, manageable daily actions. Unlike generic habit trackers that require users to figure out their own progression, this app uses AI to create personalized roadmaps that adapt based on user success patterns. The current market lacks solutions that combine the simplicity of binary tracking (Yes/No/Skip) with intelligent, adaptive progression systems that prevent users from feeling overwhelmed or giving up when they struggle.

### Change Log
| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2025-01-30 | 1.0 | Initial PRD creation | John (PM) |

## Requirements

### Functional

**FR1:** The system shall allow users to input long-term goals via natural language chat interface  
**FR2:** The AI shall generate personalized weekly roadmaps with progressive daily Yes/No tasks based on user goals  
**FR3:** The system shall provide a daily tracking UI with Yes/No/Skip buttons for habit completion  
**FR4:** The system shall display celebratory feedback (confetti, sound) upon successful task completion  
**FR5:** The system shall generate weekly progress summaries showing completion rates against success criteria  
**FR6:** The system shall automatically promote users to next stage when success criteria are met (e.g., 3 Yes out of 5 target days)  
**FR7:** The system shall display a roadmap view showing all past, current, and future weeks in linked-list format  
**FR8:** The system shall implement progression logic preventing demotion in MVP (users retry same week on failure)  
**FR9:** The system shall offer "Replan Journey" functionality when users fail consistently  
**FR10:** The AI shall regenerate gentler, revised habit plans based on user failure patterns and feedback  
**FR11:** The system shall store user journeys, stages, and task responses with proper data persistence  
**FR12:** The system shall provide user authentication and profile management capabilities

### Non Functional

**NFR1:** The mobile app shall be built with Expo (React Native) for cross-platform deployment  
**NFR2:** The backend shall use Supabase (Auth, PostgreSQL, Edge Functions) for scalability and rapid development  
**NFR3:** AI integration shall utilize OpenAI API with proper prompt tuning based on user context  
**NFR4:** The system shall support real-time data synchronization between client and server  
**NFR5:** Daily habit interactions must feel emotionally engaging with sub-200ms response times  
**NFR6:** The system shall implement Row Level Security policies for user data isolation  
**NFR7:** The app shall be optimized for mobile-first usage with responsive design principles  
**NFR8:** The system shall handle AI service failures gracefully with appropriate fallback responses  
**NFR9:** Data persistence shall use PostgreSQL with proper indexing for user-specific queries  
**NFR10:** The system shall maintain audit trails for user actions and system state changes

## User Interface Design Goals

### Overall UX Vision
The interface should embody simplicity and emotional engagement, creating a sense of progress and achievement through minimalist design. Every interaction should feel intentional and rewarding, with the primary focus on the daily Yes/No decision that drives habit formation.

### Key Interaction Paradigms
- **Binary Simplicity:** All user inputs are Yes/No/Skip - no complex forms, sliders, or lengthy inputs
- **Celebratory Feedback:** Success moments are amplified with animation, sound, and visual celebration
- **Timeline Navigation:** Journey progress is visualized as a forward-moving timeline, never looking backward
- **Adaptive Guidance:** Interface adjusts based on user success patterns, offering encouragement or replanning options

### Core Screens and Views
- **Journey Creation Screen:** Chat-like interface for goal input and AI clarification
- **Daily Habit Screen:** Central hub with current habit prompt and Yes/No/Skip buttons
- **Weekly Summary Screen:** Progress visualization with level-up prompts
- **Roadmap Timeline View:** Visual journey showing past, current, and future stages
- **Replan Interface:** Gentle failure recovery with AI-assisted journey modification

### Accessibility: WCAG AA
Ensure compatibility with screen readers, sufficient color contrast ratios, and alternative text for all visual elements. Support dynamic text sizing and maintain functionality across assistive technologies.

### Branding
Clean, modern aesthetic with encouraging color palette (greens for success, soft blues for progress, warm oranges for celebration). Typography should feel approachable yet confident, supporting the app's role as a gentle but persistent habit coach.

### Target Device and Platforms: Mobile Only
Optimized specifically for iOS and Android smartphones with portrait-first design. All interactions designed for thumb-friendly navigation and single-handed use during daily check-ins.

## Technical Assumptions

### Repository Structure: Monorepo
The project will use npm workspaces to organize the mobile app, shared packages, and backend services in a single repository structure for efficient development and type sharing.

### Service Architecture: Serverless
Supabase Edge Functions provide serverless backend logic while maintaining integration with the database and authentication systems, eliminating infrastructure management overhead.

### Testing Requirements: Unit + Integration
Focus on unit tests for business logic and integration tests for API endpoints and database operations, with manual testing for user experience validation during MVP phase.

### Additional Technical Assumptions and Requests
- **TypeScript ^5.3.0** across entire stack for type safety and reduced runtime errors
- **Expo SDK ^50.0.0** for rapid mobile development with managed workflow
- **Supabase** as primary backend platform (Auth, PostgreSQL, Edge Functions, Storage)
- **OpenAI API** for AI-powered journey generation and habit plan adaptation  
- **React Native Elements ^3.4.3** for consistent UI component library
- **Zustand ^4.4.0** for lightweight state management without Redux complexity
- **NativeWind ^2.0.11** for Tailwind CSS styling in React Native
- **Row Level Security** policies for user data isolation without custom authentication logic
- **Real-time subscriptions** via Supabase for live progress updates
- **Mobile-first optimization** with portrait-oriented design for thumb navigation
- **JWT token management** through Supabase Auth with automatic refresh
- **PostgreSQL 15+** with JSONB fields for flexible AI-generated content storage

## Epic List

### Epic 1: Foundation & Core Journey Creation
Establish project infrastructure, user authentication, and AI-powered journey generation to transform user goals into structured habit roadmaps.

### Epic 2: Daily Habit Tracking & Progress Visualization
Build the core daily interaction system with Yes/No/Skip tracking, celebratory feedback, weekly summaries, and timeline roadmap views.

### Epic 3: Progression & Adaptive Intelligence
Implement automated level-up logic, failure detection, and AI-powered journey replanning to create truly adaptive habit formation.

## Epic 1: Foundation & Core Journey Creation

**Epic Goal:** Establish the foundational project infrastructure including monorepo setup, user authentication, database schema, and the core AI-powered journey generation system. This epic delivers the essential backend services and the key differentiating feature that transforms user goals into structured habit roadmaps, providing immediate value through intelligent journey creation.

### Story 1.1: Project Setup and Development Environment
As a developer,  
I want a properly configured monorepo with shared packages and development tooling,  
so that I can efficiently develop across frontend, backend, and shared code with consistent standards.

#### Acceptance Criteria
1. Monorepo structure is created using npm workspaces with apps/, packages/, and supabase/ directories
2. TypeScript ^5.3.0 is configured across all packages with shared tsconfig.json base
3. Expo ^50.0.0 mobile app is initialized with React Native Elements and NativeWind
4. Shared packages (shared types, api-client) are created and properly linked
5. Development scripts (dev, build, test, lint) work across all packages
6. Git repository is initialized with appropriate .gitignore for Node/Expo/Supabase
7. Environment variable templates (.env.example) are created for all environments
8. Basic CI/CD workflow is configured for automated testing

### Story 1.2: Database Schema and Core Data Models
As a system architect,  
I want a complete database schema with proper relationships and constraints,  
so that user data can be stored securely and efficiently with referential integrity.

#### Acceptance Criteria
1. PostgreSQL schema is created with users, journeys, stages, and tasks tables
2. UUID primary keys are implemented across all tables
3. Foreign key relationships are properly established with cascading deletes
4. Row Level Security (RLS) policies are implemented for user data isolation
5. Database indexes are created for common query patterns (user_id, date ranges)
6. JSONB fields are properly configured for AI-generated content storage
7. Check constraints prevent invalid data entry (enum values, length limits)
8. Audit triggers are implemented for updated_at timestamp management
9. Supabase migrations are version-controlled and can be applied consistently

### Story 1.3: User Authentication and Profile Management
As a new user,  
I want to create an account and manage my profile,  
so that I can securely access the app and personalize my habit tracking experience.

#### Acceptance Criteria
1. User registration flow is implemented using Supabase Auth
2. Email/password and social login (Google, Apple) authentication methods work
3. JWT token management is handled automatically by Supabase client
4. User profile creation extends auth.users with additional fields
5. Profile update functionality allows users to modify name, avatar, timezone
6. Notification preferences can be configured and persisted
7. Session management handles token refresh and expiration gracefully
8. Password reset functionality is implemented via email
9. User data is properly isolated using RLS policies
10. Authentication state is properly managed in mobile app state

### Story 1.4: AI Journey Generation System
As a user with a long-term goal,  
I want to input my goal and receive a personalized habit roadmap,  
so that I can follow a structured plan created specifically for my situation and experience level.

#### Acceptance Criteria
1. Natural language goal input interface is implemented in mobile app
2. OpenAI API integration is configured in Supabase Edge Function
3. AI prompt engineering generates structured weekly roadmaps from user goals
4. Journey data model stores AI-generated plan with proper schema validation
5. Stage generation creates sequential weekly units with success criteria
6. Daily habit prompts are generated as clear Yes/No questions
7. Error handling gracefully manages AI API failures with user feedback
8. Journey creation persists complete roadmap to database with user association
9. AI-generated content includes reasoning and difficulty level assessment
10. Edge Function properly validates JWT tokens and enforces user permissions
11. Journey creation triggers proper database relationships (stages, initial tasks)
12. Generated journeys follow logical progression from basic to advanced habits

## Epic 2: Daily Habit Tracking & Progress Visualization

**Epic Goal:** Build the core daily interaction system that engages users with their habits through binary tracking, celebratory feedback, and progress visualization. This epic delivers the main user experience loop that drives daily engagement and provides clear feedback on habit formation progress through weekly summaries and timeline roadmap views.

### Story 2.1: Daily Habit Tracking Interface
As a user with an active journey,  
I want to quickly respond to my daily habit prompt with Yes/No/Skip,  
so that I can efficiently track my progress without friction or complexity.

#### Acceptance Criteria
1. Daily habit screen displays current stage's habit prompt prominently
2. Large, thumb-friendly Yes/No/Skip buttons are easily accessible
3. Current streak and progress indicators are visible but not overwhelming
4. Task responses are immediately persisted to database with timestamps
5. Zustand state management updates instantly reflect user actions
6. Error handling gracefully manages network failures with offline support queuing
7. Navigation allows users to access other screens while maintaining daily focus
8. Loading states provide immediate feedback during data operations
9. Habit prompt text is clear, actionable, and formatted for mobile reading
10. Daily tasks are automatically generated for the current active stage

### Story 2.2: Celebratory Feedback and Engagement
As a user completing daily habits,  
I want immediate positive reinforcement for successful actions,  
so that I feel motivated and emotionally connected to my progress.

#### Acceptance Criteria
1. "Yes" responses trigger celebratory animations (confetti, particle effects)
2. Success sounds play upon habit completion (with user preference controls)
3. Visual feedback uses encouraging color palette (greens, warm oranges)
4. Animation timing feels satisfying without delaying user workflow
5. Celebration intensity varies based on streak length and difficulty
6. "Skip" responses provide gentle, non-judgmental feedback
7. "No" responses offer encouragement without negative reinforcement
8. Haptic feedback enhances tactile celebration on supported devices
9. Celebration preferences can be customized in user settings
10. Performance remains smooth during animations without lag

### Story 2.3: Weekly Progress Summaries and Level-Up System
As a user completing weekly stages,  
I want to see my progress summarized and receive advancement opportunities,  
so that I can understand my performance and celebrate meaningful milestones.

#### Acceptance Criteria
1. Weekly summary screen displays completion rate against success criteria
2. Visual progress indicators show days completed vs. target (e.g., 3 of 5 days)
3. Stage advancement logic automatically promotes users meeting success criteria
4. Level-up notifications provide clear explanation of progression
5. Failed weeks offer retry option with encouraging messaging
6. Progress history shows past week performance in timeline format
7. Success criteria explanations help users understand advancement requirements
8. Weekly summary triggers on stage completion or manual navigation
9. Real-time updates reflect progress changes without manual refresh
10. Summary data persists and contributes to overall journey analytics

### Story 2.4: Roadmap Timeline Visualization
As a user tracking long-term progress,  
I want to visualize my complete journey with past, current, and future stages,  
so that I can understand my overall progress and maintain motivation for upcoming challenges.

#### Acceptance Criteria
1. Timeline view displays all stages in chronological linked-list format
2. Visual design emphasizes forward progression without dwelling on failures
3. Current stage is highlighted with distinct visual treatment
4. Past completed stages show success indicators and completion dates
5. Future stages display titles and descriptions to build anticipation
6. Interactive elements allow users to explore stage details
7. Timeline scrolls smoothly with appropriate mobile touch gestures
8. Progress indicators show overall journey completion percentage
9. Navigation between timeline and daily habit screens is intuitive
10. Loading states handle large journeys efficiently
11. Timeline updates reflect real-time progress changes
12. Visual design supports the app's encouraging, forward-looking brand

## Epic 3: Progression & Adaptive Intelligence

**Epic Goal:** Implement the intelligent systems that make the app truly adaptive to user behavior, including automated progression logic, failure pattern detection, and AI-powered journey replanning. This epic delivers the advanced features that differentiate the app from static habit trackers by learning from user patterns and adjusting accordingly to maximize long-term success.

### Story 3.1: Automated Stage Progression Logic
As a user meeting success criteria,  
I want the app to automatically advance me to the next stage,  
so that my journey progresses without manual intervention and I can focus on habit execution.

#### Acceptance Criteria
1. Progression evaluation runs automatically on Sunday nights or when user manually triggers
2. Success criteria logic (e.g., 3 Yes out of 5 target days) is properly implemented
3. Two consecutive successful weeks requirement is enforced before stage advancement
4. Stage status updates from 'active' to 'completed' and advances current_stage_id
5. New stage automatically becomes 'active' with tasks generated for the current week
6. Progression notifications inform users of advancement with celebratory messaging
7. Edge Function handles progression logic with proper JWT validation
8. Database triggers maintain data consistency during stage transitions
9. Real-time updates immediately reflect progression changes in mobile app
10. Error handling manages edge cases (incomplete data, concurrent updates)
11. Progression history is maintained for analytics and user reflection
12. No demotion logic is implemented in MVP (users retry failed stages)

### Story 3.2: Failure Detection and Pattern Analysis
As a user struggling with current habits,  
I want the app to recognize my failure patterns and offer appropriate support,  
so that I don't abandon my journey but instead receive adapted guidance.

#### Acceptance Criteria
1. Failure detection algorithm identifies users failing same stage multiple times
2. Pattern analysis considers frequency, consistency, and failure types (No vs Skip)
3. Failure thresholds trigger "Replan Journey" suggestions (e.g., 3 failed attempts)
4. User context is analyzed to identify potential difficulty or timing issues
5. Failure patterns are stored for AI replanning context and learning
6. Gentle intervention messaging avoids negative reinforcement or shame
7. Users maintain control over whether to accept replanning suggestions
8. Failure detection runs in background without impacting daily experience
9. Analytics capture failure patterns for product improvement insights
10. Edge Function processes failure analysis with appropriate error handling
11. Failure data contributes to overall journey adaptation recommendations
12. System preserves user progress history even when replanning occurs

### Story 3.3: AI-Powered Journey Replanning
As a user offered journey replanning,  
I want to receive a gentler, more appropriate habit plan based on my failure patterns,  
so that I can continue progressing toward my goal with a more suitable approach.

#### Acceptance Criteria
1. Replan interface provides clear explanation of why replanning is suggested
2. AI analyzes user's failure history, patterns, and original goal context
3. New journey plan is generated with gentler progression and adjusted difficulty
4. Replanned stages maintain connection to original goal but with modified approach
5. User can preview new plan before accepting replanning changes
6. Original journey data is preserved for reference and learning
7. Replanning process updates database relationships cleanly
8. AI reasoning for replanning decisions is captured for transparency
9. Replanned journeys reset progression logic while maintaining user history
10. Error handling manages AI API failures during replanning gracefully
11. Replanning preserves completed stages but adjusts future progression
12. User can decline replanning and continue with original journey if preferred

### Story 3.4: Real-Time Progress Synchronization
As a user accessing the app across sessions,  
I want my progress and journey updates to be immediately synchronized,  
so that I always see accurate information regardless of when or how I access the app.

#### Acceptance Criteria
1. Supabase real-time subscriptions update app state when data changes
2. Journey progression, stage updates, and task responses sync instantly
3. Multiple app instances (different devices) reflect changes without refresh
4. Real-time updates handle network connectivity issues gracefully
5. Optimistic updates provide immediate UI feedback before server confirmation
6. Conflict resolution manages concurrent updates from multiple sources
7. Real-time subscriptions are properly managed to avoid memory leaks
8. Zustand state management integrates seamlessly with real-time updates
9. Performance remains smooth with real-time features active
10. Real-time features can be disabled for battery optimization if needed
11. Connection status is indicated to users during network issues
12. Offline changes are queued and synchronized when connectivity returns

## Checklist Results Report

The enhanced PRD now includes all critical BMAD components that were missing from your original documentation:

✅ **Functional Requirements (FR1-FR12):** Complete system capabilities mapped to your key features  
✅ **Non-Functional Requirements (NFR1-NFR10):** Technical constraints and quality attributes  
✅ **User Interface Design Goals:** Comprehensive UX vision with accessibility and branding  
✅ **Technical Assumptions:** Detailed technology stack decisions and architectural constraints  
✅ **Epic Structure:** 3 sequential epics delivering incremental value  
✅ **Detailed Stories:** 12 implementation-ready user stories with comprehensive acceptance criteria  

**BMAD Workflow Compliance:** This PRD now follows the proper BMAD greenfield workflow with all required components for architecture creation and development planning.

## Next Steps

### UX Expert Prompt
Create detailed front-end specifications and UI wireframes based on the User Interface Design Goals and Core Screens identified in this PRD. Focus on the binary interaction paradigms and celebratory feedback systems that drive user engagement.

### Architect Prompt  
Use this comprehensive PRD with its functional requirements, technical assumptions, and detailed epics to create the complete system architecture. All technology choices and constraints have been specified - translate these into detailed technical specifications and implementation guidance.
