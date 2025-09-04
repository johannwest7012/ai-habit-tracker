# Development Workflow

## Local Development Setup

**Prerequisites:**
```bash
# Required tools
node --version  # v18+ required
npm --version   # v9+ required
git --version

# Install Expo CLI globally
npm install -g expo-cli eas-cli

# Install Supabase CLI
brew install supabase/tap/supabase  # macOS
# or npm install -g supabase
```

**Initial Setup:**
```bash
# Clone repository
git clone https://github.com/your-org/ai-habit-tracker.git
cd ai-habit-tracker

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase and OpenAI keys

# Initialize Supabase locally
supabase init
supabase start  # Starts local Supabase instance

# Run database migrations
supabase db push

# Start development
npm run dev
```

**Development Commands:**
```bash
# Start all services (runs concurrently)
npm run dev

# Start frontend only
npm run dev:app

# Start Supabase functions only
npm run dev:functions

# Run tests
npm run test
npm run test:app      # Frontend tests
npm run test:functions # Backend tests

# Linting and formatting
npm run lint
npm run format

# Type checking
npm run typecheck

# Build for production
npm run build
```

## Environment Configuration

**Required Environment Variables:**
```bash
# Frontend (.env.local)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Backend (.env)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-key
OPENAI_API_KEY=sk-your-openai-key

# Shared
DATABASE_URL=postgresql://postgres:password@localhost:54322/postgres
```
