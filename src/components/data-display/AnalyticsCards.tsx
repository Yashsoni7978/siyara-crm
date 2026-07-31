import React from 'react';
import { Lead } from '../../types/crm';

interface AnalyticsCardsProps {
  leads: Lead[];
  totalLeads?: number;
}

export const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ leads, totalLeads }) => {
  const total = totalLeads ?? leads.length;
  const converted = leads.filter(l => l.status === 'Converted').length;
  const interested = leads.filter(l => l.status === 'Interested').length;
  const followUps = leads.filter(l => l.status === 'Busy' || l.status === 'No Answer').length;
  const unprocessed = leads.filter(l => l.status === 'Not Called').length;
  
  const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : '0.0';

  const cards = [
    { title: 'Total Leads', value: total },
    { title: 'Converted', value: converted, color: 'var(--success)' },
    { title: 'Conversion Rate', value: `${conversionRate}%`, color: 'var(--primary)' },
    { title: 'Interested', value: interested },
    { title: 'Follow-ups Needed', value: followUps },
    { title: 'Unprocessed', value: unprocessed, color: 'var(--text-muted)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
      {cards.map((card, idx) => (
        <div key={idx} className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            {card.title}
          </span>
          <span style={{ fontSize: '24px', fontWeight: 700, color: card.color || 'var(--text-main)' }}>
            {card.value}
          </span>
        </div>
      ))}
    </div>
  );
};
