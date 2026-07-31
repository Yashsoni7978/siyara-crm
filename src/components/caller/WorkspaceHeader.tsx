import React from 'react';
import { Lead } from '../../types/crm';
import { MapPin, Globe, Star } from 'lucide-react';
import { STATUS_CONFIG } from '../../lib/constants';

interface WorkspaceHeaderProps {
  lead: Lead;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({ lead }) => {
  const statusStyle = STATUS_CONFIG[lead.status] || STATUS_CONFIG['Not Called'];

  return (
    <div className="cw-header">
      <div className="cw-header-main">
        <div className="cw-header-info">
          <h2 className="cw-header-name">{lead.businessName}</h2>
          <div className="cw-header-meta">
            <span className="cw-header-meta-item">{lead.phone}</span>
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
