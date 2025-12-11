---
sidebar_position: 1
---

# Product Overview

## Mission

Bring comprehensive AI & Robotics education to everyone through an interactive, intelligent platform powered by RAG (Retrieval-Augmented Generation) and modern AI.

## Core Features

### 📚 Textbook
- Complete AI & Robotics curriculum (12 chapters)
- Interactive explanations with diagrams
- Code examples and applications
- Updated with latest research

### 🤖 Intelligent Chatbot
- Ask any question about the textbook
- Get answers with source citations
- Multi-language support
- Powered by RAG + LLM

### 📄 RAG System
- Upload your own documents
- Instantly searchable knowledge base
- Document-aware responses
- Vector database for semantic search

### 🔐 Authentication
- Secure login/signup
- Role-based access control
- Session management
- JWT tokens

### 👥 Role-Based Features
- **Admins**: Manage users, documents, system
- **Users**: Full access to textbook + chat
- **HR**: Access HR policies and tools
- **Employees**: Limited access + HR features

## Technology Stack

### Frontend
- React 19
- TypeScript
- Docusaurus 3.9
- Zustand (state)
- Axios (HTTP)

### Backend
- FastAPI (Python)
- PostgreSQL
- Qdrant (Vector DB)
- sentence-transformers (embeddings)
- OpenAI API (LLM)

### DevOps
- Docker containers
- GitHub Actions CI/CD
- Deployment-ready

## Architecture

```
┌─────────────────────────────────────────────┐
│        Docusaurus Frontend (React)          │
│  (Textbook + UI + Chatbot + Dashboard)     │
└──────────────────┬──────────────────────────┘
                   │ HTTP/REST
┌──────────────────▼──────────────────────────┐
│      FastAPI Backend (Python)               │
│  ┌─────────────────────────────────────┐   │
│  │  Auth Routes  │ RAG Routes │ Chat   │   │
│  └──────┬────────────┬─────────┬───────┘   │
└─────────┼────────────┼─────────┼───────────┘
          │            │         │
      ┌───▼──┐    ┌───▼──┐   ┌──▼───┐
      │ JWT  │    │Qdrant│   │LLM   │
      │Auth  │    │VectorDB  │API   │
      └──────┘    └──────┘   └──────┘
```

## Roadmap

### Q1 2026
- [ ] Advanced RAG with LLM synthesis
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration

### Q2 2026
- [ ] AI-powered quizzes
- [ ] Progress tracking
- [ ] Certification program
- [ ] Premium features

### Q3 2026
- [ ] Community features
- [ ] Video content
- [ ] Live sessions
- [ ] Analytics dashboard

## Getting Started

See [Setup Guide](../deployment/setup.md) for installation instructions.

## Support

- 📧 Email: support@example.com
- 💬 Discord: https://discord.gg/...
- 🐛 Issues: https://github.com/.../issues
