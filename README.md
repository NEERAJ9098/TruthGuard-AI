# 🛡️ TruthGuard AI – Fake News Detection System
### 🏆 Built for HackNova Bhopal 2K26

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB.svg?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-4285F4.svg?logo=google)](https://aistudio.google.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Database-003B57.svg?logo=sqlite)](https://sqlite.org)

**TruthGuard AI** is a state-of-the-art, responsible artificial intelligence platform engineered to detect potentially fake, sensationalized, or misleading news. Built specifically for **HackNova Bhopal 2K26**, it combines linguistic machine learning, live global news coverage indexing (GDELT), certified fact-checking registers (Google Fact Check Tools), and reasoning powered by **Google Gemini AI**.

---

## 📌 1. Key Objectives & Responsible AI Charter

Unlike naive text classifiers that blindly flag dramatic writing as "fake", **TruthGuard AI** enforces strict ethical verification standards:
1. **Decoupling Style from Fact**: Sensational, emotional, or clickbait writing styles are treated as *secondary linguistic indicators*, never as mathematical proof of factual falsehood.
2. **Mandatory UNVERIFIED Outcome**: When third-party records or certified fact checks are insufficient, claims are labeled as `UNVERIFIED` rather than guessing.
3. **Model-Estimated Confidence**: Clearly labeled as internal algorithmic certainty based on retrieved evidence, not probability that an event happened.
4. **Zero Hallucination Standard**: Gemini is strictly prompted to never fabricate facts, sources, or URLs.

---

## 🏗️ 2. System Architecture & Forensic Pipeline

```
                                [ User Submission ]
                          (Headline / Full Article / URL)
                                        │
             ┌──────────────────────────┴──────────────────────────┐
             ▼                                                     ▼
     [ Text Preprocessing ]                               [ Safe URL Extractor ]
    • Normalization & Cleaning                          • SSRF Protection (DNS / IP)
    • Factual Claim Extraction                          • Strips Ads / Cookie Walls
             │                                                     │
             └──────────────────────────┬──────────────────────────┘
                                        ▼
                   ┌─────────────────────────────────────────┐
                   │        Multi-Stage Forensics Engine     │
                   └────────────────────┬────────────────────┘
                                        │
     ┌───────────────────┬──────────────┴──────┬───────────────────┐
     ▼                   ▼                     ▼                   ▼
[ ML Style Classifier ] [ Sensationalism ] [ Google Fact Check ] [ GDELT Global ]
 • TF-IDF Vectorizer     • Regex Pattern     • ClaimReview API    • 2.0 News Doc
 • Logistic Regression   • Clickbait Ratio   • Certified Debunks  • Media Corroboration
     │                   │                     │                   │
     └───────────────────┼─────────────────────┴───────────────────┘
                         ▼
             [ Google Gemini 2.5 Flash ]
             • Strict System Verification Prompt
             • Synthesizes Available Proof & Inconsistencies
             • Outputs Structured Forensic JSON
                         │
                         ▼
             [ Aggregated Output & Persistence ]
             • Verdict: LIKELY REAL / LIKELY FAKE / UNVERIFIED / MIXED
             • Model-Estimated Confidence Meter (0-100%)
             • Evidence Depth (HIGH / MEDIUM / LOW / NONE)
             • Persistent SQLite Storage & Recharts Visual Analytics
```

---

## 🚀 3. Technology Stack

### **Frontend**
- **React.js 18** (SPA with modular state)
- **Vite 5.4** (Lightning-fast HMR and bundle optimization)
- **Tailwind CSS 3.4** (Deep navy/dark blue glassmorphism theme with cyan/purple accents)
- **Lucide React** (Modern, clean icon set)
- **Recharts 2.13** (Interactive categorical donuts, depth bars, and timeline charts)

### **Backend**
- **Python FastAPI** (Asynchronous, type-safe REST framework)
- **Pydantic v2** (Strict schema validation and data sanitization)
- **SQLite 3** (Persistent historical audits and analytics data)
- **BeautifulSoup4 & HTTPX** (SSRF-protected article extraction with timeout guards)

### **AI & Machine Learning**
- **Google Gemini API** (`gemini-2.5-flash` via official `google-genai` SDK)
- **Scikit-learn / Pure-Python ML** (TF-IDF Vectorizer + Logistic Regression style classifier)
- **Configurable AI Provider Engine** (`GeminiProvider` with seamless `DemoAIProvider` fallback)

### **External News Verification APIs**
- **GDELT 2.0 Global News API** (Real-time global news coverage indexing)
- **Google Fact Check Tools API** (Certified ClaimReview schema matching)
- **NewsAPI** (Optional live news search source)

---

## 📁 4. Project Directory Structure

```
HN02/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI app, lifespan, CORS, error handlers
│   │   ├── config.py                # Pydantic settings & environment variables
│   │   ├── database.py              # SQLite thread-safe connection context & init
│   │   ├── models.py                # DB schema documentation
│   │   ├── schemas.py               # Pydantic request & response schemas
│   │   ├── sample_data.py           # Preloaded HackNova showcase seed data
│   │   ├── routers/
│   │   │   ├── analyze.py           # POST /api/analyze, POST /api/analyze-url
│   │   │   ├── history.py           # GET, DELETE /api/history
│   │   │   ├── dashboard.py         # GET /api/dashboard/stats
│   │   │   └── health.py            # GET /api/health
│   │   └── services/
│   │       ├── text_processor.py    # Text cleaning, claim extraction, sensationalism
│   │       ├── url_extractor.py     # Safe SSRF-protected URL article scraper
│   │       ├── fact_check_api.py    # Google Fact Check Tools integration
│   │       ├── news_search_api.py   # GDELT Global News & NewsAPI client
│   │       ├── ml_classifier.py     # TF-IDF + Logistic Regression writing style
│   │       ├── ai_service.py        # Gemini AI prompt engine & Demo fallback
│   │       └── analyzer.py          # Master verification pipeline orchestrator
│   ├── .env.example                 # Template for API keys
│   ├── .env                         # Local environment configuration
│   ├── requirements.txt             # Python backend dependencies
│   └── run.py                       # Backend server launcher
├── frontend/
│   ├── index.html                   # HTML entry point with dark theme
│   ├── package.json                 # Node dependencies
│   ├── vite.config.js               # Dev server & /api proxy setup
│   ├── tailwind.config.js           # Custom colors & glassmorphism theme
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                  # Root view coordinator
│       ├── index.css                # Global glassmorphism & gradients
│       ├── components/
│       │   ├── Navbar.jsx           # Brand header, status indicator, menu
│       │   ├── Footer.jsx           # HackNova 2K26 accreditation & ethics
│       │   ├── ConfidenceMeter.jsx  # Estimated confidence score & coverage
│       │   ├── SuspiciousWordsHighlighter.jsx # Flagged phrases & ML style
│       │   ├── EvidenceViewer.jsx   # Claims, Supporting, Contradicting & Sources
│       │   ├── StatCard.jsx         # Metric card with gradient accents
│       │   └── LoadingState.jsx     # Multi-step progress animation
│       ├── pages/
│       │   ├── LandingPage.jsx      # Hero, How It Works, 1-Click presets
│       │   ├── AnalyzePage.jsx      # Tri-modal input console (Headline/Article/URL)
│       │   ├── ResultsPage.jsx      # Complete verification intelligence dossier
│       │   ├── HistoryPage.jsx      # Historical SQLite audits & filters
│       │   ├── DashboardPage.jsx    # Visual Recharts analytics telemetry
│       │   └── AboutPage.jsx        # HackNova dossier & ethics charter
│       ├── services/
│       │   └── api.js               # Frontend REST client
│       └── utils/
│           ├── pdfExport.js         # Printer-friendly PDF report exporter
│           └── sampleNews.js        # Instant preset test cases
└── README.md
```

---

## ⚡ 5. Quick Start Guide

### **Prerequisites**
- **Python**: 3.10, 3.11, 3.12, 3.13, or 3.14
- **Node.js**: v18+ or v20+ with `npm`

---

### **Step 1: Backend Setup**

1. Open a terminal in the project root:
   ```bash
   # Windows PowerShell
   .\venv\Scripts\Activate.ps1
   ```
   *(Or create a new venv: `python -m venv venv` and install: `pip install -r backend/requirements.txt`)*

2. Configure environment variables in `backend/.env`:
   ```ini
   # Google Gemini API Key (Get free key at https://aistudio.google.com/)
   GEMINI_API_KEY=your_gemini_api_key_here

   # Optional API keys:
   GOOGLE_FACT_CHECK_API_KEY=
   NEWS_API_KEY=
   GEMINI_MODEL=gemini-2.5-flash
   ```
   *Note: If no API key is set, TruthGuard AI automatically activates its intelligent Demo Mode with full verification rules and preloaded knowledge.*

3. Start the FastAPI backend:
   ```bash
   python backend/run.py
   ```
   *The backend will start at `http://127.0.0.1:8000` (API Docs at `http://127.0.0.1:8000/docs`).*

---

### **Step 2: Frontend Setup**

1. In another terminal window:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open your browser at **`http://localhost:5173`**.

---

## 🌐 6. REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze` | Analyzes submitted news headline or complete article text |
| `POST` | `/api/analyze-url` | Safely extracts text from a public URL and analyzes it |
| `GET` | `/api/history` | Fetches previous reports from SQLite database (newest first) |
| `GET` | `/api/history/{id}` | Retrieves full verification report and evidence details |
| `DELETE` | `/api/history/{id}` | Deletes a single analysis record from SQLite |
| `DELETE` | `/api/history` | Clears all history records |
| `GET` | `/api/dashboard/stats`| Returns aggregate metrics and chart distribution data |
| `GET` | `/api/health` | Returns service status and configured API readiness |

---

## 🎯 7. Hackathon Judge Demonstration Guide

For the **HackNova Bhopal 2K26** judges, TruthGuard AI includes **5 preloaded demonstration cases** ready for 1-click testing:

1. **Chandrayaan-3 Lunar South Pole Landing**
   - *Verdict*: `LIKELY REAL` (94% confidence)
   - *Evidence*: BBC News, NASA Science, ISRO official telemetry corroboration.
   - *Linguistic Style*: Standard journalistic, zero suspicious terms.

2. **Hot Lemon Water Cancer Miracle Hoax**
   - *Verdict*: `LIKELY FAKE` (95% confidence)
   - *Evidence*: Certified Snopes & Reuters fact-check debunks.
   - *Linguistic Style*: Sensationalism Index 94%, flags "100% cure", "miracle", "doctors are furious".

3. **5G Cellular Radiation Viral Pandemic Hoax**
   - *Verdict*: `LIKELY FAKE` (91% confidence)
   - *Evidence*: PolitiFact ("Pants on Fire") and BBC Reality Check.
   - *Linguistic Style*: Conspiratorial framing detected.

4. **Leaked Himalayan Underground Biosphere**
   - *Verdict*: `UNVERIFIED` (46% confidence)
   - *Evidence*: No scientific peer-reviewed papers or media records.
   - *Responsible AI Demonstration*: Shows that TruthGuard AI does *not* jump to conclusions without verified evidence.

5. **Alkaline Water Antiviral Exaggeration**
   - *Verdict*: `MIXED OR MISLEADING` (74% confidence)
   - *Evidence*: Mayo Clinic supports hydration; Cleveland Clinic debunks blood pH alteration.

---

## 🛡️ 8. Security & SSRF Protection

When analyzing news URLs, `TruthGuard AI` implements strict defense against **Server-Side Request Forgery (SSRF)**:
- Enforces strict HTTP / HTTPS protocols.
- Resolves hostname via DNS prior to request.
- Blocks internal, private, loopback (`127.0.0.1`, `::1`), link-local (`169.254.x.x`), and multicast IP ranges.
- Enforces strict 10-second socket timeouts and clean HTML parsing.

---

## 👥 HackNova Bhopal 2K26 Team
Built with passion, scientific rigor, and responsible artificial intelligence for **HackNova 2K26**.
