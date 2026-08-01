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

  const getAvatarGradient = (category: string = 'Other') => {
    const colors = [
      'linear-gradient(135deg, #3b82f6, #8b5cf6)',
      'linear-gradient(135deg, #10b981, #3b82f6)',
      'linear-gradient(135deg, #f59e0b, #ef4444)',
      'linear-gradient(135deg, #ec4899, #8b5cf6)',
      'linear-gradient(135deg, #06b6d4, #3b82f6)',
      'linear-gradient(135deg, #84cc16, #10b981)',
    ];
    let hash = 0;
    for (let i = 0; i < category.length; i++) hash = category.charCodeAt(i) + ((hash << 5) - hash);
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const initial = lead.businessName ? lead.businessName.charAt(0).toUpperCase() : '?';

  return (
    <div className="cw-header">
      <div className="cw-header-main">
        <div className="cw-header-info">
          <div className="cw-header-avatar" style={{ background: getAvatarGradient(lead.category) }}>
            {initial}
          </div>
          <div className="cw-header-text">
            <h2 className="cw-header-name">{lead.businessName}</h2>
            <div className="cw-header-meta">
              <span 
                className="cw-header-meta-item" 
                style={{ cursor: 'pointer' }}
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
                  <Star size={12} fill="var(--warning)" color="var(--warning)" />
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
