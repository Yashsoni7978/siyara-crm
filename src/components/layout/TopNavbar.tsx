import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { UserRole } from '../../types/crm';

interface TopNavbarProps {
  role: UserRole;
  activeMenu: string;
  onLogout: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ role, activeMenu, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format the active menu name nicely for breadcrumb
  const pageTitle = activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="topbar" style={{ position: 'relative', zIndex: 40 }}>
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
            placeholder="Global search (coming soon)..." 
            className="input-field" 
            style={{ paddingLeft: '32px', height: '32px', backgroundColor: 'var(--bg-main)' }}
            disabled
          />
        </div>

        {/* Quick Actions & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button 
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', position: 'relative' }}
            onClick={() => alert('You have no new notifications.')}
          >
            <Bell size={18} />
          </button>
          
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', paddingLeft: '16px', borderLeft: '1px solid var(--border-main)' }}
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600 }}>
                {role.charAt(0)}
              </div>
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: 500 }}>{role}</span>
              <ChevronDown size={14} color="var(--text-muted)" />
            </div>

            {isProfileOpen && (
              <div style={{ 
                position: 'absolute', 
                top: 'calc(100% + 12px)', 
                right: 0, 
                width: '180px', 
                background: 'var(--bg-card)', 
                border: '1px solid var(--border-main)', 
                borderRadius: 'var(--radius-md)', 
                boxShadow: 'var(--shadow-lg)',
                padding: '8px 0',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ padding: '8px 16px', borderBottom: '1px solid var(--border-main)', marginBottom: '4px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>{role} User</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>siyara.enterprise</div>
                </div>
                
                <button style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px', color: 'var(--text-main)' }}>
                  <User size={16} /> My Profile
                </button>
                <button 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', width: '100%', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px', color: 'var(--danger)' }}
                  onClick={onLogout}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
