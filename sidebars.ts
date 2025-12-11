import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  textbookSidebar: [
    {
      type: 'category',
      label: 'AI and Robotics Textbook',
      items: [
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
      ],
    },
    {
      type: 'category',
      label: 'Chatbot & RAG',
      items: [
        'api/chatbot-api',
        'api/rag-system',
        'api/document-upload',
      ],
    },
    {
      type: 'category',
      label: 'Authentication',
      items: [
        'auth/login-signup',
        'auth/sessions',
        'auth/roles',
      ],
    },
    {
      type: 'category',
      label: 'API Documentation',
      items: [
        'api/overview',
      ],
    },
    {
      type: 'category',
      label: 'Database Schema',
      items: [
        'db/schema',
      ],
    },
    {
      type: 'category',
      label: 'Product & Deployment',
      items: [
        'product/overview',
        'deployment/setup',
        'deployment/deployment-guide',
      ],
    },
  ],
};

export default sidebars;
