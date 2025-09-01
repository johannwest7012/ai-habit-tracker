# AI Habit Tracker Product Requirements Document (PRD)

## Goals and Background Context

### Goals
- Create an AI-guided habit tracking system that transforms user aspirations into structured, progressive weekly stages
- Achieve 60% 30-day retention rate by providing AI-generated roadmaps that reduce early user dropout  
- Enable users to complete major multi-week progressions (8+ weeks) with 40% goal achievement rate
- Deliver shame-free adaptability where the system adjusts to user pace rather than punishing missed days
- Build a complete habit-formation system that provides methodology alongside tracking mechanism

### Background Context

Traditional habit-tracking apps create a fundamental paradox: they require users to already possess expertise in habit formation to be effective, yet the users who need them most lack exactly that expertise. The core problem isn't motivation—it's methodology. People abandon existing tools not due to lack of willpower, but because they're left alone to design their own progression plans and figure out the "how" of reaching their goals.

AI Habit Tracker addresses this expertise gap by combining simple binary daily tracking (Yes/No/Skip) with intelligent AI-generated roadmaps. Rather than requiring users to know what habits to track, the system transforms vague long-term goals into specific, achievable weekly milestones with clear daily actions. This creates a complete habit-formation system rather than just a logging tool, serving the underserved market of goal-oriented beginners who have motivation but lack structured implementation methodology.

### Change Log
| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2025-08-31 | 1.0 | Initial PRD creation based on Project Brief | PM Agent |

## Requirements

### Functional Requirements

**FR1:** The system shall generate AI-powered roadmaps that transform user-inputted long-term goals into 8-12 week progressions with specific weekly stages and daily binary habits.

**FR2:** The daily tracking interface shall provide simple binary completion options (Yes/No/Skip) for each habit with single-tap logging capability.

**FR3:** The system shall automatically advance users to the next weekly stage when success criteria are met (configurable threshold, default 5/7 days completed).

**FR4:** The visual progress display shall show a linked-list roadmap view with completed stages, current stage, and upcoming stages including progress indicators.

**FR5:** The system shall provide basic recalibration by offering simplified alternatives when users fail to complete a weekly stage.

**FR6:** The goal setup wizard shall guide users through articulating their long-term goal and expected timeline during onboarding.

**FR7:** The system shall support user preview and editing of AI-generated roadmaps with simple explanations for each stage.

**FR8:** The system shall maintain offline capability for daily tracking with synchronization when connectivity is restored.

**FR9:** The system shall provide basic reminder notifications for daily habit completion (no advanced push notification features in MVP).

**FR10:** The system shall track user completion rates and progression statistics for each weekly stage.

### Non-Functional Requirements

**NFR1:** AI roadmap generation shall complete within 3 seconds of user goal submission.

**NFR2:** Daily habit logging shall respond within 1 second of user interaction.

**NFR3:** The system shall support iOS 14+ and Android 8+ for optimal performance.

**NFR4:** The system shall maintain 99.5% uptime for core tracking functionality.

**NFR5:** User data shall be encrypted at rest and in transit using industry-standard protocols.

**NFR6:** The system shall handle up to 10,000 concurrent users without performance degradation.

**NFR7:** The mobile application shall function offline for core tracking features with data synchronization upon reconnection.

**NFR8:** The system shall comply with GDPR requirements for user data privacy and deletion.

**NFR9:** API response times shall not exceed 2 seconds for all user-facing operations.

**NFR10:** The system shall integrate with OpenAI GPT-4 API for roadmap generation while respecting rate limits.

## User Interface Design Goals

### Overall UX Vision
Create a calming, progress-focused mobile experience that feels like a personal coach rather than a productivity tool. The interface should reduce anxiety around habit formation by emphasizing journey over perfection, using gentle visual metaphors of growth and progression. Users should feel supported and guided rather than tracked or judged.

### Key Interaction Paradigms
- **Single-tap logging:** Primary interaction is one-touch Yes/No/Skip for daily habits with immediate visual feedback
- **Roadmap navigation:** Vertical scroll through linked stages showing past accomplishments, current focus, and future milestones
- **AI conversation flow:** Goal setup feels like chatting with a knowledgeable friend who asks thoughtful questions
- **Gentle notifications:** Reminders feel like gentle nudges rather than demands, with easy snooze/adjust options

### Core Screens and Views
- **Onboarding/Goal Setup Wizard:** Multi-step conversational flow for articulating long-term goals and preferences
- **Daily Habit Dashboard:** Clean, focused view showing today's binary habit with large tap targets for Yes/No/Skip
- **Weekly Progress View:** Visual representation of current week's completion pattern with encouragement messaging
- **Roadmap Overview:** Scrollable timeline showing completed stages, current stage, and upcoming progression milestones
- **Stage Detail View:** Explanation of current week's focus, why this stage matters, and tips for success
- **Recalibration Flow:** Gentle adjustment interface when weekly goals aren't met, offering simplified alternatives

