# Deployment Checklist - Phase 8 (VALIDATION & LAUNCH)

## Pre-Deployment Verification (T-070)

### Code Quality Gates
- [ ] All tests pass: `pytest tests/ --cov=src` (coverage >= 80%)
- [ ] Linting passes: `pylint src/` (score >= 8.0)
- [ ] Type checking passes: `mypy src/` (no errors)
- [ ] No console.log/print statements left in code
- [ ] No hardcoded secrets (all in .env)
- [ ] No TODO comments without context

### Frontend Verification
- [ ] `yarn build` completes without errors
- [ ] Build output size < 5MB
- [ ] Docusaurus sidebar auto-generates correctly
- [ ] All 6 chapters render properly
- [ ] Chatbot widget loads on page
- [ ] No broken internal links
- [ ] Mobile responsive on 320px+ screens

### Backend Verification
- [ ] FastAPI server starts: `uvicorn src.main:app`
- [ ] Swagger UI accessible at `/docs`
- [ ] Health endpoint responds: `curl http://localhost:8000/api/v1/health`
- [ ] Database migrations run: `alembic upgrade head`
- [ ] Qdrant collection created and accessible
- [ ] MiniLM embeddings generated for all chunks (all 6 chapters)

### Integration Testing
- [ ] Test 50 representative queries (from research.md)
  - [ ] 40 in-scope queries return relevant answers
  - [ ] 10 out-of-scope queries return "not covered"
- [ ] Latency measurements:
  - [ ] Single query: p95 < 2s
  - [ ] p99 < 3s
- [ ] Concurrent queries test (10 parallel):
  - [ ] All complete successfully
  - [ ] No connection pool exhaustion
  - [ ] No race conditions in responses

### Security Checklist
- [ ] CORS headers configured for production domain
- [ ] API key management verified (no keys in git)
- [ ] Database connection uses SSL/TLS
- [ ] HTTPS enforced on frontend
- [ ] No sensitive data in error messages
- [ ] SQL injection protection: all queries use parameterized statements
- [ ] Rate limiting configured (optional: 100 requests/minute per IP)

---

## Production Deployment (T-071)

### Frontend Deployment (GitHub Pages)

#### Step 1: Configure Repository
```bash
# Ensure main branch is protected
# Settings > Branches > Add rule for 'main'
```

#### Step 2: Configure GitHub Pages
```bash
# Settings > Pages > Source: Deploy from branch
# Branch: gh-pages
# Folder: / (root)
```

#### Step 3: Update docusaurus.config.ts
```typescript
const config: Config = {
  url: 'https://username.github.io',
  baseUrl: '/ai-textbook/',
  organizationName: 'username',
  projectName: 'ai-textbook',
  deploymentBranch: 'gh-pages',
  // ... rest of config
};
```

#### Step 4: Trigger Deployment
```bash
git push origin main
# GitHub Actions automatically builds + deploys to gh-pages
```

#### Step 5: Verify Frontend
```bash
# Check deployment status: Settings > Deployments
# Visit: https://username.github.io/ai-textbook/
# Verify all chapters load
# Test chatbot widget appears
```

- [ ] GitHub Actions workflow succeeds
- [ ] Frontend site live at production URL
- [ ] All chapters render correctly
- [ ] Chatbot widget loads
- [ ] No console errors in browser DevTools
- [ ] CSP headers allow chatbot API calls

### Backend Deployment (Railway)

#### Step 1: Create Railway Account & Project
```bash
npm install -g @railway/cli
railway login
railway init
```

#### Step 2: Add PostgreSQL Database
```bash
railway add
# Select: PostgreSQL
# Auto-generates DATABASE_URL
```

#### Step 3: Configure Environment Variables
```bash
railway variables set QDRANT_URL=https://your-qdrant-cloud.qdrant.io
railway variables set QDRANT_API_KEY=<key-from-qdrant>
railway variables set SENTRY_DSN=<key-from-sentry>
railway variables set FRONTEND_URL=https://username.github.io/ai-textbook
railway variables set LOG_LEVEL=INFO
```

#### Step 4: Deploy Backend
```bash
railway up
# Railway builds + deploys automatically
# Get deployment URL from dashboard
```

#### Step 5: Run Database Migrations
```bash
railway exec alembic upgrade head
# Verifies migrations run successfully on production DB
```

#### Step 6: Verify Backend
```bash
# Health check
curl https://ai-textbook-api.railway.app/api/v1/health

# Test sample query
curl -X POST https://ai-textbook-api.railway.app/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "What is physical AI?", "language": "en"}'
```

- [ ] Railway deployment successful
- [ ] Health endpoint returns 200 OK
- [ ] Database connected and migrated
- [ ] Qdrant collection accessible
- [ ] Sample queries return correct answers
- [ ] No errors in Railway logs

### Environment Configuration Validation

#### Frontend Environment (.env.production)
```bash
# Frontend doesn't need .env for production (built into static site)
# Backend API URL configured in Docusaurus config
NEXT_PUBLIC_API_URL=https://ai-textbook-api.railway.app
```

#### Backend Environment
- [ ] `NEON_DATABASE_URL` set in Railway
- [ ] `QDRANT_URL` set and accessible
- [ ] `QDRANT_API_KEY` set securely
- [ ] `FRONTEND_URL` set to GitHub Pages domain
- [ ] `LOG_LEVEL` set to INFO
- [ ] `SENTRY_DSN` configured for error tracking

