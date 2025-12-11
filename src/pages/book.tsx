import React from 'react';
import { useAuth } from '../auth/AuthContext';
import Chatbot from '../components/Chatbot/Chatbot';

export default function BookPage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', marginTop: '4rem' }}>
        <h2>Please login to access the textbook.</h2>
        <a href="/auth/login" style={{ color: '#764ba2', fontWeight: 'bold' }}>Go to Login</a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '2rem', background: '#f8f8ff', borderRadius: 12 }}>
      <h1 style={{ color: '#764ba2', marginBottom: '1.5rem' }}>AI & Robotics Textbook</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
        Welcome to your interactive textbook! Use the chatbot below to ask questions about any topic, chapter, or concept. The assistant will analyze your queries and provide answers from the book.
      </p>
      <Chatbot compact={true} />
    </div>
  );
}
