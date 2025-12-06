# Quickstart: AI-Native Textbook with RAG Chatbot

**Date**: 2025-12-06 | **Feature**: 1-textbook-generation | **Status**: Development

This guide walks you through setting up, building, and testing the textbook + RAG chatbot locally.

## Prerequisites

- **Node.js**: 18.x or later
- **Python**: 3.11 or later
- **Docker**: For local Qdrant instance (optional; can use free-tier Qdrant Cloud instead)
- **Git**: For cloning and version control
- **Neon Account**: Create free account at https://neon.tech (for PostgreSQL)
- **Qdrant Account** (optional): Create free account at https://cloud.qdrant.io (or use Docker)

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/ai-textbook.git
cd ai-textbook
git checkout 1-textbook-generation
```

### 2. Frontend Setup (Docusaurus)

```bash
# Install dependencies
cd book-website
yarn install

# Verify installation
yarn --version  # Should be 3.x or 4.x
node --version  # Should be 18.x+

# Create .env.local for frontend (optional, for local testing)
touch .env.local
# No secrets needed for frontend (static site)
```

### 3. Backend Setup (FastAPI)

```bash
# Create Python virtual environment
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Upgrade pip
pip install --upgrade pip setuptools wheel

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Verify FastAPI installation
python -c "import fastapi; print(fastapi.__version__)"
```

### 4. Environment Variables (Backend)

Create `.env` in the `backend/` directory:

```bash
# Database (Neon PostgreSQL)
NEON_DATABASE_URL="postgresql://user:password@host.neon.tech/database?sslmode=require"
# Get this from: https://neon.tech/docs/connect/connection-string

# Vector Database (Qdrant)
QDRANT_URL="http://localhost:6333"  # For local Docker
# OR for cloud: "https://your-cluster.qdrant.io:6333"
QDRANT_API_KEY="your-api-key"  # Only needed for cloud

# Logging
LOG_LEVEL="DEBUG"  # DEBUG, INFO, WARNING, ERROR

# Optional: Hugging Face API (for downloading MiniLM)
# Leave empty to use cached local model
HF_HOME="/tmp/hf_models"
```

### 5. Qdrant Setup

#### Option A: Local Docker (Recommended for Development)

```bash
# Start Qdrant in Docker
docker run -p 6333:6333 qdrant/qdrant:latest

# Verify it's running
curl http://localhost:6333/health
# Should return: {"ok": true}
```

#### Option B: Qdrant Cloud (Free Tier)

1. Go to https://cloud.qdrant.io
2. Create a cluster (free tier: 1GB storage)
3. Create an API key
4. Update `.env`:
   ```
   QDRANT_URL="https://your-cluster-url.qdrant.io:6333"
   QDRANT_API_KEY="your-api-key"
   ```

## Local Development

### Building the Textbook (Frontend)

```bash
cd book-website

# Start local dev server
yarn start

# Browser should open at http://localhost:3000
# Changes to docs/ are reflected live (hot reload)
```

### Running the Backend (FastAPI)

```bash
cd backend

# Start development server with auto-reload
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# Server running at http://localhost:8000
# API docs at http://localhost:8000/docs (Swagger UI)
# ReDoc at http://localhost:8000/redoc
```

### Running Tests

#### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run with coverage
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/unit/test_embedding.py -v

# Run integration tests only
pytest tests/integration/ -v
```

#### Frontend Tests

```bash
cd book-website

# Run Jest tests
yarn test

# Run with coverage
yarn test --coverage

# Run e2e tests (if configured)
yarn test:e2e
```

## Embedding Generation

### First-Time Setup (Initialization)

When you first deploy, embeddings must be generated for all chapters:

```bash
cd backend

# Activate virtual environment
source venv/bin/activate

# Run embedding script
python -m src.scripts.embed_chapters

# This will:
# 1. Load markdown chapters from docs/
# 2. Parse into sections and chunks
# 3. Generate embeddings via MiniLM (CPU, ~1-2 min for 6 chapters)
# 4. Store vectors in Qdrant + metadata in Neon
```

**Expected Output**:
```
INFO: Loading chapters from docs/
INFO: Found 6 chapters
INFO: Parsing chapter-1-intro-physical-ai...
INFO: Generating embeddings for 45 chunks
INFO: Stored 45 embeddings in Qdrant
INFO: Stored metadata in Neon
INFO: Total time: 125 seconds
```

### Testing Embeddings

```python
# After embeddings are generated, test retrieval:
python -c "
from src.services.retrieval import retrieve
results = retrieve('What is embodied cognition?', top_k=3)
for result in results:
    print(f\"Chapter: {result['chapter']}, Score: {result['similarity_score']:.3f}\")
"
```

