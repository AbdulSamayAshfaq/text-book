# Production Environment Configuration Guide

## Overview

This guide covers environment setup for **local development**, **staging**, and **production** deployments.

---

## Local Development

### Frontend (.env.local)
```bash
# Not typically needed for Docusaurus static site
# But if using any build-time environment variables:

SITE_URL=http://localhost:3000
API_URL=http://localhost:8000/api/v1
```

### Backend (.env.local)
Create `backend/.env.local`:
```bash
# Database
NEON_DATABASE_URL=postgresql://user:password@localhost:5432/textbook_dev

# Or SQLite for local testing
# DATABASE_URL=sqlite:///./textbook.db

# Vector Store - Local Qdrant (Docker)
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=

# Logging
LOG_LEVEL=DEBUG

# Embeddings Model Cache
HF_HOME=/tmp/huggingface

# API Server
API_HOST=127.0.0.1
API_PORT=8000
DEBUG=True

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### Setup Local Backend
```bash
cd backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start local Qdrant (Docker)
docker run -p 6333:6333 -p 6334:6334 qdrant/qdrant:latest

# Run migrations
alembic upgrade head

# Start server
uvicorn src.main:app --reload --host 127.0.0.1 --port 8000
```

### Test Local Setup
```bash
# Health check
curl http://localhost:8000/api/v1/health

# Sample query
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "What is AI?", "language": "en"}'
```

---

## Staging Environment

### Frontend (Docusaurus Build)
```bash
# Build static site
yarn build

# Serve locally to test production build
yarn serve

# Visit http://localhost:3000
```

### Backend (Staging on Railway)

#### Create Staging Railway Project
```bash
railway init --name ai-textbook-staging
```

#### Configure Staging Environment Variables
```bash
railway variables set ENVIRONMENT=staging
railway variables set NEON_DATABASE_URL=<staging-db-url>
railway variables set QDRANT_URL=https://staging-qdrant.qdrant.io
railway variables set QDRANT_API_KEY=<staging-key>
railway variables set SENTRY_DSN=<sentry-staging-dsn>
railway variables set FRONTEND_URL=https://username.github.io/ai-textbook-staging/
railway variables set LOG_LEVEL=INFO
```

#### Deploy Staging
```bash
railway up
```

#### Test Staging
```bash
# Health check
curl https://ai-textbook-staging.railway.app/api/v1/health

# Full 50-query validation
# See research.md for test queries
```

---

## Production Environment

### Frontend (GitHub Pages)

#### Configuration in docusaurus.config.ts
```typescript
import Config from '@docusaurus/types';

const config: Config = {
  title: 'Physical AI & Humanoid Robotics — Essentials',
  tagline: 'Free interactive textbook with AI-powered chatbot',
  url: 'https://username.github.io',
  baseUrl: '/ai-textbook/',
  organizationName: 'username',
  projectName: 'ai-textbook',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: 'https://github.com/username/ai-textbook/tree/main/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  plugins: [
    // Optional: Analytics plugin
    // [
    //   'google-analytics',
    //   {
    //     trackingID: 'G-XXXXXXXXXX',
    //     anonymizeIP: true,
    //   },
    // ],
  ],

  themeConfig: {
    metadata: [
      {
        name: 'keywords',
        content: 'physics, AI, humanoid robotics, textbook, free, interactive',
      },
    ],
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
  },
};

export default config;
```

#### Environment Variables (GitHub Actions)
No special environment variables needed for frontend—build is self-contained.

The chatbot widget dynamically discovers the backend API URL:
```typescript
// src/components/ChatbotWidget/ChatbotWidget.tsx
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://ai-textbook-api.railway.app/api/v1'
  : 'http://localhost:8000/api/v1';
```

### Backend (Railway Production)

#### Environment Variables (.env.production)
```bash
# Environment
ENVIRONMENT=production

# Database (Railway PostgreSQL addon)
DATABASE_URL=${DATABASE_URL}  # Auto-set by Railway

# Alternatively, Neon
NEON_DATABASE_URL=postgresql://username:password@ep-xxxxx.us-east-1.aws.neon.tech/dbname

# Vector Store (Qdrant Cloud)
QDRANT_URL=https://qdrant-instance.qdrant.io
QDRANT_API_KEY=<secure-api-key>

# Logging & Monitoring
LOG_LEVEL=INFO
SENTRY_DSN=https://key@sentry.io/project-id

# Embeddings
HF_HOME=/tmp/huggingface

# API Server
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=False

# Frontend URL (CORS)
FRONTEND_URL=https://username.github.io/ai-textbook

