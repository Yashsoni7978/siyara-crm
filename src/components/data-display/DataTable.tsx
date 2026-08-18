import React from 'react';
import { Lead, CallStatus } from '../../types/crm';
import { STATUS_CONFIG, formatWhatsAppNumber } from '../../lib/constants';
import { MessageCircle } from 'lucide-react';

interface DataTableProps {
  leads: Lead[];
  onRowClick?: (lead: Lead) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ leads, onRowClick }) => {
  return (
    <div className="data-table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Business Name</th>
            <th>Phone</th>
            <th>Category</th>
            <th>Location</th>
            <th>Rating (Rev)</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assigned</th>
            <th>Follow-up</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const statusStyle = STATUS_CONFIG[lead.status] || STATUS_CONFIG['Not Called'];
            const waNumber = formatWhatsAppNumber(lead.phone);
            
            let priorityColor = '#6B7280';
            if (lead.priority === 'High') priorityColor = '#DC2626';
            if (lead.priority === 'Medium') priorityColor = '#F59E0B';
            if (lead.priority === 'Low') priorityColor = '#16A34A';

            return (
              <tr key={lead.id} onClick={() => onRowClick && onRowClick(lead)} style={{ cursor: onRowClick ? 'pointer' : 'default' }}>
                <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                  {lead.businessName}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>{lead.phone || '-'}</span>
                    {waNumber && (
                      <a 
                        href={`https://wa.me/${waNumber}`} 
                        target="_blank" 
                        rel="noreferrer"
                        title="Chat on WhatsApp"
                        onClick={e => e.stopPropagation()}
                        style={{ color: '#25D366', display: 'inline-flex', alignItems: 'center' }}
                      >
                        <MessageCircle size={14} />
                      </a>
                    )}
                  </div>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{lead.category || '-'}</td>
                <td style={{ color: 'var(--text-muted)' }}>
                  {lead.cityArea || lead.address || '-'}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--warning-dark)' }}>{lead.rating || '-'}</span>
                    {lead.reviewCount ? (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({lead.reviewCount})</span>
                    ) : null}
                  </div>
                </td>
                <td>
                  <span 
                    className="badge" 
                    style={{ backgroundColor: statusStyle.bg, color: statusStyle.color }}
                  >
                    {lead.status}
                  </span>
                </td>
                <td>
                  {lead.priority && lead.priority !== 'None' ? (
                    <span className="badge" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                      {lead.priority}
                    </span>
                  ) : '-'}
                </td>
                <td>{lead.assignedTo?.name || '-'}</td>
                <td>
                  {lead.followUpDate 
                    ? (() => {
                        try {
                          const d = new Date(lead.followUpDate);
                          return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                        } catch {
                          return '-';
                        }
                      })()
                    : '-'}
                </td>
              </tr>
            );
          })}
          {leads.length === 0 && (
            <tr>
              <td colSpan={9} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                No leads found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
