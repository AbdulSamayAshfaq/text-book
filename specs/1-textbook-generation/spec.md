# Feature Specification: AI-Native Textbook with RAG Chatbot

**Feature Branch**: `1-textbook-generation`  
**Created**: 2025-12-06  
**Status**: Draft  
**Input**: User description: "Define a complete, unambiguous specification for building the AI-native textbook with RAG chatbot. Book Structure: 1. Introduction to Physical AI 2. Basics of Humanoid Robotics 3. ROS 2 Fundamentals 4. Digital Twin Simulation (Gazebo + Isaac) 5. Vision-Language-Action Systems 6. Capstone. Technical Requirements: Docusaurus, Auto sidebar, RAG backend (Qdrant + Neon), Free-tier embeddings. Optional: Urdu translation, Personalize chapter."

## User Scenarios & Testing

### User Story 1 - Student Learns from Textbook (Priority: P1)

A student visits the textbook website and reads chapters on Physical AI and Humanoid Robotics. They navigate smoothly through sections using an auto-generated sidebar, view code examples, and access accompanying diagrams. The site loads fast, renders clearly, and provides a distraction-free learning experience.

**Why this priority**: This is the core value proposition — delivering a readable, accessible textbook. Without this working flawlessly, the chatbot and other features are irrelevant.

**Independent Test**: A user can visit the live site, read all 6 chapters end-to-end, navigate via sidebar, and successfully understand key concepts. Site performance meets targets (< 60s build, fast page load). No broken links, missing images, or formatting issues.

**Acceptance Scenarios**:

1. **Given** the textbook site is deployed, **When** a student visits the homepage, **Then** they see a clear introduction and navigation to all 6 chapters.
2. **Given** a student is reading Chapter 2 (Humanoid Robotics), **When** they click a section in the auto-generated sidebar, **Then** the page scrolls/navigates to that section smoothly.
3. **Given** the textbook contains code examples and images, **When** a student views a chapter, **Then** all assets render correctly without broken references.
4. **Given** a student is on any chapter page, **When** they access the site from a mobile device, **Then** the layout is responsive and readable.
5. **Given** the textbook is rebuilt, **When** the build completes, **Then** the entire site can be deployed to GitHub Pages without errors.

---

### User Story 2 - Student Asks RAG Chatbot (Priority: P1)

A student finishes reading a section and wants clarification. They select some highlighted text or type a question into the chatbot sidebar. The chatbot instantly retrieves relevant passages from the textbook and provides an accurate, cited answer. If the question falls outside the textbook scope, the chatbot politely declines and suggests consulting the relevant chapter.

**Why this priority**: The RAG chatbot is a core differentiator promised to users. It must work accurately and be seamlessly integrated into the reading experience.

**Independent Test**: A user can ask 10 representative questions covering all 6 chapters. For each, the chatbot returns accurate, cited answers within 2 seconds. For out-of-scope questions, it correctly refuses and recommends the nearest chapter. The chatbot's response rate meets 95% accuracy on in-scope queries.

**Acceptance Scenarios**:

1. **Given** a student is reading Chapter 1 (Introduction to Physical AI), **When** they select the phrase "embodied cognition" and click "Ask AI", **Then** the chatbot appears with a pre-filled query and responds with a cited explanation from the textbook.
2. **Given** a student is using the chatbot, **When** they ask a question covered in the textbook (e.g., "What are the basics of kinematics?"), **Then** the chatbot returns an accurate answer with source attribution (e.g., "Chapter 2, Section 3").
3. **Given** a student asks an out-of-scope question (e.g., "How do I build a commercial robot?"), **When** the chatbot processes the query, **Then** it responds with "This topic is not covered in the textbook. Please refer to [relevant chapter] or consult external resources."
4. **Given** the chatbot receives a query, **When** the query is processed end-to-end, **Then** the response is delivered in under 2 seconds with p95 latency < 2.5 seconds.

---

### User Story 3 - Educator Customizes Textbook (Priority: P2)

An educator wants to reuse the textbook structure but add a personalized chapter tailored to their institution (e.g., "Custom Lab Exercises for XYZ University"). They fork the repository, add a new chapter, regenerate the sidebar, and republish to their own GitHub Pages. The chatbot automatically includes the new chapter in its knowledge base.

**Why this priority**: This enables community contributions and adaptability. It's valuable but not critical for MVP launch. Once the textbook is stable, educators and contributors will need this flexibility.

**Independent Test**: An educator can add a new chapter, rebuild the site locally, and deploy to their own GitHub Pages. The sidebar auto-updates to include the new chapter. The RAG chatbot reindexes and can answer questions about the new content. No manual configuration required.

