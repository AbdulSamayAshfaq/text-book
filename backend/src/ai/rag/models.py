"""RAG Models and Type Definitions"""

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class Document(BaseModel):
    """Document model for RAG system"""
    id: str
    content: str
    metadata: dict = {}
    source: str
    created_at: datetime = datetime.now()
    chapter: Optional[str] = None
    title: Optional[str] = None


class DocumentChunk(BaseModel):
    """Chunked document for better retrieval"""
    id: str
    document_id: str
    content: str
    chunk_index: int
    start_pos: int
    end_pos: int
    embedding: Optional[List[float]] = None
    metadata: dict = {}
    created_at: datetime = datetime.now()


class RAGConfig(BaseModel):
    """Configuration for RAG system"""
    embeddings_model: str = "all-MiniLM-L6-v2"
    vector_db_host: str = "localhost"
    vector_db_port: int = 6333
    chunk_size: int = 500
    chunk_overlap: int = 50
    top_k: int = 3
    score_threshold: float = 0.5


class RAGResponse(BaseModel):
    """Response from RAG query"""
    answer: str
    sources: List[dict]
    confidence: float
    latency_ms: float
    in_scope: bool
