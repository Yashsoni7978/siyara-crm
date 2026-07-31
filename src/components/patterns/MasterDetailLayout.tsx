import React, { useState } from 'react';
import { Lead, CallStatus } from '../../types/crm';
import { STATUS_CONFIG } from '../../lib/constants';

interface MasterDetailLayoutProps {
  leads: Lead[];
  onUpdateLead: (updated: Lead) => void;
}

export const MasterDetailLayout: React.FC<MasterDetailLayoutProps> = ({ leads, onUpdateLead }) => {
  const [activeLeadId, setActiveLeadId] = useState<string | null>(leads.length > 0 ? leads[0].id : null);
  const [activeTab, setActiveTab] = useState<'CRM' | 'Google' | 'Notes'>('CRM');

  const activeLead = leads.find(l => l.id === activeLeadId) || null;

  const handleUpdate = (updates: Partial<Lead>) => {
    if (!activeLead) return;
    onUpdateLead({ ...activeLead, ...updates });
  };

  return (
    <div className="master-detail-layout">
      {/* LEFT: MASTER LIST */}
      <div className="master-list">
        <div className="master-list-header">
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Assigned Leads ({leads.length})</span>
        </div>
        <div className="master-list-content">
          {leads.map(lead => {
            const isActive = activeLeadId === lead.id;
            const statusStyle = STATUS_CONFIG[lead.status] || STATUS_CONFIG['Not Called'];
            
            return (
              <div 
                key={lead.id} 
                className={`master-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveLeadId(lead.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-main)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {lead.businessName}
                  </span>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusStyle.color, marginTop: '4px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{lead.category}</span>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-main)' }}>{lead.phone}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT: DETAIL PANEL */}
      <div className="detail-panel">
        {activeLead ? (
          <>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--border-main)', backgroundColor: 'var(--bg-main)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, marginBottom: '4px' }}>{activeLead.businessName}</h2>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
                    <span>{activeLead.phone}</span>
                    <span>{activeLead.address || activeLead.cityArea || 'No address'}</span>
                    <span>{activeLead.category}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="badge" style={{ backgroundColor: '#E5E7EB', color: 'var(--text-main)' }}>
                    Priority: {activeLead.priority || 'None'}
                  </span>
                </div>
              </div>

              {/* TABS */}
              <div style={{ display: 'flex', gap: '24px', marginTop: '24px', borderBottom: '1px solid var(--border-main)' }}>
                {['CRM', 'Google', 'Notes'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    style={{
                      padding: '8px 4px',
                      background: 'none',
                      border: 'none',
                      borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                      color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                      fontWeight: activeTab === tab ? 600 : 500,
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    {tab} Information
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {activeTab === 'CRM' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label className="label">Call Status</label>
                      <select 
                        className="input-field" 
                        value={activeLead.status}
                        onChange={e => handleUpdate({ status: e.target.value as CallStatus })}
                        style={{ backgroundColor: STATUS_CONFIG[activeLead.status]?.bg || 'white' }}
                      >
                        {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="label">Priority</label>
                      <select 
                        className="input-field"
                        value={activeLead.priority || 'None'}
                        onChange={e => handleUpdate({ priority: e.target.value as any })}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                        <option value="None">None</option>
                      </select>
                    </div>
                    <div>
                      <label className="label">Follow-up Date</label>
                      <input 
                        type="date" 
                        className="input-field" 
                        value={activeLead.followUpDate || ''}
                        onChange={e => handleUpdate({ followUpDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="label">Quick Notes</label>
                    <textarea 
                      className="input-field" 
                      style={{ height: '180px', resize: 'none' }}
                      value={activeLead.notes || ''}
                      onChange={e => handleUpdate({ notes: e.target.value })}
                      placeholder="Add conversation notes here..."
                    />
                  </div>
                </div>
              )}

              {activeTab === 'Google' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div>
                    <label className="label">Google Rating</label>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{activeLead.rating || 'N/A'} ({activeLead.reviewCount || 0} reviews)</div>
                  </div>
                  <div>
                    <label className="label">Business Age</label>
                    <div style={{ fontSize: '14px', fontWeight: 500 }}>{activeLead.businessAge || 'Unknown'}</div>
                  </div>
                  <div>
                    <label className="label">Opening Hours</label>
                    <div style={{ fontSize: '14px' }}>{activeLead.openingHours || 'Not provided'}</div>
                  </div>
                  <div>
                    <label className="label">Website</label>
                    <div style={{ fontSize: '14px', color: 'var(--primary)' }}>
                      {activeLead.website ? <a href={activeLead.website} target="_blank" rel="noreferrer">{activeLead.website}</a> : 'No website'}
                    </div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="label">Latest Review</label>
                    <div style={{ fontSize: '13px', fontStyle: 'italic', backgroundColor: 'var(--bg-main)', padding: '12px', borderRadius: '4px' }}>
                      "{activeLead.latestReview || 'No reviews recorded.'}"
                    </div>
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <a href={activeLead.mapsLink} target="_blank" rel="noreferrer" className="btn btn-secondary">Open in Google Maps</a>
                  </div>
                </div>
              )}

              {activeTab === 'Notes' && (
                <div>
                  <label className="label">Full Interaction History</label>
                  <textarea 
                    className="input-field" 
                    style={{ height: '300px', resize: 'vertical' }}
                    value={activeLead.notes || ''}
                    onChange={e => handleUpdate({ notes: e.target.value })}
                    placeholder="Comprehensive history of interactions..."
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            Select a lead from the list to view details
          </div>
        )}
      </div>
    </div>
  );
};
