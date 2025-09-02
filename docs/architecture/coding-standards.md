# Coding Standards

## Critical Fullstack Rules

- **Type Sharing:** Always define types in shared/types and import from there
- **API Calls:** Never make direct HTTP calls - use the service layer
- **Environment Variables:** Access only through config objects, never process.env directly
- **Error Handling:** All Edge Functions must return consistent error format
- **State Updates:** Never mutate state directly - use proper state management patterns
- **Async Operations:** Always handle loading and error states in UI
- **Offline First:** Write to local storage first, then sync

## Naming Conventions

| Element | Frontend | Backend | Example |
|---------|----------|---------|---------|
| Components | PascalCase | - | `HabitCard.tsx` |
| Hooks | camelCase with 'use' | - | `useAuth.ts` |
| API Routes | - | kebab-case | `/generate-roadmap` |
| Database Tables | - | snake_case | `habit_logs` |
| Type Interfaces | PascalCase | PascalCase | `WeeklyStage` |
| Functions | camelCase | camelCase | `logHabit()` |
