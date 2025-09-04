# Project Brief: AI Habit Tracker

## Executive Summary

**AI Habit Tracker** is a universal habit-building app that transforms user aspirations into structured, AI-generated roadmaps with weekly progression stages. Unlike traditional habit trackers that require users to design their own plans, this app combines simple binary daily tracking (Yes/No) with intelligent guidance, helping users translate long-term goals into consistent daily actions through automated level-ups and shame-free adaptability.

## Problem Statement

**The Challenge:** Most habit-tracking tools require users to already know what habits to track — they offer a UI, not a roadmap. But in reality, nearly every habit is a means to a long-term goal, whether consciously stated or not. People don't drink more water for the sake of it — they do it to become healthier. They don't practice guitar for 15 minutes daily without a bigger intention — they do it to improve.

**The Core Problem:** People often want to reach a goal, but they don't know the steps to get there. That uncertainty leads to friction, indecision, and eventually, dropout. Whether the goal is fitness, creativity, learning, or self-discipline, users are left alone to figure out the "how." Traditional habit apps put the burden on the user to design a progression.

**Current Market Gap:** Existing solutions create a paradox - they require expertise in habit formation to be effective, but the users who need them most lack exactly that expertise. Users abandon these tools not because they lack motivation, but because they lack direction.

## Proposed Solution

**Core Solution:** AI Habit Tracker solves the expertise gap by combining tracking with structured guidance. The AI transforms vague goals into specific, progressive weekly stages, each with simple daily binary habits. Users describe their long-term goal, and the system breaks it into achievable weekly milestones with clear daily actions.

**Key Differentiators:**
- **Built-In Guidance**: AI creates the path — users don't have to design their own plan or guess what to do next
- **Progressive Structure**: Weekly level-ups make the experience feel like a game, not a chore  
- **Goal-Agnostic Simplicity**: Supports any kind of goal using a single binary interface (Yes/No/Skip)
- **Shame-Free Adaptability**: If users fall behind, the system adjusts — no punishment, just progression at their pace
- **Transparent Planning**: Users can preview and edit their journey roadmap with simple explanations

**Why This Succeeds Where Others Haven't:** Traditional habit apps assume users know what to track and how to progress. This app removes that assumption by providing the methodology alongside the tracking mechanism, creating a complete habit-formation system rather than just a logging tool.

## Target Users

### Primary User Segment: Goal-Oriented Beginners

**Profile:** Individuals with meaningful aspirations who struggle to translate goals into consistent daily actions. They have motivation but lack the methodology to create effective habit progressions.

**Demographics:**
- Ages 25-45 (career-building and life-transition phase)
- Mix of professionals, students, and life-changers
- Technology-comfortable but productivity-tool overwhelmed
- Income: Middle to upper-middle class (willing to pay for results)

**Current Behaviors & Workflows:**
- Start multiple habit-tracking apps but abandon them within 2-3 weeks
- Set ambitious New Year's or quarterly goals without clear implementation plans
- Research "how to build habits" but struggle to apply generic advice to their specific goals
- Cycle between periods of high motivation and complete dropout

**Specific Needs & Pain Points:**
- Need structure without complexity
- Want accountability without judgment
- Require guidance on what to do, not just how to track it
- Struggle with maintaining consistency during busy or stressful periods

**Goals They're Trying to Achieve:**
- Build new skills (language learning, creative pursuits, professional development)
- Improve health and fitness (sustainable lifestyle changes, not quick fixes)
- Develop personal qualities (discipline, mindfulness, productivity)
- Navigate life transitions (new career, parenthood, major life changes)

## Goals & Success Metrics

### Business Objectives
- **User Retention**: Achieve 60% 30-day retention rate (vs 20% industry average for habit apps) by providing AI-guided progression that reduces early dropout
- **Engagement Depth**: Average 4+ weeks of active usage per user before first "graduation" to next major life stage
- **Market Differentiation**: Capture 15% of "goal-oriented habit formation" market segment within 18 months through AI guidance positioning
- **Revenue Growth**: Reach $100K ARR within 12 months via freemium model with premium AI coaching features

### User Success Metrics
- **Goal Achievement Rate**: 40% of users complete at least one major multi-week progression (8+ weeks)
- **Daily Consistency**: Users maintain 70%+ daily check-in rate during active periods
- **Progressive Advancement**: Average user advances through 3+ weekly stages before plateau or completion
- **Satisfaction Indicators**: 4.5+ app store rating with specific praise for "actually helping me reach my goals"

### Key Performance Indicators (KPIs)
- **Weekly Active Users (WAU)**: Track consistent weekly engagement vs daily spikes
- **Stage Completion Rate**: Percentage of users who complete each weekly stage successfully
- **AI Roadmap Acceptance**: Rate at which users accept vs modify AI-generated progressions
- **Recalibration Success**: Percentage of users who re-engage after AI adjusts their roadmap due to struggles

## MVP Scope

### Core Features (Must Have)

- **AI Roadmap Generation:** User inputs long-term goal, AI creates 8-12 week progression with weekly stages and daily binary habits
- **Daily Binary Tracking:** Simple Yes/No/Skip interface for daily habit completion with single-tap logging
- **Weekly Stage Progression:** Automated level-up system when weekly success criteria are met (e.g., 5/7 days completed)
- **Visual Progress Display:** Linked-list roadmap showing completed stages, current stage, and upcoming stages with progress indicators
- **Basic Recalibration:** If user fails a weekly stage, AI offers simplified alternative for following week
- **Goal Setup Wizard:** Guided onboarding that helps users articulate their goal and expected timeline

### Out of Scope for MVP

