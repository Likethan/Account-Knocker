# Account Knocker – AI Digital Safety Assistant

Account Knocker is a premium, full-stack cybersecurity digital safety coach designed to audit connected personal profiles (Google, Spotify, Discord, GitHub), calculate real-time digital threat exposure scores, recommend mitigations, and converse with users via a dedicated chat coach.

## 🚀 Key Features

1. **Digital Safety Score Card**: Interactive safety rating indicator showing user status (Safe, Warning, Critical) on a 100-point scale.
2. **Account Integration Control**: Zero-configuration OAuth links for Google, Spotify, Discord, and GitHub (with automated local mock fallback when credentials are empty).
3. **AI Security Coach (Knock AI)**: A chatbot interface powered by Google Gemini 2.5 Flash that retains recent query history, understands your linked security status, and drafts remediation guides.
4. **Interactive Remediation Checklist**: One-click vulnerability mitigation panel to resolve identified exposure vectors.
5. **Auditing Timeline**: Score progressions charts built with Recharts, documenting history reports and digital badge rankings (Beginner Defender, Security Master, Cyber Guardian).

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Vite, TypeScript, Tailwind CSS v4, Recharts, Framer Motion, Axios, React Router, Lucide Icons |
| **Backend** | Python, FastAPI, Uvicorn, SQLAlchemy, JWT (python-jose), Password Cryptography (bcrypt, passlib) |
| **Database** | SQLite (Default, SQLite connection handles SQLite threading) |
| **AI Integration** | Google Gemini 2.5 Flash API (`google-generativeai`) |

---

## 💻 Installation & Setup

Ensure you have **Node.js (v20+)** and **Python (3.11+)** installed on your workstation.

### 1. Database & Backend Configuration

Navigate to the `backend/` directory, create a virtual environment, and install dependencies:

```bash
cd backend
python -m venv venv
# On Windows PowerShell:
.\venv\Scripts\Activate.ps1
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` configuration file inside `backend/` (template provided in `backend/.env`):

```env
DATABASE_URL=sqlite:///./account_knocker.db
JWT_SECRET=your-jwt-auth-key-change-this-in-production
GEMINI_API_KEY=your-gemini-api-key-here
```

*Note: If `GEMINI_API_KEY` is left blank, the backend automatically activates a smart local expert fallback system to answer questions contextually based on your linked account profile.*

Start the backend application server:

```bash
python -m uvicorn app.main:app --port 8000 --reload
```

FastAPI server will listen on [http://localhost:8000](http://localhost:8000). Interactive Swagger documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 2. Frontend Interface Configuration

Navigate to the `frontend/` directory, install packages, and launch Vite development client:

```bash
cd ../frontend
npm install
npm run dev
```

The React interface will mount at [http://localhost:5173](http://localhost:5173).

---

## 📂 Project Architecture

```
Account Knocker/
├── frontend/                    # Vite React Client
│   ├── src/
│   │   ├── components/          # Reusable UI cards, sidebars, alerts
│   │   ├── pages/               # Landing, Login, Register, Dashboard, Accounts, Reports, AI Chat
│   │   ├── services/            # Axios API client integrations
│   │   ├── context/             # AuthContext session states
│   │   └── index.css            # Custom CSS scrollbars, glows, grids
│   ├── tailwind.config.js       # Theme definitions
│   └── postcss.config.js        # PostCSS directives
├── backend/                     # FastAPI Service Engine
│   ├── app/
│   │   ├── main.py              # App bootstrapper
│   │   ├── models.py            # SQLite schema models
│   │   ├── schemas.py           # Pydantic payloads
│   │   ├── auth_service.py      # JWT check mechanisms
│   │   ├── routers/             # API Router endpoints
│   │   ├── services/            # Risk engines
│   │   └── ai/                  # Gemini wrappers & system rules
│   └── requirements.txt
└── README.md
```

---

## 🔑 REST API Overview

### 🔐 Authentication
* `POST /api/register` - Create user profile. Returns token and details.
* `POST /api/login` - Verify password. Returns token.
* `GET /api/me` - Fetch profile metadata for active session headers.

### 🔑 Credentials
* `GET /api/accounts` - Retrieve status checks for Google, Spotify, Discord, GitHub.
* `POST /api/accounts/mock-connect` - Demo mode platform connection simulation.
* `DELETE /api/connect/{platform}` - Sever connection to account platform.

### 🛡️ Threat Auditing
* `POST /api/analyze` - Execute risk rules on linked connections.
* `GET /api/reports` - Query previous history reports list.
* `GET /api/score/history` - Chronological points mapping score values for timeline charts.

### 💬 Assistant Coach
* `POST /api/chat` - Discuss vulnerabilities with Knock AI. Saves dialog to db memories.
* `GET /api/chat/history` - Recover conversational timeline.

---

## 🛡️ License
Proprietary under Cybersecurity Digital Safety Initiatives. Build premium cybersecurity dashboards.
