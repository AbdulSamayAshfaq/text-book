# Physical AI & Humanoid Robotics — Essentials: Project Constitution

<!-- Sync Impact Report: V1.0.0 (Initial Constitution) | Ratified: 2025-12-06 -->

## Purpose

This constitution establishes non-negotiable principles for the **Physical AI & Humanoid Robotics — Essentials** project: an AI-native textbook built with Docusaurus, integrated with a free-tier RAG chatbot. The project prioritizes simplicity, accuracy, and accessibility for learners at all levels.

## Core Principles

### I. Simplicity Over Completeness

Every deliverable prioritizes clarity and directness. Complex concepts are broken into digestible steps; unnecessary frameworks, abstractions, or vendor lock-in are eliminated. Code, documentation, and UI must be immediately understandable without external context.

**Non-negotiable rules:**
- No premature optimization or "future-proofing" that adds complexity
- Favor built-in tools over third-party libraries unless justified
- Each chapter stands alone; cross-chapter dependencies must be explicit
- UI/UX: Single-purpose components; minimal UI layers

### II. Accuracy & Source-of-Truth Alignment

All chatbot responses must be verifiable against the textbook source material. No synthesized, hallucinated, or out-of-scope answers. The RAG system is bound exclusively to book text; external knowledge is forbidden.

**Non-negotiable rules:**
- Every RAG response must cite source chapter and section
- Embeddings must preserve semantic fidelity; test against known passages
- Chatbot rejects queries outside textbook scope with "Not covered in the textbook"
- Book content is the single source of truth; no ad-hoc updates to chatbot responses

### III. Free-Tier Architecture (No GPU, Minimal Compute)

The system must run entirely on free or minimal-cost infrastructure. No heavy model inference, no GPU clusters, no expensive databases. Lightweight embeddings + vector storage + serverless/edge deployment are mandatory.

**Non-negotiable rules:**
- Embeddings: Use lightweight models (e.g., MiniLM, ONNX-quantized)
- Vector DB: Qdrant (free tier or Docker) or equivalent
- Database: Neon (free tier PostgreSQL)
- Backend: FastAPI on Vercel/Railway or equivalent free-tier serverless
- Static hosting: GitHub Pages for Docusaurus site
- No GPU usage; CPU-only inference
- Disk/storage footprint must remain < 1GB

### IV. Test-First & Quality Gates (NON-NEGOTIABLE)

Tests drive all feature work. No code lands without passing unit + integration tests. Quality checks (linting, type safety, build success) must pass before merge.

**Non-negotiable rules:**
- Unit tests written and passing for all new code
- Integration tests for chatbot retrieval + response accuracy
- Type safety enforced: TypeScript strict mode, Python type hints
- Linting: ESLint (frontend) + Pylint/Black (backend)
- Build must succeed (Docusaurus + FastAPI + tests)
- No skipped or xfailed tests in main; document waived tests as TODO with rationale

### V. Minimal, Documented API Contracts

All internal and external APIs must be explicit, versioned, and documented. Breaking changes require major version bump and migration guide.

**Non-negotiable rules:**
- REST API endpoints specify: request/response schema, error codes, latency expectations, idempotency behavior
- Chatbot API versioned: /api/v1/chat with explicit request/response format
- Database schemas documented; schema migrations required for changes
- No implicit behaviors; all edge cases documented

### VI. Observability & Debuggability

Structured logging, metrics, and error handling must enable rapid root-cause analysis. Every error must be actionable.

**Non-negotiable rules:**
- Logs include: timestamp, level, service, request ID, error message, context
- Errors logged with full stack trace (dev) and user-friendly message (production)
- Metrics tracked: build time, chatbot query latency, embedding generation time, error rate
- Logs are queryable; use structured JSON format
- Silent failures forbidden; all exceptions logged or re-raised

### VII. Git-Driven Workflow & Immutable History

All changes flow through version control with clear rationale. History must be preserved and auditable; force-pushes forbidden on main.

**Non-negotiable rules:**
- Commit messages are atomic, descriptive, reference issues/specs
- Main branch protected; PR + review required for all merges
- No merge commits; rebase + squash for clean history
- Each PR links to spec, plan, or ADR
- Automated checks (tests, linting, build) pass before merge

