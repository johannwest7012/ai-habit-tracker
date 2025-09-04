# Deployment Architecture

## Deployment Strategy

**Frontend Deployment:**
- **Platform:** Expo Application Services (EAS)
- **Build Command:** `eas build --platform all`
- **Output Directory:** Managed by EAS
- **CDN/Edge:** Expo's CDN for OTA updates

**Backend Deployment:**
- **Platform:** Supabase Cloud
- **Build Command:** `supabase functions deploy`
- **Deployment Method:** Git-based deployment with Supabase CLI

## CI/CD Pipeline

```yaml
# .github/workflows/deploy.yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run test
      - run: npm run typecheck

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: supabase/setup-cli@v1
      - run: supabase functions deploy --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}

  deploy-mobile:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - uses: expo/expo-github-action@v8
      - run: eas build --platform all --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

## Environments

| Environment | Frontend URL | Backend URL | Purpose |
|------------|--------------|-------------|---------|
| Development | Expo Go App | http://localhost:54321 | Local development |
| Staging | TestFlight/Internal Track | https://staging-project.supabase.co | Pre-production testing |
| Production | App Store/Play Store | https://prod-project.supabase.co | Live environment |
