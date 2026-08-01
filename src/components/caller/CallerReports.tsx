import React from 'react';
import { Target, Trophy, PhoneForwarded } from 'lucide-react';

export const CallerReports: React.FC = () => {
  return (
    <div style={{ padding: '24px', animation: 'fadeIn 0.3s', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>My Performance</h2>
        <p style={{ color: 'var(--text-muted)' }}>Track your daily quota and overall success rate.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#eff6ff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PhoneForwarded size={24} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>42 / 50</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Daily Call Quota</div>
          </div>
        </div>
        
        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ecfdf5', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Trophy size={24} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>5</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Converted Today</div>
          </div>
        </div>

        <div className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fffbeb', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={24} />
          </div>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-main)' }}>12%</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Win Rate</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '20px' }}>Daily Progress</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', fontWeight: 600 }}>
          <span>Calls Made: 42</span>
          <span>Goal: 50</span>
        </div>
        <div style={{ height: '12px', background: 'var(--bg-hover)', borderRadius: '6px', overflow: 'hidden' }}>
          <div style={{ width: '84%', height: '100%', background: 'linear-gradient(90deg, var(--primary), var(--success))' }}></div>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '12px', textAlign: 'center' }}>
          You're only 8 calls away from hitting your daily goal! Keep it up!
        </p>
      </div>
    </div>
  );
};