- Social features or community aspects
- Multiple simultaneous goals/roadmaps
- Advanced analytics or detailed progress reporting
- Integration with external apps or wearables
- Customizable UI themes or advanced personalization
- Habit streak counters or gamification elements beyond weekly progression
- Push notifications (start with basic reminders only)

### MVP Success Criteria

**MVP succeeds if:** Users can successfully complete the entire flow from goal input to completing their first weekly stage, with 30% of users advancing to week 2+ and 70% rating the AI-generated roadmap as "helpful" or "very helpful" for their specific goal.

## Post-MVP Vision

### Phase 2 Features

**Enhanced AI Capabilities:**
- **Contextual Adaptation:** AI reads calendar/weather/location to suggest micro-adjustments to daily habits
- **Multi-Goal Coordination:** Support 2-3 simultaneous goals with AI detecting synergies and conflicts
- **Predictive Struggle Detection:** AI identifies patterns before users hit roadblocks and proactively offers support

**Social & Community Features:**
- **Accountability Pods:** Small groups (3-5 people) working on different goals but supporting each other's consistency
- **Success Story Sharing:** Users can share completed roadmaps as inspiration for others with similar goals
- **Mentor Matching:** Connect advanced users with beginners for goal-specific guidance

**Advanced Tracking & Analytics:**
- **Habit Economics Dashboard:** Show ROI of different habits on overall well-being and productivity
- **Cross-Goal Analytics:** Identify which habits contribute to multiple life areas
- **Long-term Trend Analysis:** Multi-month and yearly progression tracking

### Long-term Vision

Transform from a single-goal habit tracker into a comprehensive **Life Progression Platform** where users can orchestrate multiple areas of growth simultaneously. The AI becomes increasingly sophisticated at understanding individual user patterns, life circumstances, and optimal challenge levels, essentially becoming a personal development coach that scales infinitely.

### Expansion Opportunities

**Vertical Market Specialization:**
- **Corporate Wellness:** Team-based goal achievement with manager dashboards
- **Educational Institutions:** Student skill development with progress integration
- **Healthcare Integration:** Habit formation for chronic condition management

**Platform Ecosystem:**
- **Third-party Integrations:** Calendar apps, fitness trackers, learning platforms
- **API for Coaches:** Professional coaches can create custom roadmaps for clients
- **White-label Solutions:** Organizations can brand the platform for their specific use cases

## Technical Considerations

### Platform Requirements
- **Target Platforms:** Mobile-first (iOS/Android) with Expo managed workflow
- **Browser/OS Support:** iOS 14+, Android 8+ for optimal performance
- **Performance Requirements:** <3 second AI roadmap generation, offline capability for daily tracking, <1 second habit logging response time

### Technology Preferences
- **Frontend:** Expo (React Native) for mobile app with managed workflow
- **Backend:** Supabase for database, authentication, real-time subscriptions, and Edge Functions
- **Database:** PostgreSQL (via Supabase) for user data/habits with JSON columns for AI-generated roadmaps
- **Hosting/Infrastructure:** Expo Application Services for app deployment, Supabase hosting, OpenAI API for roadmap generation

### Architecture Considerations
- **Repository Structure:** Single Expo project with organized folder structure (screens, components, services, utils)
- **Service Architecture:** Supabase Edge Functions for AI roadmap generation and complex business logic, client-side state management with React Query
- **Integration Requirements:** OpenAI GPT-4 via Supabase Edge Functions, Expo Push Notifications, Supabase Analytics
- **Security/Compliance:** Supabase Auth with Row Level Security policies, built-in GDPR compliance, automatic data encryption

## Constraints & Assumptions

### Constraints
- **Timeline:** Target 3-4 month MVP development timeline for focused development cycles
- **Resources:** Single developer initially, with budget for design contractor and premium services as needed
- **Technical:** Expo managed workflow capabilities, OpenAI API rate limits (manageable with pro usage)

### Key Assumptions
- Users are willing to invest 2-3 minutes daily for habit tracking if the guidance is valuable
- AI-generated roadmaps will be "good enough" for MVP validation without extensive human curation
- Weekly progression model provides sufficient engagement without daily gamification
- Binary tracking (Yes/No/Skip) captures enough nuance for meaningful progress assessment
- Mobile-first approach is appropriate - users primarily track habits on their phones
- Freemium model viable with 5-10% conversion rate to paid features
- Premium service investments (Supabase Pro, OpenAI usage, design resources) will accelerate development and improve quality

## Risks & Open Questions

### Key Risks
- **AI Roadmap Quality:** Generated roadmaps may be too generic or inappropriate for specific user contexts, leading to poor user experience and early abandonment
- **User Onboarding Complexity:** Goal articulation wizard may be too complex or too simplistic, creating barrier to entry or inadequate roadmap inputs
- **Weekly Progression Pacing:** Fixed weekly cadence may not match natural habit formation patterns for different goal types (some need daily reinforcement, others monthly milestones)
- **Retention After Success:** Users who complete their roadmap may churn rather than starting new goals, limiting lifetime value
- **Competition Response:** Established habit apps (Habitica, Streaks) could quickly add AI roadmap features and outcompete with larger user bases

### Open Questions
- Should roadmap generation be completely automated or include human review/curation step?
- What's the optimal success threshold for weekly progression (5/7 days vs adaptive based on goal type)?
- How do we handle users with multiple related goals without overwhelming them?
- Should we include any social features in MVP or wait for post-MVP?
- What's the right pricing model - subscription, one-time purchase, or freemium with premium AI features?

### Areas Needing Further Research
- Competitive analysis of AI-powered coaching apps (Noom, Fabulous, Coach.me)
- User interviews with target demographic about current goal-setting and habit-formation struggles
- Technical feasibility testing of OpenAI prompt engineering for consistent roadmap quality
- Market research on willingness to pay for AI-generated vs human-created guidance
