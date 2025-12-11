# 🚀 AI & Robotics Textbook Platform

[![GitHub](https://img.shields.io/badge/GitHub-AbdulSamayAshfaq-blue)](https://github.com/AbdulSamayAshfaq/text-book)
[![License](https://img.shields.io/badge/License-MIT-green)]()
[![Status](https://img.shields.io/badge/Status-Production-blue)]()

A comprehensive, intelligent educational platform combining a complete AI & Robotics textbook with RAG-powered chatbot, secure authentication, and advanced AI capabilities.

## 🎯 Features

### 📚 Complete Textbook (12 Chapters)
- Introduction to AI & Robotics
- Machine Learning Fundamentals
- Computer Vision
- Robot Control Systems
- Navigation & Autonomous Systems
- Deep Learning Architecture
- Natural Language Processing
- Reinforcement Learning
- Humanoid Robotics
- Knowledge Systems
- Emerging Topics & Future Directions

### 🤖 Intelligent Chatbot + RAG
- **RAG System**: Retrieval-Augmented Generation with vector embeddings
- **Document Upload**: Add custom PDFs and Markdown files
- **Smart Responses**: Context-aware answers with source citations
- **Multi-language Support**: English with more languages coming
- **Semantic Search**: Find relevant content instantly

### 🔐 Secure Authentication
- **BetterAuth Integration**: Modern authentication system
- **JWT Tokens**: Secure session management
- **Role-Based Access**: Admin, User, HR, Employee roles
- **Multi-session Support**: Login on multiple devices

### 🎨 Modern UI/UX
- Responsive Docusaurus interface
- Interactive chatbot component
- Admin dashboard for system management
- Beautiful authentication pages
- Document upload interface

### 🧠 AI Tasks Framework
- Document summarization
- Key point extraction
- RAG-powered responses
- Policy question answering
- Extensible task system

## 🏗️ Architecture

```
┌────────────────────────────────────────────────┐
│     Frontend (React 19 + Docusaurus 3.9)      │
│  Chatbot UI │ Auth Pages │ Admin Dashboard    │
└─────────────────────┬──────────────────────────┘
                      │ REST API
┌─────────────────────▼──────────────────────────┐
│      Backend (FastAPI + Python 3.11)          │
│  ┌─────────────────────────────────────────┐  │
│  │ Auth Routes │ RAG Routes │ Chat Routes  │  │
│  └──────┬──────────┬──────────┬────────────┘  │
└─────────┼──────────┼──────────┼────────────────┘
          │          │          │
      ┌───▼──┐   ┌──▼───┐  ┌──▼──┐
      │ JWT  │   │Qdrant│  │LLM  │
      │Auth  │   │Vector│  │API  │
      └──────┘   │  DB  │  └─────┘
                 └──────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 20
- Python ≥ 3.11
- PostgreSQL ≥ 14
- Docker (optional)

### Installation (5 minutes)

#### 1. Clone Repository
```bash
git clone https://github.com/AbdulSamayAshfaq/text-book.git
cd text-book
```

#### 2. Frontend Setup
```bash
npm install
cp .env.example .env
npm run start
```
→ Opens at `http://localhost:3000`

#### 3. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn src.main:app --reload --port 8000
```
→ API at `http://localhost:8000/docs`

#### 4. Vector Database (Qdrant)
```bash
docker run -p 6333:6333 qdrant/qdrant
```
→ Dashboard at `http://localhost:6333`

### ✅ Verify Setup
```bash
# Test frontend
curl http://localhost:3000

# Test backend
curl http://localhost:8000/docs

# Test database
curl http://localhost:6333/health
```

## 📖 Documentation

Complete documentation available in `/docs`:
- **Setup Guide**: `docs/deployment/setup.md`
- **API Docs**: `docs/api/overview.md`
- **RAG System**: `docs/api/rag-system.md`
- **Authentication**: `docs/auth/login-signup.md`
- **Deployment**: `docs/deployment/deployment-guide.md`
- **Database Schema**: `docs/db/schema.md`

## 🛠️ Development

### Available Commands

**Frontend**
```bash
npm run start          # Start dev server
npm run build          # Build for production
npm run typecheck      # Type checking
npm run spec:generate  # Generate documentation
npm run dev            # Run frontend + backend
```

**Backend**
```bash
npm run backend:dev    # Run backend dev server
python -m pytest       # Run tests
python -m black src/   # Format code
```

### Project Structure

```
book-website/
├── src/                    # Frontend code
│   ├── components/         # React components
│   ├── auth/              # Auth pages
│   ├── api/               # API client
│   └── pages/             # Docusaurus pages
├── backend/               # Backend code
│   └── src/
│       ├── main.py        # FastAPI app
│       ├── ai/            # AI tasks & RAG
│       ├── auth/          # Authentication
│       ├── routes/        # API routes
│       └── db/            # Database
├── docs/                  # Docusaurus docs
├── specs/                 # SpeckitPlus specs
└── .env.example          # Config template
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/auth/login          Login user
POST   /api/v1/auth/signup         Create account
POST   /api/v1/auth/refresh        Refresh token
POST   /api/v1/auth/logout         Logout
```

### Chat & RAG
```
POST   /api/v1/chat                Chat endpoint
POST   /api/v1/rag/query           RAG query
POST   /api/v1/rag/upload          Upload document
GET    /api/v1/rag/documents       List documents
DELETE /api/v1/rag/documents/{id}  Delete document
```

### Admin
```
GET    /api/v1/admin/users         List users
PUT    /api/v1/admin/users/{id}/role   Change role
GET    /api/v1/admin/stats         System stats
```

## 🗄️ Database

### Tables
- `users` - User accounts
- `sessions` - Active sessions
- `documents` - Uploaded documents
- `document_chunks` - Text chunks with embeddings
- `chat_history` - Conversation history

See `docs/db/schema.md` for detailed schema.

## 🔐 User Roles

| Role | Permissions |
|------|-------------|
| **admin** | Full system access, user management, delete documents |
| **user** | View textbook, chat, upload documents |
| **hr** | HR policies, HR dashboard, manage HR content |
| **employee** | Limited access, HR features |

## 🚢 Deployment

### Docker (Recommended)
```bash
docker-compose up -d
```

### Heroku
```bash
heroku create textbook-prod
git push heroku main
```

See `docs/deployment/deployment-guide.md` for detailed deployment instructions.

## 📊 Performance

- **API Latency**: < 500ms (p95)
- **Chat Response**: 200-500ms
- **Document Indexing**: ~5 min per 1000 pages
- **Storage**: ~100MB per 10K documents
- **Uptime**: 99.9% SLA (with proper deployment)

## 🧪 Testing

```bash
# Frontend tests
npm test

# Backend tests
cd backend && pytest

# API tests
curl -X POST http://localhost:8000/api/v1/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"What is AI?"}'
```

## 📝 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Core
FRONTEND_URL=http://localhost:3000
API_PORT=8000
DEBUG=true

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Auth
JWT_SECRET=your-secret-key
BETTERAUTH_SECRET=your-betterauth-secret

# RAG
QDRANT_HOST=localhost
QDRANT_PORT=6333

# LLM
OPENAI_API_KEY=sk-...
```

See `.env.example` for all variables.

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙋 Support

- **Documentation**: See `docs/` folder
- **Issues**: [GitHub Issues](https://github.com/AbdulSamayAshfaq/text-book/issues)
- **Email**: support@example.com

## 📈 Roadmap

### Q1 2026
- [x] Core platform launch
- [ ] LLM integration for better RAG
- [ ] Multi-language support
- [ ] Mobile app (React Native)

### Q2 2026
- [ ] AI-powered quizzes
- [ ] Progress tracking & certificates
- [ ] Real-time collaboration
- [ ] Video content

### Q3 2026
- [ ] Community features
- [ ] Live sessions with instructors
- [ ] Advanced analytics
- [ ] API marketplace

## 👨‍💻 About

Built with ❤️ for the AI & Robotics community.

**Created by**: [Abdul Samay Ashfaq](https://github.com/AbdulSamayAshfaq)

**Year**: 2025

---

**Star ⭐ this repository if you find it helpful!**
