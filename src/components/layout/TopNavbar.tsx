import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { UserRole } from '../../types/crm';

interface TopNavbarProps {
  role: UserRole;
  activeMenu: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ role, activeMenu }) => {
  // Format the active menu name nicely for breadcrumb
  const pageTitle = activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1);

  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>SIYARA CRM</span>
        <span style={{ fontSize: 'var(--font-sm)', color: 'var(--border-focus)' }}>/</span>
        <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-main)' }}>{pageTitle}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        {/* Global Search */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Search leads, phone numbers..." 
            className="input-field" 
            style={{ paddingLeft: '32px', height: '32px', backgroundColor: 'var(--bg-main)' }}
          />
        </div>

        {/* Quick Actions & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <Bell size={18} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', paddingLeft: '16px', borderLeft: '1px solid var(--border-main)' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600 }}>
              {role.charAt(0)}
            </div>
            <span style={{ fontSize: 'var(--font-sm)', fontWeight: 500 }}>{role}</span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </div>
        </div>
      </div>
    </div>
  );
};
