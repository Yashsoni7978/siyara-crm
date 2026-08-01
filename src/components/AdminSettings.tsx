import React, { useState } from 'react';
import { Save, Building2, Bell, Shield } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [orgName, setOrgName] = useState('Siyara Enterprise');

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 800);
  };

  return (
    <div style={{ animation: 'fadeIn 0.3s', maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Organization Settings</h2>
        <p style={{ color: 'var(--text-muted)' }}>Configure your CRM preferences, team details, and system defaults.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-main)', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>General Information</h3>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="cw-form-group">
              <label className="cw-form-label">Organization Name</label>
              <input type="text" className="cw-form-input" value={orgName} onChange={e => setOrgName(e.target.value)} />
            </div>
            <div className="cw-grid-2">
              <div className="cw-form-group">
                <label className="cw-form-label">Timezone</label>
                <select className="cw-form-select">
                  <option>Asia/Kolkata (IST)</option>
                  <option>UTC</option>
                  <option>America/New_York (EST)</option>
                </select>
              </div>
              <div className="cw-form-group">
                <label className="cw-form-label">Default Currency</label>
                <select className="cw-form-select">
                  <option>INR (₹)</option>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-main)', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Notifications & Alerts</h3>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span style={{ fontSize: '14px', color: 'var(--text-main)' }}>Email me daily performance summaries</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span style={{ fontSize: '14px', color: 'var(--text-main)' }}>Alert me when a caller misses their daily quota</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" />
              <span style={{ fontSize: '14px', color: 'var(--text-main)' }}>Send weekly digest to stakeholders</span>
            </label>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
          <Save size={16} />
          {isSaving ? 'Saving Changes...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};
