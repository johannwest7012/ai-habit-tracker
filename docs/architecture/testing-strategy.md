# Minimalist Testing Strategy

## Core Philosophy: "Test the Money, Not the Framework"

**THE PROBLEM:** Testing was consuming 70-80% of development time, creating a massive bottleneck that was slowing MVP delivery while providing questionable value.

**THE SOLUTION:** Drastically reduce testing to only the most critical business logic that could cause data corruption or user-blocking failures.

## Testing Rules

### ✅ What TO Test (5-10 tests maximum):
1. **Database Functions** - `check_weekly_progress()`, `log_habit()` (data corruption risk)
2. **OpenAI Response Parsing** - Roadmap JSON structure validation (user blocking)
3. **Progress Calculation Logic** - Week completion algorithm (core business logic)
4. **Authentication Edge Cases** - Token validation in Edge Functions (security)

### ❌ What NOT TO Test:
- **React Native Components** - Trust Expo's framework testing
- **Navigation** - Manual testing with Expo Go is faster
- **UI Interactions** - Visual QA replaces automated testing
- **API Client Calls** - Trust Supabase SDK
- **State Management** - Trust React Query/Zustand
- **Integration Tests** - Manual end-to-end testing instead

## Testing Guidelines

### The 1-Hour Rule
If a test takes more than 1 hour to write and debug, **skip it**. The time is better spent on features.

### No Complex Mocking
If it requires mocking Supabase, React Navigation, or Expo modules, **don't test it**. The setup overhead isn't worth it.

### Manual Over Automated
- Use **Expo Go** for rapid UI testing on real devices
- Use **Supabase Dashboard** to verify data operations
- Use **console logs** for debugging instead of test assertions

## Minimal Test Setup

**Only test pure functions with simple inputs/outputs:**

```typescript
// utils/__tests__/progressCalculator.test.ts
import { calculateWeeklyProgress } from '../progressCalculator';

describe('calculateWeeklyProgress', () => {
  it('marks week complete with 5+ completed days', () => {
    const logs = [
      { status: 'completed' },
      { status: 'completed' },
      { status: 'completed' },
      { status: 'completed' },
      { status: 'completed' },
      { status: 'missed' },
      { status: 'missed' }
    ];
    
    expect(calculateWeeklyProgress(logs)).toBe(true);
  });
});
```

**Test database functions locally:**

```sql
-- Test in Supabase SQL editor
SELECT public.check_weekly_progress('test-stage-id');
-- Verify JSON response structure
```

## Quality Assurance Strategy

### Manual Testing Checklist (5 minutes per story)
1. **Happy Path**: Core user flow works
2. **Error Cases**: Network failures show friendly messages
3. **Edge Cases**: Empty states, loading states
4. **Device Testing**: Test on iOS and Android via Expo Go

### Production Monitoring
- **Error Logging**: Supabase logs catch runtime issues
- **User Feedback**: Direct user reports for UX problems
- **Analytics**: Track completion rates, not test coverage

## File Organization

```
app/src/
└── utils/
    └── __tests__/
        └── progressCalculator.test.ts  # Only pure business logic

supabase/
└── tests/
    └── database-functions.sql  # Test SQL functions directly
```

**Note:** Remove all existing component tests, hook tests, and integration tests to reduce maintenance burden.

## Success Metrics

- **Development Speed**: 90% time on features, 10% on testing
- **Bug Detection**: Manual QA + production monitoring
- **Code Quality**: TypeScript + linting (not testing) prevents most issues
