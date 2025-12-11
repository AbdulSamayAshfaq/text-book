---
sidebar_position: 1
---

# Chatbot API

The AI Textbook Chatbot API provides intelligent question-answering capabilities powered by RAG (Retrieval-Augmented Generation).

## Endpoints

### POST /api/v1/chat

Process a user query through the chatbot.

**Request:**
```json
{
  "query": "What is deep learning?",
  "language": "en"
}
```

**Response:**
```json
{
  "answer": "Deep learning is a subset of machine learning...",
  "sources": [
    {
      "title": "deep-learning.md",
      "excerpt": "Deep learning refers to...",
      "path": "docs/deep-learning"
    }
  ],
  "latency_ms": 245,
  "in_scope": true
}
```

## Features

- 🤖 **Intelligent Responses** - Uses RAG to retrieve relevant textbook sections
- 📚 **Source Citations** - Always provides sources for answers
- 🌐 **Multi-language Support** - Currently supports English, with more languages coming
- ⚡ **Fast Inference** - Optimized for sub-500ms response times

## Usage Example

```javascript
const response = await fetch('/api/v1/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'Explain reinforcement learning',
    language: 'en'
  })
});

const data = await response.json();
console.log(data.answer);
```

## Rate Limiting

- **Free tier**: 100 requests per day
- **Premium**: Unlimited
