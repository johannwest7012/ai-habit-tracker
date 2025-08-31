# Development Workflow

## Local Development Setup

**Prerequisites:**
```bash
# Install Node.js 18+ and npm
node --version  # Should be 18+
npm --version   # Should be 8+

# Install Expo CLI globally
npm install -g @expo/cli

# Install Supabase CLI
npm install -g supabase
```

**Initial Setup:**
```bash
# Clone repository
git clone https://github.com/your-org/ai-habit-tracker.git
cd ai-habit-tracker

# Install all dependencies (monorepo)
npm install

# Set up environment variables
cp .env.example .env.local

# Initialize Supabase project
supabase init
supabase start

# Run database migrations
supabase db reset
```

**Development Commands:**
```bash
# Start mobile development server
npm run dev:mobile

# Start Supabase local development
npm run dev:supabase

# Run all tests
npm run test

# Type checking
npm run type-check

# Linting
npm run lint
```

## Environment Configuration

**Required Environment Variables:**

```bash
# Mobile App (.env.local)
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_OPENAI_API_KEY=your-openai-key

# Supabase Edge Functions (.env)
OPENAI_API_KEY=your-openai-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```
