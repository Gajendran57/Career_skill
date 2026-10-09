# 🧠 Interactive Career Skill Map

A full-stack, AI-powered career guidance platform that predicts the most relevant skill for a user based on their background, interests, and learning preferences — then serves a personalized, structured learning path with curated resources.

**Live deployment:**
- 🌐 Frontend: https://career-skill-mapper.vercel.app
- ⚙️ Backend API: https://career-skill-backend.onrender.com
- 🤖 ML Service: https://career-skill.onrender.com

---

## 📑 Table of Contents

1. [Architecture](#-architecture)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Prerequisites](#-prerequisites)
5. [Environment Variables](#-environment-variables)
6. [Local Setup — Order Matters](#-local-setup--order-matters)
7. [Running the App](#️-running-the-app)
8. [API Reference](#-api-reference)
9. [Admin Credentials](#-admin-credentials)
10. [Deployment](#-deployment)
11. [Troubleshooting](#-troubleshooting)

---

## 🏛 Architecture

Three independent services talk over HTTP:

```
┌──────────────────────┐      ┌───────────────────────┐      ┌────────────────────┐
│  Frontend (React)    │─────▶│  Backend (Express)    │─────▶│  ML Service (Flask)│
│  Vite + Tailwind     │      │  Node.js + MongoDB    │      │  scikit-learn      │
│  Port 5173 (dev)     │      │  Port 5000            │      │  Port 3000         │
│  Vercel (prod)       │      │  Render (prod)        │      │  Render (prod)     │
└──────────────────────┘      └───────────────────────┘      └────────────────────┘
        ▲                              ▲                              ▲
        │                              │                              │
   Serves UI +              Auth, skill maps,              Loads pickled pipeline
   calls /api/*             prediction proxy                and returns skill label
```

**Why three services?**

- The ML model lives in Python (scikit-learn), so it can't run in Node.
- The backend owns business logic, auth, and persistence — it never touches ML directly.
- The frontend only ever talks to the backend; it never calls the ML service directly.

This separation also means you can swap the ML model without touching the backend, or vice versa.

---

## 🧰 Tech Stack

### ML Service (`ml-model/`)

| Package | Version | Purpose |
| :--- | :--- | :--- |
| Python | 3.12+ | Runtime |
| Flask | 3.1.3 | HTTP server |
| flask-cors | 6.0.5 | CORS for cross-origin requests |
| gunicorn | 26.2.0 | Production WSGI server |
| joblib | 1.6.0 | Model persistence |
| pandas | 3.0.6 | Data manipulation during training |
| scikit-learn | 1.9.1 | Pipeline + RandomForestClassifier |

### Backend (`backend/`)

| Package | Version | Purpose |
| :--- | :--- | :--- |
| Node.js | 18+ | Runtime |
| Express | 4.22.3 | Web framework |
| Mongoose | 8.10.0 | MongoDB ODM |
| jsonwebtoken | 9.0.2 | JWT auth |
| bcryptjs | 2.4.3 | Password hashing |
| axios | 1.7.9 | Calls the ML service |
| cors | 2.8.5 | Cross-origin support |
| dotenv | 16.4.7 | Env var loading |
| nodemon | 3.1.14 | Dev hot-reload |

### Frontend (`frontend/`)

| Package | Version | Purpose |
| :--- | :--- | :--- |
| React | 18.3.1 | UI framework |
| Vite | 6.0.5 | Build tool + dev server |
| React Router | 7.1.5 | Client-side routing |
| Tailwind CSS | 4.0.0 | Styling |
| Framer Motion | 14.0.0 | Animations |
| axios | 1.7.9 | HTTP client |
| react-icons | 5.4.0 | Icon set |

---

## 📁 Project Structure

```
career_skill/
├── ml-model/                          # Python ML service
│   ├── app.py                         # Flask entry point (gunicorn target)
│   ├── train_model.py                 # Trains + saves pipeline & label encoder
│   ├── requirements.txt               # Python deps
│   ├── career_skill_dataset.csv       # Raw training data
│   ├── enhanced_career_skill_dataset.csv
│   ├── career_skill_predictor.pkl     # Trained sklearn Pipeline
│   └── label_encoder.pkl              # Fitted LabelEncoder
│
├── backend/                           # Node.js API
│   ├── server.js                      # Express entry point
│   ├── package.json
│   ├── controllers/
│   │   └── mlController.js            # Proxies /predict to the ML service
│   ├── routes/
│   │   ├── authRoute.js               # /api/auth (register, login)
│   │   ├── mlRoutes.js                # /api/ml/predict
│   │   ├── skillRoutes.js             # /api/skills
│   │   ├── skillMapRoutes.js          # /api/skill-maps
│   │   └── adminRoutes.js             # /api/admin
│   └── models/
│       ├── User.js                    # name, email, hashed password
│       ├── Skill.js
│       ├── SkillMap.js                # learningPath + resources
│       └── PredictedSkill.js          # userId ↔ skill
│
└── frontend/                          # React + Vite app
    ├── package.json
    ├── vite.config.js
    ├── vercel.json                    # SPA fallback rewrite
    ├── index.html
    ├── .env.local                     # Dev-only env vars (gitignored)
    └── src/
        ├── main.jsx
        ├── App.jsx                    # Route table
        ├── api.js                     # Shared axios instance
        ├── index.css                  # Tailwind entry
        ├── components/
        │   ├── AdminRoute.jsx         # Guards /admin
        │   ├── Navbar.jsx
        │   └── SkillCard.jsx
        └── pages/
            ├── LoginPage.jsx
            ├── RegisterPage.jsx
            ├── Dashboard.jsx
            ├── Questionnaire.jsx
            ├── Explore.jsx
            ├── Profile.jsx
            ├── SkillDetail.jsx
            ├── AdminPage.jsx
            ├── AdminSkillMapPage.jsx
            └── AdminSkillMapListPage.jsx
```

---

## ✅ Prerequisites

Install these before you start:

| Tool | Version | Notes |
| :--- | :--- | :--- |
| Python | 3.12+ | `python --version` |
| Node.js | 18+ | `node --version` |
| npm | 9+ | bundled with Node |
| MongoDB | — | Either local (`mongod`) or [MongoDB Atlas](https://cloud.mongodb.com) free tier |
| Git | any | |

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=replace_with_a_long_random_string
ML_SERVICE_URL=http://localhost:3000
```

| Variable | Required | Description |
| :--- | :--- | :--- |
| `PORT` | no | Defaults to `5000` if unset |
| `MONGO_URI` | **yes** | MongoDB connection string |
| `JWT_SECRET` | **yes** | Used to sign auth tokens. Generate with `openssl rand -hex 32` |
| `ML_SERVICE_URL` | **yes** | URL of the ML service. In production, use the deployed Render URL |

### Frontend (`frontend/.env.local`)

Create `frontend/.env.local` (Vite only reads env vars prefixed with `VITE_`):

```env
VITE_API_URL=http://localhost:5000
```

| Variable | Required | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | **yes** | Backend base URL. In production, use the deployed backend URL |

> ⚠️ `.env.local` must be added to `.gitignore`. In production, Vercel sets this variable via its dashboard.

### ML Service

**No environment variables needed.** The service only reads `$PORT`, which gunicorn binds to automatically in production. Locally it defaults to `3000` in `app.py`.

---

## 🚀 Local Setup — Order Matters

The services have dependencies between them:

```
ML Service (3000)  ←── backend needs it running
Backend (5000)     ←── frontend needs it running
Frontend (5173)    ←── user opens this in the browser
```

So the correct startup order is: **ML → Backend → Frontend**.

You'll need **3 terminal windows** open simultaneously.

### Step 1 — Clone and install dependencies

```bash
git clone <your-repo-url>
cd career_skill

# ML service
cd ml-model
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cd ..

# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### Step 2 — Train the ML model (one-time only)

You must train **inside the same virtualenv** that will run gunicorn, otherwise you'll get `InconsistentVersionWarning` and unpredictable predictions.

```bash
cd ml-model
source .venv/bin/activate
python train_model.py
```

This generates `career_skill_predictor.pkl` and `label_encoder.pkl`. Verify with:

```bash
ls -la *.pkl
```

### Step 3 — Set up MongoDB

Either:

- **Local**: Start `mongod` and set `MONGO_URI=mongodb://localhost:27017/career_skill` in `backend/.env`
- **Atlas**: Create a free cluster, whitelist `0.0.0.0/0`, and copy the SRV connection string into `backend/.env`

### Step 4 — Configure env files

Create `backend/.env` and `frontend/.env.local` as shown in [Environment Variables](#-environment-variables).

---

## ▶️ Running the App

### Terminal 1 — ML Service (start this first)

```bash
cd ml-model
source .venv/bin/activate
gunicorn app:app --bind 0.0.0.0:3000 --timeout 120 --access-logfile -
```

**Wait until you see:**

```
✅ Loaded ML pipeline and label encoder
Listening at: http://0.0.0.0:3000
```

**Verify with:**

```bash
curl http://localhost:3000/health
# → {"status":"ok"}
```

### Terminal 2 — Backend

```bash
cd backend
npm run dev
```

**Wait until you see:**

```
✅ MongoDB Connected
🚀 Server running on port 5000
```

**Verify with:**

```bash
curl http://localhost:5000/api/skill-maps
# → [] or an array of skill maps
```

### Terminal 3 — Frontend

```bash
cd frontend
npm run dev
```

Vite prints something like:

```
  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser.

---

## 📡 API Reference

All backend endpoints are prefixed with `/api`.

### Auth

| Method | Endpoint | Body | Returns |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | `{name, email, password}` | `{message: "User registered successfully"}` |
| POST | `/api/auth/login` | `{email, password}` | `{userId, name, email}` |

### ML Prediction

| Method | Endpoint | Body | Returns |
| :--- | :--- | :--- | :--- |
| POST | `/api/ml/predict` | See below | `{skill: "..."}` |

**Predict request body** (fields must match exactly):

```json
{
  "Education": "Bachelor's",
  "Occupation": "Student",
  "Interest": "AI/ML",
  "Experience": "Beginner",
  "LearningStyle": "Visual",
  "TimeCommitment": "5-10 hrs/week",
  "PreferredResources": "Free"
}
```

Valid values are enforced by the ML service's pipeline. Invalid categories return a `200` with a fallback prediction (`handle_unknown="ignore"`).

### Predictions Persistence

| Method | Endpoint | Body / Query | Returns |
| :--- | :--- | :--- | :--- |
| POST | `/api/save-prediction` | `{userId, skill}` | `{message: "Prediction saved successfully"}` |
| GET | `/api/predicted-skill?userId=<id>` | — | `{skill: "..."}` or `404` |

### Skill Maps

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| GET | `/api/skill-maps` | List all skill maps |
| GET | `/api/skill-maps/:id` | Single skill map |
| POST | `/api/skill-maps` | Create skill map (admin) |
| PUT | `/api/skill-maps/:id` | Update skill map (admin) |
| DELETE | `/api/skill-maps/:id` | Delete skill map (admin) |

### Skills

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| GET | `/api/skills` | List skills |
| POST | `/api/skills` | Add skill (admin) |
| DELETE | `/api/skills/:id` | Delete skill (admin) |

### ML Service (direct)

The ML service exposes these directly (usually only hit by the backend):

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| GET | `/health` | Liveness probe |
| POST | `/predict` | Raw prediction |

---

## 👤 Admin Credentials

The admin account is gated on the email `admin@gmail.com`. To create it:

1. Go to `/register` in the running frontend
2. Register with:
   - **Name**: `Admin`
   - **Email**: `admin@gmail.com`
   - **Password**: `Admin@123` (must match the check in `LoginPage.jsx`)
3. Log in. You'll be redirected to `/admin`

The admin can:

- **Create Skill Map** — author a new learning path with topics, subtopics, and resources
- **View Skill Maps** — browse/edit/delete existing maps
- **Back to Home** — jump to `/dashboard` to verify that new skills appear for regular users
- **Logout** — clear the session and return to `/login`

> ⚠️ **Security note:** the admin password is currently checked client-side in `LoginPage.jsx`. This is fine for demos but should be moved server-side before any real deployment.

---

## 🚢 Deployment

| Service | Platform | Root Directory | Start Command |
| :--- | :--- | :--- | :--- |
| ML Model | Render | `ml-model` | `gunicorn app:app --bind 0.0.0.0:$PORT --timeout 120 --access-logfile -` |
| Backend | Render | `backend` | `node server.js` |
| Frontend | Vercel | `frontend` | auto-detected (Vite) |

### Render env vars

**ML Service:** none required.

**Backend:**

```
ML_SERVICE_URL=https://career-skill.onrender.com
MONGO_URI=<your atlas URI>
JWT_SECRET=<your secret>
```

### Vercel env var

```
VITE_API_URL=https://career-skill-backend.onrender.com
```

Apply to **Production, Preview, Development**. After adding, redeploy with **"Use existing build cache" unchecked** — Vite inlines env vars at build time, so a cached build will serve the old value.

### Free-tier cold starts

Render free services sleep after 15 minutes of inactivity. Set up a free cron job at [cron-job.org](https://cron-job.org) to ping:

- `https://career-skill.onrender.com/health` every 15 minutes
- `https://career-skill-backend.onrender.com/api/skill-maps` every 15 minutes

This keeps both services warm and prevents 502 errors on first request.

---

## 🔧 Troubleshooting

| Symptom | Cause | Fix |
| :--- | :--- | :--- |
| `InconsistentVersionWarning` on startup | `.pkl` files trained with a different scikit-learn version | `python train_model.py` inside the same venv as gunicorn |
| `502 Bad Gateway` on `/predict` | ML service cold-starting on Render | Warm it up with `curl <ml-url>/health`, or set up a cron job |
| `ML service unavailable` in backend logs | `ML_SERVICE_URL` not set on Render | Add the env var and redeploy |
| Frontend calls `http://localhost:5000` in production | `VITE_API_URL` not set at build time | Set it in Vercel, redeploy with cache disabled |
| `Could not open requirements file` on Render | Root Directory not set | Set Root Directory = `ml-model` |
| Login succeeds but dashboard doesn't show | `App.jsx` reads localStorage only on mount | Use `window.location.href` after login, or add a `UserContext` |
| Predicted tab missing after questionnaire | Prediction not in localStorage/Mongo | Confirm `/api/save-prediction` returns 200 |
| CORS error from Vercel origin | CORS allow list | `app.use(cors())` allows all origins — should work by default |
| Admin page bounces to `/login` | Admin user doesn't exist in MongoDB | Register `admin@gmail.com` via `/register` |

---

## 🧪 End-to-End Smoke Test

After all three services are running, run these in order:

```bash
# 1. ML service alive?
curl http://localhost:3000/health
# → {"status":"ok"}

# 2. Backend alive?
curl http://localhost:5000/api/skill-maps
# → [] or [...]

# 3. Backend → ML proxy works?
curl -X POST http://localhost:5000/api/ml/predict \
  -H "Content-Type: application/json" \
  -d '{"Education":"Bachelor'"'"'s","Occupation":"Student","Interest":"AI/ML","Experience":"Beginner","LearningStyle":"Visual","TimeCommitment":"5-10 hrs/week","PreferredResources":"Free"}'
# → {"skill":"Intermediate AI/ML, TensorFlow"}
```

If step 3 returns a skill, the entire server-to-server chain is healthy. Any remaining issue is on the frontend, and the browser's Network tab will show it.

---

## 📜 License

ISC — see `backend/package.json`.

## 🙏 Acknowledgements

- scikit-learn for the classification pipeline
- MongoDB Atlas for the free-tier database
- Render for free-tier backend hosting
- Vercel for frontend hosting