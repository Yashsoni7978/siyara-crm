'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CallerName, Lead, CallStatus } from '../types/crm';
import { LeadQueueToolbar, SortField } from './caller/LeadQueueToolbar';
import { SavedViews, PRESET_VIEWS, SavedView } from './caller/SavedViews';
import { LeadQueue } from './caller/LeadQueue';
import { CallerWorkspace, WorkspaceTab } from './caller/CallerWorkspace';
import { CallerActivities } from './caller/CallerActivities';
import { CallerReports } from './caller/CallerReports';
import { CallerSettings } from './caller/CallerSettings';
import { getUserIdByName } from '../app/actions';
import { CATEGORIES, STATUS_CONFIG } from '../lib/constants';

interface CallerDashboardProps {
  callerName: CallerName;
  activeMenu?: string;
}

export const CallerDashboard: React.FC<CallerDashboardProps> = ({ callerName, activeMenu }) => {
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
  const [isWorkspaceDirty, setIsWorkspaceDirty] = useState(false);

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

      if (activeMenu === 'today') {
        params.set('followUpDue', 'today_or_overdue');
        // By default sort follow-ups by due date ascending so oldest are first
        if (!sortBy) {
          params.set('sortBy', 'followUpDate');
          params.set('sortOrder', 'asc');
        }
      }

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
  }, [userId, page, search, statusFilter, priorityFilter, activeLeadId, activeMenu]); // Exclude phase G filters from deps for now

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

  const handleSelectLead = useCallback((id: string | null) => {
    if (activeLeadId === id) return;
    if (isWorkspaceDirty) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to switch leads?');
      if (!confirm) return;
    }
    setActiveLeadId(id);
    setIsWorkspaceDirty(false); // Reset dirty state on change
  }, [activeLeadId, isWorkspaceDirty]);

  const [showMobileList, setShowMobileList] = useState(true);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input/textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        // Exception: Ctrl+Enter to save while focused in an input
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          const saveBtn = document.querySelector('button.btn-primary') as HTMLButtonElement;
          if (saveBtn && saveBtn.innerText.includes('Save')) {
            saveBtn.click();
          }
        }
        return;
      }

      if (e.key === 'Escape') {
        handleSelectLead(null);
        setFocusedIndex(-1);
        setShowMobileList(true);
        return;
      }

      if (!activeLeadId) return; // Shortcuts below require an active lead

      switch (e.key.toLowerCase()) {
        case 'n':
          e.preventDefault();
          setActiveTab('timeline');
          // small timeout to let the tab render before focusing the textarea
          setTimeout(() => {
            const noteInput = document.querySelector('.cw-note-input') as HTMLTextAreaElement;
            noteInput?.focus();
          }, 50);
          break;
        case 'f':
          e.preventDefault();
          setActiveTab('overview');
          setTimeout(() => {
            const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
            dateInput?.focus();
            dateInput?.showPicker?.(); // Optional: open date picker native UI if supported
          }, 50);
          break;
        case 't':
          e.preventDefault();
          setActiveTab('tasks');
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
          e.preventDefault();
          const statuses = Object.keys(STATUS_CONFIG) as CallStatus[];
          const index = parseInt(e.key) - 1;
          if (statuses[index]) {
            // Trigger status change via the same logic handleStatusChange would use
            const statusSelect = document.querySelector('.cw-action-status-select') as HTMLSelectElement;
            if (statusSelect) {
              statusSelect.value = statuses[index];
              statusSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }
          break;
      }
    };
    
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [activeLeadId, handleSelectLead]);

  const activeLead = useMemo(() => leads.find(l => l.id === activeLeadId) || null, [leads, activeLeadId]);

  if (isInitializing) {
    return <div style={{ padding: '40px', color: 'var(--text-muted)' }}>Loading Caller Workspace...</div>;
  }

  if (!userId) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-main)', marginTop: '40px' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>User Account Not Found</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          The caller account "<strong>{callerName}</strong>" does not exist in the database.
          Please run the database seed script or contact your administrator.
        </p>
      </div>
    );
  }

  // Handle Full-Page Modules (Activities, Reports, Settings)
  if (activeMenu === 'activities') {
    return <CallerActivities userId={userId} />;
  }
  
  if (activeMenu === 'reports') {
    return <CallerReports />;
  }
  
  if (activeMenu === 'settings') {
    return <CallerSettings callerName={callerName} />;
  }

  return (
    <div className="caller-dashboard-container" style={{ display: 'flex', height: 'calc(100vh - 56px)', overflow: 'hidden' }}>
      
      {/* Middle Column: Lead Queue */}
      <div className={`caller-dashboard-queue ${!showMobileList ? 'mobile-hidden' : ''}`} style={{ width: '350px', borderRight: '1px solid var(--border-main)', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
        
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
          onSelectLead={(id) => {
            handleSelectLead(id);
            if (id) setShowMobileList(false);
          }}
          onFocusChange={setFocusedIndex}
          isLoading={isLoading}
          total={totalLeads}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Right Column: Caller Workspace */}
      <div className={`caller-dashboard-workspace ${showMobileList ? 'mobile-hidden' : ''}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'white' }}>
        {/* Mobile Back Button */}
        <button 
          className="mobile-only" 
          onClick={() => setShowMobileList(true)}
          style={{ 
            padding: '12px 16px', 
            background: 'var(--bg-main)', 
            border: 'none', 
            borderBottom: '1px solid var(--border-main)',
            color: 'var(--primary)',
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'left'
          }}
        >
          &larr; Back to Leads Queue
        </button>
        
        <CallerWorkspace 
          lead={activeLead}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onUpdateLead={handleUpdateLead}
          onAddNote={handleAddNote}
          onDirtyChange={setIsWorkspaceDirty}
        />
      </div>

    </div>
  );
};
