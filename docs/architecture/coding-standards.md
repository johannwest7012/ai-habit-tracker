# Coding Standards

## Critical Fullstack Rules

- **Type Sharing:** Always define types in `packages/shared` and import from there - prevents type mismatches between frontend/backend
- **API Calls:** Never make direct HTTP calls - use the repository pattern from `packages/api-client`
- **Environment Variables:** Access only through config objects, never `process.env` directly in components
- **Error Handling:** All Edge Functions must use the standard error handler with proper logging
- **State Updates:** Never mutate Zustand state directly - use proper state management patterns
- **Authentication:** Always validate JWT tokens in Edge Functions, never trust client-side auth state
- **Database Access:** Use Row Level Security policies, never bypass with service role in client code

## Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| Components | PascalCase | - | `HabitTracker.tsx` |
| Hooks | camelCase with 'use' | - | `useJourney.ts` |
| Edge Functions | kebab-case | kebab-case | `generate-journey` |
| Database Tables | - | snake_case | `user_journeys` |
| API Endpoints | - | kebab-case | `/api/journey-progress` |
