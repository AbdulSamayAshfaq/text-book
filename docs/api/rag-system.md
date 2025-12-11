---
sidebar_position: 2
---

# RAG System

## Overview

The RAG (Retrieval-Augmented Generation) system combines document retrieval with LLM-powered synthesis to answer questions based on the textbook content.

## Architecture

```
User Query
    ↓
[Embeddings] - Convert query to vector
    ↓
[Vector DB] - Search similar documents
    ↓
[Document Retrieval] - Get top-k results
    ↓
[LLM Synthesis] - Generate answer from sources
    ↓
Answer + Sources
```

## Components

### 1. Embeddings
- **Model**: sentence-transformers (all-MiniLM-L6-v2)
- **Dimension**: 384
- **Update Frequency**: Real-time as documents are added

### 2. Vector Database
- **Type**: Qdrant
- **Host**: `localhost:6333`
- **Collections**: `textbook_documents`

### 3. Document Chunking
- **Chunk Size**: 500 tokens
- **Overlap**: 50 tokens
- **Strategy**: Sliding window

### 4. Retrieval
- **Method**: Cosine similarity
- **Top-K**: 3 documents
- **Score Threshold**: 0.5

## API Endpoints

### POST /api/v1/rag/query

Execute a RAG query.

**Request:**
```json
{
  "query": "What are the types of machine learning?",
  "top_k": 3,
  "threshold": 0.5
}
```

**Response:**
```json
{
  "answer": "Based on the textbook...",
  "sources": [
    {
      "title": "machine-learning.md",
      "excerpt": "...",
      "score": 0.87
    }
  ],
  "latency_ms": 342,
  "metadata": {
    "documents_searched": 150,
    "documents_returned": 3
  }
}
```

### POST /api/v1/rag/upload

Upload a document to the RAG system.

**Request:**
```
multipart/form-data
- file: Document.pdf
- metadata: {"source": "textbook_chapter_3"}
```

**Response:**
```json
{
  "document_id": "doc_12345",
  "status": "indexed",
  "chunks_created": 45,
  "tokens": 22500
}
```

## Usage

```python
# Python example
import requests

response = requests.post('http://localhost:8000/api/v1/rag/query', json={
    'query': 'What is neural networks?',
    'top_k': 3
})

data = response.json()
print(data['answer'])
for source in data['sources']:
    print(f"- {source['title']}")
```

## Performance

- **Query Latency**: 200-500ms (p95)
- **Document Indexing**: ~5 minutes per 1000 pages
- **Storage**: ~100MB per 10,000 documents
- **Accuracy**: 0.85 (BLEU score on benchmark)
