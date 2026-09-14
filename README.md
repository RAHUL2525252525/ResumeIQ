# ResumeIQ

AI-powered ATS resume analyzer. Upload a resume, paste a job description, get
an ATS score, matched/missing keywords, and AI-generated suggestions,
interview questions, and cover letters.

**Stack:** React + Vite · Django + Django REST Framework · PostgreSQL · Gemini API · Docker

---

## ⚠️ Read this first: what's fully built vs. scaffolded

This is a real, working full-stack app - not a mockup. Everything below is
implemented and tested:

- ✅ Auth (email/password, Google Sign-In, nickname-only guest login)
- ✅ Resume upload + text extraction (PDF/DOCX)
- ✅ ATS scoring engine (TF-IDF similarity + keyword coverage) - works with **no API key**
- ✅ Matched/missing keywords, skills match, keyword density, resume health check, formatting check
- ✅ AI resume analysis, bullet improver, professional summary, interview questions, cover letter (via Gemini)
- ✅ Analysis history + comparison
- ✅ Resume builder with 2 fully styled templates (Classic ATS, Modern Professional) + PDF export
- ✅ 23 backend tests (Django/pytest-style) + 5 frontend tests (Vitest), all passing
- ✅ Docker Compose, Postman collection

Marked but **not yet built** (clearly labeled "coming soon" in the UI so
it's honest, not broken):
- 4 additional resume templates (Software Developer, Fresh Graduate, Minimal
  ATS, Two-Column Professional) - the template system supports adding them,
  see `frontend/src/components/ResumePreview.jsx`.
- Multi-resume side-by-side comparison is basic (analysis history compare,
  not a dedicated resume-vs-resume diff view).

---

## 1. Get a Gemini API key (optional but recommended)

The AI features (analysis, suggestions, bullet improver, interview
questions, cover letters) call Google's Gemini API. Everything else (ATS
score, keyword matching, health checks) works without it.

1. Go to https://aistudio.google.com/app/apikey
2. Create a key, copy it.
3. Paste it into `backend/.env` as `GEMINI_API_KEY` (steps below).

## 2. About PostgreSQL - you do NOT need to install it locally

You have two options:

- **Docker (recommended, zero local install):** `docker-compose.yml`
  includes a `db` service that runs Postgres in a container. Nothing to
  install on your machine.
- **Production / cloud:** point `DB_HOST`, `DB_NAME`, `DB_USER`,
  `DB_PASSWORD`, `DB_PORT` in `backend/.env` at a managed Postgres instance
  (Render, Railway, Supabase, Neon, AWS RDS, etc). Django doesn't care
  whether Postgres is local, containerized, or in the cloud - it just needs
  those connection details.

---

## 3. Run it — Docker (fastest)

```bash
# from the project root
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
# edit backend/.env and add your GEMINI_API_KEY (optional)

docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- Django admin: http://localhost:8000/admin (create a superuser first, see below)

First time only, run migrations and create an admin user:

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

## 4. Run it — VS Code, without Docker

**Backend:**

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # edit DB_* to point at your Postgres + add GEMINI_API_KEY
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Frontend** (new terminal):

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173.

### VS Code tips
- Install the **Python** and **ESLint** extensions.
- Select the `backend/venv` interpreter: `Cmd/Ctrl+Shift+P` → "Python: Select Interpreter".
- Use the built-in terminal (`` Ctrl+` ``) to run the two dev servers side by side, or use split terminals.

---

## 5. Google Sign-In (optional)

1. Create an OAuth 2.0 Client ID at https://console.cloud.google.com/apis/credentials
   (Application type: Web application; add `http://localhost:5173` as an authorized origin).
2. Put the client ID in `frontend/.env` as `VITE_GOOGLE_CLIENT_ID` **and**
   in `backend/.env` as `GOOGLE_OAUTH_CLIENT_ID`.
3. Restart both dev servers.

If you skip this, the landing page still works via the nickname (guest) flow
or normal email/password signup.

---

## 6. Testing

**Backend** (Django's test runner, or pytest - both configured):

```bash
cd backend
python manage.py test
# or
pytest
```

**Frontend** (Vitest):

```bash
cd frontend
npm test
```

---

## 7. Postman

Import `postman_collection.json` into Postman. Register or log in first via
the Auth folder, copy the `access` token from the response into the
collection's `access_token` variable, then explore the other folders.

---

## 8. Project structure

```
taskflow/
├── backend/                # Django + DRF
│   ├── config/              # settings, urls
│   ├── accounts/            # auth (register/login/google/guest)
│   ├── resumes/              # resumes, job descriptions, analysis, builder
│   │   └── services/         # text extraction, scoring engine, Gemini wrapper
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                # React + Vite
│   ├── src/pages/            # Landing, AnalyzeWorkspace, History, Builder
│   ├── src/components/       # ScoreGauge, KeywordChips, ResumePreview, etc.
│   └── Dockerfile
├── docker-compose.yml
├── postman_collection.json
└── README.md (this file)
```

## 9. Deploying

- **Backend:** any host that runs a Python/Django app (Render, Railway,
  Fly.io, a VM, etc). Set `DEBUG=False`, a real `DJANGO_SECRET_KEY`, and
  point the `DB_*` vars at your managed Postgres instance.
- **Frontend:** `npm run build` produces a static `dist/` folder you can
  deploy to Vercel, Netlify, Render static sites, or any static host. Set
  `VITE_API_URL` to your deployed backend's `/api` URL at build time.
- **Database:** any managed PostgreSQL provider works - no local Postgres
  install is ever required, in dev (use the Docker `db` service) or in
  production (use your provider's connection string).
