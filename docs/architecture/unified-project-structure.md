# Unified Project Structure

Monorepo structure accommodating both mobile app and backend services with shared packages:

```
ai-habit-tracker/
├── .github/                    # CI/CD workflows
│   └── workflows/
│       ├── ci.yaml
│       ├── test.yaml
│       └── deploy.yaml
├── apps/                       # Application packages
│   └── mobile/                 # Expo React Native app
│       ├── src/
│       │   ├── components/     # UI components
│       │   │   ├── common/     # Reusable components
│       │   │   ├── journey/    # Journey-specific components
│       │   │   └── habit/      # Daily habit components
│       │   ├── screens/        # Screen components
│       │   │   ├── auth/       # Authentication screens
│       │   │   ├── journey/    # Journey management screens
│       │   │   ├── habit/      # Daily habit tracking
│       │   │   └── profile/    # User profile screens
│       │   ├── navigation/     # Navigation configuration
│       │   ├── services/       # API client services
│       │   ├── stores/         # Zustand state management
│       │   ├── hooks/          # Custom React hooks
│       │   ├── utils/          # Frontend utilities
│       │   └── types/          # Frontend-specific types
│       ├── assets/             # Images, fonts, etc.
│       ├── app.config.js       # Expo configuration
│       ├── package.json
│       └── README.md
├── packages/                   # Shared packages
│   ├── shared/                 # Shared types and utilities
│   │   ├── src/
│   │   │   ├── types/          # TypeScript interfaces
│   │   │   │   ├── api.ts      # API request/response types
│   │   │   │   ├── database.ts # Database entity types
│   │   │   │   └── index.ts    # Exported types
│   │   │   ├── constants/      # Shared constants
│   │   │   ├── utils/          # Shared utilities
│   │   │   └── validation/     # Shared validation schemas
│   │   └── package.json
│   └── api-client/             # Supabase client configuration
│       ├── src/
│       │   ├── client.ts       # Supabase client setup
│       │   ├── repositories/   # Data access patterns
│       │   └── types.ts        # Client-specific types
│       └── package.json
├── supabase/                   # Database and Edge Functions
│   ├── migrations/             # Database migrations
│   │   ├── 20250130000001_initial_schema.sql
│   │   ├── 20250130000002_add_indexes.sql
│   │   └── 20250130000003_add_rls_policies.sql
│   ├── functions/              # Edge Functions
│   │   ├── generate-journey/   # AI journey generation
│   │   │   ├── index.ts
│   │   │   └── package.json
│   │   ├── replan-journey/     # AI journey replanning
│   │   │   ├── index.ts
│   │   │   └── package.json
│   │   └── check-progression/  # Stage progression logic
│   │       ├── index.ts
│   │       └── package.json
│   ├── seed.sql                # Development seed data
│   └── config.toml             # Supabase configuration
├── docs/                       # Documentation
│   ├── api.md                  # API documentation
│   ├── deployment.md           # Deployment guide
│   └── development.md          # Development setup
├── scripts/                    # Build/deploy scripts
│   ├── setup.sh                # Initial project setup
│   ├── deploy.sh               # Deployment script
│   └── seed-dev.sh             # Development data seeding
├── .env.example                # Environment template
├── .gitignore
├── package.json                # Root package.json with workspaces
├── turbo.json                  # Turborepo configuration (optional)
└── README.md
```

**Project Structure Benefits:**
- **Clear Separation:** Apps vs packages vs infrastructure
- **Type Safety:** Shared types ensure consistency across stack
- **Efficient Development:** Hot reloading and shared package updates
- **Scalable:** Easy to add web dashboard or additional mobile apps
- **Version Control:** Independent versioning for each package