# Optional: Rate limiting
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW_SECONDS=60
```

#### Setting Railway Environment Variables
```bash
# Via CLI
railway variables set DATABASE_URL=<neon-url>
railway variables set QDRANT_URL=https://your-qdrant-cloud.qdrant.io
railway variables set QDRANT_API_KEY=<api-key>
railway variables set SENTRY_DSN=<sentry-dsn>
railway variables set FRONTEND_URL=https://username.github.io/ai-textbook

# Or via Railway Dashboard:
# Project Settings → Environment
```

---

## Secrets Management

### Secrets That Should Never Be In Git
- Database passwords
- Qdrant API keys
- Sentry DSN
- Any private API keys

### Railway Secrets
```bash
# Add secret (not visible in logs)
railway variables set SECRET_NAME=value

# Verify (won't show value)
railway variables list

# Delete
railway variables unset SECRET_NAME
```

### GitHub Secrets (for CI/CD)
```bash
# Settings → Secrets and variables → Actions → New repository secret

RAILWAY_TOKEN=<your-railway-token>
RAILWAY_PROJECT_ID=<project-id>
RAILWAY_SERVICE_ID=<service-id>
```

---

## Data Sources & Configuration

### Qdrant Vector Database

#### Option 1: Qdrant Cloud (Recommended for Free Tier)
1. Sign up: https://cloud.qdrant.io
2. Create collection: `textbook_chunks`
3. Get API URL and key
4. Set in environment:
   ```bash
   railway variables set QDRANT_URL=https://your-instance.qdrant.io
   railway variables set QDRANT_API_KEY=<your-key>
   ```

#### Option 2: Self-Hosted Qdrant (Docker)
```bash
docker run -p 6333:6333 qdrant/qdrant:latest
```

Set environment:
```bash
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=  # Empty for local
```

### PostgreSQL Database

#### Option 1: Neon (Recommended for Free Tier)
1. Sign up: https://neon.tech
2. Create project
3. Get connection string
4. Set in environment:
   ```bash
   railway variables set NEON_DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-1.aws.neon.tech/dbname
   ```

#### Option 2: Railway PostgreSQL Addon
```bash
railway add
# Select: PostgreSQL
# Auto-sets DATABASE_URL
```

#### Option 3: Local PostgreSQL
```bash
docker run -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15-alpine
```

Set environment:
```bash
DATABASE_URL=postgresql://postgres:password@localhost:5432/textbook
```

---

## Embedding Model Cache

### Local Development
```bash
# Model auto-downloads to ~/.cache/huggingface
export HF_HOME=/tmp/huggingface
```

### Railway Production
```bash
# Model downloads to /tmp (ephemeral, re-downloads on cold start)
railway variables set HF_HOME=/tmp/huggingface
```

### Optimize for Production
```bash
# Option: Pre-cache model in Docker layer
# (See backend/Dockerfile)

FROM python:3.11-slim
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('all-MiniLM-L6-v2')"
```

---

## CORS Configuration

### Frontend Domain
```python
# backend/src/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://username.github.io",  # Production
        "http://localhost:3000",         # Local dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Update on Deployment
Change `allow_origins` when deploying to production.

---

## Monitoring & Observability

### Structured Logging
```python
import structlog

logger = structlog.get_logger()

# Logs auto-sent to Railway dashboard
logger.info("query_received", query=query_text, language=language)
logger.error("database_error", error=str(e), context={"query": query_text})
```

### Sentry Error Tracking
```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    integrations=[FastApiIntegration()],
    traces_sample_rate=0.1,
    environment=os.getenv("ENVIRONMENT", "development"),
)
```

### Uptime Monitoring
Monitor: `https://ai-textbook-api.railway.app/api/v1/health`

Service: https://uptime.is (free tier)

---

## Configuration Checklist

### Pre-Launch
- [ ] Frontend URL configured in docusaurus.config.ts
- [ ] Backend API URL configured in chatbot widget
- [ ] Railway project created
- [ ] PostgreSQL database provisioned
- [ ] Qdrant instance running
- [ ] All environment variables set
- [ ] CORS configured for production domain
- [ ] Error tracking (Sentry) configured
- [ ] Structured logging active

### Post-Launch
- [ ] Health endpoint responds 200 OK
- [ ] Sample queries return correct answers
- [ ] Latency < 2s p95 measured
- [ ] Error rate < 1%
- [ ] Uptime monitoring active
- [ ] Logs readable in Railway dashboard

---

**Deployment Ready**: ✅ All configurations prepared
