"""RAG Routes"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List
import structlog
import io
import os
from ..ai.rag.retriever import RAGRetriever
from ..ai.rag.models import Document

router = APIRouter(prefix="/api/v1/rag", tags=["rag"])
logger = structlog.get_logger(__name__)

# Import the global retriever from main
from ..main import rag_retriever
retriever = rag_retriever


class RAGQueryRequest(BaseModel):
    query: str
    top_k: int = 3
    threshold: float = 0.5


class RAGDocument(BaseModel):
    id: str
    title: str
    content: str
    source: str


@router.post("/query")
async def query_rag(request: RAGQueryRequest):
    """
    Query the RAG system

    Returns relevant documents and synthesized answer
    """
    try:
        if not request.query or len(request.query) > 1000:
            raise HTTPException(status_code=400, detail="Invalid query")

        logger.info("rag_query", query=request.query[:100], top_k=request.top_k)

        # Query the RAG system
        response = await retriever.query(request.query, request.top_k)

        return {
            "answer": response.answer,
            "sources": response.sources,
            "latency_ms": response.latency_ms,
            "in_scope": response.in_scope,
        }
    except Exception as e:
        logger.error("rag_query_error", error=str(e))
        raise HTTPException(status_code=500, detail="RAG query failed")


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Upload and index a document for RAG
    
    Supported formats: PDF, Markdown, Text
    """
    try:
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")
        
        # Validate file type
        valid_extensions = ['.pdf', '.md', '.txt']
        if not any(file.filename.endswith(ext) for ext in valid_extensions):
            raise HTTPException(status_code=400, detail="Invalid file type")
        
        # Read file content
        content = await file.read()
        if len(content) > 50 * 1024 * 1024:  # 50MB limit
            raise HTTPException(status_code=413, detail="File too large")
        
        # TODO: Process and index document
        logger.info("document_uploaded", filename=file.filename, size=len(content))
        
        return {
            "document_id": "doc_12345",
            "title": file.filename,
            "status": "indexed",
            "size": len(content),
            "chunks_created": 0,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error("document_upload_error", error=str(e))
        raise HTTPException(status_code=500, detail="Upload failed")


@router.get("/documents")
async def list_documents():
    """List all indexed documents"""
    try:
        logger.info("list_documents")

        documents = []
        for doc in retriever.documents:
            documents.append({
                "id": doc.id,
                "title": doc.title or doc.source,
                "source": doc.source,
                "chapter": doc.chapter,
                "path": doc.metadata.get("path", ""),
                "created_at": doc.created_at.isoformat(),
            })

        return {"documents": documents}
    except Exception as e:
        logger.error("list_documents_error", error=str(e))
        raise HTTPException(status_code=500, detail="Failed to list documents")


@router.delete("/documents/{doc_id}")
async def delete_document(doc_id: str):
    """Delete a document from RAG"""
    try:
        # TODO: Delete from vector DB and database
        logger.info("document_deleted", doc_id=doc_id)
        return {"status": "deleted"}
    except Exception as e:
        logger.error("delete_document_error", error=str(e))
        raise HTTPException(status_code=500, detail="Delete failed")
