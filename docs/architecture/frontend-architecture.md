# Frontend Architecture

## Component Architecture

**Component Organization:**
```
app/
├── components/
│   ├── common/          # Shared UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ProgressRing.tsx
│   │   └── LoadingSpinner.tsx
│   ├── habit/           # Habit tracking components
│   │   ├── HabitCard.tsx
│   │   ├── HabitLogger.tsx
│   │   └── WeeklyProgress.tsx
│   ├── goal/            # Goal management components
│   │   ├── GoalWizard.tsx
│   │   ├── RoadmapTimeline.tsx
│   │   └── StageCard.tsx
│   └── layout/          # Layout components
│       ├── TabBar.tsx
│       └── Header.tsx
├── screens/             # Screen components
│   ├── auth/
│   │   ├── SignInScreen.tsx
│   │   └── SignUpScreen.tsx
│   ├── main/
│   │   ├── TodayScreen.tsx
│   │   ├── ProgressScreen.tsx
│   │   ├── JourneyScreen.tsx
│   │   └── ProfileScreen.tsx
│   └── onboarding/
│       ├── WelcomeScreen.tsx
│       └── GoalSetupScreen.tsx
├── hooks/               # Custom React hooks
│   ├── useAuth.ts
│   ├── useHabitTracking.ts
│   ├── useOfflineSync.ts
│   └── useNotifications.ts
├── services/            # API and service layers
│   ├── api/
│   │   ├── supabase.ts
│   │   └── aiService.ts
│   ├── storage/
│   │   └── offlineStorage.ts
│   └── sync/
│       └── syncManager.ts
└── stores/             # State management
    ├── authStore.ts
    ├── habitStore.ts
    └── uiStore.ts
```

**Component Template:**
```typescript
// components/habit/HabitCard.tsx
import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useHabitTracking } from '@/hooks/useHabitTracking';
import { HabitLog } from '@/types';

interface HabitCardProps {
  stageId: string;
  date: string;
  onComplete: (status: HabitLog['status']) => void;
}

export const HabitCard = memo<HabitCardProps>(({ 
  stageId, 
  date, 
  onComplete 
}) => {
  const { todayStatus, isLoading } = useHabitTracking(stageId, date);
  
  return (
    <View className="bg-white rounded-lg p-4 shadow-sm">
      {/* Component implementation */}
    </View>
  );
});
```

## State Management Architecture

**State Structure:**
```typescript
// Global state shape
interface AppState {
  // Auth state (Zustand)
  auth: {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
  };
  
  // Server state (React Query)
  goals: {
    current: Goal | null;
    all: Goal[];
  };
  stages: {
    active: WeeklyStage | null;
    upcoming: WeeklyStage[];
  };
  habitLogs: {
    today: HabitLog | null;
    week: HabitLog[];
  };
  
  // UI state (Zustand)
  ui: {
    activeTab: 'today' | 'progress' | 'journey' | 'profile';
    isOnboarding: boolean;
    syncStatus: 'idle' | 'syncing' | 'error';
  };
}
```

**State Management Patterns:**
- Server state cached and synchronized via React Query
- Optimistic updates for instant UI feedback
- Background refetching when app returns to foreground
- Persistent cache for offline support
- UI state managed locally with Zustand

## Routing Architecture

**Route Organization:**
```
RootNavigator/
├── AuthStack/
│   ├── SignIn
│   └── SignUp
├── OnboardingStack/
│   ├── Welcome
│   └── GoalSetup
└── MainTabs/
    ├── TodayStack/
    │   ├── Today
    │   └── HabitDetail
    ├── ProgressStack/
    │   ├── WeeklyProgress
    │   └── StageDetail
    ├── JourneyStack/
    │   ├── Roadmap
    │   └── EditRoadmap
    └── ProfileStack/
        ├── Profile
        └── Settings
```

**Protected Route Pattern:**
```typescript
// navigation/ProtectedRoute.tsx
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/auth/signin" />;
  
  return <>{children}</>;
};
```

## Frontend Services Layer

**API Client Setup:**
```typescript
// services/api/supabase.ts
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
);
```

**Service Example:**
```typescript
// services/api/habitService.ts
import { supabase } from './supabase';
import { HabitLog } from '@/types';

export const habitService = {
  async logHabit(stageId: string, date: string, status: HabitLog['status']) {
    const { data, error } = await supabase
      .rpc('log_habit', {
        p_stage_id: stageId,
        p_date: date,
        p_status: status,
        p_user_id: (await supabase.auth.getUser()).data.user?.id
      });
    
    if (error) throw error;
    return data;
  },
  
  async getWeekProgress(stageId: string) {
    const { data, error } = await supabase
      .from('habit_logs')
      .select('*')
      .eq('stage_id', stageId)
      .gte('date', getWeekStart())
      .lte('date', getWeekEnd());
    
    if (error) throw error;
    return data;
  }
};
```
