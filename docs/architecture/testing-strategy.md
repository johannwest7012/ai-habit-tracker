# Testing Strategy

## MVP Testing Approach

**Frontend Tests:**
```
apps/mobile/src/__tests__/
├── components/           # Component unit tests
├── hooks/               # Hook unit tests
├── services/            # API service tests
└── utils/               # Utility function tests
```

**Backend Tests:**
```
supabase/functions/__tests__/
├── generate-journey.test.ts    # AI generation tests
├── check-progression.test.ts   # Progress logic tests
└── utils.test.ts              # Shared utility tests
```

**Test Examples:**

```typescript
// Frontend component test
describe('HabitTracker', () => {
  it('should display habit prompt', () => {
    render(<HabitTracker habit="Did you practice Spanish today?" />);
    expect(screen.getByText(/practice Spanish/)).toBeInTheDocument();
  });
});

// Backend Edge Function test
describe('generate-journey', () => {
  it('should create valid journey structure', async () => {
    const response = await generateJourney({
      goal: "Learn Spanish",
      userContext: { experience: "beginner" }
    });
    
    expect(response.stages).toHaveLength.greaterThan(0);
    expect(response.estimated_duration_weeks).toBeGreaterThan(0);
  });
});
```

This completes the comprehensive fullstack architecture document for your AI Habit Tracker MVP. The architecture prioritizes rapid development while maintaining scalability and security through the Expo + Supabase tech stack.