**Acceptance Scenarios**:

1. **Given** an educator has forked the textbook repository, **When** they add a new `.md` file in the `docs` directory, **Then** the sidebar auto-generates an entry for the new chapter on rebuild.
2. **Given** a new chapter has been added, **When** the chatbot's embedding index is regenerated, **Then** the new chapter's content is automatically indexed and searchable.
3. **Given** a custom textbook is deployed, **When** a student asks a question about the custom chapter, **Then** the chatbot returns accurate answers from the new content.

---

### User Story 4 - Learner Accesses Urdu Translation (Priority: P3)

A learner prefers reading in Urdu. They select the language toggle on the homepage and access a fully translated version of the textbook. The sidebar, chatbot interface, and book content are all available in Urdu. The RAG chatbot understands and responds in Urdu.

**Why this priority**: This is a nice-to-have accessibility feature that expands reach but is not essential for MVP. It can be added in a follow-up phase once core functionality is solid.

**Independent Test**: A user can toggle to Urdu, read all chapters in Urdu, use the chatbot in Urdu, and understand the interface without confusion. Translation quality is professional and consistent.

**Acceptance Scenarios**:

1. **Given** the textbook homepage is displayed, **When** a user clicks the language toggle, **Then** the entire interface, sidebar, and book content switch to Urdu.
2. **Given** the textbook is in Urdu, **When** a student asks a question in Urdu, **Then** the chatbot responds in Urdu with accurate information from the translated content.
3. **Given** a translated chapter is deployed, **When** a user navigates between Urdu and English versions, **Then** the content and structure remain synchronized.

---

### Edge Cases

- What happens when the Qdrant vector database becomes unavailable? → Chatbot should fail gracefully with "Service temporarily unavailable" message; site remains readable.
- What happens if a student asks a question with no matching passages in the textbook? → Chatbot returns "No relevant information found in the textbook" and suggests related chapters.
- What happens if a new chapter is added but embeddings fail to generate? → An error is logged; the chapter remains readable in the textbook but is excluded from chatbot queries until reindexing succeeds.
- How does the system handle extremely long queries (e.g., 5000+ characters)? → Queries are truncated to a reasonable limit (e.g., 1000 characters) and the user is notified.
- What happens if GitHub Pages deployment fails? → Build logs are captured; previous version remains live until successful deployment.

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide a clean, responsive web interface displaying all 6 chapters using Docusaurus 3.x framework.
- **FR-002**: System MUST auto-generate a sidebar navigation that reflects all chapters and sections without manual configuration.
- **FR-003**: System MUST provide a RAG chatbot widget integrated into the textbook interface, allowing students to query content.
- **FR-004**: Chatbot MUST retrieve answers exclusively from textbook content; responses MUST include source attribution (chapter and section).
- **FR-005**: System MUST reject out-of-scope queries with a polite "not covered in textbook" message rather than hallucinating answers.
- **FR-006**: Chatbot MUST process queries in under 2 seconds (p95 latency target).
- **FR-007**: System MUST support selecting text on any chapter page and triggering a chatbot query with the selected text pre-filled.
- **FR-008**: System MUST store embeddings and metadata in a free-tier vector database (Qdrant) with no GPU usage.
- **FR-009**: System MUST store user metadata and error logs in a free-tier PostgreSQL database (Neon).
- **FR-010**: System MUST use lightweight embeddings (MiniLM or equivalent ONNX-quantized model) with disk footprint < 1GB total.
- **FR-011**: System MUST rebuild the textbook and redeploy to GitHub Pages on every merge to main.
- **FR-012**: Educators MUST be able to add new chapters by creating `.md` files in the `docs` directory; the sidebar MUST auto-update on rebuild.
- **FR-013**: System MUST support a language toggle (English + Urdu minimum); all content MUST be available in both languages (content translation and chatbot responses).
- **FR-014**: System MUST log all chatbot queries, response latencies, and errors in structured JSON format for observability.
- **FR-015**: System MUST gracefully handle vector database unavailability; site remains readable, chatbot displays "Service temporarily unavailable" message.

### Key Entities

