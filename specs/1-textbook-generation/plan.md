# Implementation Plan: AI-Native Textbook with RAG Chatbot

**Branch**: `1-textbook-generation` | **Date**: 2025-12-06 | **Spec**: [specs/1-textbook-generation/spec.md](./spec.md)  
**Input**: Feature specification from `/specs/1-textbook-generation/spec.md`

## Summary

Build a clean, AI-native textbook (6 chapters on Physical AI & Humanoid Robotics) with integrated free-tier RAG chatbot. Docusaurus provides responsive reading experience; FastAPI backend handles RAG queries via Qdrant vector DB + Neon PostgreSQL. Lightweight embeddings (MiniLM) + serverless deployment (GitHub Pages + Vercel/Railway) keep costs at zero. Chatbot answers are source-attributed and textbook-exclusive; out-of-scope queries rejected gracefully. Optional: Multi-language (Urdu) support.

## Technical Context

**Language/Version**: 
- Frontend: TypeScript, React 18+, Node.js 18+
- Backend: Python 3.11+, FastAPI 0.104+

**Primary Dependencies**:
- Frontend: Docusaurus 3.x, TailwindCSS, axios
- Backend: FastAPI, Pydantic, SQLAlchemy, sentence-transformers (MiniLM), qdrant-client, asyncpg

**Storage**:
- Vector: Qdrant (local Docker or free-tier cloud)
- Relational: Neon PostgreSQL (free tier)
- Static: GitHub Pages + GitHub Actions

**Testing**:
- Frontend: Jest, React Testing Library
- Backend: pytest, pytest-asyncio
- Integration: API contract tests (Pydantic schemas)

**Target Platform**: Web (responsive design), serverless backend

**Project Type**: Monorepo with frontend (Docusaurus) + backend (FastAPI) + shared contracts

**Performance Goals**:
- Docusaurus build: < 60 seconds
- Chatbot query response: p95 < 2 seconds, p99 < 3 seconds
- Embedding generation: < 500ms per chunk (first-time)
- Page load: < 2 seconds (from cache)

**Constraints**:
- Free-tier only (no paid services)
- CPU-only inference (no GPU)
- Total storage < 1GB (embeddings + metadata + DB)
- Cold start acceptable (serverless)
- No authentication (public textbook)

**Scale/Scope**:
- 6 chapters (~50-100 sections total)
- ~100k tokens of content (estimated)
- Initial MVP: 1,000 concurrent users
- Phase 2: Multi-language (Urdu)

## Constitution Check

### Gate 1: Simplicity Over Completeness ✅ PASS
- Design uses minimal frameworks: Docusaurus (UI), FastAPI (API), MiniLM (embeddings), Qdrant (vector DB)
- No complex auth, user management, or feature flag infrastructure
- Clear separation of concerns: static textbook vs. dynamic chatbot
- Single theme/branding (no custom theming)
- **Rationale**: Each component chosen for its simplicity and directness. No premature optimization.

### Gate 2: Accuracy & Source-of-Truth Alignment ✅ PASS
- Chatbot retrieves only from Qdrant (which indexes textbook chunks exclusively)
- Every response includes source attribution (chapter + section)
- Out-of-scope queries return explicit "not covered" message
- No external knowledge integration
- **Rationale**: RAG system architecturally bound to textbook; no synthesis allowed.

### Gate 3: Free-Tier Architecture ✅ PASS
- Embeddings: sentence-transformers MiniLM (local ONNX, CPU-only)
- Vector DB: Qdrant (self-hosted Docker or free tier)
- DB: Neon PostgreSQL (free tier: 3GB storage, sufficient for metadata)
- Backend: FastAPI on Vercel (free tier: 100GB invocations/month)
- Frontend: GitHub Pages (static, free)
- No GPU, no paid services
- **Rationale**: Entire stack operates within free tier limits with low overhead.

### Gate 4: Test-First & Quality Gates ✅ PASS
- Unit tests for all chatbot retrieval logic, embedding generation, query parsing
- Integration tests for end-to-end RAG pipeline (query → embedding → retrieval → response)
- Type safety: Python type hints (Pydantic), TypeScript strict mode
- Linting: Black + Pylint (backend), ESLint (frontend)
- Build must pass before merge (GitHub Actions)
- **Rationale**: TDD enforced from start; no code lands without tests.

### Gate 5: Minimal, Documented API Contracts ✅ PASS
- Chatbot API: `/api/v1/chat` with explicit schema (Pydantic)
- Embedding API: `/api/v1/embeddings` (internal)
- Retrieval API: `/api/v1/retrieve` (internal)
- All endpoints versioned; request/response schemas documented in OpenAPI
- **Rationale**: Every API explicitly documented; versioning built-in.

### Gate 6: Observability & Debuggability ✅ PASS
- Structured JSON logging: timestamp, level, service, request_id, message, context
- Metrics: query latency, embedding time, retrieval accuracy, error rate
- Logs queryable via text search (stdout) + exportable to external logging service (future)
- **Rationale**: Full observability for debugging and monitoring.

