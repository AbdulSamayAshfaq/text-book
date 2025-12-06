# AI-Native Textbook Backend

Backend service for the Physical AI & Humanoid Robotics textbook with RAG chatbot integration.

## Quick Start

### Prerequisites
- Python 3.11+
- PostgreSQL (or Neon)
- Qdrant instance
- Docker (optional, for local development)

### Local Development Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/username/ai-textbook.git
   cd ai-textbook/backend
   ```

2. **Create virtual environment**
   ```bash
   python3.11 -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your credentials
   ```

5. **Start Qdrant locally (Docker)**
   ```bash
   docker run -p 6333:6333 qdrant/qdrant:latest
   ```

6. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

7. **Generate embeddings**
   ```bash
   python -m src.scripts.embed_chapters
   ```

8. **Start development server**
   ```bash
   uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
   ```

9. **Access API**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc
   - Health: http://localhost:8000/api/v1/health

## Project Structure

```
backend/
├── src/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Configuration settings
│   ├── models/                 # SQLAlchemy + Pydantic models
│   │   ├── chapter.py
│   │   ├── section.py
│   │   ├── chunk.py
│   │   ├── embedding.py
│   │   ├── query.py
│   │   ├── response.py
│   │   ├── session.py
│   │   └── error_log.py
│   ├── services/               # Business logic
│   │   ├── embedding.py        # MiniLM embedding service
│   │   ├── retrieval.py        # Qdrant search service
│   │   ├── chatbot.py          # Chatbot orchestration
│   │   └── logger.py           # Structured logging
│   ├── api/                    # API endpoints
│   │   ├── v1/
│   │   │   ├── chat.py         # POST /api/v1/chat
│   │   │   └── health.py       # GET /api/v1/health
│   │   └── __init__.py
│   ├── db/                     # Database
│   │   ├── connection.py       # Connection pool
│   │   ├── models.py           # Base models
│   │   └── migrations/         # Alembic migrations
│   └── scripts/                # Utility scripts
│       └── embed_chapters.py   # Generate embeddings
├── tests/
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   ├── contract/               # API contract tests
│   └── performance/            # Load tests
├── alembic.ini                 # Database migrations
├── requirements.txt            # Python dependencies
├── .env.example                # Example environment variables
├── Dockerfile                  # Docker container
├── pyproject.toml              # Project metadata
└── README.md                   # This file
```

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
# Database
NEON_DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-1.aws.neon.tech/dbname

# Vector Store
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=

# Logging
LOG_LEVEL=INFO

# Embeddings
HF_HOME=/tmp/huggingface

# API
API_HOST=127.0.0.1
API_PORT=8000
DEBUG=True

# Frontend (CORS)
FRONTEND_URL=http://localhost:3000
```

## Testing

### Run all tests
```bash
pytest tests/ -v
```

### Run specific test category
```bash
pytest tests/unit/ -v              # Unit tests
pytest tests/integration/ -v       # Integration tests
pytest tests/contract/ -v          # API contract tests
pytest tests/performance/ -v       # Load tests
```

### With coverage
```bash
pytest tests/ --cov=src --cov-report=html
# Open htmlcov/index.html
```

## Code Quality

### Format code
```bash
black src/ tests/
```

### Lint code
```bash
pylint src/
```

### Type checking
```bash
mypy src/ --ignore-missing-imports
```

### Run all checks
```bash
black --check src/
pylint src/
mypy src/
pytest tests/
```

## API Endpoints

### Chat Endpoint
```
POST /api/v1/chat
Content-Type: application/json

{
  "query": "What is physical AI?",
  "language": "en"
}

Response 200:
{
  "answer": "Physical AI refers to...",
  "sources": [
    {
      "chapter": "Chapter 1: Introduction",
      "section": "Defining Physical AI",
      "text": "..."
    }
  ],
  "latency_ms": 1200,
  "in_scope": true
}
```

### Health Endpoint
```
GET /api/v1/health

Response 200:
{
  "status": "ok",
  "components": {
    "database": true,
    "qdrant": true
  },
  "timestamp": "2025-12-06T10:00:00Z"
}
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Production Deployment (Railway)
```bash
railway init
railway add postgres
railway variables set NEON_DATABASE_URL=...
railway variables set QDRANT_URL=...
railway variables set QDRANT_API_KEY=...
railway up
```

## Troubleshooting

### Issue: "ModuleNotFoundError: No module named 'src'"
**Solution**: Install with editable mode:
```bash
pip install -e .
```

### Issue: Qdrant connection refused
**Solution**: Start Qdrant container:
```bash
docker run -p 6333:6333 qdrant/qdrant:latest
```

### Issue: Database connection timeout
**Solution**: Verify DATABASE_URL is correct:
```bash
python -c "from sqlalchemy import create_engine; engine = create_engine(os.getenv('NEON_DATABASE_URL')); engine.connect()"
```

### Issue: Embeddings take too long
**Solution**: MiniLM model downloads on first run (~50MB). Subsequent runs use cached model.

## Monitoring

### View logs
```bash
# Local
tail -f logs/app.log

# Railway
railway logs
```

### Performance metrics
Latency and accuracy tracked in response objects. Sample query logging available via dashboard.

## Contributing

1. Create feature branch: `git checkout -b feature/xyz`
2. Write tests first (TDD)
3. Implement feature
4. Run quality checks: `pytest`, `black`, `pylint`, `mypy`
5. Commit: `git commit -m "feat: xyz"`
6. Push: `git push origin feature/xyz`
7. Create Pull Request

## License

MIT License - See LICENSE file

## Support

- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: contact@example.com

---

**Status**: 🚀 Ready for production deployment