### DNS & Domain Configuration
- [ ] GitHub Pages domain verified (Settings > Pages)
- [ ] Custom domain (optional): Add CNAME record
  ```
  CNAME: username.github.io
  ```
- [ ] Test domain resolution: `nslookup username.github.io`

---

## Health Checks & Monitoring (Post-Launch)

### Immediate Post-Deployment (First Hour)
```bash
#!/bin/bash
echo "🚀 Post-deployment health checks..."

# 1. Frontend accessibility
echo "1️⃣ Frontend..."
curl -f https://username.github.io/ai-textbook/ && echo "✅ Frontend OK" || echo "❌ Frontend DOWN"

# 2. Backend health
echo "2️⃣ Backend health endpoint..."
curl -f https://ai-textbook-api.railway.app/api/v1/health && echo "✅ Backend OK" || echo "❌ Backend DOWN"

# 3. Sample query
echo "3️⃣ Sample query..."
curl -X POST https://ai-textbook-api.railway.app/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"query": "What is humanoid robotics?", "language": "en"}' \
  && echo "✅ Query OK" || echo "❌ Query FAILED"

# 4. Database check
echo "4️⃣ Database connection..."
# (Optional: connect via psql if needed)

# 5. Qdrant check
echo "5️⃣ Qdrant collection..."
curl https://api.qdrant.io/collections | grep -q textbook_chunks && echo "✅ Qdrant OK" || echo "❌ Qdrant FAILED"
```

### Ongoing Monitoring (Daily)

#### Log Monitoring
```bash
# Railway logs (last 100 lines)
railway logs --limit 100

# Filter for errors
railway logs | grep -i error
```

#### Metrics to Track
- **Latency**: p95, p99 response times
- **Error Rate**: < 1% target
- **Query Accuracy**: >= 95% in-scope queries
- **Uptime**: >= 99.0%
- **Database**: Connection pool usage, query times
- **Qdrant**: Search latency, collection size

#### Alerts to Configure
- [ ] HTTP 5xx errors: Alert if > 5/minute
- [ ] Database down: Alert immediately
- [ ] Latency spike: Alert if p95 > 3s
- [ ] Uptime down: Alert if consecutive failures > 3

### Sentry Error Tracking
- [ ] Log in to https://sentry.io
- [ ] Review errors from first 24 hours
- [ ] Check error patterns
- [ ] Document any new issues

### Uptime Monitoring
- [ ] Setup monitoring at https://uptime.is
- [ ] Monitor: `https://ai-textbook-api.railway.app/api/v1/health`
- [ ] Alert interval: 5 minutes
- [ ] Alert on 3 consecutive failures

---

## Rollback Procedures

### Frontend Rollback (if issues found)
```bash
# Revert to previous commit
git revert <commit-hash>
git push origin main

# GitHub Actions automatically redeploys
# Check deployment status: Settings > Deployments
```

### Backend Rollback (Railway)
```bash
# Option 1: Rollback via Railway CLI
railway deployments list
railway deployments rollback <deployment-id>

# Option 2: Rollback via Git
git revert <commit-hash>
git push origin main
# Railway automatically redeploys on main push
```

### Database Rollback (if migrations failed)
```bash
# Downgrade one migration version
railway exec alembic downgrade -1

# Or downgrade to specific version
railway exec alembic downgrade <revision>
```

---

## Post-Launch Tasks (First Week)

### Day 1
- [ ] Monitor logs continuously
- [ ] Collect user feedback
- [ ] Track top queries and accuracy
- [ ] Verify no critical errors

### Day 2-3
- [ ] Monitor latency trends
- [ ] Check database performance
- [ ] Verify Qdrant search quality
- [ ] Update documentation if needed

### Day 4-7
- [ ] Review error patterns
- [ ] Analyze query distribution
- [ ] Measure accuracy across chapters
- [ ] Prepare Phase 2 feature roadmap

### SLO Targets (First Month)
- [ ] Availability: 99.0% (max 7.2 min downtime/day)
- [ ] Latency p95: < 2s
- [ ] Accuracy: >= 95% in-scope
- [ ] Error budget: 1440 errors/month at 1M requests

---

## Launch Success Criteria ✅

All items must be completed before declaring "LAUNCH COMPLETE":

1. **Frontend Live**
   - [ ] Site accessible at GitHub Pages URL
   - [ ] All 6 chapters render
   - [ ] Chatbot widget loads
   - [ ] No console errors

2. **Backend Live**
   - [ ] API responds to requests
   - [ ] Health check passes
   - [ ] Database connected
   - [ ] Qdrant integrated

3. **Integration Complete**
   - [ ] 50 test queries pass
   - [ ] Latency < 2s p95
   - [ ] Accuracy >= 95%
   - [ ] 0 critical errors in logs

4. **Monitoring Active**
   - [ ] Sentry error tracking
   - [ ] Uptime monitoring
   - [ ] Log aggregation
   - [ ] Metrics dashboard

5. **Documentation Complete**
   - [ ] README updated with prod URLs
   - [ ] Deployment guide complete
   - [ ] Runbooks created
   - [ ] Team notified

---

## Production URLs

Once deployed:

- **Frontend**: `https://username.github.io/ai-textbook/`
- **Backend API**: `https://ai-textbook-api.railway.app`
- **API Docs**: `https://ai-textbook-api.railway.app/docs`
- **Health Check**: `https://ai-textbook-api.railway.app/api/v1/health`

---

**Status**: ⏳ READY FOR DEPLOYMENT

**Next**: Execute this checklist step-by-step, verifying each section.
