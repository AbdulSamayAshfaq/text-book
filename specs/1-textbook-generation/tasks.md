# Implementation Tasks: AI-Native Textbook with RAG Chatbot

**Feature**: `1-textbook-generation` | **Date**: 2025-12-06 | **Phase**: Tasks (Phase 2)  
**Status**: Ready for implementation | **Input**: specs/1-textbook-generation/plan.md

## Task Phases & Execution Flow

```
Phase 1: SETUP (sequential)
  ├─ T-001: Initialize project structure
  ├─ T-002: Setup dependencies (frontend)
  └─ T-003: Setup dependencies (backend)

Phase 2: DATA & CONTRACTS (parallel [P])
  ├─ [P] T-010: Implement data models (Pydantic + SQLAlchemy)
  ├─ [P] T-011: Create database migrations (Alembic)
  └─ [P] T-012: Document entity relationships

Phase 3: CORE COMPONENTS (parallel [P])
  ├─ [P] T-020: Build chatbot widget (React component)
  ├─ [P] T-021: Implement embedding service (MiniLM)
  ├─ [P] T-022: Implement retrieval service (Qdrant)
  └─ [P] T-023: Build FastAPI app structure

Phase 4: API & INTEGRATION (sequential)
  ├─ T-030: Implement /api/v1/chat endpoint
  ├─ T-031: Implement /api/v1/health endpoint
  ├─ T-032: Connect Qdrant client
  └─ T-033: Connect Neon PostgreSQL

Phase 5: TESTING (parallel [P])
  ├─ [P] T-040: Unit tests (embedding, retrieval)
  ├─ [P] T-041: Unit tests (chatbot orchestration)
  ├─ [P] T-042: Integration tests (RAG pipeline)
  └─ [P] T-043: Contract tests (API schemas)

Phase 6: OBSERVABILITY & DEPLOYMENT (sequential)
  ├─ T-050: Implement structured logging
  ├─ T-051: Setup CI/CD pipeline (GitHub Actions)
  ├─ T-052: Configure deployment (GitHub Pages + Vercel)
  └─ T-053: Performance & load testing

Phase 7: POLISH (parallel [P])
  ├─ [P] T-060: Documentation & API docs
  ├─ [P] T-061: Error handling & edge cases
  └─ [P] T-062: Code quality (linting, type checking)

Phase 8: VALIDATION & LAUNCH (sequential)
  ├─ T-070: Full end-to-end testing
  ├─ T-071: Production deployment
  └─ T-072: Monitor & collect feedback
```

---

## Detailed Task Breakdown

### Phase 1: SETUP

#### T-001: Initialize Project Structure ✅ READY

**Purpose**: Create directory structure, configuration files, and git setup

**Files to Create/Modify**:
```
backend/
├── src/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── models/
│   ├── services/
│   ├── api/
│   ├── db/
│   └── scripts/
├── tests/
├── requirements.txt
├── .env.example
├── Dockerfile
└── pyproject.toml

docs/
├── chapter-1-intro-physical-ai/
│   ├── _category_.json
│   └── index.md (stub)
├── chapter-2-humanoid-robotics/
│   ├── _category_.json
│   └── index.md (stub)
[... 4 more chapters ...]

.gitignore (verify/create)
.dockerignore (create)
```

**Acceptance Criteria**:
- [ ] Directory structure created
- [ ] .gitignore exists (includes `__pycache__/`, `*.pyc`, `.venv/`, `.env`, `node_modules/`, `build/`, `dist/`)
- [ ] .dockerignore created (includes `node_modules/`, `.git/`, `__pycache__/`, `.venv/`, `*.log`)
- [ ] All stub files created
- [ ] No errors on `git status`

**Files Modified**: 0 (new files only)

---

#### T-002: Setup Frontend Dependencies ✅ READY

**Purpose**: Initialize Docusaurus + React dependencies

**Command**:
```bash
cd book-website
yarn install
```

**Files to Create/Modify**:
- `book-website/package.json` (verify Docusaurus 3.x, React 18+)
- `book-website/node_modules/` (generated)
- `book-website/yarn.lock` (generated)

