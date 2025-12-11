"""Embedding Manager for RAG"""

from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List
import structlog

logger = structlog.get_logger(__name__)


class EmbeddingManager:
    """Manages document embeddings using sentence-transformers"""

    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """Initialize embedding manager"""
        self.model_name = model_name
        try:
            self.model = SentenceTransformer(model_name)
            logger.info("embedding_model_loaded", model=model_name)
        except Exception as e:
            logger.error("embedding_model_load_failed", error=str(e))
            raise

    def embed_text(self, text: str) -> np.ndarray:
        """Embed single text string"""
        try:
            embedding = self.model.encode(text, convert_to_numpy=True)
            return embedding
        except Exception as e:
            logger.error("embedding_failed", error=str(e))
            raise

    def embed_texts(self, texts: List[str]) -> List[np.ndarray]:
        """Embed multiple texts"""
        try:
            embeddings = self.model.encode(texts, convert_to_numpy=True)
            return embeddings.tolist()
        except Exception as e:
            logger.error("batch_embedding_failed", error=str(e))
            raise

    def similarity(self, text1: str, text2: str) -> float:
        """Compute cosine similarity between two texts"""
        try:
            emb1 = self.embed_text(text1)
            emb2 = self.embed_text(text2)
            similarity = np.dot(emb1, emb2) / (
                np.linalg.norm(emb1) * np.linalg.norm(emb2)
            )
            return float(similarity)
        except Exception as e:
            logger.error("similarity_computation_failed", error=str(e))
            raise