- **Chapter**: A markdown document representing one of the 6 core learning modules (e.g., "Introduction to Physical AI"). Attributes: title, sections, content, code examples, images, source file path.
- **Section**: A subsection within a chapter (e.g., "2.1 Kinematics Basics"). Attributes: title, content, order, parent chapter, searchable text.
- **Query**: A user's question submitted to the RAG chatbot. Attributes: text, timestamp, user_id (anonymous), language, source (select-text or direct input).
- **Document Chunk**: A parsed segment of textbook content used for embedding and retrieval. Attributes: chunk_id, source_chapter, source_section, text, embedding_vector, metadata (page, section hierarchy).
- **Response**: A chatbot answer generated from retrieved chunks. Attributes: query_id, answer_text, source_chunks, latency_ms, accuracy_score (for testing), timestamp.
- **Embedding**: A vector representation of a document chunk. Attributes: chunk_id, vector (1024-dim or equivalent), model_name, generated_at.
- **User Session**: Anonymous user visit metadata. Attributes: session_id, timestamp, chapter_viewed, queries_made, language_preference.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Docusaurus build time is consistently under 60 seconds on any machine.
- **SC-002**: Chatbot query response time (query submission to answer display) is under 2 seconds for p95 latency, with p99 < 3 seconds.
- **SC-003**: Chatbot accurately answers 95% of in-scope queries (queries about content covered in the 6 chapters) as validated by manual spot-check testing.
- **SC-004**: Chatbot correctly rejects 100% of out-of-scope queries with an appropriate "not covered" message.
- **SC-005**: All 6 chapters are readable and fully deployed to GitHub Pages with zero broken links or missing assets.
- **SC-006**: Sidebar navigation is auto-generated and reflects all chapters + sections; adding a new chapter requires zero sidebar configuration.
- **SC-007**: Students can select any text on a chapter page and launch a chatbot query with that text pre-filled in under 500ms.
- **SC-008**: Vector database and embeddings require less than 1GB total disk storage.
- **SC-009**: Entire infrastructure (Docusaurus, FastAPI backend, Qdrant, Neon) runs on free-tier services with no paid upgrades required.
- **SC-010**: Site is fully responsive and readable on desktop, tablet, and mobile devices.
- **SC-011**: 99.0% of chatbot requests complete without error (temporary infrastructure failures are acceptable; graceful degradation required).
- **SC-012**: English and Urdu versions of the textbook remain synchronized in structure and content.

## Assumptions

- **Content Availability**: All 6 chapters and their content are provided as markdown files or will be authored during the development phase.
- **Embedding Model**: MiniLM (sentence-transformers) or an equivalent lightweight, open-source model is used; no proprietary/paid embedding APIs.
- **Vector DB**: Qdrant is deployed locally or on free tier; no production-scale managed service required.
- **Database**: Neon's free tier PostgreSQL is used; no additional cost.
- **Deployment**: GitHub Pages is the primary hosting; FastAPI backend runs on free-tier serverless (Vercel, Railway, or Hugging Face Spaces).
- **User Scale**: Initial MVP targets up to 1,000 concurrent users; scaling beyond this is a future phase.
- **Urdu Translation**: If Urdu is included, translations are done by a human translator or high-quality translation tool (e.g., OpenAI API with free quota); translations are version-controlled in the repository.
- **Chatbot Scope**: Chatbot is read-only; students cannot submit corrections or contribute content via the chatbot (future feature).
- **Maintenance**: A core team or maintainer is available for bug fixes, dependency updates, and optional feature additions (Urdu, personalization).

## Out of Scope (for MVP)

- Real-time collaborative editing of textbook content.
- User accounts, authentication, or personal learning profiles.
- Advanced analytics dashboards.
- Mobile app (web-responsive design only).
- Automated grading or quizzes (students can read, but cannot take tests through the system).
- Video content (text, images, and code examples only).
- Multi-language support beyond English and Urdu (can be added later).
- Custom theming or branding by educators (fixed theme for consistency).
- Offline textbook download (web-only for now).

## Known Constraints

- **Lightweight Embeddings**: Using MiniLM may result in lower retrieval accuracy than large models (e.g., GPT-4-level) but is necessary for free-tier architecture.
- **Free-Tier Limits**: Neon free tier, Vercel serverless free tier, and Qdrant free tier have rate limits and storage caps; exceeding them requires a paid upgrade.
- **Cold Starts**: Serverless deployment may experience 1–5 second cold starts on first request after idle period; document this in FAQ.
- **Translation Quality**: Machine-translated Urdu may have minor quality issues; human review recommended for production.
- **Search Index Size**: Total embeddings + metadata must stay under free-tier storage limits; limit chapters to ~100k tokens initially.

## Next Steps

1. This specification will be reviewed and validated against the Quality Checklist.
2. Any [NEEDS CLARIFICATION] markers (if present) will be addressed by the team.
3. Upon approval, the specification will move to the Planning phase (`/sp.plan`), where technical architecture, APIs, and data models are detailed.
4. Planning will output a detailed architecture diagram, database schema, API contracts, and implementation roadmap.