### Accessibility: WCAG AA
Full compliance with WCAG AA standards including high contrast ratios, scalable text, voice-over compatibility, and touch target sizing. Binary tracking interface must be fully navigable via screen readers and alternative input methods.

### Branding
Warm, natural color palette inspired by growth and seasons (soft greens, earth tones, gentle blues). Visual metaphors of paths, trees, or mountain trails to reinforce the journey concept. Typography should feel friendly but credible—more like a wellness app than a hardcore productivity tool. Subtle animations that reinforce progress and growth rather than urgency or pressure.

### Target Device and Platforms: Mobile-First (iOS/Android via Expo)
Designed primarily for mobile phones with responsive adaptation for tablets. Native mobile patterns for navigation, gestures, and notifications. Optimized for one-handed use during quick daily check-ins, with landscape support for roadmap overview browsing.

## Technical Assumptions

### Repository Structure: Monorepo
Single Expo managed workflow project with organized folder structure (screens, components, services, utils). All mobile app code, configuration, and documentation contained within one repository for simplified development and deployment pipeline.

### Service Architecture: Serverless Functions within Mobile-Centric Architecture
**Primary Architecture:** Expo React Native mobile app with Supabase backend providing database, authentication, and Edge Functions for AI roadmap generation and complex business logic. Client-side state management using React Query for efficient data fetching and caching.

**Rationale:** Serverless approach via Supabase Edge Functions provides scalability for AI roadmap generation without infrastructure management overhead, while maintaining fast response times for daily tracking operations.

### Testing Requirements: Unit + Integration Testing
**Testing Strategy:** Jest for unit testing of business logic and utility functions, React Native Testing Library for component integration tests, and Supabase local development for backend function testing.

**Manual Testing:** Focus on user flow validation for goal setup wizard and daily tracking interactions, with device testing across iOS/Android platforms.

**Rationale:** Comprehensive testing ensures reliability for core habit tracking functionality while avoiding over-engineering with full E2E automation for MVP stage.

### Additional Technical Assumptions and Requests

**Frontend Technology Stack:**
- **Framework:** Expo SDK 49+ with managed workflow for rapid development and deployment
- **State Management:** React Query for server state, Zustand for client state management
- **Navigation:** React Navigation v6 for screen routing and navigation patterns
- **UI Components:** React Native Elements or NativeBase for consistent component library

**Backend & Database:**
- **Backend as a Service:** Supabase for authentication, PostgreSQL database, real-time subscriptions, and Edge Functions
- **Database Design:** PostgreSQL with JSON columns for flexible AI-generated roadmap storage
- **Authentication:** Supabase Auth with Row Level Security policies for data isolation

**AI & External Services:**
- **AI Integration:** OpenAI GPT-4 API via Supabase Edge Functions for roadmap generation
- **Rate Limiting:** Implement request queuing and user-based rate limiting to manage OpenAI API costs
- **Offline Capability:** SQLite local storage for habit tracking with Supabase sync when online

**Development & Deployment:**
- **Development Environment:** Expo CLI with local Supabase instance for development
- **Deployment:** Expo Application Services (EAS) for app store deployment
- **Monitoring:** Supabase Analytics for usage tracking, Expo monitoring for crash reporting

**Security & Performance:**
- **Data Encryption:** Supabase built-in encryption at rest and in transit
- **Performance:** Image optimization via Expo's asset bundling, lazy loading for roadmap views
- **Privacy:** GDPR compliance via Supabase's built-in data protection features

## Epic List

### Epic 1: Foundation & Core Infrastructure
**Goal:** Establish project setup, authentication system, and basic user onboarding flow while delivering initial goal articulation functionality.

### Epic 2: AI Roadmap Generation & Display  
**Goal:** Enable users to input long-term goals and receive AI-generated 8-12 week progression roadmaps with visual timeline display.

### Epic 3: Daily Habit Tracking & Weekly Progression
**Goal:** Implement core binary tracking interface (Yes/No/Skip) with weekly stage advancement and progress visualization.

### Epic 4: Adaptive Recalibration & User Retention
**Goal:** Provide recalibration flows when users struggle with weekly stages and implement retention mechanisms through notifications and encouragement.

## Epic 1 Details: Foundation & Core Infrastructure

