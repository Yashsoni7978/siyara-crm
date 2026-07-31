import React from 'react';
import { Lead } from '../../types/crm';
import { MapPin, Globe, Star, Copy, Check } from 'lucide-react';
import { STATUS_CONFIG } from '../../lib/constants';

interface WorkspaceHeaderProps {
  lead: Lead;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({ lead }) => {
  const [copied, setCopied] = React.useState(false);
  const statusStyle = STATUS_CONFIG[lead.status] || STATUS_CONFIG['Not Called'];

  const handleCopyPhone = () => {
    if (lead.phone) {
      navigator.clipboard.writeText(lead.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="cw-header">
      <div className="cw-header-main">
        <div className="cw-header-info">
          <h2 className="cw-header-name">{lead.businessName}</h2>
          <div className="cw-header-meta">
            <span 
              className="cw-header-meta-item" 
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              onClick={handleCopyPhone}
              title="Copy Phone Number"
            >
              {lead.phone}
              {copied ? <Check size={12} color="#059669" /> : <Copy size={12} />}
            </span>
            {lead.category && (
              <span className="cw-header-meta-item">{lead.category}</span>
            )}
            {(lead.address || lead.cityArea) && (
              <span className="cw-header-meta-item">
                <MapPin size={12} />
                {lead.address || lead.cityArea}
              </span>
            )}
            {lead.rating && (
              <span className="cw-header-meta-item">
                <Star size={12} />
                {lead.rating}
                {lead.reviewCount ? ` (${lead.reviewCount})` : ''}
              </span>
            )}
            {lead.website && (
              <a href={lead.website} target="_blank" rel="noreferrer" className="cw-header-meta-item cw-header-link">
                <Globe size={12} />
                Website
              </a>
            )}
          </div>
        </div>
        <div className="cw-header-badges">
          <span className="badge" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
            {lead.status}
          </span>
          {lead.priority && lead.priority !== 'None' && (
            <span className={`cw-header-priority cw-header-priority-${lead.priority.toLowerCase()}`}>
              {lead.priority}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
