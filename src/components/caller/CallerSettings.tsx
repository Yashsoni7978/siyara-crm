import React, { useState } from 'react';
import { User, Save, Monitor, Bell } from 'lucide-react';

interface CallerSettingsProps {
  callerName: string;
}

export const CallerSettings: React.FC<CallerSettingsProps> = ({ callerName }) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Preferences saved successfully!');
    }, 800);
  };

  return (
    <div style={{ padding: '24px', animation: 'fadeIn 0.3s', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>My Preferences</h2>
        <p style={{ color: 'var(--text-muted)' }}>Customize your CRM experience and personal details.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-main)', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Profile Details</h3>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="cw-form-group">
              <label className="cw-form-label">Display Name</label>
              <input type="text" className="cw-form-input" defaultValue={callerName} disabled style={{ opacity: 0.7 }} />
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>To change your name, please contact the administrator.</div>
            </div>
          </div>
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-main)', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Monitor size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Interface Settings</h3>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="cw-form-group">
              <label className="cw-form-label">Theme</label>
              <select className="cw-form-select">
                <option>System Default</option>
                <option>Light Mode</option>
                <option>Dark Mode</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-main)', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Notifications</h3>
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span style={{ fontSize: '14px', color: 'var(--text-main)' }}>Desktop alerts for new assigned leads</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span style={{ fontSize: '14px', color: 'var(--text-main)' }}>Reminders for follow-ups due today</span>
            </label>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};