**Epic Goal:** Establish project setup, authentication system, and basic user onboarding flow while delivering initial goal articulation functionality. Users can create accounts, articulate their long-term goals through a guided wizard, and understand the app's approach to habit formation, creating immediate value even before AI roadmap generation is available.

### Story 1.1: Project Foundation Setup
As a developer,
I want a properly configured Expo React Native project with Supabase integration,
so that I have a solid foundation for building the habit tracking features.

**Acceptance Criteria:**
1. Expo managed workflow project created with TypeScript configuration
2. Supabase client properly configured with environment variables and connection testing
3. Basic folder structure established (screens, components, services, utils, types)
4. React Query setup for server state management and caching
5. Navigation structure configured with React Navigation v6
6. Basic error boundary and logging framework implemented
7. Development environment runs successfully on both iOS and Android simulators

### Story 1.2: User Authentication System
As a potential user,
I want to securely create an account and log in,
so that I can access personalized habit tracking features.

**Acceptance Criteria:**
1. Supabase Auth integration with email/password authentication
2. Sign up flow with email verification requirement
3. Login screen with email/password fields and proper validation
4. Password reset functionality via email
5. Authentication state management with protected routes
6. Row Level Security policies configured for user data isolation
7. Basic user profile storage (email, created date) in Supabase
8. Auth state persistence across app restarts

### Story 1.3: Welcome & App Introduction Flow
As a new user,
I want to understand what this app does and how it's different from other habit trackers,
so that I can decide if it fits my needs and understand how to use it effectively.

**Acceptance Criteria:**
1. Welcome screen explaining AI-guided habit formation concept
2. 3-4 slide onboarding carousel showing key differentiators (AI roadmaps, weekly progression, shame-free adaptation)
3. Permission requests for notifications with clear value explanation
4. Skip option for returning users to go directly to goal setup
5. Visual design elements establishing calming, growth-focused brand aesthetic
6. App introduction copy emphasizing guidance over tracking
7. Clear call-to-action to begin goal articulation process

### Story 1.4: Goal Articulation Wizard
As a user seeking to build new habits,
I want to clearly describe my long-term goal through a guided conversation,
so that the system understands what I'm trying to achieve and can eventually create an appropriate roadmap.

**Acceptance Criteria:**
1. Multi-step conversational form asking: goal description, timeline preference, current situation, past attempts
2. Input validation ensuring goals are specific enough for AI processing
3. Progress indicator showing steps in the goal articulation process
4. Ability to edit previous answers and navigate between wizard steps
5. Goal data saved to user profile in Supabase with proper data structure
6. Confirmation screen summarizing articulated goal before proceeding
7. Option to save goal as draft and continue later
8. Clear messaging that AI roadmap generation comes next (setting expectations)

## Epic 2 Details: AI Roadmap Generation & Display

**Epic Goal:** Enable users to input long-term goals and receive AI-generated 8-12 week progression roadmaps with visual timeline display. Users can preview their personalized journey, understand the reasoning behind each weekly stage, and make adjustments before beginning their habit formation process, delivering the core product differentiator.

### Story 2.1: AI Roadmap Generation Service
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

### Story 2.2: Roadmap Preview & Review Interface
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

### Story 2.3: Roadmap Editing & Customization
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

### Story 2.4: Roadmap Context & Education
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

## Epic 3 Details: Daily Habit Tracking & Weekly Progression

**Epic Goal:** Implement core binary tracking interface (Yes/No/Skip) with weekly stage advancement and progress visualization. Users can consistently log daily habits, see their progress throughout each week, automatically advance to new stages when successful, and maintain momentum through the visual feedback system that reinforces their journey toward their long-term goal.

### Story 3.1: Daily Habit Tracking Interface
As a user with an active roadmap,
I want to quickly log my daily habit completion with a simple binary choice,
so that I can maintain consistent tracking without friction or decision fatigue.

**Acceptance Criteria:**
1. Clean daily dashboard showing current day's habit with large Yes/No/Skip buttons
2. Single-tap logging with immediate visual feedback and confirmation
3. Habit completion data stored locally (AsyncStorage) and synced to Supabase when online
4. Today's habit description and context pulled from current weekly stage
5. Visual indication of offline vs online sync status
6. Previous day review option if user missed logging yesterday
7. Habit completion timestamps recorded for analytics and progress tracking
8. Loading states handled gracefully during sync operations

### Story 3.2: Weekly Progress Visualization
As a user tracking daily habits,
I want to see my progress throughout the current week,
so that I can understand how close I am to completing this stage and stay motivated.

