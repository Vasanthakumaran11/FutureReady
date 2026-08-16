# Career Compass

ROLE

Act as a Senior Product Designer, UX Architect and Frontend Engineer with 10+ years of experience building production-grade SaaS, AI platforms and career-tech applications.

You are responsible for designing and implementing the complete frontend of a production-quality web application called:

FUTUREREADY

AI-Powered Career Readiness Platform

The attached FutureReady Blueprint is the authoritative product specification. Carefully follow its terminology, modules, workflows and feature boundaries.

IMPORTANT:

Do not invent unrelated features.

Do not simplify or remove any major module from the blueprint.

Do not create fake backend functionality as if it were implemented.

The frontend must be designed so that a FastAPI + MongoDB backend can be connected later through REST APIs.

==================================================

1. PRODUCT PURPOSE

==================================================

FutureReady is a unified career-readiness platform that combines:

1. Resume Building & Refinement

2. Interview Preparation

3. Skill Development

4. AI-Powered Job Search & Matching

5. Personalized Career Dashboard

6. Skill Gap Analysis

The core experience should feel like one connected career journey rather than six independent pages.

The user should be able to move through:

LOGIN

→ PROFILE

→ RESUME

→ TARGET ROLES

→ INTERVIEW PREPARATION

→ SKILL DEVELOPMENT

→ JOB SEARCH

→ APPLICATION TRACKING

→ PERSONALIZED DASHBOARD

The system must continuously connect information between these modules.

==================================================

2. TECHNOLOGY REQUIREMENTS

==================================================

Frontend stack:

- React

- Vite

- Tailwind CSS

- React Router

- Recharts or Chart.js for dashboard visualizations

- TypeScript preferred

- Component-based architecture

The frontend must be prepared for integration with:

Backend:

- FastAPI / Python

Database:

- MongoDB

AI:

- Gemini API through the backend

Semantic matching:

- MongoDB Atlas Vector Search

Job data:

- Job APIs such as JSearch / SerpApi through the backend

IMPORTANT:

Never expose Gemini API keys or Job API keys in frontend code.

All external API communication must eventually go through the FastAPI backend.

==================================================

3. DESIGN DIRECTION

==================================================

Create a professional, modern, production-grade career-tech SaaS interface.

Visual personality:

- Professional

- Intelligent

- Clean

- Trustworthy

- Modern

- Minimal but not empty

- Data-driven

- Career-focused

Avoid:

- Excessive gradients

- Excessive animations

- Cartoon-like UI

- Unnecessary glassmorphism

- Overly colorful dashboards

- Huge decorative elements

- Excessive whitespace

- Unnecessary cards everywhere

- Generic AI landing-page aesthetics

Use a consistent design system:

- Primary brand color

- Neutral backgrounds

- Clear typography hierarchy

- Consistent border radius

- Consistent spacing

- Accessible contrast

- Consistent buttons

- Consistent input fields

- Consistent cards

- Consistent status badges

The interface should look like a real production SaaS application rather than an AI-generated prototype.

==================================================

4. GLOBAL APPLICATION STRUCTURE

==================================================

Create a persistent authenticated application shell containing:

LEFT SIDEBAR:

- Dashboard

- Resume

- Interview Preparation

- Job Search

- Skill Development

- Applications

- Profile

- Settings

TOP BAR:

- Page title

- Search where appropriate

- Notifications

- User avatar

- User name

- Profile menu

SIDEBAR BEHAVIOR:

- Expand/collapse

- Active route highlighting

- Icons + labels

- Responsive mobile navigation

The user must always understand:

WHERE THEY ARE

WHAT THEY CAN DO

WHAT THEIR NEXT ACTION SHOULD BE

==================================================

5. AUTHENTICATION

==================================================

Create professional authentication screens.

LOGIN:

- Email

- Password

- Remember me

- Forgot password

- Login button

- Create account

REGISTER:

- Name

- Email

- Password

- Confirm password

Include:

