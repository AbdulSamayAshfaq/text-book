---
sidebar_position: 2
---

# Deployment Guide

Production deployment instructions for the AI Textbook platform.

## Pre-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL/TLS certificates obtained
- [ ] Domain registered and DNS configured
- [ ] Backup strategy defined
- [ ] Monitoring and alerts set up
- [ ] CDN configured (optional)

## Deployment Options

### Option 1: Docker Compose (Recommended for small deployments)

```bash
# Build images
docker-compose build

# Deploy
docker-compose up -d

# View logs
docker-compose logs -f
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - API_URL=http://backend:8000
    depends_on:
      - backend

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/textbook
      - QDRANT_HOST=qdrant
    depends_on:
      - db
      - qdrant

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=textbook_db
      - POSTGRES_USER=textbook_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
    volumes:
      - qdrant_storage:/qdrant/storage

volumes:
  postgres_data:
  qdrant_storage:
```

### Option 2: Kubernetes (For large-scale deployments)

```bash
# Create namespace
kubectl create namespace textbook

# Deploy using Helm (if available)
helm install textbook ./helm-chart -n textbook

# Or apply manifests
kubectl apply -f k8s/ -n textbook
```

### Option 3: Cloud Platforms

#### Heroku
```bash
heroku create textbook-prod
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add heroku/python

git push heroku main
```

#### AWS EC2
```bash
# Launch instance
aws ec2 run-instances --image-id ami-0c55b159cbfafe1f0 --instance-type t3.medium

# SSH and deploy
ssh -i key.pem ubuntu@instance.ip
git clone ...
./deploy.sh
```

#### Google Cloud Run
```bash
gcloud run deploy textbook --source .
```

## SSL/HTTPS

### Using Let's Encrypt

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Configure nginx with SSL
sudo certbot install --nginx
```

### Environment Configuration

```bash
# .env.production
FRONTEND_URL=https://yourdomain.com
API_URL=https://api.yourdomain.com
SECURE_COOKIES=true
```

## Database Migrations

```bash
# Run migrations in production
cd backend
alembic upgrade head

# Backup before migration
pg_dump textbook_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Monitoring & Logging

### Application Logs
```bash
docker-compose logs -f backend
```

### System Metrics
- CPU usage
- Memory usage
- Disk I/O
- Network bandwidth

### Recommended Tools
- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Prometheus + Grafana** (metrics + dashboards)
- **Sentry** (error tracking)
- **New Relic** (APM)

## Performance Optimization

### Caching
```python
# Redis caching for API responses
CACHE_TTL=300  # 5 minutes
REDIS_URL=redis://localhost:6379
```

### CDN
- CloudFlare (recommended)
- AWS CloudFront
- Akamai

### Database
- Connection pooling
- Index optimization
- Query caching

## Backup & Recovery

### Daily Backups
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
pg_dump $DATABASE_URL > "$BACKUP_DIR/db_$DATE.sql"

# Backup volumes
tar -czf "$BACKUP_DIR/data_$DATE.tar.gz" /qdrant/storage

# Upload to S3
aws s3 cp "$BACKUP_DIR/" s3://my-backups/ --recursive
```

### Recovery
```bash
# Restore database
psql $DATABASE_URL < backup.sql

# Restore vector DB
tar -xzf data_backup.tar.gz -C /qdrant/storage
```

## Security

### Firewall Rules
```bash
# Allow only needed ports
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw allow 5432  # PostgreSQL (internal only)
```

### Secrets Management
- Use AWS Secrets Manager
- Or HashiCorp Vault
- Never commit secrets to git

### API Rate Limiting
```python
# In backend
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)

@app.post("/api/v1/chat")
@limiter.limit("100/day")
async def chat(request):
    pass
```

## Scaling

### Horizontal Scaling
- Load balancer (NGINX, HAProxy)
- Multiple backend instances
- Shared database
- Distributed cache

### Vertical Scaling
- Larger compute instances
- More RAM
- Faster CPUs

## Monitoring Checklist


## Support & Troubleshooting

 For common issues, check the deployment logs and ensure all environment variables are properly configured.
