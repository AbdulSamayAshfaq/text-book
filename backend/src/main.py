"""AI Textbook Backend - FastAPI Application Entry Point"""

import os
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import structlog
from pydantic import BaseModel
from typing import List, Dict, Any, Tuple, Optional
import io
from .ai.rag.retriever import RAGRetriever
from .ai.rag.models import Document
from .routes import rag

# Configure logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer(),
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger(__name__)

# Global RAG retriever instance
rag_retriever = RAGRetriever()

def load_textbook_documents():
    """Load textbook chapters from docs directory into RAG system"""
    try:
        # Locate docs directory relative to repository root
        repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
        docs_dir = os.path.join(repo_root, 'docs')

        documents = []

        # Load chapter files (1-6) first, then other docs
        chapter_files = []
        other_files = []

        for root, _, files in os.walk(docs_dir):
            for fname in files:
                if fname.lower().endswith('.md'):
                    fpath = os.path.join(root, fname)
                    if fname.startswith(('1-', '2-', '3-', '4-', '5-', '6-')):
                        chapter_files.append((fpath, fname))
                    else:
                        other_files.append((fpath, fname))

        # Sort chapter files by number
        chapter_files.sort(key=lambda x: int(x[1].split('-')[0]))

        # Load all files
        all_files = chapter_files + other_files

        for fpath, fname in all_files:
            try:
                with io.open(fpath, 'r', encoding='utf-8') as fh:
                    content = fh.read()

                # Extract title from first line if it's a heading
                title = fname.replace('.md', '').replace('-', ' ').title()
                if content.startswith('# '):
                    title_line = content.split('\n')[0].strip('# ').strip()
                    if title_line:
                        title = title_line

                # Extract chapter number if it's a numbered chapter
                chapter = None
                if fname.startswith(('1-', '2-', '3-', '4-', '5-', '6-')):
                    chapter = fname.split('-')[0]

                # Create document
                doc_id = f"doc_{fname.replace('.md', '')}"
                rel_path = os.path.relpath(fpath, repo_root).replace('\\', '/')

                doc = Document(
                    id=doc_id,
                    content=content,
                    metadata={
                        "path": rel_path,
                        "filename": fname,
                        "chapter": chapter
                    },
                    source=title,
                    chapter=chapter,
                    title=title
                )

                documents.append(doc)
                logger.info("document_loaded", filename=fname, title=title, chapter=chapter)

            except Exception as e:
                logger.error("failed_to_load_document", filename=fname, error=str(e))
                continue

        # Add documents to retriever
        rag_retriever.add_documents(documents)

        # Build chunks and embeddings
        rag_retriever.build_index()

        logger.info("textbook_documents_loaded", count=len(documents))

    except Exception as e:
        logger.error("failed_to_load_textbook_documents", error=str(e))

