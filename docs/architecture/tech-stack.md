# Tech Stack

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Frontend Language | TypeScript | 5.3+ | Type-safe mobile app development | Prevents runtime errors, improves IDE support, essential for maintainability |
| Frontend Framework | Expo (React Native) | SDK 50+ | Cross-platform mobile development | Managed workflow accelerates development, handles native complexity |
| UI Component Library | React Native Elements | 4.0+ | Pre-built UI components | Consistent Material Design components, reduces custom styling effort |
| State Management | React Query + Zustand | 5.0+ / 4.4+ | Server state + client state | React Query handles API caching, Zustand for local UI state |
| Backend Language | TypeScript | 5.3+ | Edge Functions development | Shared types with frontend, consistent language across stack |
| Backend Framework | Supabase Edge Functions | Latest | Serverless API endpoints | Built-in integration with Supabase, automatic scaling |
| API Style | REST + Realtime | - | HTTP APIs + WebSocket subscriptions | REST for CRUD, Realtime for sync, native Supabase patterns |
| Database | PostgreSQL (Supabase) | 15+ | Primary data storage | ACID compliance, JSON support for flexible roadmaps, Row Level Security |
| Cache | React Query Cache | Built-in | Client-side caching | Reduces API calls, enables offline-first functionality |
| File Storage | Supabase Storage | Latest | Profile images, exports | Integrated with auth, automatic CDN distribution |
| Authentication | Supabase Auth | Latest | User authentication | Built-in OAuth, magic links, Row Level Security integration |
| Frontend Testing | Jest + React Native Testing Library | 29+ / 12+ | Unit and integration tests | Standard React Native testing stack, good Expo support |
| Backend Testing | Deno Test (Edge Functions) | Built-in | Edge Function testing | Native to Supabase Edge Functions environment |
| E2E Testing | - | - | Deferred to post-MVP | Manual QA for MVP, add automation after launch validation |
| Build Tool | Expo CLI + EAS Build | Latest | Mobile app building | Cloud builds for iOS without Mac, simplified certificates |
| Bundler | Metro | Latest | JavaScript bundling | Default React Native bundler, optimized for mobile |
| IaC Tool | Supabase CLI | Latest | Infrastructure as code | Database migrations, function deployment, environment management |
| CI/CD | GitHub Actions + EAS | Latest | Automated deployment | Free tier sufficient for MVP, integrates with EAS |
| Monitoring | Supabase Analytics | Built-in | Usage analytics and basic monitoring | Platform metrics sufficient for MVP, add Sentry post-launch |
| Logging | Supabase Logs | Built-in | Centralized logging | Integrated platform logging for Edge Functions and database |
| CSS Framework | NativeWind | 2.0+ | Tailwind-style React Native styling | Utility-first styling, responsive design support |
