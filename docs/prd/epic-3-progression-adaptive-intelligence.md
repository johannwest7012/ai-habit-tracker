# Epic 3: Progression & Adaptive Intelligence

**Epic Goal:** Implement the intelligent systems that make the app truly adaptive to user behavior, including automated progression logic, failure pattern detection, and AI-powered journey replanning. This epic delivers the advanced features that differentiate the app from static habit trackers by learning from user patterns and adjusting accordingly to maximize long-term success.

## Story 3.1: Automated Stage Progression Logic
As a user meeting success criteria,  
I want the app to automatically advance me to the next stage,  
so that my journey progresses without manual intervention and I can focus on habit execution.

### Acceptance Criteria
1. Progression evaluation runs automatically on Sunday nights or when user manually triggers
2. Success criteria logic (e.g., 3 Yes out of 5 target days) is properly implemented
3. Two consecutive successful weeks requirement is enforced before stage advancement
4. Stage status updates from 'active' to 'completed' and advances current_stage_id
5. New stage automatically becomes 'active' with tasks generated for the current week
6. Progression notifications inform users of advancement with celebratory messaging
7. Edge Function handles progression logic with proper JWT validation
8. Database triggers maintain data consistency during stage transitions
9. Real-time updates immediately reflect progression changes in mobile app
10. Error handling manages edge cases (incomplete data, concurrent updates)
11. Progression history is maintained for analytics and user reflection
12. No demotion logic is implemented in MVP (users retry failed stages)

## Story 3.2: Failure Detection and Pattern Analysis
As a user struggling with current habits,  
I want the app to recognize my failure patterns and offer appropriate support,  
so that I don't abandon my journey but instead receive adapted guidance.

### Acceptance Criteria
1. Failure detection algorithm identifies users failing same stage multiple times
2. Pattern analysis considers frequency, consistency, and failure types (No vs Skip)
3. Failure thresholds trigger "Replan Journey" suggestions (e.g., 3 failed attempts)
4. User context is analyzed to identify potential difficulty or timing issues
5. Failure patterns are stored for AI replanning context and learning
6. Gentle intervention messaging avoids negative reinforcement or shame
7. Users maintain control over whether to accept replanning suggestions
8. Failure detection runs in background without impacting daily experience
9. Analytics capture failure patterns for product improvement insights
10. Edge Function processes failure analysis with appropriate error handling
11. Failure data contributes to overall journey adaptation recommendations
12. System preserves user progress history even when replanning occurs

## Story 3.3: AI-Powered Journey Replanning
As a user offered journey replanning,  
I want to receive a gentler, more appropriate habit plan based on my failure patterns,  
so that I can continue progressing toward my goal with a more suitable approach.

### Acceptance Criteria
1. Replan interface provides clear explanation of why replanning is suggested
2. AI analyzes user's failure history, patterns, and original goal context
3. New journey plan is generated with gentler progression and adjusted difficulty
4. Replanned stages maintain connection to original goal but with modified approach
5. User can preview new plan before accepting replanning changes
6. Original journey data is preserved for reference and learning
7. Replanning process updates database relationships cleanly
8. AI reasoning for replanning decisions is captured for transparency
9. Replanned journeys reset progression logic while maintaining user history
10. Error handling manages AI API failures during replanning gracefully
11. Replanning preserves completed stages but adjusts future progression
12. User can decline replanning and continue with original journey if preferred

## Story 3.4: Real-Time Progress Synchronization
As a user accessing the app across sessions,  
I want my progress and journey updates to be immediately synchronized,  
so that I always see accurate information regardless of when or how I access the app.

### Acceptance Criteria
1. Supabase real-time subscriptions update app state when data changes
2. Journey progression, stage updates, and task responses sync instantly
3. Multiple app instances (different devices) reflect changes without refresh
4. Real-time updates handle network connectivity issues gracefully
5. Optimistic updates provide immediate UI feedback before server confirmation
6. Conflict resolution manages concurrent updates from multiple sources
7. Real-time subscriptions are properly managed to avoid memory leaks
8. Zustand state management integrates seamlessly with real-time updates
9. Performance remains smooth with real-time features active
10. Real-time features can be disabled for battery optimization if needed
11. Connection status is indicated to users during network issues
12. Offline changes are queued and synchronized when connectivity returns
