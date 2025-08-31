# Technical Assumptions

## Repository Structure: Monorepo
The project will use npm workspaces to organize the mobile app, shared packages, and backend services in a single repository structure for efficient development and type sharing.

## Service Architecture: Serverless
Supabase Edge Functions provide serverless backend logic while maintaining integration with the database and authentication systems, eliminating infrastructure management overhead.

## Testing Requirements: Unit + Integration
Focus on unit tests for business logic and integration tests for API endpoints and database operations, with manual testing for user experience validation during MVP phase.

## Additional Technical Assumptions and Requests
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
