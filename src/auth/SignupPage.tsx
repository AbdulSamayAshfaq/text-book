import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from './SignupPage.module.css';

export default function SignupPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.name || !formData.password) {
      toast.error('All fields required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/v1/auth/signup', {
        email: formData.email,
        name: formData.name,
        password: formData.password,
      });

      toast.success('Account created! Logging you in...');
      login(response.data.token);
      window.location.href = '/book';
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Create Account</h2>
        <form onSubmit={handleSignup}>
          <div className={styles.formGroup}>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
