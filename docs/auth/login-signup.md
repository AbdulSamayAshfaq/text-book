---
sidebar_position: 1
---

# Authentication System

The platform uses BetterAuth for secure authentication with role-based access control.

## Features

- ✅ Email/Password Authentication
- 🔐 JWT Token-based Sessions
- 👥 Role-Based Access Control (RBAC)
- 🔄 Token Refresh
- 📱 Session Management

## User Roles

| Role | Permissions | Use Case |
|------|-------------|----------|
| **admin** | Full system access, manage users, delete documents | Admin panel |
| **user** | View textbook, chat, upload documents | General users |
| **hr** | Access HR policies, approve requests | HR personnel |
| **employee** | Limited access, HR features | Employees |

## Login & Signup

### POST /api/v1/auth/login

```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "user": {
    "id": "usr_123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "user"
  },
  "token": "eyJhbGc...",
  "expires_in": 86400
}
```

### POST /api/v1/auth/signup

```json
{
  "email": "newuser@example.com",
  "name": "Jane Doe",
  "password": "secure_password"
}
```

## Protected Routes

All endpoints require Authorization header:

```
Authorization: Bearer <your_token>
```

### Example

```javascript
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};

fetch('/api/v1/rag/query', {
  method: 'POST',
  headers,
  body: JSON.stringify({ query: 'What is AI?' })
});
```

## Token Refresh

Tokens expire after 24 hours. Refresh using:

### POST /api/v1/auth/refresh

```json
{
  "token": "old_token"
}
```

## Logout

### POST /api/v1/auth/logout

Invalidates the current session.
