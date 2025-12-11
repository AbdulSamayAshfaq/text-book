import React from 'react';
import Link from '@docusaurus/Link';

const chapters = [
  { slug: 'introduction', title: 'Introduction' },
  { slug: 'machine-learning', title: 'Machine Learning' },
  { slug: 'computer-vision', title: 'Computer Vision' },
  { slug: 'robot-control', title: 'Robot Control' },
  { slug: 'navigation', title: 'Navigation' },
  { slug: 'deep-learning', title: 'Deep Learning' },
  { slug: 'nlp', title: 'Natural Language Processing' },
  { slug: 'reinforcement-learning', title: 'Reinforcement Learning' },
  { slug: 'humanoid-robotics', title: 'Humanoid Robotics' },
  { slug: 'knowledge-systems', title: 'Knowledge Systems' },
];

export default function BookIndex() {
  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '2rem', background: '#f8f8ff', borderRadius: 12 }}>
      <h1 style={{ color: '#764ba2', marginBottom: '1.5rem' }}>AI & Robotics Textbook</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
        Select a chapter to explore. You can use the chatbot on each chapter page to ask questions about the content.
      </p>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {chapters.map(ch => (
          <li key={ch.slug} style={{ marginBottom: '1rem' }}>
            <Link to={`/book/${ch.slug}`} style={{ color: '#667eea', fontWeight: 'bold', fontSize: '1.1rem' }}>{ch.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
