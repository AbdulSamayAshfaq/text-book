# Backend Production Deployment Configuration

## Environment Variables

### Local Development (.env.local)
```bash
# Database
NEON_DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-1.aws.neon.tech/dbname

# Vector Store
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=your-api-key-if-cloud

# Logging
LOG_LEVEL=INFO

# Embeddings
HF_HOME=/tmp/huggingface  # MiniLM model cache

# API
API_HOST=127.0.0.1
API_PORT=8000
DEBUG=True
```

### Railway Production (.env.production)
```bash
# Database (Railway PostgreSQL addon)
DATABASE_URL=${DATABASE_URL}

# Vector Store (Qdrant Cloud)
QDRANT_URL=https://qdrant-instance.qdrant.io
QDRANT_API_KEY=${QDRANT_API_KEY}

# Logging
LOG_LEVEL=INFO

# Embeddings
HF_HOME=/tmp/huggingface

# API
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=False

# Frontend URL (CORS)
FRONTEND_URL=https://username.github.io/ai-textbook

# Monitoring
SENTRY_DSN=${SENTRY_DSN}
```

## Railway Setup

### 1. Create Railway Project
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init
```

### 2. Add PostgreSQL Addon
```bash
railway add
# Select: PostgreSQL
# This auto-populates DATABASE_URL
```

### 3. Set Environment Variables
```bash
railway variables set QDRANT_URL=https://your-qdrant-cloud.qdrant.io
railway variables set QDRANT_API_KEY=<your-api-key>
railway variables set SENTRY_DSN=<your-sentry-dsn>
railway variables set FRONTEND_URL=https://username.github.io/ai-textbook
```

### 4. Deploy from Git
```bash
# Link repository
railway link

# Deploy
railway up
```

## Vercel Alternative (if preferred)

### vercel.json
```json
{
  "buildCommand": "cd backend && pip install -r requirements.txt",
  "installCommand": "pip install -r backend/requirements.txt",
  "framework": "other",
  "public": false,
  "env": [
    "NEON_DATABASE_URL",
    "QDRANT_URL",
    "QDRANT_API_KEY",
    "LOG_LEVEL"
  ],
  "functions": {
    "backend/src/main.py": {
      "runtime": "python3.11"
    }
  }
}
```

### Deploy to Vercel
```bash
vercel --prod --env NEON_DATABASE_URL=... --env QDRANT_URL=... --env QDRANT_API_KEY=...
```

## Docker Deployment (Self-Hosted)

### Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY backend/src ./src

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/api/v1/health || exit 1

# Run server
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### docker-compose.yml
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: textbook
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: textbook_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

  backend:
    build:
      context: .
      dockerfile: backend/Dockerfile
    depends_on:
      - postgres
      - qdrant
    environment:
      DATABASE_URL: postgresql://textbook:${DB_PASSWORD}@postgres:5432/textbook_db
      QDRANT_URL: http://qdrant:6333
      LOG_LEVEL: INFO
    ports:
      - "8000:8000"

volumes:
  postgres_data:
  qdrant_data:
```

## Health Checks

### Backend Health Endpoint
```bash
curl https://ai-textbook-api.railway.app/api/v1/health
```

Expected response:
```json
{
  "status": "ok",
  "components": {
    "database": true,
    "qdrant": true
  },
  "timestamp": "2025-12-06T10:00:00Z"
}
```

### Health Check Script
```bash
#!/bin/bash
set -e

API_URL=${API_URL:-"https://ai-textbook-api.railway.app"}
MAX_RETRIES=5
RETRY_INTERVAL=10

echo "🔍 Checking backend health..."

for i in $(seq 1 $MAX_RETRIES); do
  if curl -sf "$API_URL/api/v1/health" > /dev/null; then
    echo "✅ Backend is healthy"
    exit 0
  fi
  
  if [ $i -lt $MAX_RETRIES ]; then
    echo "⏳ Attempt $i/$MAX_RETRIES failed, retrying in ${RETRY_INTERVAL}s..."
    sleep $RETRY_INTERVAL
  fi
done

echo "❌ Backend health check failed after $MAX_RETRIES attempts"
exit 1
```

## Monitoring & Observability

### Sentry (Error Tracking)
1. Create Sentry account: https://sentry.io
2. Create project for FastAPI
3. Set `SENTRY_DSN` environment variable
4. Errors automatically reported

### Uptime Monitoring
1. Use free service: https://uptime.is
2. Monitor `GET /api/v1/health` endpoint
3. Alert on 3 consecutive failures

### Logs
- Railway: Built-in dashboard at railway.app
- Check PostgreSQL logs: `railway logs --service postgres`
- Check API logs: `railway logs`

## Rollback Procedure

### Rollback to Previous Deployment
```bash
# List deployments
railway deployments list

# Rollback to specific deployment
railway deployments rollback <deployment-id>

# Or via Git
git revert <commit-hash>
git push main
# CI/CD will automatically redeploy
```

### Database Rollback
```bash
# If migrations failed
alembic downgrade -1  # Downgrade one version
railway exec alembic downgrade -1  # On production
```

## Pre-Launch Checklist

- [ ] GitHub Pages domain configured
- [ ] Railway project created
- [ ] PostgreSQL addon added
- [ ] Qdrant instance running (cloud or self-hosted)
- [ ] All environment variables set
- [ ] Health endpoint returns 200 OK
- [ ] Sample queries return correct answers
- [ ] CORS configured for GitHub Pages domain
- [ ] Error tracking (Sentry) configured
- [ ] CI/CD workflows tested on main branch
- [ ] Database migrations run successfully
- [ ] Embeddings generated and loaded
- [ ] Performance tests pass (p95 < 2s)
- [ ] 10 concurrent queries handled correctly
- [ ] No errors in production logs

## Post-Launch Monitoring

### First 24 Hours
- [ ] Monitor error logs every hour
- [ ] Verify latency < 2s p95
- [ ] Check database connections (max 10 concurrent)
- [ ] Verify Qdrant responsiveness

### First Week
- [ ] Monitor error rate (target < 1%)
- [ ] Collect user feedback
- [ ] Track query patterns
- [ ] Verify accuracy >= 95%

### Production SLOs
- Availability: 99.0% (max 7.2 minutes downtime/day)
- Latency p95: < 2s
- Accuracy: >= 95% in-scope queries
- Error budget: 1440 errors/month at 1M requests/month

