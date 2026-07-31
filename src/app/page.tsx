'use client';

import React, { useState } from 'react';
import { UserRole } from '../types/crm';
import { Sidebar } from '../components/layout/Sidebar';
import { TopNavbar } from '../components/layout/TopNavbar';
import { LoginScreen } from '../components/LoginScreen';
import { CallerDashboard } from '../components/CallerDashboard';
import { AdminOverview } from '../components/AdminOverview';
import { ImportTool } from '../components/ImportTool';

export default function Home() {
  const [loggedInRole, setLoggedInRole] = useState<UserRole | null>(null);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const handleLogout = () => {
    setLoggedInRole(null);
  };

  // Show Login Screen if no user is authenticated
  if (!loggedInRole) {
    return <LoginScreen onLoginSuccess={(role) => setLoggedInRole(role)} />;
  }

  const renderAdminContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <AdminOverview
            onImportComplete={() => {}} // TODO: Hook up to import engine
            onResetData={() => {}}
            activeMenu={activeMenu}
          />
        );
      case 'import':
        return (
          <ImportTool
            organizationId="default-org"
            onImportComplete={() => {}}
          />
        );
      default:
        return (
          <div className="placeholder-page" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1rem' }}>
              {activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}
            </h2>
            <p>This module is under construction.</p>
          </div>
        );
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar 
        role={loggedInRole} 
        activeMenu={activeMenu} 
        onNavigate={setActiveMenu} 
        onLogout={handleLogout} 
      />

      {/* Main Content Area */}
      <div className="main-content">
        <TopNavbar role={loggedInRole} activeMenu={activeMenu} />
        
        <div className="workspace">
          {loggedInRole === 'Admin' ? renderAdminContent() : <CallerDashboard callerName={loggedInRole} />}
        </div>
      </div>
    </div>
  );
}
