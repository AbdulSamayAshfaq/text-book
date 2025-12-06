# Prompt History Record (PHR) — Specification Creation

| Field | Value |
|-------|-------|
| ID | 002 |
| Title | Textbook Generation Spec |
| Stage | spec |
| Date | 2025-12-06 |
| Surface | agent |
| Model | Claude Haiku 4.5 |
| Feature | 1-textbook-generation |
| Branch | master → (pending 1-textbook-generation checkout) |
| User | user |
| Command | /sp.specify textbook-generation |
| Labels | spec, textbook, rag-chatbot, docusaurus, free-tier |
| Links | spec: specs/1-textbook-generation/spec.md • ticket: null • adr: null • pr: null |

## Files Created/Modified

- ✅ `specs/1-textbook-generation/spec.md` (368 lines) — Complete specification
- ✅ `specs/1-textbook-generation/checklists/requirements.md` (95 lines) — Quality checklist

## Validation Results

- ✅ **All 12 checklist items PASSED**
- ✅ No [NEEDS CLARIFICATION] markers
- ✅ 4 user stories (P1, P1, P2, P3) with independent tests
- ✅ 15 functional requirements, all testable
- ✅ 12 success criteria, all measurable and technology-agnostic
- ✅ Edge cases covered (6 scenarios)
- ✅ Scope bounded: in-scope + out-of-scope clearly defined
- ✅ 8 documented assumptions

## Prompt

Follow instructions in [sp.specify.prompt.md](file:///d%3A/ai-text-book/book-website/.github/prompts/sp.specify.prompt.md).
Feature: textbook-generation

Objective:
Define a complete, unambiguous specification for building the AI-native textbook with RAG chatbot.

Book Structure:
1. Introduction to Physical AI  
2. Basics of Humanoid Robotics  
3. ROS 2 Fundamentals  
4. Digital Twin Simulation (Gazebo + Isaac)  
5. Vision-Language-Action Systems  
6. Capstone  

Technical Requirements:
- Docusaurus  
- Auto sidebar  
- RAG backend (Qdrant + Neon)  
- Free-tier embeddings  

Optional:
- Urdu translation  
- Personalize chapter  

Output:
Full specification.

## Response Snapshot

Created comprehensive specification (spec.md) covering:

**4 User Stories**:
1. Student Learns from Textbook (P1) — Core reading experience, navigation, responsive design, fast builds
2. Student Asks RAG Chatbot (P1) — Query accuracy, source attribution, latency < 2s, out-of-scope rejection
3. Educator Customizes Textbook (P2) — Add chapters, auto-sidebar, chatbot reindexing
4. Learner Accesses Urdu Translation (P3) — Multi-language support, synchronized content

**15 Functional Requirements** (FR-001 to FR-015):
- Docusaurus site with 6 chapters, auto-sidebar, responsive design
- RAG chatbot integrated, textbook-only answers, source attribution
- Lightweight embeddings (MiniLM), < 1GB storage
- Qdrant + Neon free-tier backend
- GitHub Pages deployment
- Query latency < 2s, 95% accuracy target
- Graceful degradation on service failures
- Support for text selection → chatbot queries
- Language toggle (English + Urdu)
- Structured logging for observability

**12 Success Criteria** (SC-001 to SC-012):
- Build time < 60s
- Query response time p95 < 2s
- 95% in-scope query accuracy
- 100% out-of-scope rejection
- Zero broken links/assets
- Auto-sidebar, zero manual config
- < 1GB total storage
- Fully free-tier infrastructure
- Responsive on all devices
- 99.0% uptime
- Synchronized English/Urdu versions

**Quality Validation**: Passed all 12 checklist items. No clarifications needed. Ready for Planning phase.

## Outcome

- ✅ Impact: Complete, testable specification defining MVP for AI textbook + RAG chatbot. Prioritizes P1 features (textbook reading + chatbot accuracy). Enables P2/P3 additions (customization, Urdu).
- 🧪 Tests: Specification validation PASSED 12/12 checklist items. No [NEEDS CLARIFICATION] markers. All requirements testable, all success criteria measurable.
- 📁 Files: 2 files created (spec.md 368 lines, requirements.md 95 lines)
- 🔁 Next prompts: `/sp.plan 1-textbook-generation` (architecture, API contracts, data models, technical design)
- 🧠 Reflection: Spec balances ambitious vision (6 chapters + chatbot + multi-language) with free-tier constraints (lightweight embeddings, serverless architecture). User stories clearly prioritized; P1 is minimum viable product (textbook + chatbot working). P2/P3 (customization, Urdu) are high-value additions for phase 2. Edge cases and assumptions explicitly documented.

## Evaluation Notes

- Failure modes observed: None; template-driven spec process successful first pass.
- Graders run and results (PASS/FAIL): Spec validation PASS; no rework needed.
- Prompt variant (if applicable): N/A
- Next experiment: Proceed to Planning phase with high confidence. Plan should focus on: (1) validating latency targets achievable with MiniLM + Qdrant, (2) data migration strategy (markdown → chunks → embeddings), (3) Urdu translation workflow for P3.