**Acceptance Criteria**:
- [ ] `yarn install` succeeds without errors
- [ ] Docusaurus version >= 3.0
- [ ] React version >= 18.0
- [ ] `yarn start` command available
- [ ] No peer dependency warnings

**Files Modified**: 1 (package.json verify)

---

#### T-003: Setup Backend Dependencies ✅ READY

**Purpose**: Create virtual environment + install Python packages

**Commands**:
```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

**Files to Create/Modify**:
- `backend/requirements.txt` (create with dependencies)
- `backend/venv/` (generated)

**requirements.txt Contents**:
```
fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
sqlalchemy==2.0.23
asyncpg==0.29.0
alembic==1.13.0
qdrant-client==2.7.0
sentence-transformers==2.2.2
python-multipart==0.0.6
python-dotenv==1.0.0
structlog==23.2.0
pytest==7.4.3
pytest-asyncio==0.21.1
httpx==0.25.2
```

**Acceptance Criteria**:
- [ ] Virtual environment created
- [ ] `pip install -r requirements.txt` succeeds
- [ ] `python -c "import fastapi; print(fastapi.__version__)"` works
- [ ] `python -c "import sentence_transformers; print('OK')"` works
- [ ] No unresolved dependencies

**Files Modified**: 1 (requirements.txt create)

---

### Phase 2: DATA & CONTRACTS

#### T-010: Implement Data Models (Pydantic + SQLAlchemy) [P]

**Purpose**: Define ORM models + API request/response schemas

**Files to Create/Modify**:
- `backend/src/models/__init__.py`
- `backend/src/models/chapter.py` — SQLAlchemy Chapter model
- `backend/src/models/section.py` — SQLAlchemy Section model
- `backend/src/models/chunk.py` — SQLAlchemy DocumentChunk model
- `backend/src/models/embedding.py` — SQLAlchemy Embedding model
- `backend/src/models/query.py` — Pydantic + SQLAlchemy models
- `backend/src/models/response.py` — Pydantic + SQLAlchemy models
- `backend/src/models/session.py` — UserSession model
- `backend/src/models/error_log.py` — ErrorLog model

**Acceptance Criteria**:
- [ ] All 8 entity models created with full field definitions
- [ ] SQLAlchemy models include `__tablename__`, relationships, constraints
- [ ] Pydantic models include validation rules + examples
- [ ] All models pass type checking (`mypy`)
- [ ] No duplicate field names across entities
- [ ] Relationships correctly defined (ForeignKeys, backrefs)

**Dependencies**: None (can run parallel)

**Estimated Time**: 3-4 hours

---

#### T-011: Create Database Migrations [P]

**Purpose**: Set up Alembic + create initial schema

**Files to Create/Modify**:
- `backend/alembic.ini` (Alembic config)
- `backend/alembic/env.py` (migration environment)
- `backend/alembic/versions/001_initial_schema.py` (initial migration)

**Commands**:
```bash
cd backend
alembic init alembic
alembic revision --autogenerate -m "Initial schema"
```

**Acceptance Criteria**:
- [ ] `alembic init` succeeds
- [ ] `alembic current` shows current revision
- [ ] Migration file contains all 8 tables
- [ ] Migration includes all indexes + constraints
- [ ] `alembic upgrade head` runs without errors (in test DB)
- [ ] Schema matches data-model.md

**Dependencies**: T-010 (data models)

**Estimated Time**: 2-3 hours

---

#### T-012: Document Entity Relationships [P]

**Purpose**: Create ER diagram + relationship documentation

**Files to Create/Modify**:
- `specs/1-textbook-generation/ER-diagram.md` (ASCII diagram + SQL references)

**Acceptance Criteria**:
- [ ] ER diagram shows all 8 entities
- [ ] Relationships correctly labeled (1:1, 1:N, N:N)
- [ ] Foreign keys documented
- [ ] Cardinality shown
- [ ] Matches data-model.md exactly

**Dependencies**: T-010 (data models)

**Estimated Time**: 1-2 hours

---

### Phase 3: CORE COMPONENTS

#### T-020: Build Chatbot Widget (React Component) [P]

**Purpose**: Implement frontend chatbot UI component

**Files to Create/Modify**:
- `src/components/ChatbotWidget/ChatbotWidget.tsx` — Main widget component
- `src/components/ChatbotWidget/ChatbotWidget.module.css` — Styling
- `src/components/ChatbotWidget/ChatbotWidget.test.tsx` — Unit tests
- `src/services/chatbot-client.ts` — API client

**Component Features**:
- Toggle button (floating corner)
- Message history display
- Input field with send button
- Source attribution display
- Loading indicator
- Error handling

**Acceptance Criteria**:
- [ ] Component renders without errors
- [ ] Toggle button works (open/close)
- [ ] Message input + send works
- [ ] API calls use correct endpoint (`/api/v1/chat`)
- [ ] Sources displayed with chapter + section
- [ ] Loading state shows spinner
- [ ] Error state displays user-friendly message
- [ ] Responsive on mobile + desktop
- [ ] Accessibility: ARIA labels, keyboard navigation

**Estimated Time**: 6-8 hours

---

#### T-021: Implement Embedding Service (MiniLM) [P]

**Purpose**: Setup sentence-transformers + embedding generation

**Files to Create/Modify**:
- `backend/src/services/embedding.py` — Embedding service
- `backend/src/scripts/embed_chapters.py` — Batch embedding script

**Acceptance Criteria**:
- [ ] MiniLM model loads successfully (first time downloads ~50MB)
- [ ] `embed_text(text: str) -> ndarray` works
- [ ] Returns 1024-dim vector for any input
- [ ] Batch processing: `embed_chunks(chunks: List[str]) -> List[ndarray]`
- [ ] ~100ms per chunk on CPU
- [ ] Error handling for empty strings, very long text
- [ ] No GPU required (CPU-only)

**Estimated Time**: 2-3 hours

---

#### T-022: Implement Retrieval Service (Qdrant) [P]

**Purpose**: Setup Qdrant client + search logic

**Files to Create/Modify**:
- `backend/src/services/qdrant.py` — Qdrant client wrapper
- `backend/src/services/retrieval.py` — Retrieval logic

**Acceptance Criteria**:
- [ ] Qdrant client connects (local Docker or cloud)
- [ ] Collection `textbook_chunks` created with cosine similarity
- [ ] `search(vector: ndarray, top_k=3) -> List[ChunkResult]`
- [ ] Results include chunk_id, chapter, section, similarity_score
- [ ] Handles Qdrant unavailability gracefully (returns empty list + logs error)
- [ ] Circuit breaker implemented (5 failures → wait 60s)

**Estimated Time**: 3-4 hours

---

#### T-023: Build FastAPI App Structure [P]

**Purpose**: Setup main FastAPI app + routers

**Files to Create/Modify**:
- `backend/src/main.py` — FastAPI app entry point
- `backend/src/config.py` — Configuration + environment variables
- `backend/src/api/v1/__init__.py`
- `backend/src/api/v1/chat.py` — Chat router (endpoint stubs)
- `backend/src/api/v1/health.py` — Health router (stubs)
- `backend/src/db/connection.py` — Database connection pool
- `backend/src/db/models.py` — SQLAlchemy declarative base

**Acceptance Criteria**:
- [ ] FastAPI app starts on `uvicorn src.main:app --reload`
- [ ] Swagger UI available at `/docs`
- [ ] ReDoc available at `/redoc`
- [ ] Environment variables loaded from .env
- [ ] Database connection pool initialized
- [ ] Routers registered (`/api/v1/chat`, `/api/v1/health`)
- [ ] CORS configured (allow localhost + GitHub Pages domain)

**Estimated Time**: 3-4 hours

---

### Phase 4: API & INTEGRATION

#### T-030: Implement /api/v1/chat Endpoint

**Purpose**: Connect all pieces: query → embedding → retrieval → response

**Files to Create/Modify**:
- `backend/src/api/v1/chat.py` — POST /chat endpoint
- `backend/src/services/chatbot.py` — Chatbot orchestration logic

**Endpoint Behavior**:
```python
@router.post("/chat")
async def chat(request: ChatRequest) -> ChatResponse:
    # 1. Validate query (max 1000 chars)
    # 2. Generate embedding
    # 3. Search Qdrant
    # 4. Retrieve metadata from Neon
    # 5. Aggregate answer
    # 6. Log query + response
    # 7. Return ChatResponse
