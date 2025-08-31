# 🛠️ Technical & Design Considerations (MVP)

**Platform:**

* Mobile app built with Expo (React Native)
* Backend: Supabase (Auth, PostgreSQL, Edge Functions)

**AI Integration:**

* Goal-to-roadmap transformation via OpenAI API (or similar LLM)
* Prompt tuning based on onboarding responses
* Roadmap persistence stored per user in PostgreSQL database

**Data Model Sketch:**

* `users` table → individual user profiles
* `journeys` table → per-goal AI-generated plans
* `stages` table → weekly units with success rules
* `tasks` table → daily binary check-ins

**Logic Handling:**

* Level-up logic runs server-side on Sunday or when user triggers early
* "Replan Journey" invokes same AI path generator with historical feedback
* No demotion logic in MVP (retry same week on fail)
* Roadmap persistence stored per user in PostgreSQL database

**Design Notes:**

* Binary inputs must feel emotionally engaging (e.g., Yes tap = positive moment)
* Animation timing, language, and feedback tone are key to perceived momentum
* Roadmap screen UX should visualize progress in a timeline, not a calendar
