'use client';

import React, { useState, useEffect } from 'react';
import { CallerName, Lead } from '../types/crm';
import { MasterDetailLayout } from './patterns/MasterDetailLayout';

interface CallerDashboardProps {
  callerName: CallerName;
}

export const CallerDashboard: React.FC<CallerDashboardProps> = ({ callerName }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      // Map 'User 1' to the actual DB ID in a real app, but for now our seed maps it.
      // We will fetch based on assignedToId or a specific query. Wait, the API supports filtering.
      // But we need the actual user ID. For our prototype, let's just fetch all and filter client side OR
      // assume callerName maps to something we can filter by. The seed creates User with name 'User 1'.
      // Our API doesn't filter by user Name, it filters by assignedToId.
      // Let's just fetch all leads for now, and filter by caller name.
      const res = await fetch(`/api/leads?limit=500`);
      const json = await res.json();
      if (json.data) {
        // Find leads assigned to this caller
        const myLeads = json.data.filter((l: any) => l.assignedTo?.name === callerName);
        setLeads(myLeads);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [callerName]);

  const handleUpdateLead = (updated: Lead) => {
    // Optimistic UI update
    setLeads(leads.map(l => l.id === updated.id ? updated : l));
    // Ideally here we POST to the server to save the status
  };

  if (isLoading) {
    return <div style={{ padding: '40px', color: 'var(--text-muted)' }}>Loading Caller Workspace...</div>;
  }

  return (
    <div style={{ height: 'calc(100vh - 104px)' }}>
      <MasterDetailLayout leads={leads} onUpdateLead={handleUpdateLead} />
    </div>
  );
};
