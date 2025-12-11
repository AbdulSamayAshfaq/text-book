---
sidebar_position: 3
---

# Document Upload

Upload documents to enhance the RAG knowledge base.

## Supported Formats

- **PDF** (.pdf)
- **Markdown** (.md)
- **Text** (.txt)

## Upload UI

The frontend provides a drag-and-drop interface for easy document uploads.

### Features

- 📁 Drag & drop file upload
- 📊 Progress tracking
- ✅ Automatic document processing
- 🔍 Full-text indexing

### Usage

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/v1/rag/upload', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log(`Document indexed: ${result.document_id}`);
```

## Processing Pipeline

1. **Upload** - File sent to backend
2. **Validation** - Format and size checks
3. **Extraction** - Text extracted from document
4. **Chunking** - Document split into chunks
5. **Embedding** - Chunks converted to vectors
6. **Indexing** - Vectors stored in Qdrant
7. **Completion** - Ready for querying

## Limitations

- **Max File Size**: 50MB
- **Max Files Per Day**: 100 (free tier)
- **Processing Time**: ~30-60 seconds per file

## Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| `400 - Invalid Format` | File type not supported | Use PDF, Markdown, or TXT |
| `413 - File Too Large` | File exceeds 50MB | Split into smaller files |
| `429 - Rate Limited` | Too many uploads | Wait or upgrade plan |
| `500 - Processing Failed` | Backend error | Retry or contact support |
