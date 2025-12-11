# RAG Pipeline Optimization Tasks

## 1. Implement Document Chunking
- Add chunking logic to retriever.py with configurable chunk_size and overlap
- Create DocumentChunk model in models.py

## 2. Integrate Embeddings into Retrieval
- Modify retriever.py to use embeddings for semantic similarity
- Implement hybrid scoring (TF-IDF + semantic similarity)

## 3. Add Chapter Metadata Extraction
- Extract chapter numbers and titles from file names
- Add section headers from markdown content
- Store metadata in Document objects

## 4. Update RAG Route
- Modify backend/src/routes/rag.py to use improved retriever
- Add document loading and indexing on startup

## 5. Update Main.py RAG Endpoint
- Replace naive substring matching with vector-based retrieval
- Add proper error handling and logging

## 6. Testing and Validation
- Test with specific queries to ensure correct chapter retrieval
- Adjust thresholds and parameters for accuracy
