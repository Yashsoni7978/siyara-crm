'use client';

import React, { useState } from 'react';
import { UserRole } from '../types/crm';
import { ACCOUNTS } from '../lib/auth';

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
      setErrorMsg('Invalid password for selected role.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: 'var(--font-xl)', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
            SIYARA CRM
          </h1>
          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginTop: '4px' }}>
            Enterprise Lead Management
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div>
            <label className="label">Select Role</label>
            <select 
              className="input-field"
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value as UserRole);
                setPassword('');
                setErrorMsg('');
              }}
              style={{ backgroundColor: 'white', cursor: 'pointer' }}
            >
              <option value="Admin">Admin / Manager</option>
              <option value="User 1">Caller Desk 1</option>
              <option value="User 2">Caller Desk 2</option>
            </select>
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-xs)', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input type="checkbox" />
              Remember Me
            </label>
            <a href="#" style={{ fontSize: 'var(--font-xs)', color: 'var(--primary)', textDecoration: 'none', fontWeight: 500 }}>
              Forgot Password?
            </a>
          </div>

          {errorMsg && (
            <div style={{ padding: '8px 12px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '4px', color: '#DC2626', fontSize: '13px', fontWeight: 500 }}>
              {errorMsg}
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px', padding: '10px' }}>
            Login to Workspace
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
          <div>Default Passwords:</div>
          <div style={{ marginTop: '4px' }}>Admin: changeme1 | User 1: changeme2 | User 2: changeme3</div>
        </div>
      </div>
    </div>
  );
};
