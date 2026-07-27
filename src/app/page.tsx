'use client';

import React, { useState, useEffect } from 'react';
import { UserRole, Lead, ImportSummary } from '../types/crm';
import { getLeads, updateSingleLead } from '../lib/storage';
import { Navbar } from '../components/Navbar';
import { LoginScreen } from '../components/LoginScreen';
import { CallerDashboard } from '../components/CallerDashboard';
import { AdminOverview } from '../components/AdminOverview';

export default function Home() {
  const [loggedInRole, setLoggedInRole] = useState<UserRole | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize leads from localStorage on mount
  useEffect(() => {
    const loaded = getLeads();
    setLeads(loaded);
    setIsLoaded(true);
  }, []);

  const handleUpdateLead = (updatedLead: Lead) => {
    const nextLeads = updateSingleLead(updatedLead);
    setLeads([...nextLeads]);
  };

  const handleImportComplete = (updatedLeads: Lead[], summary: ImportSummary) => {
    setLeads([...updatedLeads]);
  };

  const handleResetData = (resetLeads: Lead[]) => {
    setLeads([...resetLeads]);
  };

  const handleLogout = () => {
    setLoggedInRole(null);
  };

  if (!isLoaded) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: '1rem',
          fontWeight: 600,
        }}
      >
        Loading Siyara CRM...
      </div>
    );
  }

  // Show Login Screen if no user is authenticated
  if (!loggedInRole) {
    return <LoginScreen onLoginSuccess={(role) => setLoggedInRole(role)} />;
  }

  return (
    <main style={{ minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
      <Navbar
        currentRole={loggedInRole}
        onLogout={handleLogout}
        totalLeadsCount={leads.length}
      />

      <div className="container">
        {loggedInRole === 'Admin' && (
          <AdminOverview
            leads={leads}
            onUpdateLead={handleUpdateLead}
            onImportComplete={handleImportComplete}
            onResetData={handleResetData}
          />
        )}

        {(loggedInRole === 'User 1' || loggedInRole === 'User 2') && (
          <CallerDashboard
            callerName={loggedInRole}
            leads={leads}
            onUpdateLead={handleUpdateLead}
          />
        )}
      </div>
    </main>
  );
}
