---
sidebar_position: 9
---

# Reinforcement Learning

## Introduction

Reinforcement Learning (RL) enables agents to learn from interaction with environments through rewards and penalties. This chapter covers fundamental concepts, algorithms, and applications to robotics.

## Core Concepts

### Markov Decision Process (MDP)

Mathematical framework for RL:
- **States (S)**: Possible situations
- **Actions (A)**: Available moves
- **Transitions**: P(s'|s,a) probability of reaching s' from s after a
- **Rewards (R)**: Immediate feedback r(s,a)
- **Discount factor (γ)**: Weight future rewards (0 ≤ γ < 1)

### Agent-Environment Interaction

1. Agent observes state s
2. Agent takes action a
3. Environment transitions to new state s'
4. Agent receives reward r
5. Repeat

Goal: Learn policy π(a|s) that maximizes cumulative discounted reward.

### Value Functions

**State Value Function V(s)**:
- Expected cumulative reward from state s following policy π
- V(s) = E[Σ γ^t r_t | s_0 = s]

**Action Value Function Q(s,a)**:
- Expected reward from taking action a in state s
- Q(s,a) = E[Σ γ^t r_t | s_0=s, a_0=a]

**Advantage Function A(s,a)**:
- How much better action a is than average
- A(s,a) = Q(s,a) - V(s)

### Bellman Equations

Recursive relationship between value functions:
- V(s) = Σ_a π(a|s) Σ_s' P(s'|s,a)[r(s,a) + γV(s')]
- Q(s,a) = Σ_s' P(s'|s,a)[r(s,a) + γ Σ_a' π(a'|s')Q(s',a')]

Forms basis for value iteration and policy iteration algorithms.

## Value-Based Methods

### Q-Learning

Off-policy algorithm learning optimal Q-values:
- Q(s,a) ← Q(s,a) + α[r + γ max_a' Q(s',a') - Q(s,a)]
- Bootstraps from max next Q-value (off-policy)
- Converges to optimal policy under exploration conditions

### Deep Q-Networks (DQN)

Use neural networks to approximate Q-values:
- **Experience replay**: Store transitions, sample random batches
- **Target network**: Separate network for bootstrapping
- **Reward clipping**: Normalize rewards for stability
- Breakthrough: Atari games from pixels

Improvements:
- **Double DQN**: Address overestimation bias
- **Dueling DQN**: Separate value and advantage streams
- **Prioritized replay**: Sample important transitions more often

## Policy-Based Methods

### Policy Gradient

Directly optimize policy parameters θ:
- ∇J(θ) = E[∇ log π(a|s) Q(s,a)]
- Gradient ascent on expected return
- Naturally handles continuous action spaces

### Actor-Critic Methods

Combine policy gradient and value learning:
- **Actor**: Policy network π(a|s;θ)
- **Critic**: Value network V(s;φ)
- Actor learns policy, Critic learns value function
- Critic provides low-variance advantage estimates

### Trust Region Policy Optimization (TRPO)

Ensure stable policy updates:
- Constrain KL divergence from old policy
- Take largest step improving policy within constraint
- Handles continuous control well

### Proximal Policy Optimization (PPO)

Practical variant of TRPO:
- Clip probability ratio instead of trust region
- Simpler implementation, better empirical performance
- State-of-the-art for many tasks

### Policy Gradient with Function Approximation

- **REINFORCE**: Monte Carlo policy gradient
- **A3C**: Asynchronous Advantage Actor-Critic
- **A2C**: Synchronous version, GPU-friendly
- **IMPALA**: Distributed for large-scale learning

## Exploration vs Exploitation

### Exploration Strategies

Balance between trying new things and using known good actions:

- **ε-greedy**: Take random action with probability ε
- **Boltzmann exploration**: Soft action selection
- **Upper Confidence Bound (UCB)**: Optimistic estimates
- **Thompson sampling**: Posterior sampling from beliefs
- **Curiosity-driven**: Explore surprising states

### Curriculum Learning

Start with easy tasks, progress to hard ones:
- Pre-train on simpler domain
- Gradually increase difficulty
- Speeds up learning on hard tasks

## Applications to Robotics

### Robotic Control

Learn continuous control policies:
- **Joint control**: Learn torques for each joint
- **Task-oriented**: Learn end-effector trajectories
- **Hierarchical**: Learn abstract skills, compose them
- **Meta-learning**: Quickly adapt to new tasks

### Navigation

Learn navigation policies:
- Obstacle avoidance
- Goal-reaching
- Path planning in complex environments
- Learning from demonstrations + RL

### Manipulation

Learn grasping and object manipulation:
- Grasp point selection
- Force control
- In-hand manipulation
- Transfer learning from sim to real

## Simulation and Reality Gap

### Sim2Real Transfer

Learn in simulation, deploy on real robot:
- Simulation cheaper and faster
- Reality gap: simulator doesn't match real world
- Domain randomization: Vary simulator parameters
- Domain adaptation: Adapt learned policy to real world

### Techniques

- **Randomization**: Randomize physics, visuals, dynamics
- **Progressive nets**: Transfer intermediate representations
- **Adversarial domain adaptation**: Match distributions
- **Imitation learning**: Pre-train from demonstrations

## Advanced Topics

### Hierarchical Reinforcement Learning

Learn at multiple abstraction levels:
- Options framework: sub-policies with entry/exit
- Feudal learning: Manager and Worker agents
- Skill learning: Learn reusable primitives

### Multi-Agent RL

Multiple agents learning simultaneously:
- Cooperation: Agents work together
- Competition: Zero-sum games
- Mixed: Both elements
- Challenges: Non-stationarity, scalability

### Inverse Reinforcement Learning

Learn reward function from demonstrations:
- Observe expert behavior
- Infer what reward function they optimize
- Learn policy from inferred reward
- Enables learning from human preferences

### Offline Reinforcement Learning

Learn from pre-collected data without interaction:
- Batch RL: Learn from fixed dataset
- Conservative approaches: Stay close to data
- Uncertainty estimates: Track confidence in Q-values
- Important for safety-critical applications

## Challenges and Future Directions

### Sample Efficiency

RL requires many environment interactions:
- Real robots expensive to run experiments
- Simulation-based learning faster
- Data-efficient algorithms being developed
- Imitation learning and demonstrations help

### Exploration in High-Dimensional Spaces

Large action/state spaces hard to explore:
- Curiosity-driven learning: Explore based on novelty
- Empowerment: Maximize information gain
- Hierarchical approaches: Decompose exploration
- Efficient exploration algorithms being developed

### Sim-to-Real Transfer

Bridging simulation-reality gap remains challenging:
- Domain randomization helping
- Better simulators improving fidelity
- Transfer learning and adaptation techniques
- Continued research needed

## Summary

Reinforcement Learning enables agents to learn optimal behaviors through interaction. Value-based methods (Q-learning, DQN) work well for discrete problems, while policy-based methods (PPO, TRPO) excel at continuous control. For robotics, combining RL with other techniques (imitation learning, hierarchical learning) enables efficient learning of complex behaviors. The field continues evolving toward sample-efficient, safe, and generalizable learning algorithms.

## Further Reading

- Sutton & Barto, "Reinforcement Learning: An Introduction" textbook
- DQN paper: "Playing Atari with Deep Reinforcement Learning"
- PPO paper: "Proximal Policy Optimization Algorithms"
- TRPO paper: "Trust Region Policy Optimization"
- Multi-agent RL: MARL literature survey papers
