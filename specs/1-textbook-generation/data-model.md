# Data Model: AI-Native Textbook with RAG Chatbot

**Date**: 2025-12-06 | **Feature**: 1-textbook-generation | **Version**: 1.0

## Overview

This document defines the complete data model for the textbook + RAG chatbot system. The model is split into three layers:
1. **Content Layer**: Chapters, Sections, DocumentChunks (source material)
2. **Embedding Layer**: Vectors in Qdrant (retrieval index)
3. **Runtime Layer**: Queries, Responses, Logs (operational data)

Storage:
- Content + Runtime: Neon PostgreSQL (relational)
- Embeddings: Qdrant (vector database)

## Entity Definitions

### 1. Chapter

**Purpose**: Represents one of the 6 core learning modules in the textbook.

**Table**: `chapters`

| Field | Type | Constraints | Notes |
|-------|------|-----------|-------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `title` | VARCHAR(255) | NOT NULL, UNIQUE per language | e.g., "Introduction to Physical AI" |
| `slug` | VARCHAR(255) | NOT NULL, UNIQUE | URL-safe identifier; e.g., "intro-physical-ai" |
| `order` | INT | NOT NULL | Display order (1-6 for MVP) |
| `language` | VARCHAR(5) | NOT NULL, DEFAULT 'en' | 'en' or 'ur' |
| `content` | TEXT | NOT NULL | Full markdown content |
| `source_file` | VARCHAR(512) | NULLABLE | Path to source markdown file |
| `token_count` | INT | NULLABLE | Estimated token count for content |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Relationships**:
- `1 Chapter → Many Sections` (parent)
- `1 Chapter → Many DocumentChunks` (via Sections)

**Lifecycle**:
1. Created during initial setup (markdown import)
2. Indexed into Qdrant on first deploy
3. Updated when chapter markdown changes
4. On update: re-generate embeddings for affected chunks

**Validation Rules**:
- Title: 5-255 characters, non-empty
- Slug: lowercase, hyphens, no spaces
- Order: 1-6 for MVP (extensible later)
- Language: enum {'en', 'ur'}
- Token count: computed or nullable

---

### 2. Section

**Purpose**: Represents a subsection within a chapter.

**Table**: `sections`

| Field | Type | Constraints | Notes |
|-------|------|-----------|-------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `chapter_id` | UUID | NOT NULL, FK(chapters.id) | Parent chapter |
| `title` | VARCHAR(255) | NOT NULL | e.g., "2.1 Kinematics Basics" |
| `order` | INT | NOT NULL | Order within chapter |
| `content` | TEXT | NOT NULL | Section markdown content |
| `token_count` | INT | NULLABLE | Estimated token count |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Relationships**:
- `Many Sections ← 1 Chapter` (child)
- `1 Section → Many DocumentChunks` (parent)

**Validation Rules**:
- Title: non-empty, 5-255 characters
- Order: >= 1, sequential within chapter
- Content: must be present and non-empty
- chapter_id: must reference valid chapter

---

### 3. DocumentChunk

**Purpose**: Represents a parsed segment of textbook content used for embedding and retrieval. Each chunk is a semantic unit (e.g., a paragraph or subsection).

**Table**: `document_chunks`

| Field | Type | Constraints | Notes |
|-------|------|-----------|-------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `section_id` | UUID | NOT NULL, FK(sections.id) | Parent section |
| `chapter_id` | UUID | NOT NULL, FK(chapters.id) | Denormalized for query efficiency |
| `language` | VARCHAR(5) | NOT NULL, DEFAULT 'en' | 'en' or 'ur' |
| `text` | TEXT | NOT NULL | Chunk content (used for retrieval) |
| `sequence` | INT | NOT NULL | Order within section |
| `token_count` | INT | NOT NULL | Token count (for budget tracking) |
| `embedding_id` | UUID | NULLABLE, FK(embeddings.id) | Reference to vector in Qdrant |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Creation timestamp |

**Relationships**:
- `Many DocumentChunks ← 1 Section` (child)
- `Many DocumentChunks ← 1 Chapter` (denormalized)
- `1 DocumentChunk ← 1 Embedding` (one-to-one with Qdrant)
- `Many DocumentChunks ← Many Queries` (via Retrievals join table)

**Validation Rules**:
- Text: must be present, 10-2000 characters (semantic unit)
- Sequence: >= 1, sequential within section
- Token count: > 0, computed via tokenizer
- section_id & chapter_id: must reference valid entities
- embedding_id: nullable until embedding is generated

**Index**:
- `(chapter_id, section_id, sequence)` - for retrieval context