## Manual Testing

### Test 1: Verify Frontend Loads

```bash
# Frontend running at http://localhost:3000
# Browser should display:
# - Docusaurus header + navigation
# - 6 chapters in sidebar
# - Chatbot widget in bottom-right corner
```

### Test 2: Query the Chatbot API

```bash
# With backend running at http://localhost:8000

# Test: In-scope query
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "What is embodied cognition?", "language": "en"}'

# Expected: 200 with answer + sources

# Test: Out-of-scope query
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "How do I build a commercial robot?", "language": "en"}'

# Expected: 204 with "not covered" message

# Test: Health check
curl http://localhost:8000/api/v1/health
# Expected: {"status": "ok", "components": {"qdrant": true, "neon": true}, ...}
```

### Test 3: Full E2E Flow

1. Open http://localhost:3000 in browser
2. Read a section of Chapter 1
3. Select some text → click "Ask AI"
4. Chatbot should:
   - Display loading indicator
   - Query backend
   - Show answer + sources within 2 seconds
   - Display chapter/section attribution

## Building for Production

### Frontend Build

```bash
cd book-website

# Create production build
yarn build

# Output in build/ directory (static HTML/CSS/JS)
# Size should be < 10MB

# Test production build locally
yarn serve

# Navigate to http://localhost:3000
```

### Backend Build

```bash
cd backend

# Build Docker image (if deploying via Docker)
docker build -t ai-textbook-backend:1.0.0 .

# Or: Deploy directly to Vercel/Railway (Python support)
# See deployment guides below
```

## Deployment

### Frontend → GitHub Pages

```bash
# Ensure everything is committed
git add .
git commit -m "Initial textbook setup"

# Deploy to gh-pages branch
yarn deploy

# Site live at: https://your-username.github.io/ai-textbook
```

### Backend → Vercel (Python)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy backend
cd backend
vercel --prod

# Set environment variables in Vercel dashboard:
# - NEON_DATABASE_URL
# - QDRANT_URL
# - QDRANT_API_KEY (if using cloud)
# - LOG_LEVEL

# Backend live at: https://ai-textbook-api.vercel.app
```

### Backend → Railway (Python)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway link

# Deploy
railway up

# Set environment variables via dashboard
```

## Monitoring & Debugging

### View Logs (Backend)

```bash
# Tail logs in development
tail -f backend/logs/app.log

# Or check Neon for error_logs table:
psql $NEON_DATABASE_URL
SELECT * FROM error_logs ORDER BY timestamp DESC LIMIT 10;
```

### Check Vector DB Status

```bash
# If using local Docker:
curl http://localhost:6333/collections/textbook_chunks

# If using Qdrant Cloud:
curl -H "api-key: $QDRANT_API_KEY" \
  https://your-cluster.qdrant.io:6333/collections/textbook_chunks
```

### Performance Metrics

```bash
# Check latency from Neon:
psql $NEON_DATABASE_URL
SELECT AVG(latency_ms), MAX(latency_ms), COUNT(*) FROM responses;

# Check error rate:
SELECT error_type, COUNT(*) FROM error_logs GROUP BY error_type;
```

## Troubleshooting

### Issue: "Qdrant connection refused"

**Solution**: 
```bash
# Ensure Qdrant is running
docker ps | grep qdrant

# If not, start it:
docker run -p 6333:6333 qdrant/qdrant:latest
```

### Issue: "No embeddings found"

**Solution**:
```bash
# Re-run embedding script
python -m src.scripts.embed_chapters
```

### Issue: "Chatbot returns empty answers"

**Solution**:
```bash
# Check if Neon is accessible:
psql $NEON_DATABASE_URL -c "SELECT COUNT(*) FROM document_chunks;"

# If empty, seed the database:
python -m src.scripts.seed_db
```

### Issue: Frontend build fails

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules yarn.lock
yarn install
yarn build
```

## Next Steps

1. ✅ **Setup complete**: You now have frontend + backend running locally
2. 📝 **Add chapters**: Write markdown content in `docs/chapter-*/`
3. 🧪 **Run tests**: `pytest` + `yarn test` before committing
4. 🚀 **Deploy**: Follow deployment guides above when ready
5. 📊 **Monitor**: Track latency, errors, and accuracy in Neon

## Further Reading

- **Docusaurus**: https://docusaurus.io/docs
- **FastAPI**: https://fastapi.tiangolo.com
- **Qdrant**: https://qdrant.tech/documentation/
- **Neon**: https://neon.tech/docs
- **sentence-transformers (MiniLM)**: https://www.sbert.net/docs/models/sentence_transformers_models.html
