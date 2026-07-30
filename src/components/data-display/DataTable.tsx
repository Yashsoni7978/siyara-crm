import React from 'react';
import { Lead, CallStatus } from '../../types/crm';
import { STATUS_CONFIG } from '../../lib/constants';

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
            
            let priorityColor = '#6B7280';
            if (lead.priority === 'High') priorityColor = '#DC2626';
            if (lead.priority === 'Medium') priorityColor = '#F59E0B';
            if (lead.priority === 'Low') priorityColor = '#16A34A';

            return (
              <tr 
                key={lead.id} 
                onClick={() => onRowClick && onRowClick(lead)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                <td style={{ fontWeight: 500, maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lead.business_name}
                </td>
                <td style={{ fontFamily: 'monospace' }}>{lead.phone || 'N/A'}</td>
                <td>{lead.category}</td>
                <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {lead.city_area || lead.address || '-'}
                </td>
                <td>
                  {lead.rating ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ color: '#F59E0B', fontWeight: 600 }}>{lead.rating}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({lead.review_count})</span>
                    </span>
                  ) : '-'}
                </td>
                <td>
                  <span className="badge" style={{ backgroundColor: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
                    {lead.status}
                  </span>
                </td>
                <td>
                  {lead.priority && lead.priority !== 'None' ? (
                    <span style={{ color: priorityColor, fontWeight: 600, fontSize: '12px' }}>{lead.priority}</span>
                  ) : '-'}
                </td>
                <td>{lead.assigned_to}</td>
                <td>{lead.follow_up_date || '-'}</td>
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
