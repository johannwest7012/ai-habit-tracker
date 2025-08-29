
# AI Habit Tracker

A React Native mobile application built with Expo that helps users achieve long-term goals through AI-generated progressive roadmaps and simple daily habit tracking.

## Features

- AI-powered goal breakdown and roadmap generation
- Simple binary (Yes/No) daily task tracking
- Weekly progress aggregation and stage advancement
- Supabase authentication and real-time data sync
- Offline support with automatic synchronization

## Tech Stack

- **Frontend**: React Native with Expo SDK
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **AI Integration**: OpenAI/Anthropic API via Supabase Edge Functions
- **Navigation**: React Navigation v6
- **State Management**: React Context + AsyncStorage

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Supabase:
   - Copy `.env.example` to `.env`
   - Add your Supabase URL and anon key
   - Set up Supabase project with Auth and Database

3. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React Context providers
├── navigation/     # Navigation configuration
├── screens/        # Screen components
├── services/       # Supabase and API services
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## Development

This project follows a spec-driven development approach. See `.kiro/specs/ai-habit-tracker/` for detailed requirements, design, and implementation tasks.

## Supabase Configuration

Make sure to set up the following Supabase services:
- Authentication (Email/Password)
- PostgreSQL Database
- Edge Functions (for AI integration)
- Database Functions (for weekly processing)

## Contributing

1. Follow the implementation tasks in `tasks.md`
2. Ensure all tests pass before submitting changes
3. Follow TypeScript best practices
4. Maintain consistent code formatting