```

**Acceptance Criteria**:
- [ ] Endpoint accepts POST with ChatRequest schema
- [ ] Query truncation: > 1000 chars → truncated + logged
- [ ] Embedding generation: < 1 second
- [ ] Retrieval: top-3 chunks, cosine similarity
- [ ] Answer aggregation: meaningful text from chunks
- [ ] Source attribution: chapter + section for each source
- [ ] In-scope detection: >= 1 chunk with similarity > threshold
- [ ] Out-of-scope response: explicit "not covered" message
- [ ] Latency logging: actual p95 measured
- [ ] Error handling: 400 (invalid), 503 (DB down), 500 (unexpected)

**Dependencies**: T-020, T-021, T-022, T-023 (must be parallel complete)

**Estimated Time**: 4-6 hours

---

#### T-031: Implement /api/v1/health Endpoint

**Purpose**: System health check

**Files to Create/Modify**:
- `backend/src/api/v1/health.py` — Health check endpoint

**Endpoint Behavior**:
```python
@router.get("/health")
async def health() -> HealthResponse:
    # Check Qdrant connectivity
    # Check Neon connectivity
    # Return status + component states
```

**Acceptance Criteria**:
- [ ] Returns 200 OK when all systems healthy
- [ ] Returns 503 when critical system down
- [ ] Components tested: qdrant, neon
- [ ] Includes timestamp (ISO 8601)
- [ ] Response time < 1 second
- [ ] No side effects (read-only)

**Estimated Time**: 1-2 hours

---

#### T-032: Connect Qdrant Client

**Purpose**: Initialize Qdrant, handle connection pooling

**Files to Create/Modify**:
- `backend/src/services/qdrant.py` — Connection + pooling
- `backend/src/config.py` — Qdrant config (URL, API key)

**Acceptance Criteria**:
- [ ] Qdrant client initialized on app startup
- [ ] Connection pooling configured
- [ ] `QDRANT_URL` + `QDRANT_API_KEY` read from .env
- [ ] Graceful error handling if Qdrant unavailable
- [ ] Circuit breaker in place (5 failures → wait)
- [ ] Health check endpoint verifies connectivity

**Estimated Time**: 2-3 hours

---

#### T-033: Connect Neon PostgreSQL

**Purpose**: Database connection, connection pooling, migrations

**Files to Create/Modify**:
- `backend/src/db/connection.py` — Connection pool + lifecycle
- `backend/src/config.py` — Neon config (DATABASE_URL)

**Acceptance Criteria**:
- [ ] Connection pool created (asyncpg)
- [ ] `NEON_DATABASE_URL` read from .env
- [ ] Migrations run on startup (alembic upgrade head)
- [ ] Connection pooling: min 2, max 10
- [ ] Graceful error handling if DB unavailable
- [ ] Health check endpoint verifies connectivity
- [ ] All 8 tables created + accessible

**Estimated Time**: 2-3 hours

---

### Phase 5: TESTING

#### T-040: Unit Tests (Embedding & Retrieval) [P]

**Purpose**: Test embedding generation + Qdrant search

**Files to Create/Modify**:
- `backend/tests/unit/test_embedding.py`
- `backend/tests/unit/test_retrieval.py`

**Test Cases**:
```
test_embedding.py:
  ✓ test_embed_single_text() — Verify output shape (1024)
  ✓ test_embed_batch() — Batch processing efficiency
  ✓ test_embed_empty_string() — Handle edge case
  ✓ test_embed_very_long_text() — Truncation + latency