### Gate 7: Git-Driven Workflow ✅ PASS
- Feature branch: `1-textbook-generation`
- All PRs require review + passing tests
- Commit messages atomic and descriptive
- Rebase + squash for clean history
- **Rationale**: Immutable, auditable history.

## Project Structure

### Documentation (this feature)

```text
specs/1-textbook-generation/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (/sp.plan output)
├── research.md          # Phase 0 research findings
├── data-model.md        # Phase 1: Entity relationships, schema
├── quickstart.md        # Phase 1: Setup & local dev guide
├── contracts/           # Phase 1: API contracts
│   ├── chatbot-api.openapi.yaml
│   ├── retrieval-api.openapi.yaml
│   └── embedding-api.openapi.yaml
├── checklists/
│   └── requirements.md   # Quality validation checklist (completed)
└── tasks.md             # Phase 2 output (/sp.tasks - NOT created here)
```

### Source Code (repository root)

```text
# Frontend (Docusaurus textbook)
docs/
├── intro.md
├── chapter-1-intro-physical-ai/
│   ├── _category_.json
│   ├── section-1-1.md
│   ├── section-1-2.md
│   └── ...
├── chapter-2-humanoid-robotics/
├── chapter-3-ros2-fundamentals/
├── chapter-4-digital-twin-simulation/
├── chapter-5-vision-language-action/
└── chapter-6-capstone/

src/
├── components/
│   ├── ChatbotWidget/
│   │   ├── ChatbotWidget.tsx
│   │   ├── ChatbotWidget.module.css
│   │   └── ChatbotWidget.test.tsx
│   ├── TextSelection/
│   │   ├── TextSelection.tsx
│   │   └── TextSelection.test.tsx
│   └── LanguageToggle/
│       ├── LanguageToggle.tsx
│       └── LanguageToggle.test.tsx
├── pages/
│   └── index.tsx
└── services/
    └── chatbot-client.ts

tests/
├── components/
├── integration/
└── e2e/

# Backend (FastAPI server)
backend/
├── src/
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Config (env vars, settings)
│   ├── models/
│   │   ├── query.py         # Query, Response Pydantic models
│   │   ├── chunk.py         # DocumentChunk model
│   │   └── embedding.py     # Embedding model
│   ├── services/
│   │   ├── chatbot.py       # Chatbot orchestration
│   │   ├── retrieval.py     # RAG retrieval logic
│   │   ├── embedding.py     # Embedding generation (MiniLM)
│   │   ├── qdrant.py        # Qdrant client wrapper
│   │   └── logger.py        # Structured logging
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── chat.py      # POST /api/v1/chat endpoint
│   │       ├── embeddings.py # POST /api/v1/embeddings endpoint
│   │       └── health.py    # GET /api/v1/health
│   ├── db/
│   │   ├── models.py        # SQLAlchemy models
│   │   └── connection.py    # Neon PostgreSQL pool
│   └── scripts/
│       ├── embed_chapters.py # Batch embedding script
│       └── seed_db.py       # Seed DB with chapter metadata

tests/
├── unit/
│   ├── test_embedding.py
│   ├── test_retrieval.py
│   └── test_chatbot.py
├── integration/
│   └── test_rag_pipeline.py
└── contract/
    └── test_api_schemas.py

requirements.txt
pytest.ini
```

**Structure Decision**: Monorepo with frontend (Docusaurus + React components) and backend (FastAPI) as separate concern domains. Frontend handles UI and static content; backend handles RAG logic. Shared contracts (OpenAPI) define interface. Separation allows independent scaling and deployment (GitHub Pages for frontend, Vercel for backend).

## Data Model

*See detailed schema in `data-model.md` (Phase 1 output)*

### Core Entities

1. **Chapter**
   - Fields: id (UUID), title (str), slug (str), order (int), language (str: "en" | "ur"), content (text), metadata (JSON)
   - Relationships: 1 → Many Sections

2. **Section**
   - Fields: id (UUID), chapter_id (FK), title (str), order (int), content (text)
   - Relationships: Many → 1 Chapter, 1 → Many DocumentChunks

3. **DocumentChunk**
   - Fields: id (UUID), section_id (FK), text (str), sequence (int), token_count (int)
   - Relationships: 1 → 1 Embedding, Many → Many Queries (retrievals)

4. **Embedding**
   - Fields: chunk_id (FK), vector (float32[1024]), model (str: "minilm"), generated_at (timestamp)
   - Relationships: 1 ← 1 DocumentChunk

5. **Query**
   - Fields: id (UUID), text (str), user_lang (str), timestamp (datetime), source (str: "select-text" | "direct")
   - Relationships: 1 → 1 Response

6. **Response**
   - Fields: id (UUID), query_id (FK), answer (text), source_chunks (UUID[]), latency_ms (int), timestamp (datetime)
   - Relationships: 1 ← 1 Query, Many → DocumentChunks

