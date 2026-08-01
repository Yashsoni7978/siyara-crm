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

  // Generate a consistent gradient based on the category string
  const getAvatarGradient = (category: string = 'Other') => {
    const colors = [
      'linear-gradient(135deg, #3b82f6, #8b5cf6)', // Blue-Purple
      'linear-gradient(135deg, #10b981, #3b82f6)', // Green-Blue
      'linear-gradient(135deg, #f59e0b, var(--danger))', // Orange-Red
      'linear-gradient(135deg, #ec4899, #8b5cf6)', // Pink-Purple
      'linear-gradient(135deg, #06b6d4, #3b82f6)', // Cyan-Blue
      'linear-gradient(135deg, #84cc16, #10b981)', // Lime-Green
    ];
    let hash = 0;
    for (let i = 0; i < category.length; i++) hash = category.charCodeAt(i) + ((hash << 5) - hash);
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const initial = lead.businessName ? lead.businessName.charAt(0).toUpperCase() : '?';

  return (
    <div
      className={`lq-row ${isActive ? 'lq-row-active' : ''} ${isFocused ? 'lq-row-focused' : ''}`}
      onClick={onClick}
      role="option"
      aria-selected={isActive}
      tabIndex={-1}
      data-lead-id={lead.id}
    >
      <div className="lq-row-layout">
        
        {/* Left: Avatar & Status */}
        <div className="lq-row-avatar-col">
          <div className="lq-row-avatar" style={{ background: getAvatarGradient(lead.category) }}>
            {initial}
          </div>
          <div className="lq-row-status-badge" style={{ backgroundColor: statusStyle.color }} title={lead.status} />
        </div>

        {/* Right: Content */}
        <div className="lq-row-content-col">
          <div className="lq-row-top">
            <span className="lq-row-name">{lead.businessName}</span>
            {lead.priority && lead.priority !== 'None' && (
              <span className={`lq-row-priority lq-row-priority-${lead.priority.toLowerCase()}`}>
                {lead.priority}
              </span>
            )}
          </div>

          <div className="lq-row-bottom">
            <div style={{ display: 'flex', gap: '8px' }}>
              {lead.phone && <span title="Phone Available" style={{ color: 'var(--success)' }}><Phone size={13} /></span>}
              {lead.website && <span title="Website Available" style={{ color: 'var(--primary)' }}><Globe size={13} /></span>}
              {lead.mapsLink && <span title="Location Available" style={{ color: 'var(--danger)' }}><MapPin size={13} /></span>}
              {lead.reviewCount && lead.reviewCount > 50 && (
                <span title="Highly Reviewed" style={{ color: 'var(--warning)' }}>
                  <Star size={13} fill="var(--warning)" />
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
            <div className="lq-row-followup" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.75rem' }}>
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
      </div>
    </div>
  );
});

LeadQueueRow.displayName = 'LeadQueueRow';
