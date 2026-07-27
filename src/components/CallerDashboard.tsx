'use client';

import React, { useState } from 'react';
import { CallerName, Lead } from '../types/crm';
import { LeadCard } from './LeadCard';
import { CATEGORIES } from '../lib/constants';
import { PhoneCall, CheckCircle2, TrendingUp, Calendar, ChevronDown, ChevronRight, Search, Filter, Users, UserCheck } from 'lucide-react';

interface CallerDashboardProps {
  callerName: CallerName;
  leads: Lead[];
  onUpdateLead: (updated: Lead) => void;
}

export const CallerDashboard: React.FC<CallerDashboardProps> = ({
  callerName,
  leads,
  onUpdateLead,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [viewScope, setViewScope] = useState<'MY_LEADS' | 'ALL_LEADS'>('ALL_LEADS');
  
  // Collapse state per category
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CATEGORIES.forEach((cat) => (initial[cat] = true));
    initial['Other'] = true;
    return initial;
  });

  // Filter leads based on scope (Same shared dataset for User 1 & User 2)
  const scopedLeads = viewScope === 'MY_LEADS' 
    ? leads.filter((l) => l.assigned_to === callerName)
    : leads;

  // Stats calculation
  const totalAssigned = scopedLeads.length;
  const calledCount = scopedLeads.filter((l) => l.status !== 'Not Called').length;
  const convertedCount = scopedLeads.filter((l) => l.status === 'Converted').length;
  const conversionRate = calledCount > 0 ? ((convertedCount / calledCount) * 100).toFixed(1) : '0.0';
  const followUpCount = scopedLeads.filter((l) => l.status === 'Follow-up Needed').length;

  // Apply search & status filters
  const filteredLeads = scopedLeads.filter((lead) => {
    const matchesSearch =
      lead.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      (lead.city_area && lead.city_area.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = selectedStatus === 'ALL' || lead.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Group leads by category
  const categoryGroups: Record<string, Lead[]> = {};
  filteredLeads.forEach((lead) => {
    const cat = lead.category || 'Other';
    if (!categoryGroups[cat]) categoryGroups[cat] = [];
    categoryGroups[cat].push(lead);
  });

  const toggleCategory = (cat: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const isUser1 = callerName === 'User 1';
  const userColor = isUser1 ? '#2563eb' : '#e11d48';
  const headerBg = isUser1 ? '#eff6ff' : '#fff1f2';
  const headerBorder = isUser1 ? '#bfdbfe' : '#fecdd3';

  return (
    <div>
      {/* Caller Header & Stats Bar */}
      <div
        style={{
          background: headerBg,
          border: `1px solid ${headerBorder}`,
          borderRadius: 'var(--radius-lg)',
          padding: '1.35rem',
          marginBottom: '1.25rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: userColor }}>
              {callerName}'s Lead Desk
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Work team leads categorized by profession below (Data inside is shared for User 1 & User 2)
            </p>
          </div>

          {/* Dataset Scope Toggle (Shared pooled data vs My Leads) */}
          <div className="role-switcher" style={{ background: '#ffffff' }}>
            <button
              className={`role-btn ${viewScope === 'ALL_LEADS' ? 'active-admin' : ''}`}
              onClick={() => setViewScope('ALL_LEADS')}
              style={{ fontSize: '0.78rem' }}
            >
              <Users size={14} />
              <span>All Shared Leads ({leads.length})</span>
            </button>
            <button
              className={`role-btn ${viewScope === 'MY_LEADS' ? (isUser1 ? 'active-user1' : 'active-user2') : ''}`}
              onClick={() => setViewScope('MY_LEADS')}
              style={{ fontSize: '0.78rem' }}
            >
              <UserCheck size={14} />
              <span>Assigned to {callerName} ({leads.filter(l => l.assigned_to === callerName).length})</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid" style={{ marginBottom: 0 }}>
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Total In Queue</span>
              <PhoneCall size={16} color={userColor} />
            </div>
            <div className="stat-value">{totalAssigned}</div>
            <div className="stat-subtitle">Leads available</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Calls Worked</span>
              <CheckCircle2 size={16} color="#2563eb" />
            </div>
            <div className="stat-value">{calledCount}</div>
            <div className="stat-subtitle">{totalAssigned - calledCount} pending call</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Conversion Rate</span>
              <TrendingUp size={16} color="#059669" />
            </div>
            <div className="stat-value" style={{ color: '#059669' }}>
              {conversionRate}%
            </div>
            <div className="stat-subtitle">{convertedCount} leads converted</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Follow-ups</span>
              <Calendar size={16} color="#d97706" />
            </div>
            <div className="stat-value" style={{ color: '#d97706' }}>
              {followUpCount}
            </div>
            <div className="stat-subtitle">Require callback</div>
          </div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by business name, phone, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Statuses</option>
            <option value="Not Called">Not Called</option>
            <option value="Interested">Interested</option>
            <option value="Follow-up Needed">Follow-up Needed</option>
            <option value="Meeting Booked">Meeting Booked</option>
            <option value="Converted">Converted</option>
            <option value="No Answer">No Answer</option>
            <option value="Not Interested">Not Interested</option>
            <option value="Dead">Dead</option>
          </select>
        </div>
      </div>

      {/* Collapsible Category Lead List */}
      {Object.keys(categoryGroups).length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
          <PhoneCall size={36} color="var(--text-dim)" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>No leads found</div>
          <div style={{ fontSize: '0.82rem', marginTop: '0.25rem' }}>
            Try clearing search filters or ask Admin to import a new batch!
          </div>
        </div>
      ) : (
        Object.entries(categoryGroups).map(([catName, categoryLeads]) => {
          const isOpen = openCategories[catName] !== false;
          return (
            <div key={catName} className="category-group">
              <button className="category-header" onClick={() => toggleCategory(catName)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  {isOpen ? <ChevronDown size={18} color="#475569" /> : <ChevronRight size={18} color="#475569" />}
                  <span>{catName}</span>
                </div>
                <div className="category-meta">
                  <span className="category-count">{categoryLeads.length} Leads</span>
                </div>
              </button>

              {isOpen && (
                <div className="category-content">
                  {categoryLeads.map((lead) => (
                    <LeadCard key={lead.id} lead={lead} onUpdateLead={onUpdateLead} />
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};
