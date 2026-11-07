# ResumeIQ 📄🤖 — AI-Powered Resume Analyzer & Matcher

### 🚀 Deployed Live: [Try ResumeIQ Live](https://resumeiq-wxje.onrender.com/app)
*(⚠️ Note: This service is hosted on a free Render instance. Please allow up to 45–60 seconds for the initial spin-up if the application takes a moment to load.)*

---

## 🛠️ The Tech Stack
*   **Backend Architecture:** Django REST Framework, Python, JWT Authentication
*   **AI Orchestration:** Gemini API / Groq API (LLM Orchestration)
*   **Frontend Interface:** React.js, HTML5, CSS3, JavaScript (ES6+)
*   **Database Management:** MySQL Database
*   **Containerisation & Deployment:** Docker, Multi-stage builds, Render Cloud Hosting

---

## 🔥 Key Engineering Highlights
*   **Automated Document Parsing:** Built an asynchronous processing pipe that ingests raw PDF resume uploads, cleans textual characters, and evaluates content structures.
*   **LLM Semantic Scoring:** Integrated AI foundation APIs to cross-reference candidate keywords against unstructured job descriptions, outputting a precise percentage match alongside missing technical skills.
*   **Robust Access Security:** Protected internal REST endpoints with secure, token-based JSON Web Token (JWT) authentication flow.
*   **Dockerized Deployment:** Bundled the configuration dependencies into an isolated Docker multi-stage environment pipeline, ensuring seamless deployment reproducibility.

---

## 📦 Rapid Local Installation & Development

To get the application up and running locally, execute these simple steps:

1. **Clone the Source Repository:**
   ```bash
   git clone https://github.com
   cd ResumeIQ
   ```

2. **Configure Your Environment Variables:**
   Create a `.env` file within the root backend layout and insert your secrets:
   ```env
   SECRET_KEY=your_django_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   DB_NAME=your_mysql_database
   ```

3. **Spin Up via Docker Containers:**
   ```bash
   docker-compose up --build
   ```
   *The local development server will spin up automatically on port `8000` for the backend endpoint structures and port `3000` for the React web shell.*
