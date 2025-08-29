# Requirements Document

## Introduction

The AI Habit Tracker is a mobile application designed to help users achieve long-term goals by breaking them down into manageable weekly goals and daily habits. The system uses AI to create progressive roadmaps where each stage sets clear weekly targets achieved through simple daily Yes/No tasks. Users log daily task completion, the system aggregates these into weekly success/failure metrics, and when goals are met consistently, the AI advances users to more challenging stages. The approach is intentionally binary and simple to support any type of habit while keeping tracking frictionless and universal.

## Requirements

### Requirement 1

**User Story:** As a user, I want to create a long-term goal journey through an AI-guided conversation, so that I can get a personalized roadmap for achieving my objectives.

#### Acceptance Criteria

1. WHEN a user opens the CreateJourneyScreen THEN the system SHALL display a chat interface for goal input
2. WHEN a user provides their initial goal prompt THEN the AI SHALL ask relevant follow-up questions to clarify the objective
3. WHEN the AI has sufficient information THEN the system SHALL generate a preview roadmap with progressive stages
4. WHEN the roadmap is presented THEN the user SHALL be able to accept it or provide feedback for modifications
5. IF the user provides feedback THEN the AI SHALL regenerate the roadmap incorporating the requested changes

### Requirement 2

**User Story:** As a user, I want to complete daily binary tasks with simple Yes/No tracking, so that I can maintain consistent progress without complex logging.

#### Acceptance Criteria

1. WHEN a user accesses the DailyScreen THEN the system SHALL display Yes/No buttons for each daily task
2. WHEN a user selects "Yes" for completing a task THEN the system SHALL record the completion and display celebratory feedback
3. WHEN a user selects "No" or "Skip" THEN the system SHALL record the response without penalty animations
4. WHEN a user completes a daily task THEN the system SHALL update their daily progress immediately
5. IF a user selects "Skip" THEN the system SHALL remove that day from weekly target calculations

### Requirement 3

**User Story:** As a user, I want to see my weekly progress and understand if I'm meeting my targets, so that I can stay motivated and track my advancement.

#### Acceptance Criteria

1. WHEN a user accesses the WeeklyScreen THEN the system SHALL display current week progress toward weekly target
2. WHEN the week ends THEN the system SHALL calculate if weekly target was met based on daily completions
3. WHEN weekly target is achieved THEN the system SHALL mark the week as "pass"
4. WHEN weekly target is not achieved THEN the system SHALL mark the week as "fail" without demotion
5. IF promotion criteria are met THEN the system SHALL suggest advancing to the next stage

### Requirement 4

**User Story:** As a user, I want to view my complete roadmap and current position, so that I can understand my journey progression and future goals.

#### Acceptance Criteria

1. WHEN a user accesses the RoadmapScreen THEN the system SHALL display the complete roadmap in a linked-list format
2. WHEN displaying the roadmap THEN the system SHALL highlight the current week/stage the user is working on
3. WHEN showing future stages THEN the system SHALL display weekly targets and requirements for each stage
4. WHEN showing past stages THEN the system SHALL display completion status and performance history
5. IF the user is eligible for promotion THEN the system SHALL visually indicate the next available stage

### Requirement 5

**User Story:** As a user, I want the system to automatically advance me to harder stages when I consistently meet targets, so that I can progressively improve without manual intervention.

#### Acceptance Criteria

1. WHEN a user completes K consecutive successful weeks THEN the system SHALL automatically promote them to the next stage
2. WHEN promotion occurs THEN the system SHALL update the weekly target and stage number
3. WHEN a new stage begins THEN the system SHALL reset the consecutive success counter
4. IF a user fails a week THEN the system SHALL maintain their current stage without demotion
5. WHEN stage advancement happens THEN the system SHALL notify the user of their progression

### Requirement 6

**User Story:** As a user, I want secure authentication and data persistence, so that my progress is saved and accessible only to me.

#### Acceptance Criteria

1. WHEN a user first opens the app THEN the system SHALL require Supabase authentication
2. WHEN a user logs in THEN the system SHALL retrieve their existing journeys and progress data
3. WHEN user data is stored THEN the system SHALL use Supabase PostgreSQL with proper user isolation
4. WHEN a user logs out THEN the system SHALL clear local session data while preserving cloud data
5. IF authentication fails THEN the system SHALL display appropriate error messages and retry options

### Requirement 7

**User Story:** As a user, I want the AI to generate realistic and progressive roadmaps, so that my goals are achievable and appropriately challenging.

#### Acceptance Criteria

1. WHEN generating a roadmap THEN the AI SHALL create stages with progressive weekly targets
2. WHEN setting weekly targets THEN the system SHALL ensure targets are countable by daily yes/no responses
3. WHEN creating stages THEN the AI SHALL respect guardrails for maximum weekly targets and minimum rest days
4. WHEN generating promotion rules THEN the system SHALL set appropriate consecutive success requirements
5. IF a roadmap seems unrealistic THEN the AI SHALL suggest modifications during the creation process

### Requirement 8

**User Story:** As a user, I want my timezone and scheduling preferences respected, so that weekly cycles align with my actual week structure.

#### Acceptance Criteria

1. WHEN calculating weekly periods THEN the system SHALL use the user's timezone for week boundaries
2. WHEN a week ends THEN the system SHALL close the week at Sunday 23:59 in the user's timezone
3. WHEN starting a new week THEN the system SHALL begin on Monday 00:00 in the user's timezone
4. WHEN displaying dates THEN the system SHALL show times in the user's local timezone
5. IF timezone changes THEN the system SHALL adjust future week calculations accordingly
