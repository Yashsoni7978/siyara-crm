import React from 'react';
import { Phone, MessageCircle, Mail, Calendar, StickyNote, ArrowRightLeft, MoreHorizontal } from 'lucide-react';
import { Lead, CallStatus } from '../../types/crm';
import { STATUS_CONFIG } from '../../lib/constants';

interface QuickActionsProps {
  lead: Lead;
  onStatusChange: (status: CallStatus) => void;
  onAddNote: () => void;
  onScheduleFollowUp: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  lead,
  onStatusChange,
  onAddNote,
  onScheduleFollowUp,
}) => {
  const actions: Array<{ icon: React.ReactNode; label: string; href?: string; onClick?: () => void; shortcut?: string; className: string }> = [
    { icon: <Phone size={14} />, label: 'Call', href: `tel:${lead.phone}`, className: 'cw-action-btn-call' },
    { icon: <MessageCircle size={14} />, label: 'WhatsApp', href: `https://wa.me/${lead.phone?.replace(/[^0-9]/g, '')}`, className: 'cw-action-btn-whatsapp' },
    { icon: <Mail size={14} />, label: 'Email', href: lead.email ? `mailto:${lead.email}` : undefined, className: 'cw-action-btn-email' },
    { icon: <Calendar size={14} />, label: 'Follow-up', onClick: onScheduleFollowUp, className: 'cw-action-btn-followup' },
    { icon: <StickyNote size={14} />, label: 'Note', onClick: onAddNote, shortcut: 'N', className: 'cw-action-btn-note' },
  ];

  return (
    <div className="cw-actions">
      <div className="cw-actions-left">
        {actions.map(action => {
          if (action.href) {
            return (
              <a
                key={action.label}
                href={action.href}
                target="_blank"
                rel="noreferrer"
                className={`cw-action-btn ${action.className}`}
                title={action.shortcut ? `${action.label} (${action.shortcut})` : action.label}
              >
                {action.icon}
                <span>{action.label}</span>
              </a>
            );
          }
          return (
            <button
              key={action.label}
              type="button"
              className={`cw-action-btn ${action.className}`}
              onClick={action.onClick}
              title={action.shortcut ? `${action.label} (${action.shortcut})` : action.label}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
      <div className="cw-actions-right">
        <select
          className="cw-action-status-select"
          value={lead.status}
          onChange={e => onStatusChange(e.target.value as CallStatus)}
          aria-label="Change status"
        >
          {Object.keys(STATUS_CONFIG).map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