- Proper validation

- Loading states

- Error states

- Success states

- Disabled button states

- Password visibility toggle

Do not implement fake authentication logic.

Create frontend service abstractions so authentication can later connect to FastAPI.

==================================================

6. ONBOARDING / PROFILE

==================================================

After registration, guide the user through profile creation.

Collect:

PERSONAL:

- Name

- Email

- Location

EDUCATION:

- Degree

- Institution

- Graduation year

- Relevant coursework if applicable

CAREER:

- Experience

- Target career field

- Skills

- Projects

- Certifications

TARGET ROLES:

Allow:

- 1 Major Job Role

- 2 Optional Job Roles

Example:

Major:

Backend Developer

Optional:

Python Developer

Full Stack Developer

Allow users to modify these later.

Create a clear onboarding progress indicator.

==================================================

7. RESUME MODULE

==================================================

The Resume module MUST support TWO DISTINCT PATHS.

PATH A — EXISTING RESUME

Page flow:

Upload Resume

→ Resume Analysis

→ Identify Mistakes & Gaps

→ AI Refinement

→ User Review

→ Final Resume

UI requirements:

UPLOAD:

- Drag-and-drop area

- PDF/DOCX support indicator

- Upload button

- File name

- File size

- Upload progress

- Replace/remove file

ANALYSIS:

Show sections such as:

- Resume completeness

- Structure

- Skills

- Projects

- Experience

- Education

- Target-role relevance

Show identified issues with severity:

- Critical

- Needs improvement

- Good

REFINEMENT:

Show:

CURRENT CONTENT

vs

AI SUGGESTION

Allow:

- Accept

- Reject

- Edit manually

IMPORTANT:

AI suggestions must never imply that the system invented experience, qualifications or achievements.

FINAL:

- Resume preview

- Edit

- Save

- Export/download

PATH B — NO EXISTING RESUME

Flow:

Start Resume Builder

→ Personal Details

→ Education

→ Skills

→ Projects

→ Experience

→ Certifications

→ Target Role

→ AI-assisted content refinement

→ Review

→ Generate Resume

Use a multi-step form with:

- Progress indicator

- Save draft

- Previous/Next

- Validation

- Preview

Provide professional resume templates.

Do not create dozens of unnecessary templates for V1.

==================================================

8. INTERVIEW PREPARATION MODULE

==================================================

This is a major module.

The user must first see:

TARGET ROLE CONFIGURATION

Major Role

+

Optional Role 1

+

Optional Role 2

Allow company-specific preparation.

Example:

Role:

Backend Developer

Company:

Google

Or:

Role:

Backend Developer

Company:

General preparation

The preparation system should use:

- Resume

- Skills

- Projects

- Experience

- Target role

- Company

- Existing skill gaps

INTERVIEW PREPARATION CATEGORIES:

1. DSA

2. Coding

3. Technical

4. Project

5. HR

Create a visually clear preparation workspace.

PREPARATION DASHBOARD:

Display:

- Overall interview readiness

- Role

- Company

- Completed tasks

- Pending tasks

- Weak areas

- Strong areas

- Daily goal

Use progress indicators and charts.

DSA SECTION:

Show:

- Topic

- Difficulty

- Problems completed

- Accuracy

- Progress

Example topics:

- Arrays

- Strings

- Linked Lists

- Trees

- Graphs

- Dynamic Programming

Do not hardcode these as the final backend data model; treat them as UI examples.

CODING SECTION:

Show:

- Coding tasks

- Difficulty

- Completion status

- Practice history

- Performance

TECHNICAL SECTION:

Show:

- Questions

- Topic

- Difficulty

- Attempt status

- Feedback

PROJECT SECTION:

Show:

- User projects

- Project questions

- Architecture questions

- Technical discussion

- Feedback

HR SECTION:

Show:

- Behavioral questions

- Communication practice

- Answer history

- Feedback

AI QUESTION GENERATION:

The frontend must provide UI for:

