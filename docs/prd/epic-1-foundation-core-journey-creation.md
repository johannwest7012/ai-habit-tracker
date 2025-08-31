# Epic 1: Foundation & Core Journey Creation

**Epic Goal:** Establish the foundational project infrastructure including monorepo setup, user authentication, database schema, and the core AI-powered journey generation system. This epic delivers the essential backend services and the key differentiating feature that transforms user goals into structured habit roadmaps, providing immediate value through intelligent journey creation.

## Story 1.1: Project Setup and Development Environment
As a developer,  
I want a properly configured monorepo with shared packages and development tooling,  
so that I can efficiently develop across frontend, backend, and shared code with consistent standards.

### Acceptance Criteria
1. Monorepo structure is created using npm workspaces with apps/, packages/, and supabase/ directories
2. TypeScript ^5.3.0 is configured across all packages with shared tsconfig.json base
3. Expo ^50.0.0 mobile app is initialized with React Native Elements and NativeWind
4. Shared packages (shared types, api-client) are created and properly linked
5. Development scripts (dev, build, test, lint) work across all packages
6. Git repository is initialized with appropriate .gitignore for Node/Expo/Supabase
7. Environment variable templates (.env.example) are created for all environments
8. Basic CI/CD workflow is configured for automated testing

## Story 1.2: Database Schema and Core Data Models
As a system architect,  
I want a complete database schema with proper relationships and constraints,  
so that user data can be stored securely and efficiently with referential integrity.

### Acceptance Criteria
1. PostgreSQL schema is created with users, journeys, stages, and tasks tables
2. UUID primary keys are implemented across all tables
3. Foreign key relationships are properly established with cascading deletes
4. Row Level Security (RLS) policies are implemented for user data isolation
5. Database indexes are created for common query patterns (user_id, date ranges)
6. JSONB fields are properly configured for AI-generated content storage
7. Check constraints prevent invalid data entry (enum values, length limits)
8. Audit triggers are implemented for updated_at timestamp management
9. Supabase migrations are version-controlled and can be applied consistently

## Story 1.3: User Authentication and Profile Management
As a new user,  
I want to create an account and manage my profile,  
so that I can securely access the app and personalize my habit tracking experience.

### Acceptance Criteria
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

## Story 1.4: AI Journey Generation System
As a user with a long-term goal,  
I want to input my goal and receive a personalized habit roadmap,  
so that I can follow a structured plan created specifically for my situation and experience level.

### Acceptance Criteria
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
