'use client';

import React, { useState } from 'react';
import { CallerName, ImportSummary, Lead } from '../types/crm';
import { ImportTool } from './ImportTool';
import { STATUS_CONFIG } from '../lib/constants';
import { resetToSampleData } from '../lib/storage';
import { Shield, Users, BarChart3, RotateCcw, ArrowRightLeft } from 'lucide-react';

interface AdminOverviewProps {
  leads: Lead[];
  onUpdateLead: (updated: Lead) => void;
  onImportComplete: (updatedLeads: Lead[], summary: ImportSummary) => void;
  onResetData: (resetLeads: Lead[]) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  leads,
  onUpdateLead,
  onImportComplete,
  onResetData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCaller, setSelectedCaller] = useState<string>('ALL');

  // General Metrics
  const totalLeads = leads.length;
  const totalCalled = leads.filter((l) => l.status !== 'Not Called').length;
  const totalConverted = leads.filter((l) => l.status === 'Converted').length;
  const overallConversion = totalCalled > 0 ? ((totalConverted / totalCalled) * 100).toFixed(1) : '0.0';

  // Side-by-side comparison calculations
  const calculateCallerMetrics = (caller: CallerName) => {
    const callerLeads = leads.filter((l) => l.assigned_to === caller);
    const assigned = callerLeads.length;
    const called = callerLeads.filter((l) => l.status !== 'Not Called').length;
    const interested = callerLeads.filter((l) => l.status === 'Interested').length;
    const meetings = callerLeads.filter((l) => l.status === 'Meeting Booked').length;
    const converted = callerLeads.filter((l) => l.status === 'Converted').length;
    const convRate = called > 0 ? ((converted / called) * 100).toFixed(1) : '0.0';

    return { assigned, called, interested, meetings, converted, convRate };
  };

  const user1Metrics = calculateCallerMetrics('User 1');
  const user2Metrics = calculateCallerMetrics('User 2');

  // Filter master lead table
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      (lead.city_area && lead.city_area.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat = selectedCategory === 'ALL' || lead.category === selectedCategory;
    const matchesStatus = selectedStatus === 'ALL' || lead.status === selectedStatus;
    const matchesCaller = selectedCaller === 'ALL' || lead.assigned_to === selectedCaller;

    return matchesSearch && matchesCat && matchesStatus && matchesCaller;
  });

  const handleReset = () => {
    if (window.confirm('Reset all leads back to initial demo data?')) {
      const resetLeads = resetToSampleData();
      onResetData(resetLeads);
    }
  };

  const handleReassign = (lead: Lead) => {
    const nextCaller: CallerName = lead.assigned_to === 'User 1' ? 'User 2' : 'User 1';
    onUpdateLead({
      ...lead,
      assigned_to: nextCaller,
    });
  };

  const uniqueCategories = Array.from(new Set(leads.map((l) => l.category || 'Other')));

  return (
    <div>
      {/* Admin Header */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.35rem',
          marginBottom: '1.25rem',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={22} color="#0f172a" />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                Admin Overview Dashboard
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Performance tracking, caller comparison & batch scraper import
            </p>
          </div>

          <button onClick={handleReset} className="secondary-btn">
            <RotateCcw size={14} />
            <span>Reset Demo Data</span>
          </button>
        </div>

        {/* Global Summary Stats */}
        <div className="stats-grid" style={{ marginTop: '1.15rem', marginBottom: 0 }}>
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Total Scraped Leads</span>
              <Users size={16} color="#475569" />
            </div>
            <div className="stat-value">{totalLeads}</div>
            <div className="stat-subtitle">Across all batches</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Total Called</span>
              <BarChart3 size={16} color="#2563eb" />
            </div>
            <div className="stat-value">{totalCalled}</div>
            <div className="stat-subtitle">{totalLeads - totalCalled} pending call</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Overall Conversion</span>
              <BarChart3 size={16} color="#059669" />
            </div>
            <div className="stat-value" style={{ color: '#059669' }}>
              {overallConversion}%
            </div>
            <div className="stat-subtitle">{totalConverted} converted sales</div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Caller Performance Comparison */}
      <div className="admin-grid">
        {/* User 1 Panel */}
        <div className="panel" style={{ borderTop: '4px solid #2563eb' }}>
          <div className="caller-header">
            <span className="caller-badge user1">
              <Users size={14} /> User 1 Performance
            </span>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#2563eb' }}>
              {user1Metrics.convRate}% Conv
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Assigned Leads</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{user1Metrics.assigned}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Worked / Called</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{user1Metrics.called}</div>
            </div>
          </div>

          {/* Sales Funnel */}
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            STATUS FUNNEL
          </div>

          <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                <span>Interested</span>
                <span style={{ fontWeight: 700 }}>{user1Metrics.interested}</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${user1Metrics.assigned ? (user1Metrics.interested / user1Metrics.assigned) * 100 : 0}%`,
                    background: '#10b981',
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                <span>Meetings Booked</span>
                <span style={{ fontWeight: 700 }}>{user1Metrics.meetings}</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${user1Metrics.assigned ? (user1Metrics.meetings / user1Metrics.assigned) * 100 : 0}%`,
                    background: '#2563eb',
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                <span>Converted</span>
                <span style={{ fontWeight: 700 }}>{user1Metrics.converted}</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${user1Metrics.assigned ? (user1Metrics.converted / user1Metrics.assigned) * 100 : 0}%`,
                    background: '#059669',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* User 2 Panel */}
        <div className="panel" style={{ borderTop: '4px solid #e11d48' }}>
          <div className="caller-header">
            <span className="caller-badge user2">
              <Users size={14} /> User 2 Performance
            </span>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#e11d48' }}>
              {user2Metrics.convRate}% Conv
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Assigned Leads</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{user2Metrics.assigned}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Worked / Called</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>{user2Metrics.called}</div>
            </div>
          </div>

          {/* Sales Funnel */}
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            STATUS FUNNEL
          </div>

          <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                <span>Interested</span>
                <span style={{ fontWeight: 700 }}>{user2Metrics.interested}</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${user2Metrics.assigned ? (user2Metrics.interested / user2Metrics.assigned) * 100 : 0}%`,
                    background: '#10b981',
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                <span>Meetings Booked</span>
                <span style={{ fontWeight: 700 }}>{user2Metrics.meetings}</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${user2Metrics.assigned ? (user2Metrics.meetings / user2Metrics.assigned) * 100 : 0}%`,
                    background: '#2563eb',
                  }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#334155' }}>
                <span>Converted</span>
                <span style={{ fontWeight: 700 }}>{user2Metrics.converted}</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${user2Metrics.assigned ? (user2Metrics.converted / user2Metrics.assigned) * 100 : 0}%`,
                    background: '#059669',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scraper Batch Import Tool */}
      <div style={{ marginBottom: '1.5rem' }}>
        <ImportTool onImportComplete={onImportComplete} />
      </div>

      {/* Master Leads Directory */}
      <div className="panel">
        <div className="panel-title" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={18} color="#0f172a" />
            <span>Master Leads Database ({filteredLeads.length})</span>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search business name, phone, area..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={selectedCaller}
            onChange={(e) => setSelectedCaller(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Callers</option>
            <option value="User 1">User 1</option>
            <option value="User 2">User 2</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Categories</option>
            {uniqueCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select"
          >
            <option value="ALL">All Statuses</option>
            {Object.keys(STATUS_CONFIG).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Master Table */}
        <div className="table-container">
          <table className="leads-table">
            <thead>
              <tr>
                <th>Business</th>
                <th>Category</th>
                <th>Phone</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Notes / Follow-up</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No matching leads found
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => {
                  const statusConfig = STATUS_CONFIG[lead.status] || STATUS_CONFIG['Not Called'];
                  const callerClass = lead.assigned_to === 'User 1' ? 'user1' : 'user2';
                  return (
                    <tr key={lead.id}>
                      <td style={{ fontWeight: 700 }}>
                        <div>{lead.business_name}</div>
                        {lead.city_area && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                            {lead.city_area}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="badge" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                          {lead.category}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#334155' }}>{lead.phone}</td>
                      <td>
                        <span className={`caller-badge ${callerClass}`} style={{ fontSize: '0.75rem' }}>
                          {lead.assigned_to}
                        </span>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            backgroundColor: statusConfig.bg,
                            color: statusConfig.color,
                            border: `1px solid ${statusConfig.border}`,
                          }}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td style={{ maxWidth: '200px' }}>
                        <div style={{ fontSize: '0.78rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#475569' }}>
                          {lead.notes || 'No notes'}
                        </div>
                        {lead.follow_up_date && (
                          <div style={{ fontSize: '0.72rem', color: '#d97706', fontWeight: 600 }}>
                            Follow-up: {lead.follow_up_date}
                          </div>
                        )}
                      </td>
                      <td>
                        <button
                          onClick={() => handleReassign(lead)}
                          className="secondary-btn"
                          title={`Reassign to ${lead.assigned_to === 'User 1' ? 'User 2' : 'User 1'}`}
                        >
                          <ArrowRightLeft size={12} />
                          <span>Reassign</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