Generate Questions

Generate Daily Tasks

Generate Practice Set

Retry

Submit Answer

Get Feedback

The actual Gemini request will happen through FastAPI.

ADAPTIVE PREPARATION:

Show:

Skill Gap

→ Recommended Task

→ User Practice

→ Result

→ Updated Skill

→ Next Task

The interface should visually communicate this loop.

==================================================

9. DAILY SKILL DEVELOPMENT

==================================================

Create a dedicated Skill Development area.

Display:

TODAY'S TASKS

- Task

- Category

- Difficulty

- Estimated time

- Completion status

Example:

DSA:

Solve 2 array problems

Technical:

Study REST API concepts

Project:

Review project architecture

HR:

Practice one behavioral question

Each task should support:

- Start

- Complete

- Skip

- View details

The backend will determine personalized tasks.

Frontend should simply present them clearly.

==================================================

10. JOB SEARCH MODULE

==================================================

Create a professional job-search interface.

TOP SEARCH AREA:

- Job title / role

- Location

- Experience

- Remote / onsite / hybrid

- Search button

FILTERS:

- Role

- Location

- Experience

- Job type

- Remote

- Salary where available

JOB CARDS MUST SHOW:

- Job title

- Company

- Location

- Experience

- Salary if available

- Required skills

- Job source

- Match percentage

- Why this job matches

Example:

BACKEND DEVELOPER

82% MATCH

✓ Python

✓ FastAPI

✓ MongoDB

⚠ Docker

⚠ AWS

The match explanation must be visible rather than showing only a percentage.

==================================================

11. PROFILE MATCHING UI

==================================================

The backend will perform:

Job API

→ Normalize Job Data

→ User Profile Vector

→ Job Vector

→ MongoDB Atlas Vector Search

→ Skill Matching

→ Role/Location/Experience Filtering

→ Match Score

Frontend should visualize this result.

Create a:

JOB MATCH DETAILS PAGE

Sections:

MATCH SCORE

Skill Match

Experience Match

Role Match

Location Match

Semantic Relevance

SKILL COMPARISON:

User Skills

vs

Required Skills

Use:

✓ Matched

⚠ Partial

✕ Missing

Then show:

WHY THIS JOB IS RECOMMENDED

and

SKILLS TO IMPROVE

Never make the matching system look like an unexplained black box.

==================================================

12. APPLICATION TRACKING

==================================================

Create an Applications page.

Application states:

- Saved

- Applied

- Interview

- Offer

- Rejected

Use either:

Kanban board

or

clean status-based table

Each application should show:

- Job

- Company

- Applied date

- Status

- Match score

- Notes

Allow:

- Change status

- Add notes

- View job

- Remove/save

==================================================

13. PERSONALIZED DASHBOARD

==================================================

The Dashboard is the central monitoring layer of FutureReady.

It MUST answer:

WHERE AM I?

WHAT AM I MISSING?

WHAT SHOULD I LEARN?

WHAT SHOULD I PRACTICE?

WHAT CAN I TARGET?

TOP SUMMARY:

- Career readiness score

- Resume score/status

- Interview readiness

- Skill gap count

- Job matches

- Active applications

SKILL GAP ANALYZER:

Display:

TARGET ROLE REQUIREMENTS

↓

USER EVIDENCE

↓

SKILL STATUS

↓

GAP PRIORITY

↓

LEARNING TASK

Statuses:

- Strong

- Moderate

- Missing

Use clear visual indicators.

VISUALIZATIONS:

Use Recharts or Chart.js.

Include useful charts such as:

1. Career readiness progress

2. Skill gap chart

3. Interview preparation progress

4. Job match statistics

5. Application status distribution

6. Learning/task completion trend

Do NOT add charts merely for decoration.

Every visualization must communicate useful information.

CONTINUOUS IMPROVEMENT:

Visually represent:

Task completed

→ New evidence

→ Skill status updated

→ Readiness recalculated

