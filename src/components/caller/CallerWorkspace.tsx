import React, { useState } from 'react';
import { Lead, CallStatus } from '../../types/crm';
import { WorkspaceHeader } from './WorkspaceHeader';
import { QuickActions } from './QuickActions';
import { OverviewTab } from './tabs/OverviewTab';
import { GoogleBusinessTab } from './tabs/GoogleBusinessTab';
import { TimelineTab } from './tabs/TimelineTab';
import { TasksTab } from './tabs/TasksTab';

export type WorkspaceTab = 'overview' | 'google' | 'timeline' | 'tasks';

interface CallerWorkspaceProps {
  lead: Lead | null;
  activeTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  onUpdateLead: (updates: Partial<Lead>) => Promise<void>;
  onAddNote: (note: string) => Promise<void>;
}

export const CallerWorkspace: React.FC<CallerWorkspaceProps> = ({
  lead,
  activeTab,
  onTabChange,
  onUpdateLead,
  onAddNote,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState<Partial<Lead>>({});

  if (!lead) {
    return (
      <div className="cw-container cw-empty">
        <div className="cw-empty-content">
          <p>Select a lead from the queue to start working.</p>
          <span className="text-xs text-muted">Use ↑ ↓ arrows to navigate</span>
        </div>
      </div>
    );
  }

  const handleUpdateField = (field: string, value: string) => {
    setPendingUpdates(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (Object.keys(pendingUpdates).length === 0) return;
    setIsSaving(true);
    try {
      await onUpdateLead(pendingUpdates);
      setPendingUpdates({});
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: CallStatus) => {
    setIsSaving(true);
    try {
      await onUpdateLead({ ...pendingUpdates, status: newStatus });
      setPendingUpdates({});
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'google', label: 'Google Business' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'tasks', label: 'Tasks' },
  ] as const;

  return (
    <div className="cw-container">
      <WorkspaceHeader lead={lead} />
      
      <QuickActions 
        lead={lead}
        onStatusChange={handleStatusChange}
        onAddNote={() => onTabChange('timeline')}
        onScheduleFollowUp={() => onTabChange('overview')}
      />

      <div className="cw-tabs-nav">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`cw-tab-btn ${activeTab === tab.id ? 'cw-tab-btn-active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="cw-tab-body">
        {activeTab === 'overview' && (
          <OverviewTab 
            lead={lead} 
            onUpdateField={handleUpdateField} 
            onSave={handleSave} 
            isSaving={isSaving} 
          />
        )}
        {activeTab === 'google' && (
          <GoogleBusinessTab lead={lead} />
        )}
        {activeTab === 'timeline' && (
          <TimelineTab leadId={lead.id} onAddNote={onAddNote} />
        )}
        {activeTab === 'tasks' && (
          <TasksTab lead={lead} />
        )}
      </div>
    </div>
  );
};
