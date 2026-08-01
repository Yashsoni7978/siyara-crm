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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    setLoggedInRole(null);
  };

  // Show Login Screen if no user is authenticated
  if (!loggedInRole) {
    return <LoginScreen onLoginSuccess={(role) => setLoggedInRole(role)} />;
  }

  const renderAdminContent = () => {
    return (
      <AdminOverview
        onImportComplete={() => {}} // TODO: Hook up to import engine
        onResetData={() => {}}
        activeMenu={activeMenu}
      />
    );
  };

  return (
    <div className="app-layout">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop mobile-only-block" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <Sidebar 
        role={loggedInRole} 
        activeMenu={activeMenu} 
        onNavigate={setActiveMenu} 
        onLogout={handleLogout} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="main-content">
        <TopNavbar 
          role={loggedInRole} 
          activeMenu={activeMenu} 
          onLogout={handleLogout} 
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        
        <div className="workspace" style={{ padding: 0 }}>
          {loggedInRole === 'Admin' ? renderAdminContent() : <CallerDashboard callerName={loggedInRole} activeMenu={activeMenu} />}
        </div>
      </div>
    </div>
  );
}
