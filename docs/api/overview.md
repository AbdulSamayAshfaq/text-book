---
sidebar_position: 1
---

# API Overview

## Base URL

```
http://localhost:8000
```

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All API responses follow this format:

```json
{
  "data": { /* response data */ },
  "status": "success|error",
  "timestamp": "2025-12-11T10:30:00Z",
  "latency_ms": 245
}
```

## Error Responses

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Detailed error message",
    "details": { /* additional context */ }
  },
  "status": "error",
  "timestamp": "2025-12-11T10:30:00Z"
}
```

## Rate Limiting

- **Free Tier**: 100 requests/day
- **Premium**: Unlimited
- **Rate limit headers**:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Versioning

API versions in URL: `/api/v1/`, `/api/v2/`, etc.

Current stable version: **v1**
