# Unified Project Structure

```plaintext
ai-habit-tracker/
├── .github/                    # CI/CD workflows
│   └── workflows/
│       ├── ci.yaml            # Test and lint on PR
│       └── deploy.yaml        # Deploy to EAS/Supabase
├── app/                        # Expo React Native application
│   ├── src/
│   │   ├── components/         # UI components
│   │   │   ├── common/        # Shared components
│   │   │   ├── habit/         # Habit tracking components
│   │   │   ├── goal/          # Goal management components
│   │   │   └── layout/        # Layout components
│   │   ├── screens/           # Screen components
│   │   │   ├── auth/          # Authentication screens
│   │   │   ├── main/          # Main app screens
│   │   │   └── onboarding/    # Onboarding flow
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useHabitTracking.ts
│   │   │   └── useOfflineSync.ts
│   │   ├── services/          # API client services
│   │   │   ├── api/           # Supabase client
│   │   │   ├── storage/       # Offline storage
│   │   │   └── sync/          # Sync management
│   │   ├── stores/            # State management
│   │   │   ├── authStore.ts
│   │   │   └── uiStore.ts
│   │   ├── navigation/        # Navigation configuration
│   │   │   └── RootNavigator.tsx
│   │   ├── utils/             # Utility functions
│   │   └── constants/         # App constants
│   ├── assets/                # Images, fonts
│   ├── app.json              # Expo configuration
│   ├── babel.config.js
│   ├── tsconfig.json
│   ├── tailwind.config.js    # NativeWind config
│   └── package.json
├── supabase/                   # Backend (Supabase)
│   ├── functions/             # Edge Functions
│   │   ├── generate-roadmap/
│   │   │   └── index.ts
│   │   ├── recalibrate-roadmap/
│   │   │   └── index.ts
│   │   ├── check-weekly-progress/
│   │   │   └── index.ts
│   │   ├── edit-roadmap/
│   │   │   └── index.ts
│   │   └── _shared/           # Shared utilities
│   │       ├── openai.ts
│   │       ├── supabase.ts
│   │       ├── auth.ts
│   │       └── types.ts
│   ├── migrations/            # Database migrations
│   │   ├── 20240301000000_initial_schema.sql
│   │   ├── 20240301000001_rls_policies.sql
│   │   └── 20240301000002_functions.sql
│   ├── tests/                 # Backend tests
│   └── config.toml           # Supabase configuration
├── shared/                     # Shared code
│   ├── types/                 # TypeScript interfaces
│   │   ├── models.ts         # Data models
│   │   ├── api.ts            # API types
│   │   └── index.ts
│   ├── constants/             # Shared constants
│   │   └── habits.ts
│   └── package.json
├── scripts/                    # Build/deploy scripts
│   ├── setup.sh              # Initial setup
│   ├── deploy.sh             # Deployment script
│   └── sync-types.js        # Type generation
├── docs/                       # Documentation
│   ├── brief.md
│   ├── prd/
│   ├── front-end-spec.md
│   └── architecture.md       # This document
├── .env.example               # Environment template
├── .gitignore
├── package.json               # Root package.json
├── README.md
└── tsconfig.base.json        # Shared TS config
```
