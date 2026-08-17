# FutureReady — AI-Powered Career Development Platform

> A unified career development platform that bridges the gap between learning, resume building, interview preparation, and job applications with data-grounded AI analytics.

---

## 📌 Project Status & Roadmap

```
├── 🟢 COMPLETED PHASES (Production-Ready)
│   ├── Authentication & Session Management
│   ├── Resume Builder & ATS Scanner
│   ├── Skill Development & Deterministic Gap Analysis
│
├── 🟡 CURRENTLY UNDER WORK (In-Progress Enhancements)
│   ├── AI Job Matching & Multi-Source Aggregator
│   ├── Interactive Application Tracker (Kanban Pipeline)
│   └── AI Mock Interview Voice Simulator
│   ├── Interview Preparation (4 Core Modules + 7 DSA Categories)
│   └── Live Career Readiness & Dynamic Analytics
│
└── 🔵 FUTURE ROADMAP (Planned Features)
    ├── Peer-to-Peer Mock Interviews & Shared Code Editor
    ├── AI Cold Email & Referral Pitch Generator
    ├── Company-Specific Salary & Interview Insights
    └── Gamified Daily Challenges & Skill Badges
```

---

### 🟢 1. Completed Phases (100% Functional)

* **Authentication & Profile State**:
  * MongoDB session tokens, Email/Password & Google OAuth.
  * Synchronous session cache hydration eliminating layout shifts and refresh delays.
* **Resume Building & ATS Analysis**:
  * PDF resume parsing (`PyMuPDF`), text extraction, and formatting validation.
  * Deterministic ATS scoring based on quantified impact, keywords, and section completeness.
  * Live resume builder with real-time template preview.
* **Skill Development & Learning Pathways**:
  * Roadmaps across 10 career tracks (Frontend, Backend, Full Stack, Cloud, DevOps, AI/ML, Data Engineering, Cyber Security, Mobile, System Design).
  * Strict ground-truth gap analysis evaluating user's resume against selected role requirements (no random data).
  * Curated video resources with real-time completion tracking and readiness score bonuses.
* **Interview Preparation Suite**:
  * **4 Core Modules**: DSA Practice, Technical Concepts, Project Deep Dive, and HR & Behavioral.
  * **DSA Benchmark Catalog**: 56 curated problems across 7 algorithmic categories (*Searching, Sorting, Linked List, Recursion, Trees, Graphs, DP*).
  * **Company Targeting**: Target employer selector (e.g. Google, Microsoft, Stripe, custom) tailored to role focus.
  * Glassmorphism problem overlay modals with interactive **[Mark as Done]** checkboxes and instant AI evaluation feedback.
* **Dynamic Analytics & Career Readiness Engine**:
  * Live weighted computation engine:
    $$\text{Career Readiness} = (\text{Skills} \times 40\%) + (\text{ATS} \times 30\%) + (\text{Interview} \times 20\%) + (\text{Applications} \times 10\%) + \text{Bonus}$$
  * Real-time trend visualizer and skill gap comparative distribution charts.

---

### 🟡 2. Phases Under Active Work

* **Job Search & Recommendation Engine**:
  * Direct job discovery integrated with live APIs (Jooble, Google Jobs, RapidAPI).
  * Deep skill alignment breakdown and personalized match score per job posting.
* **Application Tracker**:
  * Multi-stage pipeline board (Applied, Screening, Interviewing, Offer, Rejected).
  * Milestone alerts, interview dates synchronization, and notes timeline.
* **AI Mock Interview Simulator**:
  * Conversational AI mock interview simulator with speech-to-text input.
  * Dynamic follow-up questions evaluating communication clarity, technical depth, and STAR delivery.

---

### 🔵 3. Future Phases

* **Peer-to-Peer Mock Interviews**: Live collaborative coding environment with shared compiler and video calls.
* **Automated Networking Assistant**: AI-generated cold outreach emails, LinkedIn connection notes, and portfolio summaries.
* **Company Insights Hub**: Crowdsourced compensation benchmarks, interview round timelines, and hiring trends.
* **Gamification & Daily Sprints**: Daily problem-solving streaks, leaderboard rankings, and verified skill completion badges.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Lucide Icons, Sonner |
| **Backend** | FastAPI (Python 3.10+), Pydantic v2, PyMuPDF, Scikit-learn |
| **Database** | MongoDB (via Async `Motor` Driver) |
| **State & Auth** | Custom Session Auth with LocalStorage Fast Hydration |

---

## 🚀 Quick Start Guide

### 1. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
* **API Documentation**: `http://localhost:8000/api/v1/docs`

### 2. Frontend Setup (React / Vite)

```bash
cd frontend
npm install
npm run dev
```
* **Local Web App**: `http://localhost:5173`

---

## 📂 Project Architecture

```
FutureReady/
├── backend/
│   └── app/
│       ├── database/      # MongoDB connection and collection handlers
│       ├── routes/        # Modular API endpoints (auth, interview, skills, resume, jobs, dashboard)
│       ├── schemas/       # Pydantic data validation schemas
│       └── services/      # Business logic, skill roadmap seeds, and computation engine
│
└── frontend/
    └── src/
        ├── components/    # Reusable UI primitives (common, interview, layout, ui)
        ├── hooks/         # React context hooks (useAuth, useTheme, useAsyncData)
        ├── pages/         # Core application views (Dashboard, Resume, Interview, Skills, Jobs)
        └── services/      # API communication clients
```
