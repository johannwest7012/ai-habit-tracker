# Tech Stack

This is the **DEFINITIVE** technology selection for the entire project. This table is the single source of truth - all development must use these exact versions.

| Category | Technology | Version | Purpose | Rationale |
|----------|------------|---------|---------|-----------|
| Frontend Language | TypeScript | ^5.3.0 | Type-safe mobile development | Strong typing prevents runtime errors, excellent tooling support with Expo |
| Frontend Framework | Expo SDK | ^50.0.0 | React Native mobile app framework | Managed workflow simplifies deployment, built-in modules for native features |
| UI Component Library | React Native Elements | ^3.4.3 | Pre-built mobile UI components | Consistent design system, accessibility built-in, customizable |
| State Management | Zustand | ^4.4.0 | Lightweight state management | Simple API, minimal boilerplate, excellent TypeScript support |
| Backend Language | TypeScript | ^5.3.0 | Unified language across stack | Code sharing between frontend/backend, reduced context switching |
| Backend Framework | Supabase Edge Functions | Latest | Serverless function runtime | Built-in integration with Supabase services, global edge deployment |
| API Style | REST with Supabase Auto-API | Latest | Database-generated REST API | Reduces boilerplate, automatic CRUD operations, real-time subscriptions |
| Database | PostgreSQL | 15+ | Primary data store | ACID compliance, JSON support, excellent Supabase integration |
| File Storage | Supabase Storage | Latest | User avatars and app assets | Integrated with auth system, CDN distribution |
| Authentication | Supabase Auth | Latest | User authentication & authorization | Social logins, row-level security, JWT tokens |
| Frontend Testing | Jest + React Native Testing Library | ^29.0.0 / ^12.0.0 | Unit and integration testing | Standard React Native testing stack |
| Backend Testing | Jest + Supertest | ^29.0.0 / ^6.3.0 | API testing | HTTP endpoint testing for edge functions |
| Build Tool | Expo CLI | ^6.3.0 | Mobile app build and deployment | Handles iOS/Android builds, OTA updates |
| Bundler | Metro (Expo) | Latest | JavaScript bundling | Optimized for React Native, built into Expo |
| IaC Tool | Supabase CLI | Latest | Database migrations and deployment | Version-controlled schema changes |
| CI/CD | GitHub Actions + EAS Build | Latest | Automated testing and deployment | Free for open source, excellent Expo integration |
| Monitoring | Flipper + Supabase Dashboard | Latest | Development debugging and analytics | Real-time debugging, built-in analytics |
| Logging | React Native Logs + Supabase Logs | Latest | Application logging | Centralized logging across mobile and backend |
| CSS Framework | NativeWind | ^2.0.11 | Tailwind CSS for React Native | Familiar utility classes, responsive design |

**Key Integration Points:**
- **AI Service:** OpenAI API (latest) for goal breakdown and habit generation
- **Network Handling:** Expo NetInfo for connectivity detection
- **Push Notifications:** Expo Notifications for habit reminders
- **Analytics:** Expo Analytics for user behavior tracking

**MVP-Focused Architecture Benefits:**
- **Reduced Complexity:** No offline sync, caching layers, or complex E2E test setup
- **Faster Development:** Direct API calls with standard error handling patterns
- **Lean Stack:** Essential tools only - can add caching and advanced testing post-MVP
- **Better UX:** Real-time updates through Supabase subscriptions without additional complexity
- **Easier Testing:** Unit tests and manual testing for MVP validation
