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
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Welcome! 👋 I\'m your AI & Robotics Textbook Assistant. I can help you understand any concept from this comprehensive textbook covering AI, machine learning, robotics, and more. What would you like to learn about?',
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

  const getAnswer = (question: string): string => {
    const lowerQuestion = question.toLowerCase();

    // Greetings and creator info
    if (lowerQuestion.match(/^(hi|hello|hey|greetings|namaste|assalam|salaam)/)) {
      return 'Hello! 👋 Welcome to the AI & Robotics Textbook! I\'m your assistant here to help you explore this comprehensive resource on AI, machine learning, robotics, and emerging technologies. Feel free to ask me anything about any topic in the book!';
    }

    if (lowerQuestion.includes('created by') || lowerQuestion.includes('who made') || lowerQuestion.includes('author')) {
      return '📚 This is a comprehensive textbook bringing together expertise in AI, robotics, and advanced machine learning technologies. It aims to provide a complete understanding of how AI and robotics intersect and transform each other, covering everything from fundamentals to cutting-edge research directions.';
    }

    // Introduction to AI and Robotics
    if (lowerQuestion.includes('introduction') && (lowerQuestion.includes('ai') || lowerQuestion.includes('robotics') || lowerQuestion.includes('book'))) {
      return 'The Introduction chapter explores the convergence of AI and Robotics:\n\n🤖 AI provides machines with:\n• Perception (understanding the world)\n• Learning (improving from experience)\n• Decision-making (choosing optimal actions)\n• Reasoning (understanding complex problems)\n\n🦾 Robotics provides:\n• Physical embodiment (sensors & actuators)\n• Real-time control (fast response)\n• Manipulation (moving and changing the world)\n• Autonomous operation\n\nTogether, they create intelligent machines that can work in complex, unstructured environments alongside humans.';
    }

    // Machine Learning Fundamentals
    if (lowerQuestion.includes('machine learning') || (lowerQuestion.includes('supervised') && lowerQuestion.includes('learning'))) {
      return '📊 Machine Learning Fundamentals:\n\n**Three Main Paradigms:**\n\n1️⃣ Supervised Learning:\n• Learn from labeled data (input→output pairs)\n• Classification: predict categories\n• Regression: predict continuous values\n• Examples: predicting house prices, image classification\n\n2️⃣ Unsupervised Learning:\n• Find patterns in unlabeled data\n• Clustering: group similar items\n• Dimensionality reduction: simplify high-dimensional data\n• Examples: customer segmentation, data visualization\n\n3️⃣ Reinforcement Learning:\n• Learn through trial and error with rewards/penalties\n• Agent interacts with environment\n• Goal: maximize cumulative reward\n• Examples: game playing, robot control\n\nKey concept: Choose the right algorithm for your problem!';
    }

    // Computer Vision
    if (lowerQuestion.includes('computer vision') || (lowerQuestion.includes('image') && (lowerQuestion.includes('recognition') || lowerQuestion.includes('detection') || lowerQuestion.includes('segmentation')))) {
      return '👁️ Computer Vision Overview:\n\nComputer vision enables machines to interpret visual information.\n\n**Key Tasks:**\n\n🖼️ Image Classification: Classify entire image (dog vs cat)\n🎯 Object Detection: Find and locate objects in image\n📍 Semantic Segmentation: Classify each pixel\n👤 Instance Segmentation: Identify individual objects\n3️⃣ 3D Vision: Understand depth and 3D structure\n\n**Main Architecture:**\n🧠 Convolutional Neural Networks (CNNs):\n• Convolutional layers: Extract features using filters\n• Pooling layers: Downsample and reduce parameters\n• Fully connected layers: Make final predictions\n• Each layer learns hierarchical features\n\n**Applications in Robotics:**\n• Robot vision for object picking\n• Autonomous vehicle perception\n• Gesture recognition\n• Scene understanding';
    }

    // Robot Control
    if (lowerQuestion.includes('robot control') || lowerQuestion.includes('pid') || (lowerQuestion.includes('control') && (lowerQuestion.includes('trajectory') || lowerQuestion.includes('kinematics')))) {
      return '⚙️ Robot Control Systems:\n\n**Control Objectives:**\n1. Make robot move to desired position\n2. Follow planned trajectories\n3. Maintain stability\n4. Handle disturbances\n\n**Control Methods:**\n\n📌 PID Control (Classic):\n• Proportional: React to current error\n• Integral: Correct persistent error\n• Derivative: Anticipate future error\n• Used for individual joint control\n\n🛤️ Trajectory Planning:\n• Generate smooth paths in configuration space\n• Avoid singularities and joint limits\n• Minimize time, energy, or smoothness\n• Result: sequence of waypoints\n\n🔄 Inverse Kinematics:\n• Convert desired end-effector position to joint angles\n• Multiple solutions possible (redundancy)\n• Numerical vs analytical solutions\n• Essential for precise manipulation\n\n🧠 Learning-Based Control:\n• Neural networks learn control policies\n• Adapt to changing environments\n• More robust to uncertainties\n• Requires training data/simulation';
    }

    // Navigation
    if (lowerQuestion.includes('navigation') || lowerQuestion.includes('slam') || lowerQuestion.includes('path planning') || lowerQuestion.includes('localization')) {
      return '🗺️ Robot Navigation:\n\n**Three Core Components:**\n\n🧭 Localization:\n• Where am I? (robot position & orientation)\n• GPS works outdoors\n• IMU, odometry for relative movement\n• Must handle accumulated error\n\n📍 Mapping:\n• What\'s around me?\n• Build 2D/3D maps of environment\n• Sensor fusion from multiple sensors\n• Occupancy grids, feature maps\n\n🎯 Path Planning:\n• How do I reach goal?\n• A*: Optimal path with heuristics\n• RRT: Rapidly-exploring Random Trees\n• Dijkstra, Bellman-Ford algorithms\n\n**SLAM (Simultaneous Localization and Mapping):**\n• Solve chicken-and-egg problem\n• Build map while figuring out location\n• Essential for autonomous robots\n• FastSLAM, Graph-SLAM popular approaches\n\n**Modern Approaches:**\n• End-to-end learning with neural networks\n• Visual inertial odometry\n• LiDAR-based approaches';
    }

    // Deep Learning
    if (lowerQuestion.includes('deep learning') || lowerQuestion.includes('neural network') || lowerQuestion.includes('cnn') || lowerQuestion.includes('lstm') || lowerQuestion.includes('transformer')) {
      return '🧠 Deep Learning:\n\n**Why Deep?**\n• Hierarchical representations\n• Lower layers: simple features (edges, corners)\n• Higher layers: complex concepts (objects, scenes)\n• More layers = more expressive power\n\n**Key Architectures:**\n\n🎨 Convolutional Neural Networks (CNNs):\n• For images and spatial data\n• Filters detect local patterns\n• Pooling reduces dimensionality\n• Architecture: Conv → ReLU → Pool → FC\n\n📈 Recurrent Neural Networks (RNNs):\n• For sequences and time series\n• Hidden state carries information forward\n• Process one element at a time\n• Problem: Vanishing gradients over long sequences\n\n🔗 LSTM (Long Short-Term Memory):\n• Solution to RNN gradient problems\n• Memory cells store long-term info\n• Gates control information flow\n• Can learn 100+ step dependencies\n\n⚡ Transformers:\n• Process sequences in parallel (not sequential)\n• Attention mechanism: focus on relevant parts\n• Much faster training than RNNs\n• Foundation for modern LLMs\n• Multi-head attention: multiple perspectives\n\n**Training Deep Networks:**\n• Backpropagation: compute gradients efficiently\n• SGD, Adam: optimization algorithms\n• Dropout, batch norm: regularization\n• GPU/TPU: essential for large-scale training';
    }

    // NLP
    if (lowerQuestion.includes('nlp') || lowerQuestion.includes('natural language') || lowerQuestion.includes('bert') || lowerQuestion.includes('gpt') || lowerQuestion.includes('language model')) {
      return '📝 Natural Language Processing:\n\n**Text Representation:**\n\n📊 Bag of Words:\n• Simple but loses word order\n• Count occurrences of each word\n• Works for some tasks\n\n🔢 Word Embeddings:\n• Represent words as dense vectors\n• Similar words have similar vectors\n• Word2Vec, GloVe, FastText\n• Enable semantic operations: king - man + woman ≈ queen\n\n**Key Models:**\n\n🔤 BERT (Bidirectional Encoder):\n• Pre-trained on massive text corpus\n• Understands context from both directions\n• Fine-tune for: classification, NER, Q&A\n• Foundation for many NLP applications\n\n📢 GPT (Generative Pre-trained Transformer):\n• Autoregressive: predicts next word\n• Excellent for text generation\n• Few-shot learning capability\n• Powers ChatGPT, modern LLMs\n\n**Tasks:**\n\n😊 Sentiment Analysis: Positive/negative/neutral\n🏷️ Named Entity Recognition: Find people, places, organizations\n🌐 Machine Translation: Translate between languages\n❓ Question Answering: Find answers in documents\n💬 Dialogue: Conversational systems\n📰 Text Summarization: Condense long text\n\n**Modern Approach:**\n• Pre-train on huge corpus\n• Fine-tune on specific task\n• Transfer learning is key\n• Transformers dominate the field';
    }

    // Reinforcement Learning
    if (lowerQuestion.includes('reinforcement learning') || lowerQuestion.includes('q-learning') || lowerQuestion.includes('reward') || (lowerQuestion.includes('policy') && lowerQuestion.includes('learning'))) {
      return '🎮 Reinforcement Learning (RL):\n\n**Core Concept:**\nAgent learns optimal behavior through interaction:\n• Takes action in environment\n• Receives reward/penalty\n• Updates its policy\n• Goal: Maximize cumulative reward\n\n**Key Components:**\n\n🌍 Environment:\n• State: current situation\n• Action: choices available\n• Transition: state probability given action\n• Reward: feedback signal\n\n🤖 Agent:\n• Policy: mapping state → action\n• Value function: expected reward from state\n• Action-value: expected reward from action in state\n\n**Popular Algorithms:**\n\n📌 Q-Learning:\n• Learn state-action values (Q-values)\n• Off-policy: learn from any experience\n• Bellman equation: Q(s,a) = r + γ max Q(s\',a\')\n• Converges to optimal policy\n• Issue: Table too large for complex problems\n\n🧠 Deep Q-Networks (DQN):\n• Use neural network to approximate Q-values\n• Experience replay: store and sample memories\n• Target network: separate network for stability\n• Breakthrough: Learned Atari games from pixels\n\n📈 Policy Gradient:\n• Directly optimize policy parameters\n• Gradient ascent on expected reward\n• Handles continuous action spaces\n• Examples: REINFORCE, Actor-Critic\n\n**Applications in Robotics:**\n• Robot manipulation and grasping\n• Locomotion and walking\n• Navigation and obstacle avoidance\n• Game playing and control tasks';
    }

    // Humanoid Robotics
    if (lowerQuestion.includes('humanoid') || lowerQuestion.includes('bipedal') || (lowerQuestion.includes('robot') && (lowerQuestion.includes('grasping') || lowerQuestion.includes('manipulation') || lowerQuestion.includes('arm')))) {
      return '🦾 Humanoid Robotics:\n\n**Why Humanoid Form?**\n• Designed for human environments\n• Can use human tools and spaces\n• Natural interaction with humans\n• Familiar movement patterns\n\n**Key Challenges:**\n\n⚖️ Bipedal Balance:\n• 2 contact points (unstable)\n• Zero Moment Point (ZMP) must stay in support polygon\n• Dynamic balance vs static balance\n• Active balance control essential\n\n🦾 Dexterous Manipulation:\n• Multi-fingered hands (typically 5 fingers)\n• High DOF (degrees of freedom)\n• Complex coordination required\n• In-hand manipulation difficult\n\n👁️ Perception:\n• Cameras, IMU, force sensors\n• Real-time processing required\n• Environment must be understood\n• Sensor fusion essential\n\n**Design Elements:**\n\n🧠 Actuation:\n• Electric motors: precise, clean\n• Pneumatic: powerful, compliant\n• Hydraulic: very strong but slow\n• Series elastic: absorb impacts safely\n\n📍 Kinematics:\n• Forward kinematics: joint angles → end-effector pose\n• Inverse kinematics: desired pose → joint angles\n• Redundancy: more DOF than necessary\n• Workspace: reachable positions\n\n**State-of-the-art Systems:**\n• Tesla Optimus: approaching mass production\n• Boston Dynamics Atlas: acrobatic capabilities\n• Sanctuary AI Phoenix: advanced dexterity\n• Honda Asimo: social interaction pioneer\n\n**Control Strategies:**\n• Hierarchical: task → motion → joint level\n• Whole-body: coordinate all joints\n• Learning from demonstration\n• Reinforcement learning for adaptation';
    }

    // Knowledge Systems
    if (lowerQuestion.includes('knowledge') || lowerQuestion.includes('ontology') || lowerQuestion.includes('semantic') || lowerQuestion.includes('neurosymbolic')) {
      return '🧠 Knowledge Systems and Reasoning:\n\n**Traditional AI vs Modern Learning:**\n\n📚 Symbolic AI:\n• Explicit knowledge representation\n• Rules: IF condition THEN action\n• Logical reasoning: derive new facts\n• Explainable and interpretable\n• Limited to pre-programmed knowledge\n\n🧠 Neural AI:\n• Learn from data automatically\n• Patterns in high-dimensional spaces\n• Black box: hard to explain\n• Requires large amounts of data\n• Robust to noise and variations\n\n**Knowledge Representation:**\n\n🌐 Knowledge Graphs:\n• Nodes: entities (objects, concepts)\n• Edges: relationships\n• Semantic meaning captured\n• Examples: Google Knowledge Graph, DBpedia\n\n📋 Ontologies:\n• Formal definitions of domain concepts\n• Class hierarchies: Dog is-a Animal\n• Properties and relationships\n• Enable semantic web technologies\n\n🔗 Semantic Networks:\n• Concepts connected by relations\n• Spreading activation for inference\n• Simple but powerful\n\n**Neurosymbolic AI:**\n💡 Combines best of both worlds:\n• Neural networks: learn patterns from data\n• Symbolic systems: reason over representations\n• Knowledge-guided learning: incorporate constraints\n• Better generalization and interpretability\n\n**Applications:**\n• Robotics: ground language in perception\n• Knowledge extraction from text\n• Hybrid reasoning systems\n• AI safety and verification';
    }

    // Emerging Topics
    if (lowerQuestion.includes('emerging') || lowerQuestion.includes('future') || lowerQuestion.includes('meta-learning') || lowerQuestion.includes('multimodal') || lowerQuestion.includes('vision transformer') || lowerQuestion.includes('nerf')) {
      return '🚀 Emerging Topics and Future Directions:\n\n**Few-Shot Learning:**\n• Learn from minimal examples (1-5 shots)\n• Meta-learning: learn how to learn\n• Quick adaptation to new tasks\n• Prototypical networks, matching networks\n\n**Zero-Shot Learning:**\n• Learn without task-specific examples\n• Transfer knowledge from related tasks\n• Semantic descriptions of new classes\n• Enables learning of unseen categories\n\n**Vision Transformers:**\n• Apply transformer architecture to images\n• Split image into patches\n• Self-attention between patches\n• Outperforms CNNs on large datasets\n• Stronger transfer learning\n\n**Multimodal Models:**\n🖼️ Vision + Language: GPT-4V, CLIP, BLIP\n• Understand images with text descriptions\n• Powerful for reasoning about visual content\n\n🎙️ Audio + Language: Whisper\n• Speech-to-text, transcription\n• Robust to accents and noise\n\n🤖 Vision + Language + Action: Robotics foundation models\n• Learn robot control from videos\n• Generalize to new tasks\n\n**Neural Radiance Fields (NeRF):**\n• Implicit 3D representation\n• Novel view synthesis\n• 3D reconstruction from images\n• Real-time rendering advances\n\n**Key Challenges:**\n⚠️ Robustness: Adversarial examples, distribution shift\n📊 Data efficiency: Learn from few examples\n🛡️ Safety: Ensure AI behaves as intended\n🎯 Interpretability: Understand model decisions\n⚡ Efficiency: Deploy on edge devices\n🌍 Generalization: Work in new environments\n\n**Future Research Directions:**\n• Continual learning: adapt without forgetting\n• Embodied AI: learn through interaction\n• AI safety and alignment\n• Energy-efficient models\n• Brain-inspired computing\n• Quantum machine learning';
    }

    // Future Chapter
    if (lowerQuestion.includes('future') || lowerQuestion.includes('next') || lowerQuestion.includes('what\'s coming')) {
      return '🔮 The Future of AI and Robotics:\n\n**Near-term (1-5 years):**\n• Humanoid robots in manufacturing\n• Autonomous delivery systems\n• Advanced medical robotics\n• More capable LLMs\n• Better sim-to-real transfer\n\n**Medium-term (5-10 years):**\n• Home assistant robots\n• Fully autonomous vehicles\n• AI-augmented drug discovery\n• Brain-computer interfaces\n• General-purpose embodied agents\n\n**Challenges to Overcome:**\n❓ Generalization: Work in new environments\n💰 Cost: Make systems affordable\n🔒 Safety: Ensure reliable operation\n⚖️ Ethics: Fair and beneficial AI\n🌍 Environmental: Sustainable deployment\n🤝 Human-AI: Better collaboration\n\n**Opportunities:**\n✨ Healthcare: Personalized medicine, surgery\n🌱 Environment: Climate modeling, resource management\n🎓 Education: Personalized learning\n🏭 Industry: Flexible automation\n🚀 Space: Autonomous exploration\n\n**The Bottom Line:**\nAI and robotics will transform society. Success depends on:\n• Technical innovation\n• Ethical development\n• Inclusive deployment\n• Continuous learning and adaptation';
    }

    // Default/general response
    return '📚 Great question! This comprehensive textbook covers 12 chapters:\n\n1. Introduction to AI & Robotics\n2. Machine Learning Fundamentals\n3. Computer Vision\n4. Robot Control\n5. Navigation & Autonomous Systems\n6. Deep Learning\n7. Natural Language Processing\n8. Reinforcement Learning\n9. Humanoid Robotics\n10. Knowledge Systems\n11. Emerging Topics\n12. Future of AI & Robotics\n\nTry asking about any specific chapter or topic! Examples:\n• "Tell me about deep learning"\n• "How does computer vision work?"\n• "What is reinforcement learning?"\n• "Tell me about humanoid robots"\n• "Who created this textbook?"\n\nWhat interests you most?';
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Call backend RAG endpoint; fall back to local rule-based answer on error
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
          content: data.answer || getAnswer(input),
          sources: data.sources || [],
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const answer = getAnswer(input);
        const assistantMessage: Message = { role: 'assistant', content: answer };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (err) {
      const answer = getAnswer(input);
      const assistantMessage: Message = { role: 'assistant', content: answer };
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
                          <a className={styles.sourceLink} href={`/docs/${s.path.replace(/\.md$/,'')}`} target="_blank" rel="noreferrer">Open</a>
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
