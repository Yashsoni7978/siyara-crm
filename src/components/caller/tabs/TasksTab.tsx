import React from 'react';
import { Lead } from '../../../types/crm';
import { CheckCircle2 } from 'lucide-react';

interface TasksTabProps {
  lead: Lead;
}

export const TasksTab: React.FC<TasksTabProps> = ({ lead }) => {
  return (
    <div className="cw-tab-content cw-tasks-tab" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px', color: 'var(--text-muted)' }}>
      <CheckCircle2 size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
      <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>Task Management</h3>
      <p style={{ textAlign: 'center', maxWidth: '300px', fontSize: '13px' }}>
        No tasks scheduled for {lead.businessName}. Task engine integration coming in Phase 3.
      </p>
      <button className="btn btn-secondary" style={{ marginTop: '24px' }} disabled>
        Create Task
      </button>
    </div>
  );
};
