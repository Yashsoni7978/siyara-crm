import React from 'react';
import { PhoneCall, TrendingUp, Users } from 'lucide-react';

export const AdminCallers: React.FC = () => {
  const callers = [
    { id: 1, name: 'User 1', status: 'Active', leadsAssigned: 124, callsMade: 89, conversionRate: '12%' },
    { id: 2, name: 'User 2', status: 'Active', leadsAssigned: 98, callsMade: 45, conversionRate: '8%' },
    { id: 3, name: 'Jane Doe', status: 'Offline', leadsAssigned: 45, callsMade: 12, conversionRate: '5%' },
  ];

  return (
    <div style={{ animation: 'fadeIn 0.3s' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Caller Management</h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage your team of callers, track their performance, and assign quotas.</p>
        </div>
        <button className="btn btn-primary">
          <Users size={16} /> Add New Caller
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>3</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Total Callers</div>
          </div>
        </div>
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ecfdf5', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PhoneCall size={24} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>146</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Calls Made (Today)</div>
          </div>
        </div>
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fffbeb', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>10.2%</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Avg Conversion Rate</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Caller Name</th>
              <th>Status</th>
              <th>Leads Assigned</th>
              <th>Calls Made (Week)</th>
              <th>Conversion Rate</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {callers.map(caller => (
              <tr key={caller.id}>
                <td style={{ fontWeight: 600 }}>{caller.name}</td>
                <td>
                  <span className={`badge ${caller.status === 'Active' ? 'cw-header-priority-low' : 'cw-header-priority-medium'}`}>
                    {caller.status}
                  </span>
                </td>
                <td>{caller.leadsAssigned}</td>
                <td>{caller.callsMade}</td>
                <td style={{ color: 'var(--success)', fontWeight: 600 }}>{caller.conversionRate}</td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px' }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
