## AI Habit Tracker — Product Requirements Document (PRD)

### 📝 Product Overview

**Product Name:** AI Habit Tracker
**Tagline:** Turn your long-term goals into simple daily actions.
**Overview:**
AI Habit Tracker is a mobile-first app that helps users achieve long-term personal goals through simple, daily Yes/No habit tracking and AI-guided progression. The app removes complexity and guesswork by generating custom roadmaps for any goal, translating vague aspirations into weekly targets and binary daily tasks. Its minimalist interface, celebratory feedback, and adaptive structure make habit-building accessible, sustainable, and universal.

---

### 🎯 Goals & Success Criteria

**Primary Goals:**

1. Provide a frictionless daily habit tracker that works across any goal category
2. Help users transform long-term ambitions into achievable daily actions
3. Leverage AI to reduce decision fatigue and create adaptive, personalized habit journeys
4. Encourage consistency and reduce abandonment through clear progression and feedback
5. Validate product-market fit with early user behavior and feedback

**Success Metrics (MVP):**

* ✅ First Journey Completion Rate
* ✅ Daily Check-in Streaks (2+ weeks)
* ✅ % of users who level up at least once
* ✅ Self-reported clarity and usefulness of AI-generated plans
* ✅ % of users who stay engaged after a failed week

---

### 🧩 Key Features (MVP Scope)

**1. AI Goal Breakdown Engine**
Users enter a long-term goal via chat. The AI asks follow-up questions, then generates a weekly roadmap with progressive daily Yes/No tasks.

**2. Daily Tracking UI**
Minimalist screen with daily habit prompt and Yes/No/Skip buttons. Includes celebratory feedback (e.g. confetti, sound) on success.

**3. Weekly Progress Screen**
Summarizes user’s progress for the week, checks if success criteria are met (e.g., “3 Yes out of 5 target”), and offers promotion to next stage.

**4. Roadmap View**
Linked-list style display of all stages. Highlights current week, allows looking ahead or reflecting on past weeks.

**5. Progression Logic Engine**
Handles level-up logic (e.g., 2 successful weeks in a row), recalculates progression if needed, and prevents demotion in MVP.

**6. AI Replan Option**
If users fail consistently, a “Replan Journey” feature lets the AI offer a gentler, revised path forward.

---

### 👤 User Stories

* As a new user, I want to describe my long-term goal in plain language so that the AI can create a personalized habit plan for me.
* As a user, I want to tap Yes/No each day so I can track my progress quickly and easily.
* As a user, I want to see weekly progress summaries so I understand how I’m doing and what’s needed to advance.
* As a user, I want to see a roadmap of where I’m headed so I feel anchored in a bigger journey.
* As a user, I want the app to adapt if I’m struggling so I don’t feel like I’m failing.
* As a user, I want fun and encouraging feedback when I complete tasks to stay motivated.

---

### 🔄 User Flow & UX Notes

**Primary Flow:**

1. **Create Journey**

   * User enters a long-term goal in chat.
   * AI asks brief clarifying questions.
   * Roadmap is generated and user accepts or edits it.

2. **Daily Habit Screen**

   * Each day shows the current habit.
   * User taps Yes/No/Skip.
   * Feedback animation appears on Yes.

3. **Weekly Summary**

   * Every Sunday, user sees weekly results.
   * If success criteria met, user is prompted to level up.
   * If not, user repeats or chooses to replan.

4. **Roadmap View**

   * Accessible anytime.
   * Shows all past, current, and future weeks in roadmap format.

**UX Notes:**

* Binary interactions only (no sliders, ratings, or logs).
* Copy and visuals should reinforce effort over perfection.
* Celebrations should feel meaningful but not gimmicky.
* All failure states should include soft landing and encouragement.

---

### 🛠️ Technical & Design Considerations (MVP)

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
