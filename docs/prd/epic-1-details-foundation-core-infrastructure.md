# Epic 1 Details: Foundation & Core Infrastructure

**Epic Goal:** Establish project setup, authentication system, and basic user onboarding flow while delivering initial goal articulation functionality. Users can create accounts, articulate their long-term goals through a guided wizard, and understand the app's approach to habit formation, creating immediate value even before AI roadmap generation is available.

## Story 1.1: Project Foundation Setup
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

## Story 1.2: User Authentication System
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

## Story 1.3: Welcome & App Introduction Flow
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

## Story 1.4: Goal Articulation Wizard
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