# Initialize FastAPI app
app = FastAPI(
    title="AI Textbook Chatbot API",
    description="RAG-powered chatbot for Physical AI & Humanoid Robotics textbook",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# CORS Configuration
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

origins = [
    FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(rag.router)

# Load textbook documents on startup
logger.info("loading_textbook_documents")
load_textbook_documents()


@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "service": "ai-textbook-chatbot",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/v1/health",
    }


@app.get("/api/v1/health")
async def health():
    """
    Health check endpoint.
    
    Returns:
        {
            "status": "ok" | "degraded" | "down",
            "components": {
                "database": bool,
                "qdrant": bool
            },
            "timestamp": ISO8601 string
        }
    """
    # TODO: Implement health check
    # - Check database connectivity
    # - Check Qdrant connectivity
    logger.info("health_check", status="ok")
    return {
        "status": "ok",
        "components": {
            "database": True,
            "qdrant": True,
        },
        "timestamp": "2025-12-06T00:00:00Z",
    }


@app.post("/api/v1/chat")
async def chat(query: str, language: str = "en"):
    """
    Chat endpoint - process user query via RAG.
    
    Request:
        {
            "query": "What is physical AI?",
            "language": "en" | "ur"
        }
    
    Response:
        {
            "answer": "Physical AI is...",
            "sources": [
                {
                    "chapter": "Chapter 1",
                    "section": "Introduction",
                    "text": "..."
                }
            ],
            "latency_ms": 1200,
            "in_scope": true
        }
    """
    # TODO: Implement RAG pipeline
    # 1. Validate query (max 1000 chars)
    # 2. Generate embedding
    # 3. Search Qdrant
    # 4. Retrieve from database
    # 5. Aggregate answer
    # 6. Log query + response
    logger.info("chat_request", query=query, language=language)
    
    return {
        "answer": "Coming soon - RAG pipeline not yet implemented",
        "sources": [],
        "latency_ms": 0,
        "in_scope": False,
    }


class RagRequest(BaseModel):
    query: str


@app.post("/api/v1/rag")
async def rag_endpoint(payload: RagRequest):
    """
    Lightweight RAG-like endpoint (naive retrieval):
    - Searches `docs/` markdown files for occurrences of the query
    - Returns short excerpts and file paths as sources
    This is a minimal, local fallback implementation (not vector-based).
    """
    query = (payload.query or "").strip()
    if not query:
        return {"answer": "Please provide a query.", "sources": []}

    # locate docs directory relative to repository root
    repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
    docs_dir = os.path.join(repo_root, 'docs')

    results: List[Dict[str, Any]] = []

    try:
        for root, _, files in os.walk(docs_dir):
            for fname in files:
                if not fname.lower().endswith('.md'):
                    continue
                fpath = os.path.join(root, fname)
                try:
                    with io.open(fpath, 'r', encoding='utf-8') as fh:
                        text = fh.read()
                except Exception:
                    continue

                low = text.lower()
                qlow = query.lower()
                if qlow in low:
                    idx = low.find(qlow)
                    start = max(0, idx - 140)
                    end = min(len(text), idx + 140)
                    excerpt = text[start:end].replace('\n', ' ')
                    rel = os.path.relpath(fpath, repo_root).replace('\\', '/')
                    results.append({
                        'title': fname,
                        'excerpt': excerpt,
                        'path': rel,
                    })

        # If no direct substring matches, do token scoring as a fallback
        if not results:
            tokens = [t for t in query.lower().split() if t]
            scores = []
            for root, _, files in os.walk(docs_dir):
                for fname in files:
                    if not fname.lower().endswith('.md'):
                        continue
                    fpath = os.path.join(root, fname)
                    try:
                        with io.open(fpath, 'r', encoding='utf-8') as fh:
                            text = fh.read().lower()
                    except Exception:
                        continue
                    score = sum(text.count(tok) for tok in tokens)
                    if score > 0:
                        idx = text.find(tokens[0]) if tokens else 0
                        start = max(0, idx - 120)
                        end = min(len(text), idx + 120)
                        excerpt = text[start:end].replace('\n', ' ')
                        rel = os.path.relpath(fpath, repo_root).replace('\\', '/')
                        scores.append({'title': fname, 'excerpt': excerpt, 'path': rel, 'score': score})
            scores = sorted(scores, key=lambda r: r.get('score', 0), reverse=True)
            results = scores

        top = results[:3]
        if top:
            answer = "I found relevant textbook sections:\n\n" + "\n\n".join([f"- {t['title']}: {t['excerpt'][:300]}..." for t in top])
        else:
            answer = "I couldn't find a good match in the textbook. Try rephrasing the question."

        return {"answer": answer, "sources": top}

    except Exception as exc:
        logger.error("rag_error", error=str(exc))
        return {"answer": "RAG search failed.", "sources": []}


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler for all unhandled errors"""
    logger.error(
        "unhandled_exception",
        error=str(exc),
        error_type=type(exc).__name__,
        path=request.url.path,
    )
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc) if DEBUG else "An error occurred",
        },
    )


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("API_PORT", 8000))
    host = os.getenv("API_HOST", "127.0.0.1")

    logger.info("starting_server", host=host, port=port, debug=DEBUG)
    uvicorn.run(
        app,
        host=host,
        port=port,
        reload=DEBUG,
        log_level="info" if not DEBUG else "debug",
    )