→ Dashboard refreshed

→ Next action recommended

NEXT ACTION:

The dashboard should prominently show:

"Recommended Next Action"

Example:

Improve Docker fundamentals

Complete 2 DSA problems

Refine Backend project description

Apply to 3 high-match jobs

==================================================

14. PROFILE PAGE

==================================================

Create a complete candidate profile page.

Sections:

- Personal information

- Education

- Experience

- Skills

- Projects

- Certifications

- Target roles

- Resume

- Career preferences

Allow editing.

The profile is the central data source for Resume, Interview Preparation, Skill Gap Analysis and Job Matching.

==================================================

15. SETTINGS

==================================================

Include:

- Account

- Profile preferences

- Notification preferences

- Career preferences

- Privacy

- Logout

Keep settings simple for V1.

==================================================

16. LOADING / ERROR / EMPTY STATES

==================================================

This is extremely important.

Every data-dependent page MUST have:

LOADING:

- Skeleton loaders

- Button loading states

- Progress indicators

ERROR:

- Clear error message

- Retry button

- No broken layout

EMPTY:

- Explain what is missing

- Provide clear CTA

Examples:

"No resume uploaded yet"

→ Upload Resume

"No interview tasks available"

→ Generate Preparation Plan

"No matching jobs found"

→ Adjust Filters

"No applications yet"

→ Explore Jobs

==================================================

17. API-READY FRONTEND ARCHITECTURE

==================================================

Do not hardcode business logic into UI components.

Create a clean structure similar to:

src/

├── components/

├── pages/

├── layouts/

├── routes/

├── services/

│   ├── auth/

│   ├── resume/

│   ├── interview/

│   ├── jobs/

│   ├── dashboard/

│   └── profile/

├── hooks/

├── types/

├── utils/

├── charts/

└── assets/

Create API service abstractions.

For example:

authService

resumeService

interviewService

jobService

dashboardService

profileService

Use environment variables for:

VITE_API_BASE_URL

Never place secrets in frontend code.

==================================================

18. ROUTING

==================================================

Create proper routes such as:

/login

/register

/onboarding

/dashboard

/profile

/resume

/resume/create

/resume/analyze

/interview

/interview/setup

/interview/dsa

/interview/coding

/interview/technical

/interview/project

/interview/hr

/skills

/jobs

/jobs/:id

/applications

/settings

Protect authenticated routes.

==================================================

19. RESPONSIVE DESIGN

==================================================

The website MUST work properly on:

- Desktop

- Laptop

- Tablet

- Mobile

Desktop:

Sidebar + content

Tablet:

Compact navigation

Mobile:

Bottom navigation or collapsible menu

Never allow:

- Horizontal overflow

- Broken cards

- Text clipping

- Overlapping components

- Charts overflowing containers

- Buttons leaving the viewport

==================================================

20. PERFORMANCE

==================================================

The frontend must be optimized.

Requirements:

- Lazy-load heavy pages

- Avoid unnecessary re-renders

- Avoid huge component files

- Reuse components

- Optimize charts

- Optimize images

- Debounce search

- Paginate large job lists

- Avoid unnecessary API calls

- Show cached/previous data while refreshing where appropriate

The interface must feel responsive even when AI/API requests take time.

==================================================

21. ACCESSIBILITY

==================================================

Implement:

- Semantic HTML

- Keyboard navigation

- Visible focus states

- Proper labels

- Accessible buttons

- Accessible form errors

- Sufficient color contrast

- Screen-reader-friendly structure

==================================================

22. UX RULES

==================================================

Every page should have:

1. Clear page title

2. Short explanation

3. Primary action

4. Secondary action where necessary

5. Relevant data

6. Clear feedback

7. Loading state

8. Error state

9. Empty state

Never force the user to guess what to do next.

==================================================

23. AI UX RULES

==================================================

AI-generated content must be visually distinguishable.

Use labels such as:

"AI Suggestion"

"AI Generated"

"Recommended by FutureReady"

