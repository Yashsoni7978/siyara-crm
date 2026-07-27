'use client';

import React, { useState } from 'react';
import { UserRole } from '../types/crm';
import { ACCOUNTS } from '../lib/auth';
import { Shield, User, Lock, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (role: UserRole) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [selectedUser, setSelectedUser] = useState<UserRole>('Admin');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const account = ACCOUNTS[selectedUser];

    if (password === account.password) {
      setErrorMsg('');
      onLoginSuccess(selectedUser);
    } else {
      setErrorMsg(`Incorrect password for ${selectedUser}. Please try again.`);
    }
  };

  const handleSelectUser = (role: UserRole) => {
    setSelectedUser(role);
    setPassword('');
    setErrorMsg('');
  };

  return (
    <div className="login-splash-wrapper">
      <div className="login-card">
        {/* Splash Branding Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div className="login-brand-icon">
            <Sparkles size={24} color="#0f172a" />
          </div>
          <h1 className="login-headline">Ready to work with the best version of yourself</h1>
          <p className="login-subtext">Siyara Lead Management CRM &bull; Internal Desk</p>
        </div>

        {/* User Role Selection Grid (Admin, User 1, User 2) */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label className="field-label" style={{ marginBottom: '0.65rem', display: 'block', textAlign: 'center' }}>
            Select Team Member
          </label>

          <div className="login-user-grid">
            <button
              type="button"
              className={`login-user-card ${selectedUser === 'Admin' ? 'active-admin' : ''}`}
              onClick={() => handleSelectUser('Admin')}
            >
              <div className="login-user-avatar admin">
                <Shield size={18} />
              </div>
              <div className="login-user-name">Admin</div>
              <div className="login-user-role">Founder</div>
            </button>

            <button
              type="button"
              className={`login-user-card ${selectedUser === 'User 1' ? 'active-user1' : ''}`}
              onClick={() => handleSelectUser('User 1')}
            >
              <div className="login-user-avatar user1">
                <User size={18} />
              </div>
              <div className="login-user-name">User 1</div>
              <div className="login-user-role">Caller Desk</div>
            </button>

            <button
              type="button"
              className={`login-user-card ${selectedUser === 'User 2' ? 'active-user2' : ''}`}
              onClick={() => handleSelectUser('User 2')}
            >
              <div className="login-user-avatar user2">
                <User size={18} />
              </div>
              <div className="login-user-name">User 2</div>
              <div className="login-user-role">Caller Desk</div>
            </button>
          </div>
        </div>

        {/* Password Form */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="field-group">
            <label className="field-label">Password for {selectedUser}</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Enter password..."
                className="date-input"
                style={{ paddingLeft: '38px', width: '100%' }}
                autoFocus
              />
            </div>
          </div>

          {errorMsg && (
            <div className="login-error-alert">
              <AlertCircle size={16} color="#dc2626" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button type="submit" className="primary-btn" style={{ width: '100%', marginTop: '0.5rem' }}>
            <span>Access Dashboard</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Password Hints */}
        <div className="login-hints">
          <div style={{ fontWeight: 700, marginBottom: '0.25rem', color: '#475569' }}>
            Default Passwords:
          </div>
          <div>Admin: <code>changeme1</code> &bull; User 1: <code>changeme2</code> &bull; User 2: <code>changeme3</code></div>
        </div>
      </div>
    </div>
  );
};
