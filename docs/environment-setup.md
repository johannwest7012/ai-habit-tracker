# Environment Setup Guide

This guide explains how to configure environment variables for the AI Habit Tracker application across different environments.

## Required Environment Variables

The application requires the following environment variables to connect to Supabase:

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://your-project-id.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key | `eyJhbG...` |
| `EXPO_PUBLIC_ENVIRONMENT` | Current environment (optional) | `development` |

## Development Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Get your Supabase credentials:**
   - Log into your Supabase dashboard
   - Go to Settings > API
   - Copy your Project URL and anon/public key

3. **Fill in your `.env` file:**
   ```bash
   # Supabase Configuration
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   EXPO_PUBLIC_ENVIRONMENT=development
   ```

4. **Verify configuration:**
   - The app will validate environment variables on startup
   - Check console for any configuration errors

## Production Setup

### Option 1: Separate Production File
Create a `.env.production` file with production credentials:
```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-prod-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key-here
EXPO_PUBLIC_ENVIRONMENT=production
```

### Option 2: EAS Build Environment Variables
Configure environment variables in your `eas.json` for build-time injection:
```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_SUPABASE_URL": "https://your-prod-project-id.supabase.co",
        "EXPO_PUBLIC_SUPABASE_ANON_KEY": "your-prod-anon-key-here",
        "EXPO_PUBLIC_ENVIRONMENT": "production"
      }
    }
  }
}
```

## Security Notes

- **Never commit `.env` files** to version control
- Use different Supabase projects for development and production
- The `anon` key is safe to expose in client-side code (public key)
- Implement Row Level Security (RLS) policies in Supabase for data protection
- Use environment-specific Supabase projects to isolate data

## Troubleshooting

### Missing Environment Variables
If you see errors about missing environment variables:
1. Ensure `.env` file exists in project root
2. Verify all required variables are set
3. Restart your development server after changes
4. Check for typos in variable names (case-sensitive)

### Connection Issues
If Supabase connection fails:
1. Verify your Supabase URL and anon key are correct
2. Check your Supabase project is active
3. Test connection in Supabase dashboard
4. Ensure your network allows connections to Supabase

### Expo Environment Variables
- Variables must be prefixed with `EXPO_PUBLIC_` to be available in the client
- Variables are embedded at build time, not runtime
- Restart development server after changing environment variables

## Configuration Access

Environment variables are accessed through the configuration object:

```typescript
import { config } from '../config/environment';

// Correct way - access through config object
const url = config.supabaseUrl;
const key = config.supabaseAnonKey;

// Wrong way - never access process.env directly
const url = process.env.EXPO_PUBLIC_SUPABASE_URL; // ❌ Don't do this
```

This follows our coding standards requiring environment variable access only through config objects.