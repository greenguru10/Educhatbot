# Educational LLM + RAG Chatbot

> **Project type:** Source-grounded educational assistant for students, learners, and educators.
>
> **Deployment target:** React frontend on Vercel, Python/FastAPI backend on Render, PostgreSQL database, hosted or local LLM provider through a secure backend gateway.

## 1. Executive Summary

Build a polished educational chatbot that answers academic questions using a Retrieval-Augmented Generation (RAG) pipeline. The application retrieves material from curated educational datasets, course notes, public learning resources, textbooks that are legally usable, and institution-approved documents; then an LLM produces a clear explanation with citations.

The project should serve as a general academic learning assistant, initially supporting Computer Science, Mathematics, Physics, English communication, and study skills. It must be deployed as a professional web application: Vercel hosts the React frontend, Render hosts the FastAPI backend, PostgreSQL stores application data and source metadata, and a vector index supports semantic retrieval. Structured outputs can make LLM responses conform to a JSON Schema, which is useful for predictable backend integration. [web:31][web:32]

## 2. Goals

- Answer educational questions using retrieved, approved learning evidence.
- Support explanations, definitions, examples, comparisons, study plans, quizzes, flashcards, and source citations.
- Make difficult concepts easier through level-aware answers.
- Allow administrators or teachers to upload curated course documents.
- Preserve source title, page, section, author, URL, license, date, and subject metadata.
- Support conversation history and follow-up questions.
- Provide a clean, mobile-responsive frontend.
- Run with a Vercel frontend and Render backend.
- Offer evaluation, feedback, analytics, logs, and administration workflows.
- Keep the architecture modular so new subjects and datasets can be added later.

## 3. Non-Goals

- Do not claim answers are official grading decisions.
- Do not impersonate a teacher, examiner, university, or certification authority.
- Do not bypass academic integrity rules or complete prohibited assessments for users.
- Do not ingest copyrighted course materials unless the owner has authorized their use.
- Do not expose uploaded documents to unauthorized users.
- Do not use browser-side LLM API keys.
- Do not build an autonomous agent that accesses arbitrary websites, emails, student accounts, or external tools.

## 4. Product Scope

### Initial subject categories

```text
computer_science
programming
artificial_intelligence
mathematics
physics
english_communication
study_skills
career_learning
cybersecurity_fundamentals
cloud_computing
```

### Supported user intents

```text
definition
explanation
example_request
comparison
step_by_step_learning
concept_summary
quiz_request
flashcard_request
study_plan_request
revision_request
code_explanation
formula_explanation
follow_up_question
source_request
unsupported
```

### Key use cases

| User need | Example | Expected behavior |
|---|---|---|
| Definition | “What is recursion?” | Short definition, explanation, example, citations |
| Concept explanation | “Explain TCP vs UDP” | Structured comparison with source support |
| Math learning | “Explain Bayes’ theorem” | Formula, variable definitions, worked illustrative example |
| Programming help | “Why does this Python loop fail?” | Explain supplied code, identify issue, provide educational correction |
| Quiz generation | “Quiz me on OSI layers” | Generate cited learning quiz based on retrieved topic evidence |
| Flashcards | “Create flashcards for DBMS normalization” | Return structured question/answer cards |
| Study plan | “Make a 7-day plan for DSA basics” | Generate a general study plan, clearly marked as adaptable |
| Follow-up | “Explain it with an example” | Resolve previous concept from session context |

## 5. System Architecture

```mermaid
flowchart LR
    USER[Student / Educator] --> FE[React + TypeScript Frontend]
    FE --> API[FastAPI Backend on Render]

    API --> AUTH[Authentication and Authorization]
    API --> QP[Query Processor]
    QP --> CTX[Conversation Context Manager]
    QP --> INT[Intent Classifier]
    QP --> RET[Hybrid Retriever]

    RET --> BM25[BM25 Lexical Search]
    RET --> VECTOR[Vector Search / pgvector]
    RET --> META[Metadata Filters]
    BM25 --> FUSION[Hybrid Fusion]
    VECTOR --> FUSION
    META --> FUSION
    FUSION --> RERANK[Reranker]
    RERANK --> EVIDENCE[Evidence Selector]

    EVIDENCE --> PROMPT[Prompt Builder]
    PROMPT --> LLM[LLM Gateway]
    LLM --> VALIDATE[Output and Citation Validator]
    VALIDATE --> RESPONSE[Response Builder]

    API --> DB[(PostgreSQL)]
    API --> LOGS[Structured Logs / Metrics]

    ADMIN[Admin / Teacher] --> INGEST[Ingestion Pipeline]
    INGEST --> DB
    INGEST --> BM25
    INGEST --> VECTOR
```

### Query flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as FastAPI
    participant C as Context Manager
    participant R as Retriever
    participant L as LLM Gateway
    participant D as Database

    U->>F: Ask learning question
    F->>A: POST /api/v1/chat
    A->>D: Load session and permissions
    A->>C: Resolve follow-up references
    C-->>A: Processed query
    A->>R: Hybrid retrieval
    R-->>A: Ranked evidence chunks
    A->>L: Grounded prompt + citations
    L-->>A: Structured response draft
    A->>A: Validate citations and output schema
    A->>D: Save query, answer, citations, feedback context
    A-->>F: Answer + sources + learning actions
    F-->>U: Render answer and citations
```

## 6. Technology Stack

| Layer | Recommended technology | Reason |
|---|---|---|
| Frontend | React 19, TypeScript, Vite | Fast modern UI development and type safety |
| Styling | Tailwind CSS + shadcn/ui | Professional responsive components with low overhead |
| Backend | Python 3.12 + FastAPI | Strong typing, OpenAPI docs, async support, fast development |
| Validation | Pydantic v2 | API and LLM structured-output validation |
| ORM | SQLAlchemy 2.x | Reliable persistence layer |
| Database | PostgreSQL 16 + pgvector | Relational source metadata plus vector search in one database |
| Local development DB | SQLite | Fast setup for local prototypes |
| Lexical retrieval | `rank-bm25` | Exact terminology and keyword retrieval |
| Embeddings | Configurable embedding provider/model | Semantic retrieval for paraphrased student questions |
| Reranking | Cross-encoder reranker optional | Better top-evidence precision |
| LLM provider | Explicit LLM gateway abstraction | Provider flexibility and secure backend-only keys |
| Parsing | PyMuPDF, python-docx, BeautifulSoup4, lxml | PDF, DOCX, HTML, and text ingestion |
| Background work | FastAPI BackgroundTasks initially | Simple ingestion/reindex jobs |
| Tests | pytest, httpx, Vitest, Playwright | Backend, API, and UI validation |
| Logging | structlog | Structured logs with request correlation |
| Hosting | Vercel frontend + Render API + Render PostgreSQL | Student-friendly managed deployment |

Vercel supports Git-connected React deployment with automatic HTTPS and low-friction deployment workflows, while structured JSON outputs help maintain predictable application contracts between an LLM and a backend. [web:33][web:31]

## 7. RAG and LLM Design

### RAG objective

The LLM should explain information from retrieved educational evidence rather than relying exclusively on model memory. Retrieval makes sources visible, lets administrators control course material, and helps update knowledge without retraining a model.

### LLM gateway

Create a provider abstraction so that the rest of the backend never depends on a particular vendor SDK.

```python
from typing import Protocol

class LLMClient(Protocol):
    async def generate(
        self,
        system_prompt: str,
        user_prompt: str,
        temperature: float,
        max_output_tokens: int,
        response_schema: dict,
    ) -> dict:
        ...
```

Supported adapters:

```text
OpenAICompatibleClient
AnthropicClient
GeminiClient
AzureOpenAIClient
OllamaClient (local development)
LocalVLLMClient (advanced self-hosted deployment)
MockLLMClient (testing)
```

### LLM configuration

```yaml
llm:
  provider: openai_compatible
  model: configured_by_environment
  temperature: 0.2
  top_p: 1.0
  max_output_tokens: 900
  timeout_seconds: 35
  retry_count: 2
  require_structured_output: true
  require_citations: true