---

### 4. Embedding

**Purpose**: Stores vector embeddings for DocumentChunks in Qdrant (vector database). This is a reference table; actual vectors live in Qdrant.

**Table**: `embeddings` (Neon, metadata only)

| Field | Type | Constraints | Notes |
|-------|------|-----------|-------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `chunk_id` | UUID | NOT NULL, FK(document_chunks.id), UNIQUE | One embedding per chunk |
| `model` | VARCHAR(50) | NOT NULL | e.g., "minilm-l6-v2" |
| `dimension` | INT | NOT NULL | e.g., 1024 |
| `qdrant_id` | BIGINT | NOT NULL | Qdrant point ID (for deletion) |
| `generated_at` | TIMESTAMP | NOT NULL | Creation timestamp |
| `checksum` | VARCHAR(64) | NULLABLE | SHA256 of chunk text (for change detection) |

**Relationships**:
- `1 Embedding ← 1 DocumentChunk` (one-to-one)

**Qdrant Payload** (stored with each point):
```json
{
  "chunk_id": "uuid",
  "chapter_title": "string",
  "section_title": "string",
  "chapter_id": "uuid",
  "section_id": "uuid",
  "language": "en|ur",
  "text": "string (searchable)"
}
```

**Validation Rules**:
- chunk_id: unique, must reference existing chunk
- model: enum {'minilm-l6-v2', ...}
- dimension: must match model (e.g., 1024 for MiniLM)
- qdrant_id: positive integer, unique per Qdrant collection

---

### 5. Query

**Purpose**: Represents a user's question submitted to the RAG chatbot.

**Table**: `queries`

| Field | Type | Constraints | Notes |
|-------|------|-----------|-------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `text` | TEXT | NOT NULL | User's question (truncated to 1000 chars) |
| `language` | VARCHAR(5) | NOT NULL | 'en' or 'ur' |
| `source` | VARCHAR(20) | NOT NULL | 'select-text' or 'direct-input' |
| `user_session_id` | UUID | NULLABLE, FK(user_sessions.id) | Anonymous session reference |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Query timestamp |

**Relationships**:
- `1 Query → 1 Response` (one-to-one)
- `Many Queries ← 1 UserSession` (many-to-one)

**Validation Rules**:
- Text: 5-1000 characters
- Language: enum {'en', 'ur'}
- Source: enum {'select-text', 'direct-input'}
- user_session_id: nullable (anonymous)

---

### 6. Response

**Purpose**: Represents a chatbot's answer to a Query.

**Table**: `responses`

| Field | Type | Constraints | Notes |
|-------|------|-----------|-------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `query_id` | UUID | NOT NULL, FK(queries.id), UNIQUE | One response per query |
| `answer_text` | TEXT | NOT NULL | Generated answer (from retrieved chunks) |
| `source_chunk_ids` | UUID[] | NOT NULL | IDs of chunks used (e.g., [uuid1, uuid2, uuid3]) |
| `latency_ms` | INT | NOT NULL | Query processing time in milliseconds |
| `accuracy_score` | FLOAT | NULLABLE | Optional: Human-rated or automated accuracy (0-1) |
| `in_scope` | BOOLEAN | NOT NULL | True if answer found; False if "not covered" |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Response timestamp |

**Relationships**:
- `1 Response ← 1 Query` (one-to-one)
- `Many Response ← Many DocumentChunks` (via source_chunk_ids array)

**Validation Rules**:
- answer_text: non-empty
- source_chunk_ids: non-empty array if in_scope=True; empty if in_scope=False
- latency_ms: > 0, < 5000 (alert if > 3000)
- accuracy_score: 0-1.0 or null
- in_scope: boolean

---

### 7. UserSession

**Purpose**: Tracks anonymous user visits and interactions (no personal data).

**Table**: `user_sessions`

| Field | Type | Constraints | Notes |
|-------|------|-----------|-------|
| `id` | UUID | PRIMARY KEY | Anonymous session ID |
| `language_preference` | VARCHAR(5) | NOT NULL, DEFAULT 'en' | 'en' or 'ur' |
| `chapters_viewed` | UUID[] | NULLABLE | IDs of chapters visited |
| `queries_made` | INT | NOT NULL, DEFAULT 0 | Count of queries |
| `first_visit` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Session start |
| `last_visit` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Session end |

**Relationships**:
- `1 UserSession → Many Queries` (one-to-many)

**Validation Rules**:
- language_preference: enum {'en', 'ur'}
- chapters_viewed: array of valid chapter IDs or null
- queries_made: >= 0

