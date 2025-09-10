# Testing Strategy

Tests are important, but the developer should also keep in mind that creating overly complex testing can sometimes lead to spending more time having to fix and maintain the tests compared to whatever benefits the tests actually provide. 

Additionally there have been multiple instances where in implementing stories in this project, developers have sacrified the integrity of the actual product and code, in order to try to get a test work. DON'T DO THAT. 

At the end of the day, tests are important, but they are secondary priorities to the product itself. 

## Testing Pyramid

```
     E2E Tests (0%)
    /            \
   Integration (30%)
  /              \
Unit Tests (70%)
```

## Test Organization

**Frontend Tests:**
```
app/src/
├── components/
│   └── __tests__/
│       ├── HabitCard.test.tsx
│       └── ProgressRing.test.tsx
├── hooks/
│   └── __tests__/
│       └── useHabitTracking.test.ts
└── services/
    └── __tests__/
        └── habitService.test.ts
```

**Backend Tests:**
```
supabase/functions/
├── generate-roadmap/
│   └── index.test.ts
└── _shared/
    └── __tests__/
        └── openai.test.ts
```

## Test Examples

**Frontend Component Test:**
```typescript
// components/__tests__/HabitCard.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { HabitCard } from '../HabitCard';

describe('HabitCard', () => {
  it('should mark habit as complete on tap', () => {
    const onComplete = jest.fn();
    const { getByText } = render(
      <HabitCard 
        stageId="123" 
        date="2024-03-15" 
        onComplete={onComplete}
      />
    );
    
    fireEvent.press(getByText('Complete'));
    expect(onComplete).toHaveBeenCalledWith('completed');
  });
});
```

**Backend API Test:**
```typescript
// functions/generate-roadmap/index.test.ts
import { createClient } from '@supabase/supabase-js';

describe('generate-roadmap', () => {
  it('should create goal with roadmap', async () => {
    const response = await fetch('http://localhost:54321/functions/v1/generate-roadmap', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Learn Spanish',
        description: 'Conversational level',
        target_date: '2024-12-31',
        experience_level: 'beginner'
      })
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.roadmap.stages).toHaveLength(12);
  });
});
```