**Acceptance Criteria:**
1. Weekly calendar view showing completed, missed, and remaining days for current stage
2. Progress bar or visual indicator showing completion percentage (e.g., 4/7 days)
3. Encouraging messaging based on current progress ("Great momentum!" or "You're almost there!")
4. Clear display of weekly success criteria (e.g., "Complete 5 out of 7 days to advance")
5. Visual distinction between different completion states (Yes/No/Skip/Missed)
6. Week-over-week comparison showing consistency trends
7. Current stage title and brief description prominently displayed
8. Days remaining in current stage with countdown if approaching deadline

### Story 3.3: Weekly Stage Advancement System
As a user who has successfully completed a weekly stage,
I want to automatically advance to the next stage in my roadmap,
so that I can continue progressing toward my long-term goal without manual intervention.

**Acceptance Criteria:**
1. Automated stage advancement when weekly success criteria are met (default: 5/7 days)
2. Celebration screen acknowledging stage completion with specific achievement recognition
3. Preview of next week's stage showing new habits and objectives
4. Updated roadmap view reflecting completed stage and current position
5. Stage transition logged with timestamp for progress analytics
6. Option to delay stage advancement if user wants to repeat current week
7. Push notification celebrating stage completion (if notifications enabled)
8. Historical record of all completed stages accessible from profile

### Story 3.4: Progress Analytics & Motivation
As a user building habits over multiple weeks,
I want to see patterns in my consistency and overall progress,
so that I can understand my improvement and stay motivated during challenging periods.

**Acceptance Criteria:**
1. Overall roadmap progress showing percentage completion toward long-term goal
2. Consistency metrics displaying average completion rate across all weeks
3. Streak tracking for consecutive successful days (but not prominently featured to avoid pressure)
4. Week-by-week completion rate comparison with trend visualization
5. Encouraging insights based on progress patterns ("You're strongest on weekdays" or "Consistency improving!")
6. Total days tracked and habits completed since starting journey
7. Estimated completion date for roadmap based on current pace
8. Option to share progress milestones (prepare for future social features)

### Story 3.5: Offline Habit Tracking & Sync
As a user who may not always have internet connectivity,
I want to log my habits offline and have them sync when I'm back online,
so that connectivity issues never prevent me from maintaining my habit tracking consistency.

**Acceptance Criteria:**
1. Offline capability for daily habit logging using AsyncStorage local storage
2. Queue system storing offline actions for sync when connectivity returns
3. Visual indicators clearly showing offline mode vs online sync status
4. Automatic background sync when network connection is restored
5. Conflict resolution for edge cases where data exists both locally and remotely
6. Retry logic for failed sync attempts with exponential backoff
7. User notification when offline data has been successfully synced
8. Graceful handling of extended offline periods (multiple days)

## Epic 4 Details: Adaptive Recalibration & User Retention

**Epic Goal:** Provide recalibration flows when users struggle with weekly stages and implement retention mechanisms through notifications and encouragement. Users who fall behind or fail weekly stages receive adaptive support rather than abandonment, with the system adjusting their roadmap to meet them where they are while maintaining progress toward their long-term goal, ensuring sustainable habit formation rather than dropout.

### Story 4.1: Weekly Stage Failure Detection & Response
As a user who has not met the success criteria for a weekly stage,
I want the system to recognize my struggle and offer supportive alternatives,
so that I can continue progressing without feeling like I've failed or need to start over.

**Acceptance Criteria:**
1. Automated detection when weekly stage success criteria are not met (e.g., completed less than 5/7 days)
2. Gentle messaging acknowledging the challenge without blame or judgment language
3. Analysis of user's actual completion pattern to understand specific struggles
4. Option to repeat current week with same habits or proceed to simplified alternative
5. Explanation of why recalibration helps rather than hinders long-term progress
6. User choice in recalibration approach - no forced changes to roadmap
7. Recalibration decision logged for future AI roadmap improvements
8. Encouragement messaging emphasizing learning and adaptation over perfection

### Story 4.2: AI-Powered Roadmap Recalibration
As a user who has chosen to recalibrate my roadmap,
I want the system to generate a simplified but still progressive alternative path,
so that I can continue building toward my goal at a more sustainable pace.

**Acceptance Criteria:**
1. Supabase Edge Function generating simplified alternatives based on user's completion patterns
2. Recalibrated roadmaps maintain logical progression toward original long-term goal
3. Simplified stages reduce daily habit complexity or frequency while preserving core benefits
4. New roadmap shows clear connection to original goal with adjusted timeline
5. User preview and approval process for recalibrated roadmap before implementation
6. Option to return to original roadmap later if circumstances improve
7. Recalibration reasoning explained to user (e.g., "Focusing on consistency over intensity")
8. Updated roadmap integrates seamlessly with existing progress tracking

