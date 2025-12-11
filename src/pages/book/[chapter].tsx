import React from 'react';
import Chatbot from '../../components/Chatbot/Chatbot';

const chapterTitles: Record<string, string> = {
  'introduction': 'Introduction',
  'machine-learning': 'Machine Learning',
  'computer-vision': 'Computer Vision',
  'robot-control': 'Robot Control',
  'navigation': 'Navigation',
  'deep-learning': 'Deep Learning',
  'nlp': 'Natural Language Processing',
  'reinforcement-learning': 'Reinforcement Learning',
  'humanoid-robotics': 'Humanoid Robotics',
  'knowledge-systems': 'Knowledge Systems',
  'emerging-topics': 'Emerging Topics',
  'future': 'Future',
};

export default function ChapterPage(props: any) {
  const chapter = props?.route?.params?.chapter || 'introduction';
  const title = chapterTitles[String(chapter)] || 'Chapter';

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '2rem', background: '#f8f8ff', borderRadius: 12 }}>
      <h1 style={{ color: '#764ba2', marginBottom: '1.5rem' }}>{title}</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
        This is the <b>{title}</b> chapter. Use the chatbot below to ask questions about this chapter or any other topic in the textbook.
      </p>
      <Chatbot compact={true} />
    </div>
  );
}
