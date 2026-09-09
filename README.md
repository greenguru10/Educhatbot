# 🎓 LearnWise - Source-Grounded AI Academic Tutor & RAG Platform

<div align="center">

![LearnWise Banner](https://img.shields.io/badge/LearnWise-Academic%20AI%20Tutor-059669?style=for-the-badge&logo=openai&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Groq](https://img.shields.io/badge/Groq-120B%20Accelerated-f97316?style=for-the-badge)
![NeonDB](https://img.shields.io/badge/NeonDB-PostgreSQL-00E599?style=for-the-badge&logo=postgresql&logoColor=white)

**A high-precision, production-grade educational RAG assistant engineered to deliver conversational explanations with verified academic citations, zero hallucinations, syntax-highlighted code execution, and per-user workspace isolation.**

[Features](#-key-features) • [Architecture](#-architecture) • [Getting Started](#-getting-started) • [API Reference](#-api-reference) • [Evaluation](#-testing--evaluation)

</div>

---

## 🌟 Key Features

- ⚡ **Groq 120B Acceleration with Multi-Key Failover**: Near-instantaneous response times powered by `openai/gpt-oss-120b` with seamless automatic rotation across multiple fallback API keys upon rate-limits or quota depletion.
- 🔍 **Strict Citation Grounding (`[S1]`, `[S2]`)**: Every factual claim is backed by verified university-standard course materials with clickable citation badges that slide open full document excerpts.
- 🎨 **ChatGPT-Style Minimalist Interface**: Clean, distraction-free conversational stream with multiline composer (`Shift + Enter`), copyable syntax-highlighted code blocks, and audio read-aloud text-to-speech.
- 🚀 **High-Converting Landing Page**: Featuring an interactive code terminal preview, animated features grid, curriculum topic showcases, and one-click app launch.
- 👤 **Per-User Workspace Isolation**: Dedicated user profiles ensuring chat histories, active sessions, and saved study notes are strictly segregated per learner.
- 🗄️ **Dual Database Support**: Direct connection to NeonDB Cloud PostgreSQL with graceful automatic fallback to local SQLite.
- 📝 **Personal Study Notebook**: Save key insights, code snippets, and source takeaways to a persistent drawer.
- 📚 **Comprehensive 102-Chunk Educational Corpus**: Pre-indexed repository covering Python, Data Structures & Algorithms (BST, AVL, Dijkstra, Sorting), React 19, DBMS Normalization (1NF-3NF, ACID), Computer Networks (OSI, TCP/UDP), and Operating Systems.

---

## 🏗️ Architecture

```
                                  ┌─────────────────────────────┐
                                  │   React 19 + Vite Frontend  │
                                  │  (ChatGPT UI + Landing Page)│
                                  └──────────────┬──────────────┘
                                                 │ HTTP / JSON
                                                 ▼
                                  ┌─────────────────────────────┐
                                  │       FastAPI Backend       │
                                  └──────────────┬──────────────┘
                                                 │
                   ┌─────────────────────────────┴────────────────────────────┐
                   ▼                                                          ▼
    ┌─────────────────────────────┐                            ┌─────────────────────────────┐
    │     Hybrid Retrieval        │                            │      Generation Gateway     │
    │  • Lexical BM25 (Boosted)   │                            │  • Groq (openai/gpt-oss-120b)│
    │  • Dense Vector Cosine Sim  │                            │  • Multi-Key Failover Pool  │
    │  • Reciprocal Rank Fusion   │                            │  • Grounding Validator      │
    └──────────────┬──────────────┘                            └──────────────┬──────────────┘
                   │                                                          │
                   ▼                                                          ▼
    ┌─────────────────────────────┐                            ┌─────────────────────────────┐
    │   NeonDB PostgreSQL / DB    │                            │    Verified Citations [S#]  │
    │ (Sessions, Chunks, Users)   │                            │  (Source Evidence Drawer)   │
    └─────────────────────────────┘                            └─────────────────────────────┘
```

---

## 📁 Repository Structure

```
├── backend/
│   ├── app/
│   │   ├── api/routes/          # Chat, Sessions, Quiz, Sources, Auth, Documents
│   │   ├── conversation/        # Context resolution & conversation history
│   │   ├── core/                # App configuration, security & logging
│   │   ├── database/            # Database engine (NeonDB + SQLite fallback)
│   │   ├── generation/          # LLM gateway, multi-key failover & prompt builders
│   │   ├── ingestion/           # Chunking, tokenization & metadata tagging
│   │   ├── models/              # SQLAlchemy database models
│   │   ├── nlp/                 # Entity recognition & query normalization
│   │   ├── retrieval/           # BM25, TF-IDF / Dense Embeddings, RRF Ranker
│   │   ├── schemas/             # Pydantic validation schemas
│   │   └── services/            # ChatService, IngestionService, QuizService
│   ├── tests/                   # Pytest test suites
│   └── requirements.txt         # Backend Python dependencies
├── frontend/
│   ├── src/
│   │   ├── api/                 # API client methods
│   │   ├── components/
│   │   │   ├── chat/            # CodeBlock, SourceDrawer, MessageBubble
│   │   │   ├── common/          # Logo, UserProfileModal
│   │   │   └── learning/        # NotesDrawer, QuizCard, FlashcardDeck
│   │   ├── pages/               # LandingPage
│   │   ├── utils/               # User profile manager & local storage
│   │   ├── App.tsx              # Main application router & state
│   │   └── main.tsx             # Entry point
│   ├── package.json             # Frontend dependencies
│   └── vite.config.ts           # Vite configuration
├── data/
│   └── raw/                     # Markdown course materials & textbooks
├── scripts/
│   ├── evaluate_retrieval.py    # Recall@K & MRR retrieval benchmarks
│   ├── smoke_test.py            # End-to-end integration test suite
│   └── ingest_corpus.py         # Data chunking & index pipeline
├── .env.example                 # Example configuration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+** (Python 3.11 recommended)
- **Node.js 18+** and `npm`
- **Groq API Key** ([console.groq.com](https://console.groq.com))

---

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create and activate a virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp ../.env.example ../.env
```

Edit `.env` at root with your keys:
```env
LLM_PROVIDER=openai_compatible
LLM_API_KEY=gsk_your_primary_groq_key
LLM_FALLBACK_API_KEYS=gsk_fallback_key_1,gsk_fallback_key_2
LLM_BASE_URL=https://api.groq.com/openai/v1
LLM_MODEL=openai/gpt-oss-120b
DATABASE_URL=postgresql://user:pass@host/neondb?sslmode=require
```

Start the FastAPI server:
```bash
uvicorn app.main:app --reload --port 8000
```
API Documentation will be available at: `http://127.0.0.1:8000/docs`.

---

### 2. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 📡 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/chat` | `POST` | Primary RAG generation endpoint with grounded `[S#]` citations |
| `/api/v1/sessions` | `GET` | Retrieve session history (supports `?user_id=...` isolation) |
| `/api/v1/sessions/{id}` | `GET` | Get full message thread for a specific session |
| `/api/v1/sessions/{id}` | `DELETE` | Delete a chat session |
| `/api/v1/quiz` | `POST` | Generate practice multiple-choice questions for any topic |
| `/api/v1/flashcards` | `POST` | Generate 3D-flip flashcard decks for active recall |
| `/api/v1/sources` | `GET` | List institutional source registry and licensing metadata |
| `/api/v1/documents` | `GET` | List indexed documents and active chunk counts |
| `/api/v1/health` | `GET` | Health check, vector index status, and chunk statistics |

---

## 🧪 Testing & Evaluation

### Automated Unit & Integration Tests
```bash
pytest backend/tests/ -v
```

### Retrieval Evaluation Benchmark
```bash
python scripts/evaluate_retrieval.py
```
*Current benchmark result:* **100.00% Recall@3**, **87.50% Recall@1**.

### End-to-End Smoke Test
```bash
python scripts/smoke_test.py
```

---

## 📦 Production Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
# Deploy 'dist/' folder to Vercel
```

### Backend (Render / Railway)
Set the Start Command to:
```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```
Ensure all environment variables from `.env.example` are configured in your dashboard.

---

## 📄 License
This project is released under the **MIT License**.
