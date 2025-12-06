---
id: 7
title: "Chatbot UI + RAG"
stage: implementation
date_iso: 2025-12-07
surface: agent
model: GPT-5 mini
feature: none
branch: unknown
user: unknown
command: "Updated frontend Chatbot and backend RAG endpoint"
labels:
 - chatbot
 - rag
 - ui
links:
  spec: null
  ticket: null
  adr: null
files_yaml:
 - src/components/Chatbot/Chatbot.tsx
 - src/components/Chatbot/Chatbot.module.css
 - backend/src/main.py
tests_yaml:
 - none
prompt_text: |
  mara chatbot ki ui achi krdo our rag add krdo

response_text: |
  Implemented UI improvements to display RAG sources and added a basic `/api/v1/rag` endpoint in the backend that searches `docs/` markdown files for matching excerpts. Frontend now posts to `http://localhost:8000/api/v1/rag` and shows sources under assistant messages. Fallback to local rule-based answers if API fails.

Outcome: success
---
