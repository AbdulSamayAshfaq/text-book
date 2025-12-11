import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Email and password required');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/v1/auth/login', {
        email,
        password,
      });

      toast.success('Login successful!');
      // Store token in context and redirect
      login(response.data.token);
      window.location.href = '/book';
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Login to AI Textbook</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p>
          Don't have an account? <a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
}
