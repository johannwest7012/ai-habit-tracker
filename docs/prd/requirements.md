# Requirements

## Functional

**FR1:** The system shall allow users to input long-term goals via natural language chat interface  
**FR2:** The AI shall generate personalized weekly roadmaps with progressive daily Yes/No tasks based on user goals  
**FR3:** The system shall provide a daily tracking UI with Yes/No/Skip buttons for habit completion  
**FR4:** The system shall display celebratory feedback (confetti, sound) upon successful task completion  
**FR5:** The system shall generate weekly progress summaries showing completion rates against success criteria  
**FR6:** The system shall automatically promote users to next stage when success criteria are met (e.g., 3 Yes out of 5 target days)  
**FR7:** The system shall display a roadmap view showing all past, current, and future weeks in linked-list format  
**FR8:** The system shall implement progression logic preventing demotion in MVP (users retry same week on failure)  
**FR9:** The system shall offer "Replan Journey" functionality when users fail consistently  
**FR10:** The AI shall regenerate gentler, revised habit plans based on user failure patterns and feedback  
**FR11:** The system shall store user journeys, stages, and task responses with proper data persistence  
**FR12:** The system shall provide user authentication and profile management capabilities

## Non Functional

**NFR1:** The mobile app shall be built with Expo (React Native) for cross-platform deployment  
**NFR2:** The backend shall use Supabase (Auth, PostgreSQL, Edge Functions) for scalability and rapid development  
**NFR3:** AI integration shall utilize OpenAI API with proper prompt tuning based on user context  
**NFR4:** The system shall support real-time data synchronization between client and server  
**NFR5:** Daily habit interactions must feel emotionally engaging with sub-200ms response times  
**NFR6:** The system shall implement Row Level Security policies for user data isolation  
**NFR7:** The app shall be optimized for mobile-first usage with responsive design principles  
**NFR8:** The system shall handle AI service failures gracefully with appropriate fallback responses  
**NFR9:** Data persistence shall use PostgreSQL with proper indexing for user-specific queries  
**NFR10:** The system shall maintain audit trails for user actions and system state changes
