---
sidebar_position: 3
---

# Role-Based Access Control (RBAC)

## Roles

The system has four user roles with different permissions:

### 1. Admin (admin)

**Permissions:**
- ✅ Full system access
- ✅ Manage users
- ✅ Delete/modify documents
- ✅ View system logs
- ✅ Access admin dashboard
- ✅ Manage roles and permissions

**Routes:**
```
/admin/*
/api/v1/admin/*
/api/v1/users/*
/api/v1/system/*
```

### 2. User (user)

**Permissions:**
- ✅ View entire textbook
- ✅ Use chatbot (unlimited queries)
- ✅ Upload documents to RAG
- ✅ View own documents
- ✅ Access all content

**Routes:**
```
/docs/*
/api/v1/chat
/api/v1/rag/*
/api/v1/documents
```

### 3. HR (hr)

**Permissions:**
- ✅ All user permissions
- ✅ Access HR policies
- ✅ View HR documents
- ✅ Manage HR-related content
- ✅ Access HR dashboard

**Routes:**
```
/docs/*
/api/v1/chat
/api/v1/rag/*
/api/v1/hr/*
```

### 4. Employee (employee)

**Permissions:**
- ⚠️ Limited textbook access (HR chapters)
- ✅ Use chatbot for HR questions
- ✅ View own documents
- ✅ Access HR policies
- ❌ Cannot upload documents

**Routes:**
```
/docs/hr/*
/api/v1/chat (HR queries only)
/api/v1/hr/my-documents
```

## Checking Permissions

### Frontend (React)

```typescript
import { useAuth } from '@/hooks/useAuth';

export function AdminPanel() {
  const { user } = useAuth();
  
  if (user?.role !== 'admin') {
    return <Unauthorized />;
  }
  
  return <AdminDashboard />;
}
```

### Backend (Python)

```python
from fastapi import Depends
from src.auth.models import User

async def require_admin(user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user

@app.delete("/api/v1/users/{user_id}")
async def delete_user(user_id: str, admin: User = Depends(require_admin)):
    # Delete user
    return {"status": "deleted"}
```

## Permission Matrix

| Action | Admin | User | HR | Employee |
|--------|-------|------|----|----|
| View Textbook | ✅ | ✅ | ✅ | ⚠️ (HR only) |
| Chat | ✅ | ✅ | ✅ | ✅ |
| Upload Docs | ✅ | ✅ | ✅ | ❌ |
| Delete Docs | ✅ | ⚠️ (own) | ✅ | ❌ |
| Manage Users | ✅ | ❌ | ❌ | ❌ |
| HR Features | ✅ | ❌ | ✅ | ✅ |
| Admin Panel | ✅ | ❌ | ❌ | ❌ |

## Changing User Role

### Admin API

```bash
PUT /api/v1/admin/users/{user_id}/role
Content-Type: application/json
Authorization: Bearer <admin_token>

{
  "role": "hr"
}
```

## Default Behavior

- **New signups**: Assigned `user` role by default
- **Email domain detection**: Auto-assign `hr` for @company.com emails
- **Admins only**: Can manually assign roles
