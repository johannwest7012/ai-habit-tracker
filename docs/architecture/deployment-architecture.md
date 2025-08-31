# Deployment Architecture

## Deployment Strategy

**Mobile Deployment:**
- **Platform:** Expo Application Services (EAS)
- **Build Command:** `eas build --platform all`
- **Distribution:** App Store and Google Play Store
- **OTA Updates:** Expo Updates for JavaScript-only changes

**Backend Deployment:**
- **Platform:** Supabase Cloud
- **Database:** Automated PostgreSQL hosting
- **Edge Functions:** Automatic deployment via Supabase CLI
- **Deployment Method:** Infrastructure as Code via migrations

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
      - run: npm run type-check

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npx supabase db push
      - run: npx supabase functions deploy

  build-mobile:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
      - run: eas build --platform all --non-interactive
```

## Environments

| Environment | Mobile | Backend | Purpose |
|-------------|---------|---------|---------|
| Development | Expo Dev Client | Supabase Local | Local development |
| Staging | TestFlight/Internal Testing | Supabase Staging | Pre-production testing |
| Production | App Store/Google Play | Supabase Production | Live environment |
