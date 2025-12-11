import React, { useState, useRef, useEffect } from 'react';
import styles from './Chatbot.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{
    title: string;
    excerpt: string;
    path: string;
  }>;
}

type ChatbotProps = {
  compact?: boolean;
};

export default function Chatbot({ compact = false }: ChatbotProps): React.ReactElement {
  // Detect chapter from URL
  const chapterMatch = typeof window !== 'undefined' ? window.location.pathname.match(/\/book\/(\w+)/) : null;
  const chapterSlug = chapterMatch ? chapterMatch[1] : '';
  const supportedChapters = [
    'introduction',
    'machine-learning',
    'computer-vision',
    'robot-control',
    'navigation',
    'deep-learning',
    'nlp',
    'reinforcement-learning',
    'humanoid-robotics',
    'knowledge-systems',
    'emerging-topics',
    'future',
  ];
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        supportedChapters.includes(chapterSlug)
          ? 'Welcome! 👋 I\'m your AI & Robotics Textbook Assistant. I can help you understand any concept from this chapter. What would you like to learn about?'
          : 'Sorry, this chapter is not supported in chatbot yet. Please select from the available chapters.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const lowerInput = input.toLowerCase();

    // Check for navigation requests first
    if (lowerInput.includes('go to') || lowerInput.includes('navigate to') || (lowerInput.includes('chapter') && (lowerInput.includes('open') || lowerInput.includes('read') || lowerInput.includes('see')))) {
      const chapterMap: Record<string, string> = {
        'introduction': 'introduction',
        'machine learning': 'machine-learning',
        'computer vision': 'computer-vision',
        'robot control': 'robot-control',
        'navigation': 'navigation',
        'deep learning': 'deep-learning',
        'nlp': 'nlp',
        'natural language processing': 'nlp',
        'reinforcement learning': 'reinforcement-learning',
        'humanoid robotics': 'humanoid-robotics',
        'knowledge systems': 'knowledge-systems',
        'emerging topics': 'emerging-topics',
        'future': 'future',
      };
      for (const [key, slug] of Object.entries(chapterMap)) {
        if (lowerInput.includes(key)) {
          const assistantMessage: Message = {
            role: 'assistant',
            content: `Sure! You can navigate to the ${key} chapter here: [Go to ${key}](/book/${slug})`,
          };
          setMessages(prev => [...prev, assistantMessage]);
          setIsLoading(false);
          return;
        }
      }
    }

    // Call backend RAG endpoint - only use textbook content
    try {
      const resp = await fetch('http://localhost:8000/api/v1/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      if (resp.ok) {
        const data = await resp.json();
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.answer || "I couldn't find a specific answer in the textbook. Please try rephrasing your question.",
          sources: data.sources || [],
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const assistantMessage: Message = {
          role: 'assistant',
          content: "I'm having trouble accessing the textbook content right now. Please try again later."
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (err) {
      const assistantMessage: Message = {
        role: 'assistant',
        content: "Unable to connect to the textbook system. Please check your connection and try again."
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={styles.chatbotContainer}
      style={{ height: compact ? 360 : undefined, maxWidth: compact ? 360 : undefined }}
    >
      <div className={styles.chatbotHeader}>
        <h3>📚 Textbook Assistant</h3>
      </div>
      <div className={styles.messagesContainer}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`${styles.message} ${styles[msg.role]}`}>
            <div className={styles.messageContent}>
              <div>{msg.content}</div>

              {msg.sources && msg.sources.length > 0 && (
                <div className={styles.sources}>
                  <div className={styles.sourceList}>
                    {msg.sources.map((s, i) => (
                      <div key={i} className={styles.sourceItem}>
                        <span className={styles.sourceTitle}>{s.title}</span>
                        <span className={styles.sourceExcerpt}>{s.excerpt}</span>
                        {s.path && (
                          <a className={styles.sourceLink} href={`/book/${s.path.replace(/^docs\/\d+-/, '').replace(/\.md$/, '')}`} target="_blank" rel="noreferrer">Open</a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        ))}
        {isLoading && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.messageContent}>
              <span className={styles.typing}>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className={styles.inputContainer}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about AI & robotics"
          className={styles.input}
          disabled={isLoading}
          rows={2}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className={styles.sendButton}
        >
          Send
        </button>
      </div>
    </div>
  );
}
