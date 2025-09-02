# External APIs

## OpenAI API

- **Purpose:** Generate intelligent habit roadmaps and provide adaptive recalibration based on user progress
- **Documentation:** https://platform.openai.com/docs/api-reference
- **Base URL(s):** https://api.openai.com/v1
- **Authentication:** Bearer token (API key stored in Supabase Edge Function environment variables)
- **Rate Limits:** 
  - GPT-4: 10,000 tokens/min, 200 requests/min (Tier 2)
  - Implement queuing and caching to stay within limits

**Key Endpoints Used:**
- `POST /chat/completions` - Generate roadmaps and recalibrations using GPT-4

**Integration Notes:** 
- All OpenAI calls proxied through Supabase Edge Functions for security
- Implement response caching to reduce API costs
- Use structured prompts with JSON response format for consistent roadmap generation
- Average roadmap generation: ~2000 tokens ($0.06 per roadmap at current pricing)

## Expo Push Notification Service

- **Purpose:** Send daily habit reminders and weekly completion celebrations
- **Documentation:** https://docs.expo.dev/push-notifications/overview/
- **Base URL(s):** https://exp.host/--/api/v2/push/send
- **Authentication:** No auth required for sending (uses push tokens)
- **Rate Limits:** 600 notifications per second

**Key Endpoints Used:**
- `POST /push/send` - Send individual or batch push notifications
- `POST /push/getReceipts` - Check notification delivery status

**Integration Notes:**
- Push tokens obtained during app onboarding and stored in user profile
- Implement exponential backoff for failed deliveries
- Schedule notifications locally when possible to reduce server dependency
- No cost for Expo push service in managed workflow

## Supabase Services

- **Purpose:** Provides authentication, database, realtime subscriptions, and edge function hosting
- **Documentation:** https://supabase.com/docs
- **Base URL(s):** https://{project-ref}.supabase.co
- **Authentication:** 
  - Anon key for public access
  - Service role key for admin operations (Edge Functions only)
  - JWT tokens for authenticated user requests
- **Rate Limits:** 
  - Free tier: 500MB database, 2GB bandwidth, 50,000 Edge Function invocations
  - Pro tier ($25/month): 8GB database, 50GB bandwidth, 500,000 Edge Function invocations

**Key Endpoints Used:**
- `/auth/v1/*` - User authentication
- `/rest/v1/*` - Database CRUD operations  
- `/realtime/v1/*` - WebSocket subscriptions
- `/storage/v1/*` - File uploads (profile pictures)
- `/functions/v1/*` - Custom Edge Functions

**Integration Notes:**
- Row Level Security (RLS) policies enforce data isolation
- Realtime subscriptions automatically reconnect on network changes
- Edge Functions have 10-second timeout (sufficient for OpenAI calls)
- Consider Pro tier for production to ensure adequate resources