## Technical Constraints

### Technology Stack

- **Frontend**: Docusaurus 3.x, React 18+, TypeScript, TailwindCSS
- **Backend**: FastAPI (Python 3.11+), async/await
- **Vector DB**: Qdrant (local Docker or managed free tier)
- **Database**: Neon PostgreSQL (free tier)
- **Embeddings**: Lightweight models (sentence-transformers MiniLM or equivalent ONNX-quantized)
- **CI/CD**: GitHub Actions (free tier)
- **Hosting**: GitHub Pages (frontend) + Vercel/Railway/Hugging Face Spaces (backend)

### Scope: 6 Core Chapters

1. **Introduction to Physical AI** — Definitions, history, physical grounding, embodied cognition
2. **Basics of Humanoid Robotics** — Kinematics, dynamics, motor control, sensors
3. **ROS 2 Fundamentals** — Installation, nodes, topics, services, launch files
4. **Digital Twin Simulation** — Gazebo, Isaac Sim, physics-based simulation, visualization
5. **Vision-Language-Action Systems** — Vision transformers, language models, multi-modal integration
6. **Capstone: Simple AI-Robot Pipeline** — End-to-end example combining chapters 1–5

**Out of scope:**
- Advanced reinforcement learning
- Custom hardware design
- Heavy-weight ML training
- Multi-robot coordination (beyond basics)
- Commercial robotics platforms

### Performance & Reliability Targets

- **Build time**: < 60 seconds (Docusaurus)
- **Chatbot query latency**: p95 < 2 seconds (query → embedding → retrieval → answer)
- **Embedding generation**: < 500ms per chunk (first-time)
- **Availability**: 99.0% uptime (reasonable for free-tier services)
- **Document coverage**: Chatbot must accurately retrieve answers for 95%+ of in-scope queries
- **Search index size**: < 100MB (embeddings + metadata)

### Data & Privacy

- All textbook content is public (open-licensed or original)
- User queries are not logged beyond error diagnostics
- No personal data collection; no tracking cookies
- Backups: Git repository is the primary backup; vector DB is ephemeral (can be regenerated)

## Development Workflow

### Spec → Plan → Tasks → Code → Test → Merge

1. **Spec**: User/stakeholder requirement → `.specify/specs/<feature>/spec.md` (objective, acceptance criteria)
2. **Plan**: Architecture & design → `.specify/specs/<feature>/plan.md` (decisions, APIs, data flow)
3. **Tasks**: Testable, atomic tasks → `.specify/specs/<feature>/tasks.md` (each task = one PR)
4. **Code**: Write tests first (RED) → implement (GREEN) → refactor (CLEAN)
5. **Review**: Code review + automated checks (linting, type, tests, build)
6. **Merge**: Squash + rebase → main
7. **Document**: Update ADR/README if architectural changes; archive PHR

### Code Review Gate

- **Reviewer must verify**: Tests pass, coverage maintained, no regressions, spec requirement met
- **Blocked if**: Type errors, linting failures, failing tests, missing commit message rationale, breaking change without ADR + migration guide
- **Recommended**: Author provides test cases + rationale in PR description

## Governance

### Constitution as Law

This constitution supersedes all other practices and informal guidelines. When conflicts arise, constitution controls. Violations must be documented and remediated within the current sprint.

### Amendment Process

1. **Detect change need**: Principle becomes outdated, new constraint discovered, or workflow issue identified
2. **Document reasoning**: Create ADR or issue explaining rationale, impact, and alternatives considered
3. **Review & consent**: Team consensus required before amendment
4. **Version bump**: MAJOR (principle removal/redefinition), MINOR (new principle/section), PATCH (clarification)
5. **Propagate**: Update dependent templates (spec, plan, tasks) and runtime guidance (README)
6. **Archive**: Original version backed up in git history; PHR created documenting amendment

### Compliance & Auditing

- **Weekly check**: All PRs/merges verify compliance with current principles (automated + human review)
- **Quarterly audit**: Full sweep of codebase, documentation, and architecture for adherence
- **Non-compliance escalation**: Document in issue, retro, and amend constitution if principle needs clarification

### Version History

**Version**: 1.0.0 | **Ratified**: 2025-12-06 | **Last Amended**: 2025-12-06
