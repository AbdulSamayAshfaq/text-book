---
sidebar_position: 1
---

# Database Schema

## Tables

### users
User accounts and profiles.

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user', 'hr', 'employee') DEFAULT 'user',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### sessions
Active user sessions.

```sql
CREATE TABLE sessions (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### documents
Indexed documents for RAG.

```sql
CREATE TABLE documents (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  source VARCHAR(255),
  file_type VARCHAR(10),
  file_size INT,
  upload_user_id VARCHAR(36),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  indexed_at TIMESTAMP,
  FOREIGN KEY (upload_user_id) REFERENCES users(id)
);
```

### document_chunks
Text chunks extracted from documents.

```sql
CREATE TABLE document_chunks (
  id VARCHAR(36) PRIMARY KEY,
  document_id VARCHAR(36) NOT NULL,
  chunk_index INT,
  content TEXT NOT NULL,
  embedding VECTOR(384),
  metadata JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (document_id) REFERENCES documents(id)
);
```

### chat_history
Conversation history.

```sql
CREATE TABLE chat_history (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  query TEXT,
  response TEXT,
  sources JSON,
  latency_ms INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Indexes

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_documents_uploaded_at ON documents(uploaded_at);
CREATE INDEX idx_chunks_document_id ON document_chunks(document_id);
CREATE INDEX idx_chat_user_id ON chat_history(user_id);
```
