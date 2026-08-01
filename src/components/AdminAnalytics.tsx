import React from 'react';
import { PieChart, BarChart2, Activity, TrendingUp } from 'lucide-react';
import { Lead } from '../types/crm';

interface AdminAnalyticsProps {
  leads: Lead[];
}

export const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ leads }) => {
  return (
    <div style={{ animation: 'fadeIn 0.3s' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Analytics & Reporting</h2>
        <p style={{ color: 'var(--text-muted)' }}>Deep dive into your CRM data with advanced visual metrics.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        
        {/* Conversion Funnel */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <BarChart2 size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Lead Conversion Funnel</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', fontWeight: 600 }}>
                <span>Total Leads</span>
                <span>100%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: 'var(--border-focus)' }}></div>
              </div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', fontWeight: 600 }}>
                <span>Contacted</span>
                <span>65%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '65%', height: '100%', background: 'var(--primary)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', fontWeight: 600 }}>
                <span>Interested (Qualified)</span>
                <span>28%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '28%', height: '100%', background: 'var(--warning)' }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', fontWeight: 600 }}>
                <span>Converted (Closed)</span>
                <span>12%</span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: '12%', height: '100%', background: 'var(--success)' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <PieChart size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Category Distribution</h3>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '160px' }}>
            {/* CSS-based pie chart simulation */}
            <div style={{ 
              width: '140px', height: '140px', borderRadius: '50%', 
              background: 'conic-gradient(var(--primary) 0% 40%, var(--success) 40% 70%, var(--warning) 70% 90%, var(--border-focus) 90% 100%)',
              boxShadow: 'var(--shadow-md)',
              position: 'relative'
            }}>
              <div style={{ 
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: '80px', height: '80px', background: 'var(--bg-card)', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
              }}>
                <span style={{ fontSize: '16px', fontWeight: 800 }}>Total</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}><span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--primary)' }}></span> B2B Services (40%)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}><span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--success)' }}></span> Retail (30%)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}><span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--warning)' }}></span> Healthcare (20%)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}><span style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'var(--border-focus)' }}></span> Other (10%)</div>
          </div>
        </div>
        
        {/* Activity Heatmap */}
        <div className="card" style={{ padding: '24px', gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Activity size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Weekly Call Activity</h3>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '150px', paddingBottom: '20px', borderBottom: '1px solid var(--border-main)' }}>
            {[45, 60, 30, 80, 55, 20, 10].map((height, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '100%', maxWidth: '40px', height: `${height}%`, 
                  background: height > 50 ? 'var(--primary)' : 'var(--primary-light)', 
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.5s ease-out'
                }}></div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', padding: '0 20px' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <span key={day} style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>{day}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