---

### 8. ErrorLog

**Purpose**: Audit trail for errors, debugging, and observability.

**Table**: `error_logs`

| Field | Type | Constraints | Notes |
|-------|------|-----------|-------|
| `id` | UUID | PRIMARY KEY | Unique identifier |
| `timestamp` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Error time |
| `error_type` | VARCHAR(100) | NOT NULL | e.g., "embedding_generation_failed", "qdrant_unavailable" |
| `message` | TEXT | NOT NULL | Error message |
| `context` | JSONB | NULLABLE | Additional context (query_id, user_session_id, etc.) |
| `severity` | VARCHAR(10) | NOT NULL | 'info', 'warning', 'error', 'critical' |

**Relationships**: None (immutable log)

**Validation Rules**:
- error_type: enum {predefined list}
- severity: enum {'info', 'warning', 'error', 'critical'}
- message: non-empty

---

## Join Tables

### QueryRetrievals (implicit)

Tracks which chunks were retrieved for a query (normalized from Response.source_chunk_ids for analysis).

**Table**: `query_retrievals`

| Field | Type | Notes |
|-------|------|-------|
| `query_id` | UUID | FK(queries.id) |
| `chunk_id` | UUID | FK(document_chunks.id) |
| `rank` | INT | Retrieval rank (1, 2, 3, ...) |
| `similarity_score` | FLOAT | Cosine similarity score from Qdrant (0-1) |

---

## Data Volume Estimates

| Table | Rows | Storage | Notes |
|-------|------|---------|-------|
| chapters | 6 | ~10KB | 6 chapters × 2 languages = 12 rows |
| sections | ~60 | ~100KB | ~10 sections per chapter |
| document_chunks | ~300 | ~5MB | ~50 chunks per chapter (semantic chunking) |
| embeddings | ~300 | ~10MB | One per chunk; vectors in Qdrant |
| queries | ~1000/day | ~1MB | Growth over time |
| responses | ~1000/day | ~500KB | Paired with queries |
| user_sessions | ~100/day | ~200KB | Anonymous sessions |
| error_logs | ~100/day | ~100KB | Error audit trail |

**Total Neon Storage**: ~20MB (well within free tier 3GB limit)  
**Total Qdrant Storage**: ~30MB (well within 1GB limit)

---

## State Transitions

### DocumentChunk Lifecycle

```
Created (from markdown parse)
  ↓
Pending Embedding (chunk created, no embedding yet)
  ↓
Embedded (embedding generated, stored in Qdrant)
  ↓
Indexed (chunk searchable)
  ↓
[Optional: Updated] (if source markdown changes)
  ↓
Deleted (if chapter/section removed)
```

### Query Lifecycle

```
Submitted
  ↓
Processing (embedding generation + retrieval)
  ↓
Responded (answer generated, stored)
  ↓
Logged (query + response stored in Neon)
  ↓
[Optional: Rated] (accuracy score added)
```

---

## Indexes & Performance

### Neon Indexes

```sql
-- Fast chunk retrieval by chapter/section
CREATE INDEX idx_chunks_chapter_section ON document_chunks(chapter_id, section_id, sequence);

-- Fast query lookups
CREATE INDEX idx_queries_session ON queries(user_session_id, created_at);

-- Fast error analysis
CREATE INDEX idx_errors_type_time ON error_logs(error_type, timestamp);

-- Responses linked to queries
CREATE INDEX idx_responses_query ON responses(query_id);
```

### Qdrant Indexes

- Automatically indexed by Qdrant on insertion
- Collection: `textbook_chunks` (configured for cosine similarity)
- Vector dimension: 1024 (MiniLM)
- Payload indexed on: `chapter_id`, `section_id`, `language`

---

## Constraints & Assumptions

1. **No user authentication**: All data is anonymous; no PII stored
2. **Append-only logs**: Queries, responses, errors are immutable
3. **Chunk immutability**: Once embedded, chunks are not modified in-place; updates create new chunks
4. **Language isolation**: Each language version has separate chapters, sections, chunks (not translations of each other)
5. **Free-tier limits**: All schema optimized for < 3GB Neon + < 1GB Qdrant
6. **No real-time sync**: Qdrant and Neon are eventually consistent (not critical for this use case)

---

## Migration & Versioning

**V1.0**: Initial schema (current)
- Support for English + Urdu
- 6 chapters, ~300 chunks
- Query logging + error tracking

**Future versions** (Phase 2+):
- Add quiz/assessment tables
- Add user annotation tables
- Add chapter versioning tables
- Add multi-language support (beyond English + Urdu)
