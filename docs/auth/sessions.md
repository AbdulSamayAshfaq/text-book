---
sidebar_position: 2
---

# Session Management

## Overview

Sessions are created when a user logs in and remain active until logout or token expiration.

## Session Lifecycle

```
1. User Login
    ↓
2. Session Created with JWT token
    ↓
3. Token stored in localStorage (frontend)
    ↓
4. Sent with each request
    ↓
5. Server validates token
    ↓
6. User logout or token expires
    ↓
7. Session invalidated
```

## Token Structure

JWT tokens contain:
- `user_id`: User identifier
- `exp`: Expiration timestamp
- `iat`: Issued at timestamp
- `role`: User role

```python
# Python example
import jwt
from datetime import datetime

payload = jwt.decode(token, secret_key, algorithms=['HS256'])
print(payload)
# {
#   'user_id': 'usr_123',
#   'exp': 1733904000,
#   'iat': 1733817600,
#   'role': 'user'
# }
```

## Session Duration

- **Default**: 24 hours
- **Remember Me**: 30 days
- **Max Inactive**: 7 days

## Multiple Sessions

Users can have multiple active sessions (e.g., on phone and desktop).

**Get All Sessions:**

```bash
GET /api/v1/auth/sessions
Authorization: Bearer <token>
```

**Response:**
```json
{
  "sessions": [
    {
      "id": "ses_123",
      "device": "Chrome on macOS",
      "last_active": "2025-12-11T10:30:00Z",
      "ip_address": "192.168.1.1",
      "created_at": "2025-12-10T10:30:00Z"
    }
  ]
}
```

**Logout Specific Session:**

```bash
POST /api/v1/auth/sessions/ses_123/logout
Authorization: Bearer <token>
```

## Security Best Practices

- ✅ Always use HTTPS
- ✅ Store token in secure, httpOnly cookies
- ✅ Never share tokens in logs
- ✅ Refresh tokens periodically
- ✅ Revoke tokens on logout
- ✅ Use short expiration times
