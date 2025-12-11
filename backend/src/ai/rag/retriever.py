"""RAG Retriever - handles document retrieval and ranking"""

from typing import List, Optional, Tuple
import structlog
import re
from .models import Document, DocumentChunk, RAGResponse
from .embeddings import EmbeddingManager

logger = structlog.get_logger(__name__)


class RAGRetriever:
    """Retrieves and ranks relevant documents from vector store"""

    def __init__(self, embedding_manager: Optional[EmbeddingManager] = None, chunk_size: int = 500, chunk_overlap: int = 50):
        """Initialize RAG retriever"""
        self.embedding_manager = embedding_manager or EmbeddingManager()
        self.documents: List[Document] = []
        self.chunks: List[DocumentChunk] = []
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def add_documents(self, documents: List[Document]):
        """Add documents to retrieval system"""
        self.documents.extend(documents)
        logger.info("documents_added", count=len(documents))

    def build_index(self):
        """Build search index by chunking documents and generating embeddings"""
        try:
            for doc in self.documents:
                # Skip if already chunked
                if any(chunk.document_id == doc.id for chunk in self.chunks):
                    continue

                # Split document into chunks
                chunks = self._chunk_document(doc)

                # Generate embeddings for chunks
                for chunk in chunks:
                    if chunk.content.strip():  # Skip empty chunks
                        chunk.embedding = self.embedding_manager.embed_text(chunk.content)
                        self.chunks.append(chunk)

            logger.info("index_built", documents=len(self.documents), chunks=len(self.chunks))
        except Exception as e:
            logger.error("failed_to_build_index", error=str(e))

    def _chunk_document(self, document: Document) -> List[DocumentChunk]:
        """Split document into overlapping chunks"""
        chunks = []
        content = document.content
        content_length = len(content)

        start_pos = 0
        chunk_index = 0

        while start_pos < content_length:
            end_pos = min(start_pos + self.chunk_size, content_length)

            # Try to break at sentence or paragraph boundary
            if end_pos < content_length:
                # Look for sentence endings within the last 100 characters
                search_end = min(end_pos + 100, content_length)
                chunk_text = content[start_pos:search_end]

                # Find last sentence ending
                sentence_endings = ['. ', '! ', '? ', '\n\n']
                best_break = end_pos

                for ending in sentence_endings:
                    last_ending = chunk_text.rfind(ending)
                    if last_ending != -1 and start_pos + last_ending + len(ending) > best_break:
                        best_break = start_pos + last_ending + len(ending)

                end_pos = min(best_break, content_length)

            chunk_content = content[start_pos:end_pos]

            chunk = DocumentChunk(
                id=f"{document.id}_chunk_{chunk_index}",
                document_id=document.id,
                content=chunk_content,
                chunk_index=chunk_index,
                start_pos=start_pos,
                end_pos=end_pos,
                metadata=document.metadata.copy(),
                created_at=document.created_at
            )

            chunks.append(chunk)
            chunk_index += 1

            # Move start position with overlap
            start_pos = end_pos - self.chunk_overlap
            if start_pos <= 0:
                break

        return chunks

    def retrieve(self, query: str, top_k: int = 3) -> List[Document]:
        """
        Retrieve top-k relevant documents for query using hybrid scoring
        """
        if not self.chunks:
            logger.warning("no_chunks_indexed")
            return []

        # Generate query embedding
        query_embedding = self.embedding_manager.embed_text(query)

        # Score chunks using hybrid approach: semantic similarity + keyword matching
        scored_chunks = []
        query_lower = query.lower()
        query_tokens = set(query_lower.split())

        for chunk in self.chunks:
            # Semantic similarity score
            if chunk.embedding:
                import numpy as np
                semantic_score = np.dot(query_embedding, chunk.embedding) / (
                    np.linalg.norm(query_embedding) * np.linalg.norm(chunk.embedding)
                )
            else:
                semantic_score = 0.0

            # Keyword matching score
            chunk_tokens = set(chunk.content.lower().split())
            keyword_score = len(query_tokens & chunk_tokens) / len(query_tokens) if query_tokens else 0.0

            # Hybrid score: weighted combination
            hybrid_score = 0.7 * semantic_score + 0.3 * keyword_score

            scored_chunks.append((chunk, hybrid_score))

        # Sort by hybrid score descending
        scored_chunks.sort(key=lambda x: x[1], reverse=True)

        # Group by document and get unique documents
        seen_docs = set()
        results = []
        for chunk, score in scored_chunks[:top_k * 2]:  # Get more chunks to ensure document diversity
            doc_id = chunk.document_id
            if doc_id not in seen_docs and len(results) < top_k:
                # Find the original document
                doc = next((d for d in self.documents if d.id == doc_id), None)
                if doc:
                    results.append(doc)
                    seen_docs.add(doc_id)

        logger.info("documents_retrieved", count=len(results), chunks_scored=len(scored_chunks))
        return results

    async def query(self, query: str, top_k: int = 3) -> RAGResponse:
        """
        Process RAG query: retrieve documents + generate response
        
        In production: use LLM to synthesize answer
        """
        try:
            docs = self.retrieve(query, top_k)
            
            if not docs:
                return RAGResponse(
                    answer="No matching documents found. Please rephrase your question.",
                    sources=[],
                    confidence=0.0,
                    latency_ms=0.0,
                    in_scope=False,
                )

            # Format sources
            sources = [
                {
                    "title": doc.source,
                    "excerpt": doc.content[:300],
                    "path": doc.metadata.get("path", "unknown"),
                }
                for doc in docs
            ]

            # Naive answer synthesis (in production: use LLM)
            answer = f"Based on the textbook:\n\n" + "\n\n".join(
                [f"- {s['title']}: {s['excerpt']}..." for s in sources]
            )

            return RAGResponse(
                answer=answer,
                sources=sources,
                confidence=0.75,
                latency_ms=0.0,
                in_scope=True,
            )
        except Exception as e:
            logger.error("rag_query_failed", error=str(e))
            return RAGResponse(
                answer="An error occurred while retrieving documents.",
                sources=[],
                confidence=0.0,
                latency_ms=0.0,
                in_scope=False,
            )
