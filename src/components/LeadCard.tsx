'use client';

import React, { useState } from 'react';
import { CallStatus, Lead } from '../types/crm';
import { STATUS_CONFIG } from '../lib/constants';
import { Phone, Copy, Check, Star, ExternalLink, MapPin } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onUpdateLead: (updated: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onUpdateLead }) => {
  const [copied, setCopied] = useState(false);

  const statusStyle = STATUS_CONFIG[lead.status] || STATUS_CONFIG['Not Called'];

  const handleCopyPhone = () => {
    if (!lead.phone) return;
    navigator.clipboard.writeText(lead.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateLead({
      ...lead,
      status: e.target.value as CallStatus,
    });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdateLead({
      ...lead,
      notes: e.target.value,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateLead({
      ...lead,
      follow_up_date: e.target.value,
    });
  };

  return (
    <div
      className="lead-card"
      style={{
        borderLeftColor: statusStyle.color,
      }}
    >
      <div className="lead-card-header">
        <div>
          <div className="lead-title">{lead.business_name}</div>
          {lead.city_area && (
            <div className="lead-location">
              <MapPin size={12} />
              <span>{lead.city_area}</span>
            </div>
          )}
        </div>

        {lead.rating !== undefined && lead.rating !== null && (
          <div className="rating-badge">
            <Star size={12} fill="#d97706" color="#d97706" />
            <span>{lead.rating}</span>
            {lead.review_count && (
              <span style={{ color: '#b45309', fontSize: '0.68rem' }}>
                ({lead.review_count})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Tap-to-copy Phone Number Button */}
      <button
        onClick={handleCopyPhone}
        className={`phone-btn ${copied ? 'copied' : ''}`}
        title="Tap to copy phone number"
      >
        {copied ? (
          <>
            <Check size={18} />
            <span>Copied to Clipboard!</span>
          </>
        ) : (
          <>
            <Phone size={18} />
            <span>{lead.phone || 'No Phone Number'}</span>
            <Copy size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />
          </>
        )}
      </button>

      {/* Status & Follow-up Controls */}
      <div className="lead-controls">
        <div className="field-group">
          <label className="field-label">Call Status</label>
          <select
            value={lead.status}
            onChange={handleStatusChange}
            className="status-select"
            style={{
              backgroundColor: statusStyle.bg,
              color: statusStyle.color,
              borderColor: statusStyle.border,
            }}
          >
            {Object.keys(STATUS_CONFIG).map((statusKey) => (
              <option
                key={statusKey}
                value={statusKey}
                style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
              >
                {statusKey}
              </option>
            ))}
          </select>
        </div>

        <div className="field-group">
          <label className="field-label">Follow-up Date</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              type="date"
              value={lead.follow_up_date || ''}
              onChange={handleDateChange}
              className="date-input"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Notes Area */}
      <div className="field-group">
        <label className="field-label">Caller Notes</label>
        <textarea
          value={lead.notes || ''}
          onChange={handleNotesChange}
          placeholder="Add conversation notes, next steps..."
          className="notes-input"
        />
      </div>

      {/* External Links */}
      {(lead.website || lead.maps_link) && (
        <div className="lead-links">
          {lead.website && (
            <a
              href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-pill"
            >
              <ExternalLink size={12} />
              <span>Website</span>
            </a>
          )}
          {lead.maps_link && (
            <a
              href={lead.maps_link}
              target="_blank"
              rel="noopener noreferrer"
              className="link-pill"
            >
              <MapPin size={12} />
              <span>Google Maps</span>
            </a>
          )}
          <span style={{ marginLeft: 'auto', fontSize: '0.7rem', color: 'var(--text-dim)' }}>
            {lead.batch_label}
          </span>
        </div>
      )}
    </div>
  );
};