7. **ErrorLog**
   - Fields: id (UUID), timestamp (datetime), error_type (str), message (text), context (JSON)
   - Relationships: None (audit log)

## API Contracts

*See detailed OpenAPI specs in `/contracts/` (Phase 1 output)*

### REST Endpoints

**Chat Endpoint**
```
POST /api/v1/chat
Request: { "query": str, "language": "en" | "ur" }
Response: { "answer": str, "sources": [{ "chapter": str, "section": str, "text": str }], "latency_ms": int }
Error: { "error": str, "details": str } (4xx/5xx)
```

**Health Endpoint**
```
GET /api/v1/health
Response: { "status": "ok" | "degraded", "qdrant": bool, "neon": bool, "timestamp": datetime }
```

**Embedding Endpoint** (internal)
```
POST /api/v1/embeddings (authenticated)
Request: { "text": str, "model": "minilm" }
Response: { "vector": float32[1024], "model": "minilm", "dimension": 1024 }
```

### Error Handling

| Status | Scenario | Response |
|--------|----------|----------|
| 200 | Query answered from textbook | Normal response with sources |
| 204 | Query successful but no results | Empty response with "Not covered in textbook" message |
| 400 | Invalid query format | `{ "error": "invalid_query", "details": "..." }` |
| 503 | Qdrant/Neon unavailable | `{ "error": "service_unavailable", "details": "..." }` |
| 500 | Unexpected error | `{ "error": "internal_error", "details": "..." }` |

## Workflow: Query to Response

```
1. User selects text or types query in chatbot widget
2. Frontend: POST /api/v1/chat { "query": "...", "language": "en" }
3. Backend: Parse query, generate embedding via MiniLM (local ONNX)
4. Backend: Search Qdrant for top-K similar chunks (cosine similarity)
5. Backend: Retrieve full chunk text + chapter/section metadata from Neon
6. Backend: Aggregate retrieved chunks into answer (if K > 0)
7. Backend: Log query, latency, source chunks to Neon
8. Backend: Return response with sources + latency
9. Frontend: Display answer + sources (e.g., "Chapter 2, Section 3.1")
10. User: Reads answer, selects next text or new query (loop)
```

## Deployment Architecture

### Frontend Deployment

- Build: `yarn build` → static HTML/CSS/JS
- Host: GitHub Pages (`gh-pages` branch auto-deployed on main merge)
- CDN: GitHub's CDN (free)
- Domain: User's repo URL (e.g., `user.github.io/book-website`)

### Backend Deployment

- Build: Docker container with FastAPI + MiniLM + qdrant-client
- Host: Vercel (Python runtime, free tier) OR Railway (free credits) OR Hugging Face Spaces
- Environment: `NEON_DATABASE_URL`, `QDRANT_URL`, `LOG_LEVEL`
- Health check: `GET /api/v1/health` polled every 60s
- Graceful degradation: If Qdrant down, return 503; if Neon down, log errors but respond to queries from cache

### Data Pipeline

1. **Initialization** (one-time per deployment):
   - Load markdown chapters from `docs/` directory
   - Parse chapters into sections and chunks
   - Generate embeddings for each chunk via MiniLM (CPU, ~100ms per chunk for 6 chapters)
   - Store chunks in Neon (metadata) + Qdrant (vectors)
   - Total: ~5-10 minutes on first deploy

2. **Runtime**:
   - Query comes in → real-time embedding + retrieval
   - No background jobs needed
   - Logs accumulated in Neon (queryable later)

### Free-Tier Considerations

- **Neon**: 3GB storage free (metadata for ~6 chapters + logs is < 100MB)
- **Qdrant**: Docker container (self-hosted) OR Qdrant Cloud free tier (1GB vector storage)
- **Vercel**: 100GB invocations/month (each query ~0.001GB) = ~100M queries/month
- **GitHub Pages**: Unlimited (static files)

## Phase 1 Outputs (Deliverables)

1. **research.md** — Resolved all unknowns (embedding deployment, retry logic, etc.)
2. **data-model.md** — Detailed entity schema, field types, validation rules, relationships
3. **contracts/** — OpenAPI specs for all endpoints (chatbot, health, embedding)
4. **quickstart.md** — Local dev setup, environment variables, running tests
5. **Agent context updated** — Technology stack registered for future phases

## Next Steps

→ **Phase 2** (`/sp.tasks`): Break down feature into atomic, testable tasks (one per PR):
  - Task 1: Setup Docusaurus + basic chapter structure
  - Task 2: Implement chatbot widget + frontend client
  - Task 3: Setup FastAPI backend + Neon connection
  - Task 4: Implement embedding generation (MiniLM)
  - Task 5: Implement Qdrant integration + retrieval logic
  - Task 6: Implement chat endpoint + orchestration
  - Task 7: Add structured logging + observability
  - Task 8: Write integration tests
  - Task 9: Setup CI/CD + GitHub Actions
  - Task 10: Deploy to GitHub Pages + Vercel
  - Task 11 (P2): Add Urdu translation support