```

Use low temperature for stable explanations while allowing enough flexibility for examples and instructional phrasing.

### System prompt

```text
You are LearnWise, an educational assistant.

Your job is to help learners understand concepts accurately and clearly.

Rules:
1. Use the approved retrieved sources as the primary factual basis of your answer.
2. Cite factual claims using source markers such as [S1] and [S2].
3. Do not invent facts, quotations, statistics, citations, page numbers, or sources.
4. If the sources do not support the answer, say that the approved learning library does not contain enough information.
5. Explain concepts at the learner level requested. If no level is provided, use clear undergraduate-level language.
6. You may create original examples, analogies, quiz questions, and flashcards, but label them as examples or practice material.
7. Distinguish source-grounded facts from illustrative examples.
8. Do not claim to be an official examiner or guarantee grades.
9. Do not assist with cheating, impersonation, bypassing exams, or submitting academic work dishonestly.
10. Return valid JSON matching the required schema.
```

### Prompt envelope

```text
User question:
{question}

Learner preferences:
- Level: {learner_level}
- Subject: {subject}
- Desired format: {requested_format}

Conversation context:
{safe_context}

Approved source evidence:
[S1]
Title: {title}
Author/Publisher: {source_name}
Section: {section}
Page: {page_number}
URL: {url}
Text:
{chunk_text}

[S2]
...