test_retrieval.py:
  ✓ test_search_returns_top_k() — Top-3 results
  ✓ test_search_similarity_scores() — Scores in [0, 1]
  ✓ test_search_empty_vector() — Handle invalid input
  ✓ test_search_qdrant_unavailable() — Graceful degradation
  ✓ test_circuit_breaker_opens() — After 5 failures
```

**Acceptance Criteria**:
- [ ] All tests pass: `pytest tests/unit/`
- [ ] Coverage >= 85% for embedding + retrieval
- [ ] No flaky tests (deterministic)
- [ ] Latency assertions: embedding < 1s, retrieval < 500ms

**Estimated Time**: 4-5 hours

---

#### T-041: Unit Tests (Chatbot Orchestration) [P]

**Purpose**: Test chatbot logic (query validation, aggregation)

**Files to Create/Modify**:
- `backend/tests/unit/test_chatbot.py`

**Test Cases**:
```
✓ test_query_truncation() — Queries > 1000 chars truncated
✓ test_in_scope_detection() — Similarity threshold logic
✓ test_out_of_scope_response() — No chunks → "not covered"
✓ test_answer_aggregation() — Multiple chunks → coherent answer
✓ test_source_attribution() — Sources properly formatted
✓ test_language_support() — Handle 'en' + 'ur'
✓ test_latency_logging() — Recorded for all queries
```

**Acceptance Criteria**:
- [ ] All tests pass: `pytest tests/unit/test_chatbot.py`
- [ ] Coverage >= 90%
- [ ] No external dependencies (mocked)

**Estimated Time**: 3-4 hours

---

#### T-042: Integration Tests (RAG Pipeline) [P]

**Purpose**: End-to-end test: query → embedding → retrieval → response

**Files to Create/Modify**:
- `backend/tests/integration/test_rag_pipeline.py`

**Test Scenarios**:
```
✓ test_full_query_flow() — Query exists in chunks → answer returned
✓ test_50_representative_queries() — Coverage across 6 chapters
✓ test_out_of_scope_queries() — 100% rejection rate
✓ test_latency_targets() — p95 < 2s, p99 < 3s
✓ test_db_recovery() — Connection lost → reconnect + answer
✓ test_concurrent_queries() — 10 parallel queries
```

**Acceptance Criteria**:
- [ ] All integration tests pass (requires real/test Qdrant + Neon)
- [ ] 95% of in-scope queries retrieve relevant chunks
- [ ] 100% of out-of-scope queries return "not covered"
- [ ] Latency targets met (p95 < 2s)
- [ ] No data corruption after failures

**Estimated Time**: 6-8 hours

---

#### T-043: Contract Tests (API Schemas) [P]

**Purpose**: Validate request/response schemas match OpenAPI

**Files to Create/Modify**:
- `backend/tests/contract/test_api_schemas.py`

**Test Cases**:
```
✓ test_chat_request_schema() — Valid + invalid payloads
✓ test_chat_response_schema() — Response conforms to OpenAPI
✓ test_health_response_schema() — Status + components fields
✓ test_error_response_schema() — Error codes as spec
✓ test_endpoints_exist() — All routes registered
✓ test_cors_headers() — Correct allow-origins
```

**Acceptance Criteria**:
- [ ] All tests pass: `pytest tests/contract/`
- [ ] Schemas match contracts/chatbot-api.openapi.yaml exactly
- [ ] Invalid payloads rejected with 400
- [ ] No schema drift from spec

**Estimated Time**: 2-3 hours

---

### Phase 6: OBSERVABILITY & DEPLOYMENT

#### T-050: Implement Structured Logging

**Purpose**: Setup structlog + log to Neon

**Files to Create/Modify**:
- `backend/src/services/logger.py` — Structured logging config
- `backend/src/db/error_logs.py` — Error log persistence

**Features**:
- Timestamp, level, service, message, context (JSON)
- Log to stdout (development) + error_logs table (production)
- Request ID tracking (correlation)
- Performance metrics (latency per query)

**Acceptance Criteria**:
- [ ] All errors logged with full context
- [ ] Query latencies recorded in responses table
- [ ] Error_logs table queryable for debugging
- [ ] No sensitive data in logs (query text ok, no API keys)
- [ ] Latency: logging adds < 50ms overhead

**Estimated Time**: 3-4 hours

---

#### T-051: Setup CI/CD Pipeline (GitHub Actions)

**Purpose**: Automated tests, linting, type checking on PR

**Files to Create/Modify**:
- `.github/workflows/backend-tests.yml` — Run pytest on PR
- `.github/workflows/frontend-build.yml` — Build Docusaurus
- `.github/workflows/lint-and-format.yml` — ESLint, Black, Pylint

**Workflow Rules**:
- Run on: push to `1-textbook-generation`, PR to main
- Tests must pass: `pytest tests/ --cov`
- Linting must pass: `black`, `pylint`, `eslint`
- Type checking: `mypy backend/src`
- Coverage: >= 80%

**Acceptance Criteria**:
- [ ] Workflows defined in `.github/workflows/`
- [ ] Passing PR shows green checkmarks
- [ ] Failing tests block merge
- [ ] Coverage report available

**Estimated Time**: 3-4 hours

---

#### T-052: Configure Deployment (GitHub Pages + Vercel)

**Purpose**: Setup CD for frontend + backend

**Files to Create/Modify**:
- `.github/workflows/deploy.yml` — Deploy on main merge
- `.github/workflows/deploy-backend.yml` — Deploy to Vercel
- `vercel.json` — Vercel config (Python runtime)
- `book-website/docusaurus.config.ts` — GitHub Pages config

**Acceptance Criteria**:
- [ ] `yarn deploy` pushes to gh-pages branch
- [ ] GitHub Pages site live at `https://user.github.io/ai-textbook`
- [ ] Vercel deployment on main merge
- [ ] Backend API live at `https://ai-textbook-api.vercel.app`
- [ ] Environment variables configured in Vercel
- [ ] Rollback procedure documented

