import React, { useState } from 'react';
import { Lead } from '../../../types/crm';

interface OverviewTabProps {
  lead: Lead;
  onUpdateField: (field: string, value: string) => void;
  onSave: () => void;
  isSaving: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  lead,
  onUpdateField,
  onSave,
  isSaving
}) => {
  const formatDateForInput = (dateVal?: string | Date | null) => {
    if (!dateVal) return '';
    try {
      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return '';
      return d.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  const [localPriority, setLocalPriority] = useState<'High' | 'Medium' | 'Low' | 'None'>(
    (lead.priority as 'High' | 'Medium' | 'Low' | 'None') || 'None'
  );
  const [localFollowUp, setLocalFollowUp] = useState(
    formatDateForInput(lead.followUpDate)
  );

  // Sync when lead changes
  React.useEffect(() => {
    setLocalPriority(lead.priority || 'None');
    setLocalFollowUp(formatDateForInput(lead.followUpDate));
  }, [lead.id, lead.priority, lead.followUpDate]);

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as 'High' | 'Medium' | 'Low' | 'None';
    setLocalPriority(val);
    onUpdateField('priority', val);
  };

  const handleFollowUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalFollowUp(e.target.value);
    onUpdateField('followUpDate', e.target.value);
  };

  return (
    <div className="cw-tab-content cw-overview-tab">
      <div className="cw-grid-2">
        <div className="cw-form-group">
          <label className="cw-form-label">Priority</label>
          <select 
            className="cw-form-select"
            value={localPriority}
            onChange={handlePriorityChange}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
            <option value="None">None</option>
          </select>
        </div>
        <div className="cw-form-group">
          <label className="cw-form-label">Follow-up Date</label>
          <input 
            type="date" 
            className="cw-form-input" 
            value={localFollowUp}
            onChange={handleFollowUpChange}
          />
        </div>
      </div>
      
      <div className="cw-form-actions" style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          className="btn btn-primary" 
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Changes (Ctrl+Enter)'}
        </button>
      </div>
    </div>
  );
};
