# AI Habit Tracker - Visual Mockup Generation Prompt

## High-Level Goal
Create high-fidelity visual mockups for AI Habit Tracker's core screens that showcase the complete branding, style guide, and design system. Focus on pixel-perfect visual representation of the warm, coaching-focused aesthetic with growth metaphors - no functionality required, just beautiful concept designs.

## Detailed Step-by-Step Instructions

### 1. Design System Foundation Setup
1. Create a comprehensive design system file with exact specifications:
   - **Color Palette**: Primary #4A90A4, Secondary #7FB069, Accent #F4A259, Success #81B29A, Warning #E9C46A, Error #F76C6C
   - **Neutrals**: #F8F9FA (bg), #CED4DA (borders), #6C757D (text), #212529 (headers)
   - **Typography**: Inter (primary), Poppins (headings), with exact scale: H1(28px/600), H2(24px/600), H3(20px/500), Body(16px/400)
   - **Spacing**: 8px base grid system (8px, 16px, 24px, 32px, 48px)
   - **Touch Targets**: 44px minimum, 64px for habit logging buttons

### 2. Core Component Design
1. **Habit Logging Buttons** - Create three button variants:
   - **Yes Button**: Soft green (#7FB069), rounded corners, subtle growing animation state
   - **No Button**: Warm amber (#E9C46A), equal visual weight, supportive styling
   - **Skip Button**: Soft blue (#4A90A4), secondary styling but not diminished
   - All buttons: 64px height, generous spacing, organic rounded corners
2. **Progress Visualization Cards**: 
   - Weekly calendar view with organic dot indicators
   - Growth metaphor styling (seedling to plant progression)
   - Warm, encouraging color states
3. **Coaching Message Component**:
   - Chat-bubble styling with warm background gradients
   - Poppins typography for personality
   - Subtle shadow and organic borders

### 3. Screen Mockup Creation
1. **Daily Habit Dashboard** (375x812px mobile):
   - Large friendly greeting: "Good morning, [Name]!" in Poppins 24px
   - Date display in warm, conversational style
   - Today's habit description in coaching language: "Take a 10-minute mindful walk to build your movement foundation"
   - Three prominent habit buttons centered with generous spacing
   - Weekly progress dots below buttons with organic styling
   - Stage context: "Week 2: Building Foundation" in subtle secondary text
   - Bottom tab navigation with organic icon styling

2. **Goal Articulation Wizard** (375x812px mobile):
   - Progress indicator (2 of 4) at top with organic progression line
   - Large conversational question: "What do you want to achieve?" in Poppins
   - Supportive subtext explaining why this matters
   - Chat-bubble input field with encouraging placeholder
   - Rounded, organic "Next" button in primary color
   - Warm background with subtle growth imagery

3. **AI Roadmap Preview** (375x812px mobile):
   - Scrollable timeline with path metaphor design
   - Stage cards showing week progression like stepping stones
   - Each card displays: week number, theme, daily habit, brief rationale
   - Growth phases visually distinct (foundation/building/mastery colors)
   - Organic connecting lines between stages
   - "Why this works" educational content with warm styling

4. **Weekly Progress View** (375x812px mobile):
   - Calendar view with 7 organic day indicators
   - Encouraging headline: "You're building something beautiful" in Poppins
   - Success criteria in supportive language: "Complete 5 days to grow to the next stage"
   - Progress visualization using plant growth metaphor
   - Next stage preview card with excitement-building design

### 4. Visual Identity Implementation
1. **Growth Metaphors Throughout**:
   - Use seedling-to-plant progression imagery
   - Path/journey visual metaphors for roadmaps
   - Seasonal color transitions for different stages
   - Organic shapes and rounded corners everywhere
2. **Warm Coaching Personality**:
   - Poppins headings for warmth and personality  
   - Inter body text for clarity and friendliness
   - Generous white space for breathing room
   - Soft shadows and subtle gradients
3. **Shame-Free Visual Language**:
   - No red/green success/failure indicators
   - Equal visual weight for all habit logging options
   - Encouraging progress visualizations (never harsh percentages)
   - Supportive color palette avoiding alarm colors

## Code Examples, Data Structures & Constraints

### Color Application Examples
```css
/* Primary Actions */
.primary-button {
  background: #4A90A4;
  color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(74, 144, 164, 0.2);
}

/* Success States */
.habit-complete {
  background: linear-gradient(135deg, #81B29A 0%, #7FB069 100%);
  border: 2px solid #7FB069;
}

/* Coaching Messages */
.coaching-bubble {
  background: linear-gradient(135deg, #F4A259 0%, #E9C46A 100%);
  border-radius: 16px 16px 16px 4px;
  padding: 16px 20px;
  box-shadow: 0 2px 12px rgba(244, 162, 89, 0.15);
}
```

### Typography Implementation
```css
/* Headings */
.heading-1 {
  font-family: 'Poppins', sans-serif;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.25;
  color: #212529;
}

/* Body Text */
.body-text {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  color: #6C757D;
}

/* Coaching Text */
.coaching-text {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.6;
  color: #212529;
}
```

### Growth Metaphor Visual Elements
- **Progress Dots**: Circular indicators that grow from seeds to flowers
- **Stage Connections**: Organic flowing lines connecting roadmap stages
- **Background Elements**: Subtle botanical illustrations in neutral tones
- **Button States**: Gentle scaling animations suggesting organic growth
- **Card Shadows**: Soft, natural shadows mimicking outdoor lighting

### Critical Design Constraints
- **Mobile-First**: All designs optimized for 375px width (iPhone standard)
- **Touch Accessibility**: 44px minimum touch targets, 64px for primary actions
- **WCAG AA Compliance**: 4.5:1 contrast ratio minimum for all text
- **Organic Aesthetic**: No harsh geometric shapes or corporate styling
- **Coaching Warmth**: Every element should feel supportive and encouraging
- **Performance Consideration**: Designs should be implementable without heavy graphics

## Define Strict Scope

**Screens to Design:**
1. **Daily Habit Dashboard** - Primary home screen with habit logging
2. **Goal Articulation Wizard** - Step 2 of 4 onboarding screen  
3. **AI Roadmap Preview** - Full journey visualization
4. **Weekly Progress View** - Current week status and encouragement
5. **Component Library Sheet** - All core components in various states

**Visual Requirements:**
- High-fidelity mockups at 375x812px resolution
- Complete implementation of color palette and typography
- Growth metaphor visual language throughout
- Coaching personality reflected in all copy and styling
- Accessibility-compliant contrast ratios
- Organic, rounded design aesthetic with natural shadows

**Copy Requirements:**
- All text should reflect warm, supportive coaching personality
- Use encouraging, shame-free language throughout
- Habit descriptions should be conversational and specific
- Progress messaging should emphasize journey over perfection
- Educational content should feel like guidance from a patient coach

**Do NOT Include:**
- Any functional buttons or interactive elements
- Complex data visualizations or analytics
- Social features or competitive elements
- Harsh success/failure visual indicators
- Corporate or productivity-focused styling
- Red/green color coding for completion status

**Focus Areas:**
- Perfect implementation of the established color palette
- Exact typography scale and font combinations  
- Organic growth metaphors in visual elements
- Warm, approachable coaching personality in all text
- Mobile-optimized spacing and touch targets
- Consistent visual language across all screens

---

## Usage Instructions

This prompt is optimized for AI design tools like:
- **v0.dev** - For React component mockups
- **Figma AI** - For high-fidelity design mockups  
- **Claude** - For detailed design specifications
- **Midjourney/DALL-E** - For visual concept generation

Simply copy the entire prompt above and paste it into your preferred AI tool to generate pixel-perfect mockups that showcase the AI Habit Tracker's unique visual identity and coaching-focused design system.

---

**Key Strengths:**
- **Visual Design Focus**: Emphasizes pixel-perfect implementation without functionality concerns
- **Brand Consistency**: Ensures warm, coaching aesthetic in every visual element
- **Growth Metaphors**: Specifically calls out organic, natural progression imagery
- **Mobile Optimization**: Tailored for 375px mobile screens with proper touch targets
- **Accessibility Built-In**: WCAG compliance requirements embedded in design specs
- **Component-First**: Creates reusable design elements for consistency

**Created**: 2025-09-01  
**Version**: 1.0  
**Author**: UX Expert Sally