**Estimated Time**: 4-5 hours

---

#### T-053: Performance & Load Testing

**Purpose**: Verify latency targets under load

**Files to Create/Modify**:
- `backend/tests/performance/test_load.py` — Load test script

**Test Scenarios**:
```
✓ test_single_query_latency() — Single query < 2s
✓ test_10_concurrent_queries() — All < 3s
✓ test_100_queries_per_minute() — Throughput
✓ test_embedding_generation_time() — < 500ms per chunk
✓ test_cold_start() — Vercel cold start acceptable
```

**Acceptance Criteria**:
- [ ] Single query: p95 < 2s, p99 < 3s
- [ ] 10 concurrent queries: all complete < 3s
- [ ] 100 queries/min: no errors
- [ ] Embedding: < 500ms per chunk
- [ ] Cold start: < 5s acceptable (logged)

**Estimated Time**: 3-4 hours

---

### Phase 7: POLISH

#### T-060: Documentation & API Docs [P]

**Purpose**: README, Swagger, deployment guides

**Files to Create/Modify**:
- `backend/README.md` — Backend overview + setup
- `frontend/README.md` — Frontend overview + setup
- `.github/README.md` — Project overview
- Swagger docs auto-generated via FastAPI

**Acceptance Criteria**:
- [ ] README covers setup, testing, deployment
- [ ] Swagger docs accessible at `/docs`
- [ ] All endpoints documented with examples
- [ ] API contracts match OpenAPI spec

