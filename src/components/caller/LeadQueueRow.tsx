import React from 'react';
import { Phone, Globe, Star, MapPin } from 'lucide-react';
import { Lead } from '../../types/crm';
import { STATUS_CONFIG } from '../../lib/constants';

interface LeadQueueRowProps {
  lead: Lead;
  isActive: boolean;
  isFocused: boolean;
  onClick: () => void;
}

export const LeadQueueRow: React.FC<LeadQueueRowProps> = React.memo(({
  lead,
  isActive,
  isFocused,
  onClick,
}) => {
  const statusStyle = STATUS_CONFIG[lead.status] || STATUS_CONFIG['Not Called'];

  const getFollowUpStatus = () => {
    if (!lead.followUpDate) return null;
    const date = new Date(lead.followUpDate);
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    if (date < startOfToday) return 'Overdue';
    if (date >= startOfToday && date < startOfTomorrow) return 'Due Today';
    return null;
  };

  const fuStatus = getFollowUpStatus();

  return (
    <div
      className={`lq-row ${isActive ? 'lq-row-active' : ''} ${isFocused ? 'lq-row-focused' : ''}`}
      onClick={onClick}
      role="option"
      aria-selected={isActive}
      tabIndex={-1}
      data-lead-id={lead.id}
    >
      <div className="lq-row-top">
        <div className="lq-row-status" style={{ backgroundColor: statusStyle.color }} title={lead.status} />
        <span className="lq-row-name">{lead.businessName}</span>
        {lead.priority && lead.priority !== 'None' && (
          <span className={`lq-row-priority lq-row-priority-${lead.priority.toLowerCase()}`}>
            {lead.priority.charAt(0)}
          </span>
        )}
      </div>
      <div className="lq-row-bottom" style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '6px', color: 'var(--border-focus)' }}>
          {lead.phone && <span title="Phone Available"><Phone size={12} /></span>}
          {lead.website && <span title="Website Available"><Globe size={12} /></span>}
          {lead.mapsLink && <span title="Location Available"><MapPin size={12} /></span>}
          {lead.reviewCount && lead.reviewCount > 50 && (
            <span title="Highly Reviewed">
              <Star size={12} fill="var(--warning)" color="var(--warning)" />
            </span>
          )}
        </div>
        <span className="lq-row-meta" style={{ marginLeft: 'auto' }}>
          {lead.updatedAt
            ? new Date(lead.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
            : ''}
        </span>
      </div>
      {lead.followUpDate && (
        <div className="lq-row-followup" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>↩ {new Date(lead.followUpDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
          {fuStatus && (
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              padding: '2px 6px',
              borderRadius: '4px',
              background: fuStatus === 'Overdue' ? '#fee2e2' : '#fef3c7',
              color: fuStatus === 'Overdue' ? '#dc2626' : '#d97706'
            }}>
              {fuStatus}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

LeadQueueRow.displayName = 'LeadQueueRow';