Write a helpful answer using the source evidence. Mark source-grounded factual claims with [S#]. Clearly label any original illustrative example as “Example”.
```

### Structured output schema

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {
    "answer": {
      "type": "string"
    },
    "key_points": {
      "type": "array",
      "items": { "type": "string" },
      "maxItems": 6
    },
    "example": {
      "type": ["string", "null"]
    },
    "quiz": {
      "type": "array",
      "items": {
        "type": "object",
        "additionalProperties": false,
        "properties": {
          "question": { "type": "string" },
          "answer": { "type": "string" },
          "explanation": { "type": "string" }
        },
        "required": ["question", "answer", "explanation"]
      },
      "maxItems": 5
    },
    "follow_up_suggestions": {
      "type": "array",
      "items": { "type": "string" },
      "maxItems": 4
    },
    "used_source_ids": {
      "type": "array",
      "items": { "type": "string" },
      "maxItems": 5
    },
    "confidence_note": {
      "type": "string"
    }
  },
  "required": [
    "answer",
    "key_points",
    "example",
    "quiz",
    "follow_up_suggestions",
    "used_source_ids",
    "confidence_note"
  ]
}
```

## 8. Educational Data Sources and Dataset

### Source principles

Use only legally usable, public-domain, Creative Commons, institution-authorized, or self-created content. Record license/terms information for every source.

### Recommended data sources

| Source | Use | Notes |
|---|---|---|
| OpenStax | Textbooks | Open educational textbooks in science, math, computing-adjacent subjects |
| MIT OpenCourseWare | Course material | Use content only according to stated license and attribution requirements |
| Khan Academy | Concept learning references | Use public materials according to license/terms; do not copy restricted content blindly |
| NPTEL / SWAYAM | India-relevant course resources | Use approved course pages, public notes, and content permitted for reuse |
| MDN Web Docs | Web development | Excellent for HTML, CSS, JavaScript documentation |
| Python Documentation | Programming | Official Python language/library material |
| PostgreSQL Documentation | Databases | Official database documentation |
| OWASP | Cybersecurity fundamentals | Security education and best-practice references |
| AWS Documentation | Cloud concepts | Official cloud learning material and architecture references |
| NASA educational resources | Physics/science | Public science content where license permits |
| Wikimedia / Wikipedia | Supplementary overview only | Lower authority than primary/official sources; require citations and moderation |
| Teacher-created notes | Course-specific material | Best for institution-specific learning, with teacher authorization |
| Public government education portals | General academic material | Prefer official sources for policies and public datasets |

### Initial dataset recommendation

Start with 30–50 documents and 500–1,500 chunks.

| Subject | Example document types | Target documents |
|---|---|---:|
| Python/programming | Official tutorial pages, approved notes | 8–12 |
| Data structures and algorithms | Open educational notes and teacher-created modules | 6–10 |
| DBMS | Normalization, SQL, indexing, transactions notes | 5–8 |
| Networking | OSI, TCP/IP, routing concept resources | 5–8 |
| Mathematics | Calculus, probability, linear algebra content | 8–12 |
| Physics | Mechanics, electricity, waves learning content | 5–8 |
| AI/ML | Supervised learning, evaluation metrics, ethics | 6–10 |
| Study skills | Revision and learning-strategy material | 4–6 |
| English communication | Grammar, writing, presentations | 4–6 |
| Cybersecurity | OWASP and basic defensive-security materials | 4–6 |

### Dataset manifest

```json
{
  "document_key": "python_docs_functions_001",
  "title": "Python Functions",
  "source_name": "Python Documentation",
  "source_url": "https://docs.python.org/...",
  "license_or_terms_url": "https://docs.python.org/3/license.html",
  "authority_level": "A",
  "subject": "programming",
  "topic_tags": ["python", "functions", "parameters"],
  "document_type": "documentation",
  "publication_date": null,
  "last_updated": "2026-01-01",
  "language": "en",
  "status": "active"
}
```

### Evaluation dataset

Create at least 200 questions split across subjects and intent types.

```json
{
  "id": "programming_001",
  "question": "What is a Python function?",
  "subject": "programming",
  "expected_intent": "definition",
  "expected_sources": ["python_docs_functions_001"],
  "expected_keywords": ["function", "code", "call"],
  "answerable": true,
  "difficulty": "beginner"
}
```

## 9. Document Ingestion

### Ingestion pipeline

```mermaid
flowchart TD
    A[Admin uploads or registers source] --> B[Source and license validation]
    B --> C[File type / MIME / checksum validation]
    C --> D[Text extraction]
    D --> E[Cleaning and boilerplate removal]
    E --> F[Headings and sections detection]
    F --> G[Educational chunking]
    G --> H[Metadata enrichment]
    H --> I[Store documents and chunks]
    I --> J[Create lexical index]
    I --> K[Generate embeddings]
    J --> L[Build hybrid indexes]
    K --> L
    L --> M[Admin quality review]
    M --> N[Activate document]
```

### Supported formats

| Type | Parser | Status |
|---|---|---|
| PDF | PyMuPDF | Required |
| TXT | Native text parser | Required |
| Markdown | Markdown parser | Required |
| HTML | BeautifulSoup4 + lxml | Required |
| DOCX | python-docx | Optional |
| JSON | JSON schema parser | Optional |

### Ingestion steps

1. Verify the source exists in the approved source registry.
2. Verify source terms, license, attribution requirements, and intended use.
3. Validate upload size, file type, MIME type, checksum, and safe storage path.
4. Extract text while preserving pages, headings, lists, code blocks, formulas, tables, and captions.
5. Remove menus, cookie banners, repeated headers/footers, navigation, unrelated ads, and duplicate content.
6. Detect sections and nested headings.
7. Create educational chunks based on topic and logical boundaries.
8. Attach subject, topic tags, level, document type, page range, title, author, URL, date, and license metadata.
9. Generate lexical and vector representations.
10. Run automated quality checks.
11. Require admin/teacher review before document activation.
12. Version source documents and rebuild indexes when changes occur.

### File validation rules

```text
Maximum upload size: 25 MB
Allowed extensions: pdf, txt, md, html, htm, docx, json
Reject: archives, executables, macro documents, encrypted PDFs, malformed files
Storage: generated UUID filenames under configured private root
Checksum: SHA-256 for duplicate detection
```

## 10. Chunking

### Chunking objective

Keep concepts, definitions, examples, steps, formulas, diagrams captions, and code explanations together so retrieval provides useful context to the LLM.

### Rules

1. Split by headings first.
2. Keep a definition with its immediate explanation and example.
3. Keep formulas with variable definitions and assumptions.
4. Keep code blocks with surrounding explanation.
5. Keep numbered procedures as complete units.
6. Preserve table headings and relevant notes.
7. Target 250–500 tokens per chunk, with a soft target of 350 tokens.
8. Use 40–80 token overlap only where a concept continues across a boundary.
9. Create smaller 80–180 token chunks for FAQs, definitions, glossary entries, and flashcard-like content.
10. Do not split in the middle of a mathematical derivation, source-code block, table, or list.

### Chunk metadata

```json
{
  "document_id": "uuid",
  "chunk_id": "uuid",
  "chunk_sequence": 5,
  "title": "Introduction to Recursion",
  "section": "Base Case and Recursive Case",
  "subject": "programming",
  "topic_tags": ["recursion", "algorithms", "python"],
  "difficulty_level": "beginner",
  "document_type": "course_note",
  "author": "Course Team",
  "source_url": "https://...",
  "license": "CC BY 4.0",
  "page_start": 4,
  "page_end": 5,
  "text": "...",
  "normalized_text": "...",
  "token_count": 342,
  "status": "active"
}
```

## 11. Query Processing

### Processing pipeline

```text
Raw message
  -> length and encoding validation
  -> language detection
  -> spelling normalization
  -> abbreviation expansion
  -> entity/topic extraction
  -> intent classification
  -> conversation reference resolution
  -> subject and level inference
  -> retrieval query generation
```

### Educational terminology dictionary

Store in `configs/education_terms.yaml`.

```yaml
abbreviations:
  dsa:
    expansion: data structures and algorithms
    subject: computer_science
  dbms:
    expansion: database management system
    subject: computer_science
  oops:
    expansion: object oriented programming
    subject: programming
  osi:
    expansion: open systems interconnection
    subject: networking
  sql:
    expansion: structured query language
    subject: databases
  ml:
    expansion: machine learning
    subject: artificial_intelligence
  ai:
    expansion: artificial intelligence
    subject: artificial_intelligence
synonyms:
  recursion: [recursive function, self calling function]
  database_normalization: [normal forms, db normalization]
  binary_search: [binary lookup, divide and conquer search]
  derivative: [differentiation, rate of change]
```

### Conversation follow-up resolution

If the user asks:

```text
User: What is recursion?
Assistant: [Explains recursion]
User: Give me an example.
```

Rewrite internally to:

```text
Give me an example of recursion.
```

Resolve only when a prior subject/entity is unambiguous. Otherwise ask:

```text
Which concept would you like an example for?
```

## 12. Retrieval Architecture

### Retrieval pipeline

```mermaid
flowchart LR
    Q[Processed query] --> F[Metadata filtering]
    Q --> B[BM25 retrieval]
    Q --> V[Vector retrieval]
    B --> U[Candidate union]
    V --> U
    F --> U
    U --> RRF[Reciprocal Rank Fusion]
    RRF --> RR[Reranking]
    RR --> DS[Diversity selection]
    DS --> E[Evidence chunks]
```

### BM25 retrieval

Use BM25 for exact educational terminology, formulas, programming names, APIs, abbreviations, headings, and course-specific vocabulary.

\[
BM25(Q,D)=\sum_{q_i \in Q} IDF(q_i)\cdot \frac{f(q_i,D)(k_1+1)}{f(q_i,D)+k_1\left(1-b+b\cdot \frac{|D|}{avgdl}\right)}
\]

Initial parameters:

```yaml
bm25:
  k1: 1.2
  b: 0.75
  candidate_k: 40
```

### Vector retrieval

Use embeddings for semantic similarity between student phrasing and educational content.

\[
Cosine(Q,D)=\frac{\vec{e}_Q\cdot\vec{e}_D}{\|\vec{e}_Q\|\|\vec{e}_D\|}
\]

Settings:

```yaml
vector_search:
  candidate_k: 40
  similarity: cosine
  normalize_embeddings: true
  minimum_similarity: 0.35
```

### Hybrid fusion

Use Reciprocal Rank Fusion:

\[
RRF(d)=\sum_{r \in R}\frac{1}{k+rank_r(d)}
\]

Initial `k = 60`.

Final ranking formula:

\[
Final(d)=0.45\cdot RRF_n+
0.25\cdot Rerank_n+
0.15\cdot Authority+
0.10\cdot MetadataMatch+
0.05\cdot Recency
\]

### Reranking rules

- Rerank the top 30 candidates.
- Return 3–5 evidence chunks.
- Prefer official documentation and teacher-approved course material when scores are comparable.
- Prefer the requested subject and difficulty-level match.
- Ensure diversity: do not return five nearly identical chunks.
- Exclude inactive, unauthorized, duplicate, expired, or superseded sources.

## 13. Citation and Evidence Design

### Citation requirements

Every source-grounded factual claim must use a marker such as `[S1]`. Original examples, analogies, quizzes, and study suggestions should be visibly labeled as generated learning aids.

### Citation payload

```json
{
  "citation_key": "S1",
  "document_id": "uuid",
  "chunk_id": "uuid",
  "title": "Python Functions",
  "source_name": "Python Documentation",
  "author": "Python Software Foundation",
  "section": "Defining Functions",
  "page_number": null,
  "url": "https://docs.python.org/...",
  "license": "PSF License",
  "last_updated": "2026-01-01",
  "excerpt": "Relevant retrieved evidence."
}
```

### Evidence validation

1. Parse citation markers from LLM output.
2. Confirm each cited marker exists in supplied retrieval context.
3. Reject fake or malformed citation markers.
4. Verify each source is active and authorized.
5. Use lexical overlap plus embedding similarity to estimate whether cited evidence supports the associated sentence.
6. Remove unsupported claims or regenerate once with explicit correction instructions.
7. If verification still fails, return an evidence-insufficient answer.

## 14. Output Validation

### Validation stages

```text
LLM JSON output
  -> Pydantic schema validation
  -> citation parser
  -> citation existence check
  -> source activity check
  -> factual sentence support check
  -> academic-integrity policy check
  -> response length/format check
  -> final API response
```

### Insufficient-evidence template

```text
I could not find enough reliable material in the approved learning library to answer this accurately.

Try rephrasing the question, selecting a subject, or ask an administrator to add an approved source on this topic.
```

### Academic-integrity response template

```text
I can help you understand the concept, review your approach, create practice questions, or give feedback on work you have written.

I cannot complete a prohibited assessment or help you submit work as if it were your own.
```

## 15. Database Schema

### Recommendation

Use PostgreSQL with pgvector on Render for production. PostgreSQL keeps source metadata, user/session data, feedback, document versions, citations, and vectors in one managed database.

Use SQLite locally only when PostgreSQL is unavailable.

### Entity relationship diagram

```mermaid
erDiagram
    users ||--o{ sessions : owns
    users ||--o{ documents : uploads
    source_registry ||--o{ documents : publishes
    subjects ||--o{ documents : categorizes
    documents ||--o{ document_chunks : contains
    documents ||--o{ documents : supersedes
    sessions ||--o{ messages : contains
    sessions ||--o{ queries : owns
    queries ||--o{ retrieval_results : produces
    queries ||--o| answers : creates
    answers ||--o{ citations : includes
    document_chunks ||--o{ citations : supports
    answers ||--o{ feedback : receives
    users ||--o{ audit_events : performs
```

### `users`

| Column | Type | Constraints | Purpose |
|---|---|---|---|
| id | UUID | PK | User ID |
| email | VARCHAR(320) | Unique, nullable for guest mode | Identity |
| display_name | VARCHAR(120) | Nullable | UI label |
| password_hash | TEXT | Nullable | Password if local auth is used |
| role | VARCHAR(20) | `student`, `teacher`, `admin` | Authorization |
| status | VARCHAR(20) | active/disabled | Access control |
| created_at | TIMESTAMPTZ | Not null | Audit |
| updated_at | TIMESTAMPTZ | Not null | Audit |

### `source_registry`

| Column | Type | Constraints | Purpose |
|---|---|---|---|
| id | UUID | PK | Source ID |
| name | VARCHAR(255) | Unique | Publisher/source |
| base_url | TEXT | Nullable | Source root URL |
| authority_level | CHAR(1) | A–D | Trust tier |
| authority_score | NUMERIC(3,2) | 0–1 | Ranking score |
| license_notes | TEXT | Nullable | Usage terms |
| active | BOOLEAN | Default true | Eligibility |
| created_at | TIMESTAMPTZ | Not null | Audit |

### `subjects`

| Column | Type | Constraints | Purpose |
|---|---|---|---|
| id | SMALLSERIAL | PK | Subject ID |
| slug | VARCHAR(80) | Unique | Stable subject code |
| display_name | VARCHAR(150) | Not null | UI label |
| description | TEXT | Nullable | Scope |
| active | BOOLEAN | Default true | Availability |

### `documents`

| Column | Type | Constraints | Purpose |
|---|---|---|---|
| id | UUID | PK | Document ID |
| source_id | UUID | FK source_registry.id | Publisher |
| subject_id | SMALLINT | FK subjects.id | Subject |
| uploaded_by | UUID | FK users.id | Admin/teacher uploader |
| title | VARCHAR(500) | Not null | Title |
| author | VARCHAR(500) | Nullable | Author |
| document_type | VARCHAR(80) | Not null | textbook, course_note, documentation |
| source_url | TEXT | Nullable | Original URL |
| license | VARCHAR(255) | Nullable | License label |
| license_url | TEXT | Nullable | License/terms URL |
| local_path | TEXT | Not null | Private file storage |
| content_hash | CHAR(64) | Unique | SHA-256 checksum |
| publication_date | DATE | Nullable | Published date |
| last_updated | DATE | Nullable | Updated date |
| version_label | VARCHAR(100) | Nullable | Version |
| status | VARCHAR(20) | draft/active/inactive/superseded/failed | Lifecycle |
| superseded_by | UUID | FK documents.id nullable | Version link |
| extracted_text | TEXT | Nullable | Preview |
| created_at | TIMESTAMPTZ | Not null | Audit |
| updated_at | TIMESTAMPTZ | Not null | Audit |

Indexes:

```sql
CREATE INDEX ix_documents_subject_status ON documents(subject_id, status);
CREATE INDEX ix_documents_source_updated ON documents(source_id, last_updated DESC);
CREATE INDEX ix_documents_superseded_by ON documents(superseded_by);
```

### `document_chunks`

| Column | Type | Constraints | Purpose |
|---|---|---|---|
| id | UUID | PK | Chunk ID |
| document_id | UUID | FK documents.id | Parent document |
| chunk_sequence | INTEGER | Not null | Position |
| title | VARCHAR(500) | Nullable | Title snapshot |
| section | VARCHAR(500) | Nullable | Section heading |
| subsection | VARCHAR(500) | Nullable | Subheading |
| page_start | INTEGER | Nullable | Start page |
| page_end | INTEGER | Nullable | End page |
| raw_text | TEXT | Not null | Evidence text |
| normalized_text | TEXT | Not null | Search text |
| token_count | INTEGER | Not null | Context accounting |
| topic_tags | JSONB | Default `[]` | Topics |
| difficulty_level | VARCHAR(30) | Nullable | beginner/intermediate/advanced |
| embedding | VECTOR(n) | Nullable | Dense vector |
| active | BOOLEAN | Default true | Retrieval eligibility |
| created_at | TIMESTAMPTZ | Not null | Audit |

Constraints:

```sql
UNIQUE(document_id, chunk_sequence);
CHECK (token_count > 0);
CHECK (page_end IS NULL OR page_start IS NULL OR page_end >= page_start);
```

### Other tables

| Table | Required fields | Purpose |
|---|---|---|
| `sessions` | `id`, `user_id`, `state_json`, `expires_at`, timestamps | Conversation state |
| `messages` | `id`, `session_id`, `role`, `content`, `metadata_json`, timestamp | Chat history |
| `queries` | `id`, `session_id`, `raw_query`, `normalized_query`, `intent`, `subject`, `created_at` | Search/audit data |
| `retrieval_results` | `id`, `query_id`, `chunk_id`, scores, rank, `selected_as_evidence` | Retrieval diagnostics |
| `answers` | `id`, `query_id`, model/provider, prompt version, response text, confidence, timestamp | Answer audit |
| `citations` | `id`, `answer_id`, `chunk_id`, citation key, excerpt, order | Evidence attribution |
| `feedback` | `id`, `answer_id`, `user_id`, rating, type, comment | Product quality signals |
| `audit_events` | `id`, `user_id`, request ID, event type, metadata, timestamp | Security/admin audit |
| `index_versions` | index type, artifact path, corpus hash, model version, params, active flag | Reproducible index builds |

## 16. Backend API

### API conventions

```text
Base path: /api/v1
Format: JSON
Identifiers: UUID
Validation: Pydantic
Authentication: JWT for authenticated users and all admin endpoints
Request correlation: X-Request-ID
API documentation: /docs and /openapi.json
```

### `POST /api/v1/chat`

Request:

```json
{
  "session_id": "b79e64c0-1af1-4a3a-8e94-dafe96b62d5f",
  "message": "Explain recursion with a Python example.",
  "subject": "programming",
  "learner_level": "beginner",
  "response_style": "detailed"
}
```

Response:

```json
{
  "request_id": "req_01JXYZ",
  "session_id": "b79e64c0-1af1-4a3a-8e94-dafe96b62d5f",
  "response_mode": "grounded_answer",
  "answer": "Recursion is a technique in which a function calls itself to solve smaller instances of a problem. [S1]",
  "key_points": [
    "A recursive solution needs a base case to stop repeated calls. [S1]",
    "The recursive case reduces the problem toward the base case. [S1]"
  ],
  "example": "Example (generated): A factorial function can call itself with a smaller number until it reaches 0.",
  "quiz": [],
  "confidence": {
    "score": 0.89,
    "label": "high",
    "explanation": "The answer was supported by current, high-quality learning sources."
  },
  "sources": [
    {
      "citation_key": "S1",
      "title": "Introduction to Recursion",
      "source_name": "Approved Course Notes",
      "section": "Recursive Functions",
      "page_number": 4,
      "url": "https://example.edu/...",
      "license": "Authorized course material",
      "excerpt": "A recursive function calls itself..."
    }
  ],
  "follow_up_suggestions": [
    "What is a base case?",
    "Show recursion versus iteration."
  ]
}
```

### `POST /api/v1/auth/register`

```json
{
  "email": "student@example.com",
  "password": "strong-password",
  "display_name": "Mihir"
}
```

Response: `201 Created` with a sanitized user profile and authentication token strategy.

### `POST /api/v1/auth/login`

```json
{
  "email": "student@example.com",
  "password": "strong-password"
}
```

Response:

```json
{
  "access_token": "jwt",
  "token_type": "bearer",
  "expires_in": 3600,
  "user": {
    "id": "uuid",
    "display_name": "Mihir",
    "role": "student"
  }
}
```

### `POST /api/v1/documents`

Admin/teacher-only multipart upload.

```text
file: recursion_notes.pdf
source_id: UUID
subject_slug: programming
title: optional
author: optional
license: required
license_url: optional
publication_date: optional
last_updated: optional
version_label: optional
```

### `POST /api/v1/documents/{document_id}/ingest`

Starts secure extraction, chunking, embedding, and index build.

```json
{
  "document_id": "uuid",
  "job_id": "uuid",
  "status": "queued"
}
```

### `GET /api/v1/documents`

Supports:

```text
subject
source_id
status
page
page_size
```

### `GET /api/v1/documents/{document_id}`

Returns metadata, source details, text preview, chunks, version history, and ingestion diagnostics according to access role.

### `PATCH /api/v1/documents/{document_id}`

Admin/teacher-only.

```json
{
  "status": "inactive",
  "superseded_by": null
}
```

### `POST /api/v1/documents/{document_id}/reindex`

Queues reindexing of one document or the active corpus.

### `POST /api/v1/quiz`

Request:

```json
{
  "topic": "OSI model",
  "subject": "computer_science",
  "learner_level": "beginner",
  "question_count": 5,
  "question_types": ["multiple_choice", "short_answer"]
}
```

Response includes generated practice questions, answer keys, explanations, and sources used.

### `POST /api/v1/flashcards`

Request:

```json
{
  "topic": "database normalization",
  "subject": "computer_science",
  "card_count": 10,
  "learner_level": "intermediate"
}
```

### `POST /api/v1/feedback`

```json
{
  "answer_id": "uuid",
  "rating": 4,
  "feedback_type": "helpful",
  "comment": "The example made recursion easy to understand."
}
```

### `GET /api/v1/sessions/{session_id}`

Returns authorized session messages and metadata.

### `DELETE /api/v1/sessions/{session_id}`

Deletes a session and associated conversation data according to retention policy.

### `GET /api/v1/sources`

Returns approved source registry, subject coverage, license details, and document counts.

### `GET /api/v1/health`

```json
{
  "status": "ok",
  "database": "ok",
  "bm25_index": "ready",
  "vector_index": "ready",
  "llm_gateway": "ready",
  "version": "1.0.0"
}
```

## 17. Frontend Design

### Recommended visual style

```text
Theme: Modern academic workspace
Primary: Deep indigo (#4338CA) or academic blue (#1D4ED8)
Secondary: Violet and cyan for learning categories
Success: Green for completed practice, not answer correctness guarantees
Warning: Amber for source limitations
Typography: Inter or Source Sans 3
Layout: Clean cards, readable line height, generous whitespace
Target: WCAG 2.1 AA accessibility
```

### Main application layout

```mermaid
flowchart LR
    NAV[Top Navigation] --> SIDEBAR[Conversation Sidebar]
    NAV --> MAIN[Learning Workspace]
    MAIN --> CHAT[Chat and Learning Response]
    MAIN --> SOURCE[Source Explorer]
    CHAT --> ACTIONS[Quiz / Flashcards / Save Notes]
```

### Screens

1. **Landing page**
   - Product value proposition.
   - Supported subjects.
   - “Ask a question” call to action.
   - Privacy and academic integrity notice.
   - Examples of source-grounded answers.

2. **Chat workspace**
   - Conversation sidebar.
   - Main response stream.
   - Source badges and expandable evidence cards.
   - Subject selector.
   - Learning-level selector: beginner, intermediate, advanced.
   - Response-style selector: concise, detailed, exam-oriented.
   - Follow-up suggestion chips.

3. **Study tools panel**
   - Generate quiz.
   - Generate flashcards.
   - Save learning notes.
   - Copy/export answer as Markdown.

4. **Source explorer**
   - Title, author/publisher, source type, URL, license, date, section/page, excerpt.
   - Highlight evidence relevant to the selected claim.

5. **Admin dashboard**
   - Documents table.
   - Upload flow.
   - Review extracted text.
   - Chunk browser.
   - Index status.
   - Source registry.
   - Query/evaluation dashboard.

### Frontend component structure

```text
frontend/src/
├── api/
│   ├── client.ts
│   ├── auth.ts
│   ├── chat.ts
│   ├── documents.ts
│   └── sources.ts
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── chat/
│   │   ├── ChatInput.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── CitationBadge.tsx
│   │   ├── SourceDrawer.tsx
│   │   ├── ConfidenceBadge.tsx
│   │   └── FollowUpChips.tsx
│   ├── learning/
│   │   ├── QuizCard.tsx
│   │   ├── FlashcardDeck.tsx
│   │   ├── ExampleCard.tsx
│   │   └── StudyPlanCard.tsx
│   └── admin/
│       ├── DocumentTable.tsx
│       ├── UploadDialog.tsx
│       ├── ChunkPreview.tsx
│       └── IndexStatus.tsx
├── features/
│   ├── auth/
│   ├── chat/
│   ├── documents/
│   └── study-tools/
├── hooks/
├── lib/
├── pages/
│   ├── LandingPage.tsx
│   ├── ChatPage.tsx
│   ├── AdminPage.tsx
│   ├── SourcesPage.tsx
│   └── SettingsPage.tsx
├── stores/
├── types/
├── App.tsx
└── main.tsx
```

### UX rules

- Show progress states: “Searching learning sources”, “Preparing explanation”, “Checking citations”.
- Show citations directly after claims or in source cards.
- Visually distinguish source-grounded content from generated examples.
- Keep answers readable with headings, short paragraphs, and code blocks where needed.
- Ensure mobile responsiveness.
- Provide keyboard navigation and screen-reader labels.
- Do not reveal API errors, stack traces, model names, or secrets to users.

## 18. Security and Privacy

### Essential production controls

- Validate all API requests with Pydantic.
- Use HTTPS in deployment.
- Keep LLM API keys strictly in Render environment variables.
- Never expose provider API keys in Vercel environment variables that reach the browser.
- Use JWT authentication for accounts and roles.
- Require teacher/admin roles for document upload, review, activation, reindexing, and source management.
- Apply rate limits to anonymous and authenticated chat requests.
- Configure strict CORS to only allow the Vercel frontend domain.
- Use parameterized SQL through SQLAlchemy.
- Validate all uploaded file MIME types and magic bytes.
- Enforce upload limits and safe private storage paths.
- Use password hashing with Argon2 or bcrypt.
- Add security headers: CSP, HSTS, `X-Content-Type-Options`, `X-Frame-Options`, and `Referrer-Policy`.

### Environment variables

```env
APP_ENV=production
API_PREFIX=/api/v1
DATABASE_URL=postgresql+psycopg://user:password@host:5432/education_rag

JWT_SECRET=replace_with_long_random_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ADMIN_API_KEY=replace_with_long_random_secret

LLM_PROVIDER=openai_compatible
LLM_API_KEY=replace_me
LLM_BASE_URL=https://provider.example/v1
LLM_MODEL=configured-model-name
LLM_TEMPERATURE=0.2
LLM_MAX_OUTPUT_TOKENS=900

EMBEDDING_PROVIDER=local_or_managed
EMBEDDING_MODEL=configured-embedding-model
RERANKER_MODEL=configured-reranker-model

ALLOWED_ORIGINS=https://your-app.vercel.app
MAX_UPLOAD_MB=25
MAX_QUERY_LENGTH=1500
RATE_LIMIT_ANONYMOUS_PER_MINUTE=10
RATE_LIMIT_AUTHENTICATED_PER_MINUTE=30

RETRIEVAL_CANDIDATE_K=40
RERANK_TOP_N=30
FINAL_EVIDENCE_K=4
MIN_RETRIEVAL_SCORE=0.45
MIN_GROUNDING_SCORE=0.70

LOG_LEVEL=INFO
```

### Logging policy

Log:

- Request ID.
- Endpoint and response code.
- Latency.
- Intent and subject.
- Retrieval candidate count.
- Citation/validation counts.
- Model provider identifier, model identifier, token usage, and errors.
- Admin document lifecycle events.

Do not log:

- Passwords, JWTs, provider keys, connection strings, or authorization headers.
- Entire private documents unless authorized audit mode is enabled.
- Full prompts by default in production.
- User email addresses in normal application logs.

## 19. Testing

### Unit tests

| Component | Required tests |
|---|---|
| Query normalizer | Whitespace, abbreviations, subject aliases, Unicode |
| Intent classifier | Definitions, quizzes, study plan, comparison, unsupported requests |
| Context resolver | Pronoun resolution and ambiguity handling |
| BM25 retriever | Exact terms, stopwords, empty query, known rankings |
| Vector retriever | Mock vectors, metadata filters, similarity thresholds |
| Hybrid ranker | RRF correctness, authority weighting, tie-breaking |
| Reranker | Candidate cap and stable output |
| Prompt builder | Source delimiters, token budgets, citation instructions |
| LLM gateway | Mock behavior, timeouts, retries, provider failure mapping |
| Schema validator | Invalid JSON, missing fields, extra fields |
| Citation validator | Valid, missing, fabricated, and unused citations |
| Grounding validator | Supported/unsupported sentence checks |
| Academic integrity module | Assessment-completion and cheating routes |
| Ingestion validators | MIME, checksum, path traversal, size limits |
| Chunker | Code blocks, equations, headings, lists, page metadata |

### Integration tests

- Upload -> validate -> extract -> chunk -> embed -> index -> activate.
- Chat -> retrieval -> LLM mock -> citation validation -> response persistence.
- Follow-up question -> session state -> resolved retrieval query.
- Quiz generation -> evidence retrieval -> structured quiz output.
- Inactive/superseded document -> excluded from retrieval.
- Unauthorized admin route -> denied.
- Rate limit exceeded -> `429` response.
- LLM provider unavailable -> graceful `503` response.

### End-to-end flow

```text
1. Start backend, PostgreSQL, and frontend locally.
2. Seed source registry and subjects.
3. Upload approved Python documentation/course note.
4. Ingest and activate document.
5. Ask: “What is recursion?”
6. Verify source-backed answer and citations.
7. Ask: “Give an example.”
8. Verify conversation context resolves to recursion.
9. Generate a recursion quiz.
10. Verify quiz is structured and source-grounded.
11. Attempt unauthorized document upload.
12. Verify access denial.
13. Mark source superseded.
14. Verify it is excluded from retrieval.
```

## 20. Evaluation

### Retrieval dataset

Create `data/evaluation/retrieval_qrels.jsonl`.

```json
{
  "question_id": "networking_001",
  "question": "What is the difference between TCP and UDP?",
  "subject": "computer_science",
  "relevant_chunk_ids": ["tcp_udp_chunk_01", "tcp_udp_chunk_02"],
  "difficulty": "beginner"
}
```

### Retrieval metrics

\[
Recall@K=\frac{\text{questions with relevant evidence in top K}}{\text{all answerable questions}}
\]

\[
Precision@K=\frac{\text{relevant chunks in top K}}{K}
\]

\[
MRR=\frac{1}{N}\sum_{i=1}^{N}\frac{1}{rank_i}
\]

Measure Recall@5, Recall@10, Precision@5, MRR, and nDCG@10.

### Answer evaluation rubric

| Dimension | Evaluation method |
|---|---|
| Factual correctness | Human reviewer compares claims to source evidence |
| Citation correctness | Citation maps to actual supporting chunk |
| Groundedness | Every factual statement is supported by provided sources |
| Clarity | Student reviewers rate explanation readability |
| Completeness | Expected key concepts are included |
| Example quality | Examples are relevant and clearly labeled generated |
| Quiz quality | Questions are answerable from source material |
| Academic integrity | Requests violating course rules are handled appropriately |

### Target metrics

| Metric | Target |
|---|---:|
| Recall@5 | >= 0.85 |
| Recall@10 | >= 0.93 |
| Citation validity | >= 0.98 |
| Human-rated groundedness | >= 0.95 |
| Structured-output schema compliance | >= 0.99 |
| Quiz quality reviewer score | >= 4/5 |
| P95 end-to-end chat latency | < 8 seconds |

## 21. Observability

### Structured log event

```json
{
  "timestamp": "2026-09-09T17:44:00+05:30",
  "level": "INFO",
  "request_id": "req_01JXYZ",
  "event": "chat.completed",
  "user_role": "student",
  "subject": "programming",
  "intent": "explanation",
  "retrieval_candidates": 60,
  "evidence_count": 4,
  "citation_count": 2,
  "grounding_score": 0.88,
  "llm_provider": "configured_provider",
  "model": "configured_model",
  "retrieval_latency_ms": 420,
  "llm_latency_ms": 2200,
  "validation_latency_ms": 180,
  "total_latency_ms": 2900
}
```

### Metrics to track

- Requests by subject and intent.
- Retrieval score distribution.
- Low-evidence and abstention rate.
- Citation validation failures.
- LLM failure, timeout, and retry rate.
- Token usage/cost by endpoint.
- P50/P95 response latency.
- Document ingestion success/failure rate.
- Active document/chunk counts by subject.
- User feedback distribution.

## 22. Deployment

### Deployment architecture

```mermaid
flowchart LR
    USER[Browser] --> VERCEL[Vercel: React Frontend]
    VERCEL --> RENDER_API[Render: FastAPI Backend]
    RENDER_API --> RENDER_DB[Render PostgreSQL + pgvector]
    RENDER_API --> STORE[Persistent Disk or Object Storage]
    RENDER_API --> LLM[LLM Provider API]
```

### Render backend setup

1. Push repository to GitHub.
2. Create a Render Web Service using the `backend/` directory.
3. Set build command:

```bash
pip install -r requirements.txt
```

4. Set start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

5. Create Render PostgreSQL instance.
6. Configure `DATABASE_URL` and all secrets in Render environment variables.
7. Run Alembic migrations during release/deployment.
8. Add persistent storage for document/index artifacts if required by selected retrieval implementation.
9. Configure health check path:

```text
/api/v1/health
```

### Vercel frontend setup

1. Import GitHub repository into Vercel.
2. Set frontend root directory to `frontend/`.
3. Configure build command:

```bash
npm run build
```

4. Configure output directory:

```text
dist
```

5. Set frontend environment variable:

```env
VITE_API_BASE_URL=https://your-render-service.onrender.com/api/v1
```

6. Add the final Vercel domain to Render `ALLOWED_ORIGINS`.
7. Enable automatic deployment on Git push.

Vercel supports simple Git-based React deployment workflows with automatic HTTPS, making it suitable for hosting the static frontend of this project. [web:33]

### Deployment rules

- Do not put `LLM_API_KEY` in the frontend.
- Do not connect the frontend directly to PostgreSQL.
- Do not expose admin APIs without authentication.
- Use separate development, staging, and production environment variables.
- Use managed database backups.
- Set strict CORS to the deployed Vercel domain.
- Use Render health checks and logs for backend monitoring.

## 23. Docker

### Backend `Dockerfile`

```dockerfile
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    APP_HOME=/app

WORKDIR ${APP_HOME}

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

RUN useradd --create-home appuser \
    && mkdir -p /app/data/raw /app/data/processed /app/data/indexes \
    && chown -R appuser:appuser /app

USER appuser

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Root `docker-compose.yml`

```yaml
services:
  backend:
    build:
      context: ./backend
    env_file:
      - .env
    ports:
      - "8000:8000"
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - raw_documents:/app/data/raw
      - processed_documents:/app/data/processed
      - retrieval_indexes:/app/data/indexes
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/v1/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 45s

  db:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_DB: education_rag
      POSTGRES_USER: education_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U education_user -d education_rag"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
  raw_documents:
  processed_documents:
  retrieval_indexes:
```

## 24. Project Structure

```text
educational-rag-chatbot/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── dependencies.py
│   │   │   ├── router.py
│   │   │   └── routes/
│   │   │       ├── auth.py
│   │   │       ├── chat.py
│   │   │       ├── documents.py
│   │   │       ├── feedback.py
│   │   │       ├── health.py
│   │   │       ├── quiz.py
│   │   │       ├── sessions.py
│   │   │       └── sources.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── constants.py
│   │   │   ├── exceptions.py
│   │   │   ├── logging.py
│   │   │   ├── security.py
│   │   │   └── rate_limit.py
│   │   ├── database/
│   │   │   ├── base.py
│   │   │   ├── session.py
│   │   │   └── repositories/
│   │   ├── generation/
│   │   │   ├── llm_gateway.py
│   │   │   ├── prompt_builder.py
│   │   │   ├── response_builder.py
│   │   │   ├── citation_validator.py
│   │   │   ├── grounding_validator.py
│   │   │   └── integrity_validator.py
│   │   ├── ingestion/
│   │   │   ├── cleaner.py
│   │   │   ├── chunker.py
│   │   │   ├── metadata.py
│   │   │   ├── pipeline.py
│   │   │   ├── validators.py
│   │   │   └── parsers/
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── source.py
│   │   │   ├── subject.py
│   │   │   ├── document.py
│   │   │   ├── chunk.py
│   │   │   ├── session.py
│   │   │   ├── query.py
│   │   │   ├── answer.py
│   │   │   ├── citation.py
│   │   │   └── feedback.py
│   │   ├── nlp/
│   │   │   ├── normalizer.py
│   │   │   ├── entities.py
│   │   │   ├── intent.py
│   │   │   ├── terminology.py
│   │   │   └── language.py
│   │   ├── retrieval/
│   │   │   ├── bm25.py
│   │   │   ├── embeddings.py
│   │   │   ├── vector_store.py
│   │   │   ├── hybrid.py
│   │   │   ├── reranker.py
│   │   │   ├── evidence.py
│   │   │   ├── index_manager.py
│   │   │   └── retriever.py
│   │   ├── conversation/
│   │   │   ├── state.py
│   │   │   ├── resolver.py
│   │   │   └── summarizer.py
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── chat.py
│   │   │   ├── documents.py
│   │   │   ├── quiz.py
│   │   │   ├── feedback.py
│   │   │   └── common.py
│   │   ├── services/
│   │   │   ├── chat_service.py
│   │   │   ├── ingestion_service.py
│   │   │   ├── quiz_service.py
│   │   │   ├── session_service.py
│   │   │   └── evaluation_service.py
│   │   └── main.py
│   ├── alembic/
│   ├── tests/
│   │   ├── unit/
│   │   ├── integration/
│   │   ├── e2e/
│   │   └── fixtures/
│   ├── requirements.txt
│   ├── Dockerfile
│   └── alembic.ini
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── features/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── stores/
│   │   ├── styles/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   └── vercel.json
├── configs/
│   ├── education_terms.yaml
│   ├── source_registry.yaml
│   ├── retrieval.yaml
│   └── prompts/
│       ├── system_v1.txt
│       ├── quiz_v1.txt
│       └── integrity_v1.txt
├── data/
│   ├── raw/
│   ├── processed/
│   ├── indexes/
│   ├── evaluation/
│   └── models/
├── scripts/
│   ├── seed_sources.py
│   ├── ingest_directory.py
│   ├── rebuild_indexes.py
│   ├── evaluate_retrieval.py
│   ├── evaluate_answers.py
│   └── smoke_test.py
├── docs/
│   ├── architecture.md
│   ├── data_source_policy.md
│   ├── evaluation_protocol.md
│   ├── deployment.md
│   └── admin_runbook.md
├── docker-compose.yml
├── .env.example
├── README.md
└── LICENSE
```

## 25. File-by-File Implementation Plan

| File | Purpose | Primary classes/functions |
|---|---|---|
| `backend/app/main.py` | App factory, middleware, router setup | `create_app`, lifespan |
| `backend/app/core/config.py` | Environment settings | `Settings` |
| `backend/app/core/security.py` | JWT, roles, headers, file security | `require_role`, `hash_password` |
| `backend/app/api/routes/chat.py` | Chat endpoint | `post_chat` |
| `backend/app/services/chat_service.py` | End-to-end RAG orchestration | `ChatService.answer` |
| `backend/app/nlp/normalizer.py` | Clean and normalize queries | `normalize_query` |
| `backend/app/nlp/intent.py` | Detect user learning intent | `IntentClassifier` |
| `backend/app/conversation/resolver.py` | Resolve follow-up references | `resolve_reference` |
| `backend/app/retrieval/bm25.py` | Lexical retrieval | `BM25Retriever` |
| `backend/app/retrieval/embeddings.py` | Embedding provider abstraction | `EmbeddingClient` |
| `backend/app/retrieval/vector_store.py` | pgvector/FAISS operations | `VectorStore` |
| `backend/app/retrieval/hybrid.py` | RRF and scoring | `HybridRanker` |
| `backend/app/retrieval/reranker.py` | Candidate reranking | `Reranker` |
| `backend/app/retrieval/evidence.py` | Select evidence chunks | `EvidenceSelector` |
| `backend/app/generation/llm_gateway.py` | Provider adapters | `LLMClient`, adapters |
| `backend/app/generation/prompt_builder.py` | Build RAG prompts | `PromptBuilder` |
| `backend/app/generation/citation_validator.py` | Validate source markers | `CitationValidator` |
| `backend/app/generation/grounding_validator.py` | Verify claims against evidence | `GroundingValidator` |
| `backend/app/generation/integrity_validator.py` | Academic integrity checks | `IntegrityValidator` |
| `backend/app/ingestion/parsers/pdf_parser.py` | PDF text extraction | `PDFParser` |
| `backend/app/ingestion/chunker.py` | Section-aware chunk creation | `EducationalChunker` |
| `backend/app/ingestion/pipeline.py` | Ingestion orchestration | `IngestionPipeline.run` |
| `backend/app/models/document.py` | Document database model | `Document` |
| `backend/app/models/chunk.py` | Chunk database model | `DocumentChunk` |
| `backend/app/api/routes/documents.py` | Admin ingestion endpoints | `upload_document`, `ingest_document` |
| `backend/app/api/routes/quiz.py` | Quiz and flashcard endpoints | `generate_quiz`, `generate_flashcards` |
| `frontend/src/pages/ChatPage.tsx` | Main learning interface | `ChatPage` |
| `frontend/src/components/chat/MessageBubble.tsx` | Answer rendering | `MessageBubble` |
| `frontend/src/components/chat/SourceDrawer.tsx` | Citation/source display | `SourceDrawer` |
| `frontend/src/components/learning/QuizCard.tsx` | Practice quiz UI | `QuizCard` |
| `frontend/src/pages/AdminPage.tsx` | Admin document controls | `AdminPage` |
| `scripts/evaluate_retrieval.py` | Retrieval metrics | `evaluate_retrieval` |
| `scripts/evaluate_answers.py` | Grounding/citation evaluation | `evaluate_answers` |

## 26. Development Phases

### Phase 1 — Repository foundation

**Objective:** Initialize backend, frontend, Docker, environment configuration, linting, and base test suites.

**Files:**

```text
backend/app/main.py
backend/app/core/config.py
frontend/src/App.tsx
docker-compose.yml
.env.example
README.md
```

**Completion criteria:** Frontend and `/api/v1/health` run locally.

### Phase 2 — Database and authentication

**Objective:** Create schema, migrations, user roles, source registry, subjects, and JWT authentication.

**Files:**

```text
backend/app/models/
backend/app/database/
backend/app/api/routes/auth.py
backend/alembic/
configs/source_registry.yaml
```

**Completion criteria:** Users can register/login; admin routes enforce roles.

### Phase 3 — Secure document ingestion

**Objective:** Implement upload validation, extraction, metadata capture, document lifecycle, and review process.

**Files:**

```text
backend/app/ingestion/
backend/app/api/routes/documents.py
backend/app/services/ingestion_service.py
```

**Completion criteria:** Approved documents can be uploaded, previewed, chunked, and activated.

### Phase 4 — Retrieval baseline

**Objective:** Implement BM25, embeddings, pgvector, metadata filtering, RRF, and evidence selection.

**Files:**

```text
backend/app/retrieval/
configs/retrieval.yaml
scripts/rebuild_indexes.py
```

**Completion criteria:** Gold questions retrieve expected content with measurable Recall@K.

### Phase 5 — LLM integration

**Objective:** Add provider gateway, prompt templates, structured outputs, timeout/retry behavior, and mock tests.

**Files:**

```text
backend/app/generation/llm_gateway.py
backend/app/generation/prompt_builder.py
configs/prompts/system_v1.txt
```

**Completion criteria:** LLM responses validate against structured schema.

### Phase 6 — Grounding and citations

**Objective:** Add citation parsing, source validation, answer-evidence checks, and abstention behavior.

**Files:**

```text
backend/app/generation/citation_validator.py
backend/app/generation/grounding_validator.py
backend/app/generation/response_builder.py
```

**Completion criteria:** Answers without valid citations are rejected or regenerated once.

### Phase 7 — Conversation and study tools

**Objective:** Add session state, follow-up resolution, quiz generation, flashcards, examples, and study-plan outputs.

**Files:**

```text
backend/app/conversation/
backend/app/api/routes/quiz.py
backend/app/services/quiz_service.py
```

**Completion criteria:** Follow-up question and quiz workflows work with citations.

### Phase 8 — Frontend experience

**Objective:** Build a polished responsive learning UI with citations, sources, subject selection, feedback, and admin interfaces.

**Files:**

```text
frontend/src/pages/
frontend/src/components/
frontend/src/features/
```

**Completion criteria:** User can chat, inspect sources, create quizzes, and manage documents based on role.

### Phase 9 — Testing and evaluation

**Objective:** Build unit/integration/E2E tests and retrieval/answer benchmarks.

**Files:**

```text
backend/tests/
data/evaluation/
scripts/evaluate_retrieval.py
scripts/evaluate_answers.py
```

**Completion criteria:** Evaluation report records retrieval, grounding, citation, latency, and feedback metrics.

### Phase 10 — Render and Vercel deployment

**Objective:** Deploy frontend to Vercel and backend/database to Render with secure environment configuration.

**Files:**

```text
backend/Dockerfile
frontend/vercel.json
docs/deployment.md
.env.example
```

**Completion criteria:** Public production URL works with HTTPS, strict CORS, health checks, and protected admin APIs.

## 27. Coding Agent Implementation Rules

# CODING AGENT IMPLEMENTATION RULES

1. Build the project as a source-grounded educational RAG system.
2. Keep LLM provider calls isolated inside `app/generation/llm_gateway.py`.
3. Never expose LLM API keys, database URLs, JWT secrets, or admin keys to the React frontend.
4. Every source-grounded factual claim must have a valid citation marker tied to retrieved evidence.
5. Never fabricate citations, source titles, authors, pages, URLs, facts, or quotations.
6. Validate structured LLM output with Pydantic before returning it to users.
7. Validate citation markers and answer-to-evidence support after generation.
8. If retrieval or grounding is insufficient, return the approved insufficient-evidence response.
9. Clearly label generated examples, analogies, quizzes, flashcards, and study plans as learning aids.
10. Do not use unauthorized copyrighted documents or scrape restricted sources.
11. Implement source license metadata and admin approval before activation.
12. Keep source document versioning and supersession support.
13. Use FastAPI, Pydantic, SQLAlchemy, PostgreSQL, BM25, and vector search as defined in this blueprint.
14. Do not add unnecessary agent frameworks, orchestration frameworks, microservices, or vector databases.
15. Use pgvector as the hosted vector-store default; allow FAISS only as a local/offline option.
16. Add input validation, authentication/authorization, rate limits, CORS allowlists, safe uploads, and structured logs.
17. Use parameterized database access only.
18. Add tests for every major module and regression tests for every bug fixed.
19. Keep API contracts versioned under `/api/v1`.
20. Preserve clean separation among API routes, services, retrieval, generation, ingestion, persistence, and frontend.
21. Avoid storing unnecessary personal data.
22. Do not log secrets, authentication headers, or full production prompts by default.
23. Fail safely when the LLM provider, index, document parser, citation validator, or database is unavailable.
24. Document material design changes in `docs/architecture.md`.
25. Do not rewrite working modules without a clearly documented reason and passing regression suite.

## 28. Performance Targets

| Area | Target |
|---|---|
| Initial corpus | 30–50 documents, 500–1,500 chunks |
| BM25 + vector retrieval | < 800 ms P95 |
| Reranking top 30 chunks | < 1,500 ms P95 |
| LLM generation | < 6 seconds P95, provider dependent |
| Validation | < 1 second P95 |
| Total chat latency | < 8 seconds P95 |
| Typical document ingestion | < 60 seconds including embeddings |
| API memory | 1–2 GB recommended |
| Frontend initial load | < 2.5 seconds on normal network |

### Optimizations

- Keep indexes and embedding model clients warm.
- Generate embeddings in batches during ingestion.
- Limit retrieval candidates and final prompt chunks.
- Use RRF instead of expensive broad reranking.
- Cache source registry and metadata filters.
- Add short-TTL caching for identical anonymous queries only if privacy policy permits.
- Use background jobs for bulk ingestion/reindexing.
- Measure token usage and cap output size.
- Do not build distributed infrastructure for the initial corpus size.

## 29. Future Improvements

- Add Hindi and Marathi support using separately evaluated source collections.
- Add teacher classrooms, shared resource libraries, and teacher-curated learning paths.
- Add citation-aware note taking and Markdown/PDF export.
- Add spaced-repetition scheduling for flashcards.
- Add user progress tracking with explicit consent.
- Add offline/local embeddings for privacy-oriented deployment.
- Add more subjects such as electronics, mechanical engineering, economics, biology, and law basics.
- Add document OCR for scanned notes in an isolated worker.
- Add source-review workflows with teacher approval and stale-source alerts.
- Add learning analytics dashboards that aggregate without exposing individual private content.

## 30. Final Acceptance Criteria

### Functional

- Students can ask questions and receive clear answers with visible citations.
- The system supports definitions, explanations, examples, comparisons, quizzes, flashcards, and follow-up questions.
- Admins/teachers can upload, review, activate, deactivate, supersede, and reindex documents.
- The source explorer shows title, authority, author/publisher, URL, license, date, section/page, and evidence excerpt.

### RAG quality

- BM25, vector retrieval, hybrid fusion, reranking, and evidence selection are implemented.
- The LLM receives only selected evidence and controlled instructions.
- Every factual answer claim has a valid citation.
- Citation and grounding validators run before response display.
- Unsupported questions result in a transparent evidence-insufficient response.

### Security

- LLM/API/database secrets stay backend-only.
- Admin endpoints require authentication and roles.
- File uploads enforce type, size, MIME, checksum, and path rules.
- CORS permits only configured frontend domains.
- Rate limiting, secure headers, parameterized SQL, and structured logs are active.

### Deployment

- React frontend deploys successfully to Vercel.
- FastAPI backend deploys successfully to Render.
- PostgreSQL with pgvector is configured and persistent.
- Health checks pass.
- Environment variables are documented.
- Production frontend can securely call the Render backend.

### Testing and evaluation

- Unit, integration, and end-to-end test suites pass.
- Retrieval evaluation produces Recall@K, Precision@K, MRR, and nDCG metrics.
- Citation correctness and grounding are measured.
- LLM output schema compliance reaches target levels.
- A documented evaluation report and known-limitations list are included.