**Estimated Time**: 2-3 hours

---

#### T-061: Error Handling & Edge Cases [P]

**Purpose**: Comprehensive error handling

**Files to Create/Modify**:
- `backend/src/api/v1/exceptions.py` — Custom exceptions
- Error handling in endpoints + services

**Edge Cases**:
- Empty query
- Very long query (> 1000 chars)
- Non-Latin characters (Urdu)
- Concurrent requests
- DB connection lost
- Qdrant unavailable
- Invalid JSON payload
- Rate limiting (future)

**Acceptance Criteria**:
- [ ] All edge cases handled gracefully
- [ ] No unhandled exceptions reaching client
- [ ] Error messages user-friendly
- [ ] 5xx errors logged with context
- [ ] Graceful degradation (site readable even if chatbot down)

**Estimated Time**: 3-4 hours

---

#### T-062: Code Quality (Linting, Type Checking) [P]

**Purpose**: Enforce code standards

**Files to Modify**: All source files

**Tools**:
- Python: `black` (formatting), `pylint` (linting), `mypy` (type checking)
- TypeScript: `eslint`, `prettier`

**Acceptance Criteria**:
- [ ] `black --check backend/src` passes
- [ ] `pylint backend/src` score >= 8.0
- [ ] `mypy backend/src` no errors
- [ ] `eslint src/` passes
- [ ] No console.log or print statements left
- [ ] No TODO comments without context

**Estimated Time**: 2-3 hours

---

### Phase 8: VALIDATION & LAUNCH

#### T-070: Full End-to-End Testing

**Purpose**: Test entire system as user would

