'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CallerName, Lead, CallStatus } from '../types/crm';
import { LeadQueueToolbar, SortField } from './caller/LeadQueueToolbar';
import { SavedViews, PRESET_VIEWS, SavedView } from './caller/SavedViews';
import { LeadQueue } from './caller/LeadQueue';
import { CallerWorkspace, WorkspaceTab } from './caller/CallerWorkspace';
import { getUserIdByName } from '../app/actions';
import { CATEGORIES, STATUS_CONFIG } from '../lib/constants';

interface CallerDashboardProps {
  callerName: CallerName;
}

export const CallerDashboard: React.FC<CallerDashboardProps> = ({ callerName }) => {
  // Authentication & Init State
  const [userId, setUserId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Pagination & Data State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Queue & Workspace State
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');

  // Filter & Sort State
  const [activeView, setActiveView] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortField>('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Resolve User ID
  useEffect(() => {
    let mounted = true;
    const initUser = async () => {
      setIsInitializing(true);
      const id = await getUserIdByName(callerName);
      if (mounted) {
        setUserId(id);
        setIsInitializing(false);
      }
    };
    initUser();
    return () => { mounted = false; };
  }, [callerName]);

  // Fetch Leads
  const fetchLeads = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        assignedToId: userId,
      });

      if (search) params.set('search', search);
      if (statusFilter.length > 0) params.set('status', statusFilter.join(','));
      if (priorityFilter.length > 0) params.set('priority', priorityFilter.join(','));
      if (categoryFilter.length > 0) params.set('category', categoryFilter.join(','));
      if (locationFilter.length > 0) params.set('cityArea', locationFilter.join(','));
      if (sortBy) params.set('sortBy', sortBy);
      if (sortOrder) params.set('sortOrder', sortOrder);

      const res = await fetch(`/api/leads?${params.toString()}`);
      const json = await res.json();
      
      if (json.data) {
        setLeads(json.data);
        setTotalLeads(json.meta.total);
        setTotalPages(json.meta.totalPages);
        
        // Ensure activeLeadId remains valid or reset it
        if (json.data.length > 0 && !json.data.find((l: Lead) => l.id === activeLeadId)) {
          setActiveLeadId(null);
          setFocusedIndex(-1);
        }
      }
    } catch (e) {
      console.error('Failed to fetch leads', e);
    } finally {
      setIsLoading(false);
    }
  }, [userId, page, search, statusFilter, priorityFilter, activeLeadId]); // Exclude phase G filters from deps for now

  // Refetch when dependencies change
  useEffect(() => {
    if (!isInitializing) {
      fetchLeads();
    }
  }, [fetchLeads, isInitializing]);

  // Handlers
  const handleViewChange = (view: SavedView) => {
    setActiveView(view.id);
    setStatusFilter(view.filters.status || []);
    setPriorityFilter(view.filters.priority || []);
    setCategoryFilter(view.filters.category || []);
    setSortBy((view.filters.sortBy as SortField) || 'updatedAt');
    setSortOrder(view.filters.sortOrder || 'desc');
    setPage(1);
    
    // In Phase G, we will also handle followUpToday filter
  };

  const handleUpdateLead = async (updates: Partial<Lead>) => {
    if (!activeLeadId || !userId) return;
    
    // Optimistic Update
    setLeads(prev => prev.map(l => l.id === activeLeadId ? { ...l, ...updates } as Lead : l));
    
    try {
      const res = await fetch(`/api/leads/${activeLeadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updates,
          userId: userId // pass userId for activity audit trail
        })
      });
      
      if (!res.ok) {
        throw new Error('Failed to update lead');
      }
      
      // Optionally sync back the updated lead if backend changed anything else
      // const updatedLead = await res.json();
      // setLeads(prev => prev.map(l => l.id === activeLeadId ? updatedLead : l));
    } catch (e) {
      console.error('API Persistence failed', e);
      // If we wanted robust error handling, we'd revert the optimistic update here
    }
  };

  const handleAddNote = async (note: string) => {
    if (!activeLeadId || !userId) return;
    
    // Fire and forget POST to activities
    try {
      await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: activeLeadId,
          userId: userId,
          type: 'Note',
          description: note,
        })
      });
    } catch (e) {
      console.error('Failed to add note', e);
    }
  };

  // Keyboard Shortcuts (Phase H basics: Enter, Esc, Arrows are in LeadQueue)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Escape to clear selection
      if (e.key === 'Escape') {
        setActiveLeadId(null);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const activeLead = useMemo(() => leads.find(l => l.id === activeLeadId) || null, [leads, activeLeadId]);

  if (isInitializing) {
    return <div style={{ padding: '40px', color: 'var(--text-muted)' }}>Loading Caller Workspace...</div>;
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
      
      {/* Middle Column: Lead Queue */}
      <div style={{ width: '350px', borderRight: '1px solid var(--border-main)', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
        
        <div style={{ padding: '16px 16px 0', background: 'var(--bg-main)' }}>
          <SavedViews activeView={activeView} onViewChange={handleViewChange} />
        </div>

        <LeadQueueToolbar 
          search={search}
          onSearchChange={(s) => { setSearch(s); setPage(1); }}
          statusFilter={statusFilter}
          onStatusFilterChange={(s) => { setStatusFilter(s); setPage(1); }}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={(p) => { setPriorityFilter(p); setPage(1); }}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={(c) => { setCategoryFilter(c); setPage(1); }}
          locationFilter={locationFilter}
          onLocationFilterChange={(l) => { setLocationFilter(l); setPage(1); }}
          sortBy={sortBy}
          onSortByChange={(s) => { setSortBy(s); setPage(1); }}
          sortOrder={sortOrder}
          onSortOrderChange={(o) => { setSortOrder(o); setPage(1); }}
          statusOptions={Object.keys(STATUS_CONFIG)}
          priorityOptions={['High', 'Medium', 'Low', 'None']}
          categoryOptions={CATEGORIES}
          locationOptions={['Downtown', 'Northside', 'West End', 'Eastside', 'Southside']} // Dummy locations for now
        />

        <LeadQueue 
          leads={leads}
          activeLeadId={activeLeadId}
          focusedIndex={focusedIndex}
          onSelectLead={setActiveLeadId}
          onFocusChange={setFocusedIndex}
          isLoading={isLoading}
          total={totalLeads}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Right Column: Caller Workspace */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'white' }}>
        <CallerWorkspace 
          lead={activeLead}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onUpdateLead={handleUpdateLead}
          onAddNote={handleAddNote}
        />
      </div>

    </div>
  );
};
