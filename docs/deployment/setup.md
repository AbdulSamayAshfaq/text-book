---
sidebar_position: 1
---

# Setup Guide

Complete setup instructions for the AI Textbook project.

## Prerequisites

- Node.js ≥ 20
- Python ≥ 3.11
- PostgreSQL ≥ 14
- Qdrant ≥ 2.0
- Docker (optional, recommended)

## Quick Start (Local)

### 1. Clone Repository

```bash
git clone https://github.com/AbdulSamayAshfaq/text-book.git
cd text-book
```

### 2. Setup Frontend

```bash
npm install
cp .env.example .env
# Edit .env with your configuration
npm run start
```

Frontend runs at: `http://localhost:3000`

### 3. Setup Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
# or with poetry:
# poetry install

python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: `http://localhost:8000`

### 4. Setup Database

```bash
# Create database
createdb textbook_db

# Run migrations (if applicable)
cd backend
alembic upgrade head
```

### 5. Setup Vector DB (Qdrant)

**Option A: Docker (Recommended)**

```bash
docker run -p 6333:6333 \
  -v qdrant_storage:/qdrant/storage \
  qdrant/qdrant
```

Qdrant runs at: `http://localhost:6333`

**Option B: Local Installation**

```bash
# Download and install from: https://qdrant.tech/

qdrant
```

## Configuration

### Environment Variables

```bash
# Copy template
cp .env.example .env

# Edit with your values
nano .env
```

Key variables:
- `FRONTEND_URL`: Frontend location
- `DATABASE_URL`: PostgreSQL connection
- `JWT_SECRET`: Secret key for tokens
- `OPENAI_API_KEY`: For LLM features
- `QDRANT_HOST/PORT`: Vector DB

### Database Setup

```bash
# Create tables
python -c "from backend.src.db import init_db; init_db()"
```

## Development

### Install Dependencies

```bash
# Frontend
npm install

# Backend
cd backend
pip install -r requirements.txt
```

### Run Development Servers

**Terminal 1: Frontend**
```bash
npm run start
```

**Terminal 2: Backend**
```bash
npm run backend:dev
# or directly:
# cd backend && python -m uvicorn src.main:app --reload
```

### Available Commands

```bash
# Frontend
npm run build          # Build for production
npm run typecheck      # Type checking
npm run spec:generate  # Generate docs
npm run spec:sync      # Sync specs to docs
npm run spec:validate  # Validate specs
npm run dev            # Run both frontend + backend

# Backend
npm run backend:dev    # Run backend dev server
npm run backend:build  # Build backend
```

## Docker Setup (Recommended for Production)

### Using Docker Compose

```yaml
# docker-compose.yml provided
docker-compose up -d
```

Services started:
- Frontend on :3000
- Backend on :8000
- PostgreSQL on :5432
- Qdrant on :6333

## Testing

```bash
# Frontend tests
npm test

# Backend tests
cd backend && pytest
```

## Deployment

See [Deployment Guide](./deployment-guide.md) for production setup.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | `lsof -i :3000` then kill process |
| Database connection error | Check `DATABASE_URL` in `.env` |
| Qdrant not connecting | Ensure Qdrant running on `:6333` |
| Module not found | Run `pip install -r requirements.txt` |

## Support

Having issues? See:
- [Docs](https://docs.example.com)
- [Issues on GitHub](https://github.com/.../issues)