### Story 4.3: Motivational Check-ins & Encouragement System
As a user progressing through my habit formation journey,
I want periodic encouragement and recognition of my efforts,
so that I stay motivated during difficult periods and feel supported by the system.

**Acceptance Criteria:**
1. Smart notification system sending encouraging messages based on user progress patterns
2. Weekly reflection prompts asking how the user is feeling about their progress
3. Milestone celebrations for significant achievements (first week completed, halfway point, etc.)
4. Personalized encouragement messages referencing user's specific goal and progress
5. Tips and reminders sent at optimal times based on user's logging patterns
6. Gentle re-engagement for users who haven't logged habits in 2-3 days
7. Success pattern recognition with positive reinforcement ("You're strongest on Tuesdays!")
8. Option to adjust notification frequency and timing based on user preferences

### Story 4.4: Progress Recovery & Re-engagement Flow
As a user who has stopped using the app for several days,
I want a supportive way to restart my habit tracking without penalty,
so that temporary breaks don't permanently derail my long-term progress.

**Acceptance Criteria:**
1. Welcome back flow for users returning after 3+ days of inactivity
2. Option to backfill missed days or restart from current date without penalty
3. Gentle inquiry about what caused the break and how to prevent future gaps
4. Roadmap adjustment offering to slow down progression if user was overwhelmed
5. Re-motivation messaging connecting user back to their original long-term goal
6. Option to modify current stage if circumstances have changed during break
7. Success story sharing showing that breaks are normal and recoverable
8. Updated habit recommendations based on what might be more sustainable

### Story 4.5: Long-term Retention & Goal Evolution
As a user who has completed or significantly progressed through my roadmap,
I want options for continued engagement with habit formation,
so that I can build on my success and tackle new areas of growth.

**Acceptance Criteria:**
1. Graduation celebration when users complete their full roadmap with achievement summary
2. Post-completion survey gathering feedback on roadmap effectiveness and user satisfaction
3. Option to set new long-term goal and generate fresh roadmap for continued growth
4. Maintenance mode for users who want to sustain current habits without new progression
5. Success story creation allowing users to share their journey for inspiring others
6. Habit consolidation recommendations for integrating successful habits into permanent lifestyle
7. Advanced goal suggestions based on user's completed roadmap and expressed interests
8. Alumni status with periodic check-ins to prevent regression and maintain motivation

## Checklist Results Report

### PM Checklist Validation Summary

**Overall PRD Completeness:** 92% complete  
**MVP Scope Appropriateness:** Just Right - Well-balanced for 3-4 month development timeline  
**Readiness for Architecture Phase:** ✅ Ready  
**Most Critical Gap:** Missing user research validation and specific competitive analysis

### Category Analysis Results

| Category                         | Status  | Critical Issues |
| -------------------------------- | ------- | --------------- |
| 1. Problem Definition & Context  | PASS    | No user research data cited |
| 2. MVP Scope Definition          | PASS    | None |
| 3. User Experience Requirements  | PASS    | None |
| 4. Functional Requirements       | PASS    | None |
| 5. Non-Functional Requirements   | PASS    | None |
| 6. Epic & Story Structure        | PASS    | None |
| 7. Technical Guidance            | PASS    | None |
| 8. Cross-Functional Requirements | PARTIAL | Missing specific data schema details |
| 9. Clarity & Communication       | PASS    | None |

### Key Findings

**Strengths:**
- Complete technical guidance with clear technology stack specifications
- Well-structured epic and story breakdown with 18 comprehensive user stories
- Strong MVP scope definition balancing features with development timeline
- Comprehensive functional and non-functional requirements (10 each)
- Clear user experience vision with accessibility considerations

**Areas for Future Enhancement:**
- Specific database schema design details for roadmaps and progress data
- Cited user research validation of problem-solution fit
- Detailed competitive feature analysis

### Final Validation Decision
**✅ READY FOR ARCHITECT** - The PRD provides sufficient clarity and structure for architectural design phase.

## Next Steps

### UX Expert Prompt

Load `/BMad:agents:ux` and use this PRD to create comprehensive user experience designs. Focus on the conversational goal setup wizard, daily habit tracking interface, and roadmap visualization. Ensure the design supports the shame-free, growth-focused brand aesthetic while optimizing for mobile-first binary interactions.

### Architect Prompt

Load `/BMad:agents:dev` and use this PRD to create the technical architecture document. Begin with Epic 1 foundation setup focusing on Expo + Supabase integration, then design the AI roadmap generation system using Edge Functions and OpenAI GPT-4. Pay special attention to offline sync architecture for daily tracking and scalable data schema for flexible roadmap storage.