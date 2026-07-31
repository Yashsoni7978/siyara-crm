import React from 'react';
import { UserRole } from '../../types/crm';
import { 
  LayoutDashboard, 
  Users, 
  UploadCloud, 
  PhoneCall, 
  PieChart, 
  Settings, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  role: UserRole;
  activeMenu: string;
  onNavigate: (menu: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, activeMenu, onNavigate, onLogout }) => {
  const adminMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'leads', label: 'Lead Management', icon: <Users size={18} /> },
    { id: 'import', label: 'Import Leads', icon: <UploadCloud size={18} /> },
    { id: 'callers', label: 'Callers', icon: <PhoneCall size={18} /> },
    { id: 'analytics', label: 'Analytics', icon: <PieChart size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const callerMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'today', label: "Today's Follow-ups", icon: <PhoneCall size={18} /> },
    { id: 'leads', label: 'All Leads', icon: <Users size={18} /> },
    { id: 'activities', label: 'Activities', icon: <PieChart size={18} /> },
    { id: 'reports', label: 'Reports', icon: <UploadCloud size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  const menuItems = role === 'Admin' ? adminMenu : callerMenu;

  return (
    <div className="sidebar" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '24px 20px', borderBottom: '1px solid var(--border-main)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.5px' }}>
          SIYARA CRM
        </h2>
      </div>
      
      <div style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {menuItems.map(item => {
          const isActive = activeMenu === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                width: '100%',
                border: 'none',
                background: isActive ? 'var(--bg-hover)' : 'transparent',
                color: isActive ? 'var(--text-main)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500,
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s'
              }}
            >
              {item.icon}
              <span style={{ fontSize: 'var(--font-sm)' }}>{item.label}</span>
            </button>
          )
        })}
      </div>

      <div style={{ padding: '16px 12px', borderTop: '1px solid var(--border-main)' }}>
        <button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 12px',
            width: '100%',
            border: 'none',
            background: 'transparent',
            color: 'var(--text-muted)',
            fontWeight: 500,
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <LogOut size={18} />
          <span style={{ fontSize: 'var(--font-sm)' }}>Logout</span>
        </button>
      </div>
    </div>
  );
};
