import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from './AdminDashboard.module.css';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'hr' | 'employee';
  created_at: string;
  is_active: boolean;
}

interface SystemStats {
  total_users: number;
  total_documents: number;
  api_uptime: number;
  last_backup: string;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const headers = { Authorization: `Bearer ${token}` };

      const [usersRes, statsRes] = await Promise.all([
        axios.get('/api/v1/admin/users', { headers }),
        axios.get('/api/v1/admin/stats', { headers }),
      ]);

      setUsers(usersRes.data.users);
      setStats(statsRes.data);
    } catch (error: any) {
      toast.error('Failed to load dashboard');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      await axios.put(
        `/api/v1/admin/users/${userId}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Role updated');
      loadDashboardData();
    } catch (error: any) {
      toast.error('Failed to update role');
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.dashboard}>
      <h1>Admin Dashboard</h1>

      {/* Stats Cards */}
      {stats && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Users</h3>
            <p className={styles.statValue}>{stats.total_users}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Documents</h3>
            <p className={styles.statValue}>{stats.total_documents}</p>
          </div>
          <div className={styles.statCard}>
            <h3>API Uptime</h3>
            <p className={styles.statValue}>{stats.api_uptime.toFixed(2)}%</p>
          </div>
          <div className={styles.statCard}>
            <h3>Last Backup</h3>
            <p className={styles.statValue}>
              {new Date(stats.last_backup).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      {/* Users Management */}
      <div className={styles.section}>
        <h2>User Management</h2>
        <div className={styles.usersTable}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={styles.roleSelect}
                    >
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                      <option value="hr">HR</option>
                      <option value="employee">Employee</option>
                    </select>
                  </td>
                  <td>
                    <span className={user.is_active ? styles.active : styles.inactive}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className={styles.detailsBtn}
                      onClick={() => setSelectedUser(user)}
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className={styles.modal} onClick={() => setSelectedUser(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelectedUser(null)}>
              ✕
            </button>
            <h2>User Details</h2>
            <div className={styles.details}>
              <p>
                <strong>ID:</strong> {selectedUser.id}
              </p>
              <p>
                <strong>Name:</strong> {selectedUser.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>
              <p>
                <strong>Status:</strong> {selectedUser.is_active ? 'Active' : 'Inactive'}
              </p>
              <p>
                <strong>Joined:</strong> {new Date(selectedUser.created_at).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
