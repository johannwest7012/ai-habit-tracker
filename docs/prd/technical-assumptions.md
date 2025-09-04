# Technical Assumptions

## Repository Structure: Monorepo
Single Expo managed workflow project with organized folder structure (screens, components, services, utils). All mobile app code, configuration, and documentation contained within one repository for simplified development and deployment pipeline.

## Service Architecture: Serverless Functions within Mobile-Centric Architecture
**Primary Architecture:** Expo React Native mobile app with Supabase backend providing database, authentication, and Edge Functions for AI roadmap generation and complex business logic. Client-side state management using React Query for efficient data fetching and caching.

**Rationale:** Serverless approach via Supabase Edge Functions provides scalability for AI roadmap generation without infrastructure management overhead, while maintaining fast response times for daily tracking operations.

## Testing Requirements: Unit + Integration Testing
**Testing Strategy:** Jest for unit testing of business logic and utility functions, React Native Testing Library for component integration tests, and Supabase local development for backend function testing.

**Manual Testing:** Focus on user flow validation for goal setup wizard and daily tracking interactions, with device testing across iOS/Android platforms.

**Rationale:** Comprehensive testing ensures reliability for core habit tracking functionality while avoiding over-engineering with full E2E automation for MVP stage.

## Additional Technical Assumptions and Requests

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