Allow the user to:

- Accept

- Reject

- Edit

- Regenerate

Do not present AI output as unquestionable truth.

==================================================

24. SECURITY FRONTEND RULES

==================================================

Never expose:

- Gemini API keys

- Job API keys

- Database credentials

- Backend secrets

Use secure authentication integration with FastAPI.

Do not store sensitive secrets in localStorage.

Handle unauthorized API responses gracefully.

Implement route protection.

==================================================

25. DESIGN CONSISTENCY

==================================================

Create reusable components:

Button

Input

Select

Modal

Card

Badge

ProgressBar

ProgressRing

Tabs

Dropdown

Toast

Modal

Skeleton

EmptyState

ErrorState

JobCard

SkillBadge

QuestionCard

ResumeSection

ChartCard

StatusBadge

Do not duplicate styles unnecessarily.

==================================================

26. DATA VISUALIZATION

==================================================

Use Recharts or Chart.js.

Charts must be:

- Responsive

- Lightweight

- Accessible

- Properly labeled

- Consistent with the design system

Do not use charts when a simple number, badge or progress bar communicates the information better.

==================================================

27. FRONTEND-BACKEND CONTRACT READINESS

==================================================

Even if backend APIs are not yet connected, create clean mock service interfaces that can later be replaced with real FastAPI calls.

Do NOT scatter mock data throughout components.

Keep temporary mock data inside:

src/services/mock/

and make the replacement path obvious.

Example:

getDashboardData()

getResume()

analyzeResume()

getInterviewPlan()

getInterviewQuestions()

submitInterviewAnswer()

getDailyTasks()

searchJobs()

getJobMatch()

getApplications()

getSkillGap()

==================================================

28. FINAL QUALITY REQUIREMENTS

==================================================

Before considering the frontend complete, verify:

- No broken routes

- No console errors

- No missing imports

- No TypeScript errors

- No rendering errors

- No overlapping elements

- No horizontal scrolling

- No overflow

- No broken responsive layouts

- No inconsistent spacing

- No inconsistent typography

- No dead buttons

- No unexplained empty screens

- No fake success messages

- No exposed API keys

- No unnecessary animations

- No duplicated components

- No inaccessible forms

Every major button must either perform a real frontend action or clearly indicate that backend integration is pending.

==================================================

29. DEVELOPMENT PRIORITY

==================================================

Build in this order:

PHASE 1

Application shell

Authentication

Routing

Profile

Design system

PHASE 2

Resume module

Existing Resume flow

No Resume flow

PHASE 3

Interview Preparation

Role selection

Company selection

Preparation categories

Daily tasks

Progress

PHASE 4

Job Search

Filters

Job cards

Matching

Job details

Applications

PHASE 5

Skill Gap

Dashboard

Charts

Continuous improvement

PHASE 6

Responsive optimization

Accessibility

Error handling

Loading states

Performance optimization

==================================================

30. FINAL EXPECTATION

==================================================

The final result should look like a professional production SaaS product.

It should NOT look like:

- A generic AI landing page

- A template with random cards

- A simple CRUD dashboard

- A static prototype

- A collection of disconnected pages

It should feel like one complete product.

The user's career journey must remain visible throughout the application:

PROFILE

↓

RESUME

↓

TARGET ROLE

↓

INTERVIEW PREPARATION

↓

SKILL DEVELOPMENT

↓

JOB MATCHING

↓

APPLICATIONS

↓

CAREER READINESS DASHBOARD

↓

NEXT ACTION

Build the frontend with clean architecture, reusable components, responsive layouts and API-ready services so that a FastAPI + MongoDB backend can be integrated without restructuring the entire application.

IMPORTANT:

First understand the complete product architecture and information flow.

Then create the design system and application shell.

Then implement the modules in the specified order.

Do not rush into generating individual pages before establishing consistent navigation, components and data structures.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d1455afa-8399-4df9-b7a1-a62aafaf4e07).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
