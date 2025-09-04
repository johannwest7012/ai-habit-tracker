# Security and Performance

## Security Requirements

**Frontend Security:**
- CSP Headers: Managed by Expo
- XSS Prevention: React Native's default text encoding
- Secure Storage: Expo SecureStore for tokens

**Backend Security:**
- Input Validation: Zod schemas on Edge Functions
- Rate Limiting: 10 req/min for AI endpoints
- CORS Policy: Configured per Edge Function

**Authentication Security:**
- Token Storage: Expo SecureStore (encrypted)
- Session Management: 1-week refresh tokens
- Password Policy: 8+ chars, 1 number, 1 special

## Performance Optimization

**Frontend Performance:**
- Bundle Size Target: <5MB initial download
- Loading Strategy: Lazy load screens, prefetch next stage
- Caching Strategy: React Query with 5-min stale time

**Backend Performance:**
- Response Time Target: <500ms for queries, <5s for AI
- Database Optimization: Indexes on foreign keys and date fields
- Caching Strategy: Edge Function results cached 1 hour
