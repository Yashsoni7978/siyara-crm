'use client';

import React from 'react';
import { UserRole } from '../types/crm';
import { Shield, User, LogOut, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onLogout: () => void;
  totalLeadsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onLogout,
  totalLeadsCount,
}) => {
  const isUser1 = currentRole === 'User 1';
  const isUser2 = currentRole === 'User 2';
  const isAdmin = currentRole === 'Admin';

  const badgeClass = isAdmin ? 'active-admin' : isUser1 ? 'active-user1' : 'active-user2';

  return (
    <header className="header-bar">
      <div className="brand">
        <div className="brand-icon">
          <Sparkles size={18} color="#ffffff" />
        </div>
        <div>
          <div className="brand-title">Siyara CRM</div>
          <div className="brand-subtitle">Cold Call & Lead Management</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div className={`role-badge-pill ${badgeClass}`}>
          {isAdmin ? <Shield size={14} /> : <User size={14} />}
          <span>{currentRole} Session</span>
        </div>

        <button onClick={onLogout} className="secondary-btn" title="Logout session">
          <LogOut size={14} />
          <span>Lock & Logout</span>
        </button>
      </div>
    </header>
  );
};