**Test Scenarios**:
```
✓ User visits textbook site (loads in < 2s)
✓ User reads chapter 1 (navigation works)
✓ User selects text → chatbot appears
✓ User types question → response in < 2s
✓ Response includes source attribution
✓ User navigates to chapter 2 (sidebar works)
✓ Repeat for all 6 chapters
```

**Acceptance Criteria**:
- [ ] Frontend loads successfully
- [ ] Chatbot widget functional
- [ ] All 6 chapters readable
- [ ] Chat responses accurate + timely
- [ ] No console errors
- [ ] Mobile view responsive

**Estimated Time**: 2-3 hours

---

#### T-071: Production Deployment

**Purpose**: Deploy to GitHub Pages + Vercel

**Steps**:
1. Tag release: `git tag v1.0.0`
2. Deploy frontend: `yarn deploy`
3. Deploy backend: `vercel --prod`
4. Verify: Test endpoints from production URLs
5. Monitor: Check logs for errors

**Acceptance Criteria**:
- [ ] Frontend live at GitHub Pages URL
- [ ] Backend live at Vercel URL
- [ ] Health check passes
- [ ] Sample queries return correct answers
- [ ] No 500 errors in production logs

**Estimated Time**: 1-2 hours

---

#### T-072: Monitor & Collect Feedback

**Purpose**: Post-launch monitoring + iteration

**Actions**:
- Monitor error logs daily (first week)
- Track query latencies + accuracy
- Collect user feedback (optional: form)
- Document learnings for Phase 2

**Acceptance Criteria**:
- [ ] Error rate < 1% (99.0% uptime)
- [ ] Latency p95 < 2s sustained
- [ ] Accuracy >= 95% on sample queries
- [ ] Zero critical issues in first week

**Estimated Time**: Ongoing (1 hour per day first week)

---

## Task Execution Summary

**Total Tasks**: 22 working tasks across 8 phases

**Phase Breakdown**:
- Phase 1 (SETUP): 3 sequential tasks
- Phase 2 (DATA): 3 parallel tasks
- Phase 3 (CORE): 4 parallel tasks
- Phase 4 (API): 4 sequential tasks
- Phase 5 (TESTS): 4 parallel tasks
- Phase 6 (OPS): 4 sequential tasks
- Phase 7 (POLISH): 3 parallel tasks
- Phase 8 (LAUNCH): 3 sequential tasks

**Estimated Total Time**: 70-90 hours (2-3 person-weeks)

**Parallel Opportunities**: 
- Phase 2 tasks can run in parallel (T-010, T-011, T-012)
- Phase 3 tasks can run in parallel (T-020, T-021, T-022, T-023)
- Phase 5 tasks can run in parallel (T-040, T-041, T-042, T-043)
- Phase 7 tasks can run in parallel (T-060, T-061, T-062)

**Quality Gates**:
- [ ] All tests pass before Phase 4
- [ ] All linting passes before Phase 6
- [ ] Coverage >= 80% before production

---

## Completion Tracking

**Status Legend**:
- ✅ COMPLETED
- 🔄 IN PROGRESS
- ⏳ NOT STARTED
- ⚠️ BLOCKED

**Phase 1**: ⏳ (ready to start)  
**Phase 2**: ⏳ (ready after Phase 1)  
**Phase 3**: ⏳ (ready after Phase 1)  
**Phase 4**: ⏳ (ready after Phase 3 completes)  
**Phase 5**: ⏳ (ready after Phase 4)  
**Phase 6**: ⏳ (ready after Phase 5)  
**Phase 7**: ⏳ (ready after Phase 6)  
**Phase 8**: ⏳ (ready after Phase 7)  

---

## Rollback Plan

If any phase fails:

1. **Phase 1 Failure**: Start over (no data loss)
2. **Phase 2-3 Failure**: Delete test data, re-run migrations
3. **Phase 4 Failure**: Revert endpoint code, keep migrations
4. **Phase 5 Failure**: Fix test issues, re-run tests
5. **Phase 6+ Failure**: Revert production deployment, use previous git tag

All data is version-controlled in git; easy recovery to any previous state.

---

**Next Action**: Execute Phase 1 tasks (T-001, T-002, T-003)

Ready for implementation! 🚀
