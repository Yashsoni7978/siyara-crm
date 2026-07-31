'use client';

import React, { useState, useEffect } from 'react';
import { Lead, ImportSummary } from '../types/crm';
import { ImportTool } from './ImportTool';
import { DataTable } from './data-display/DataTable';
import { AnalyticsCards } from './data-display/AnalyticsCards';
import { STATUS_CONFIG } from '../lib/constants';

interface AdminOverviewProps {
  onImportComplete: (updatedLeads: Lead[], summary: ImportSummary) => void;
  onResetData: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  onImportComplete,
  onResetData,
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedCaller, setSelectedCaller] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch leads from server
  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: '50',
        search: searchTerm,
        status: selectedStatus,
        priority: selectedPriority,
        assignedToId: selectedCaller
      });
      const res = await fetch(`/api/leads?${query.toString()}`);
      const json = await res.json();
      if (json.data) {
        setLeads(json.data);
        setTotalPages(json.meta.totalPages);
        setTotalLeads(json.meta.total);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly
    const timer = setTimeout(() => {
      fetchLeads();
    }, 300);
    return () => clearTimeout(timer);
  }, [page, searchTerm, selectedStatus, selectedPriority, selectedCaller]);

  return (
    <div>
      {/* KPIs */}
      <AnalyticsCards leads={leads} totalLeads={totalLeads} />

      <div style={{ marginBottom: '24px' }}>
        <ImportTool onImportComplete={onImportComplete} organizationId="siyara-enterprise-id-1" />
      </div>

      {/* Leads Table Section */}
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: 'var(--font-lg)', fontWeight: 600 }}>Master Leads Database</h2>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Page {page} of {totalPages || 1}</span>
            <button 
              className="btn btn-secondary" 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Search by business name or phone..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
            style={{ width: '300px' }}
          />
          <select className="input-field" value={selectedCaller} onChange={e => { setSelectedCaller(e.target.value); setPage(1); }} style={{ width: '150px' }}>
            <option value="ALL">All Callers</option>
            <option value="User 1">User 1</option>
            <option value="User 2">User 2</option>
          </select>
          <select className="input-field" value={selectedStatus} onChange={e => { setSelectedStatus(e.target.value); setPage(1); }} style={{ width: '150px' }}>
            <option value="ALL">All Statuses</option>
            {Object.keys(STATUS_CONFIG).map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <select className="input-field" value={selectedPriority} onChange={e => { setSelectedPriority(e.target.value); setPage(1); }} style={{ width: '150px' }}>
            <option value="ALL">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
            <option value="None">None</option>
          </select>
        </div>

        {/* Data Table */}
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading leads...</div>
        ) : (
          <DataTable leads={leads} />
        )}
      </div>
    </div>
  );
};
