import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from './RAGUpload.module.css';

interface UploadedDoc {
  id: string;
  title: string;
  size: number;
  uploadedAt: string;
}

export default function RAGUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<UploadedDoc[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf' || file.name.endsWith('.md')) {
        setSelectedFile(file);
      } else {
        toast.error('Only PDF and Markdown files supported');
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    try {
      const response = await axios.post('/api/v1/rag/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Document uploaded successfully!');
      setDocuments([...documents, response.data.document]);
      setSelectedFile(null);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.uploadBox}>
        <h3>📄 Upload Documents to RAG</h3>
        <p>Upload PDFs or Markdown files to enhance the knowledge base</p>

        <div className={styles.dropZone}>
          <input
            type="file"
            accept=".pdf,.md"
            onChange={handleFileSelect}
            id="fileInput"
            className={styles.fileInput}
            disabled={loading}
          />
          <label htmlFor="fileInput" className={styles.dropLabel}>
            {selectedFile ? (
              <>
                <span className={styles.fileName}>{selectedFile.name}</span>
                <small>Click to change</small>
              </>
            ) : (
              <>
                <span className={styles.dropIcon}>📁</span>
                <span>Drag files here or click to upload</span>
                <small>PDF or Markdown (max 10MB)</small>
              </>
            )}
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={!selectedFile || loading}
          className={styles.uploadButton}
        >
          {loading ? 'Uploading...' : 'Upload Document'}
        </button>
      </div>

      {documents.length > 0 && (
        <div className={styles.documentsList}>
          <h4>📚 Your Documents</h4>
          <div className={styles.docs}>
            {documents.map((doc) => (
              <div key={doc.id} className={styles.docCard}>
                <div className={styles.docInfo}>
                  <h5>{doc.title}</h5>
                  <small>{(doc.size / 1024).toFixed(2)} KB</small>
                  <small>{new Date(doc.uploadedAt).toLocaleDateString()}</small>
                </div>
                <button className={styles.deleteBtn}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
