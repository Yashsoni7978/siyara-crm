import React from 'react';
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
      <div className="lq-row-bottom">
        <span className="lq-row-phone">{lead.phone}</span>
        <span className="lq-row-meta">
          {lead.updatedAt
            ? new Date(lead.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
            : ''}
        </span>
      </div>
      {lead.followUpDate && (
        <div className="lq-row-followup">
          ↩ {new Date(lead.followUpDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
        </div>
      )}
    </div>
  );
});

LeadQueueRow.displayName = 'LeadQueueRow';
