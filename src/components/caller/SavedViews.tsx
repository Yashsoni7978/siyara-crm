import React from 'react';

export interface SavedView {
  id: string;
  label: string;
  filters: {
    status?: string[];
    priority?: string[];
    category?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    followUpToday?: boolean;
  };
}

export const PRESET_VIEWS: SavedView[] = [
  { id: 'all', label: 'My Leads', filters: {} },
  { id: 'doctors', label: '🩺 Doctor Leads', filters: { category: ['Doctor'] } },
  { id: 'anchors', label: '🎙️ Anchor Leads', filters: { category: ['Anchor'] } },
  { id: 'follow-ups', label: "Today's Follow-ups", filters: { followUpToday: true } },
  { id: 'high-priority', label: 'High Priority', filters: { priority: ['High'] } },
  { id: 'new-imports', label: 'New Imports', filters: { sortBy: 'createdAt', sortOrder: 'desc' } },
  { id: 'recently-updated', label: 'Recently Updated', filters: { sortBy: 'updatedAt', sortOrder: 'desc' } },
  { id: 'needs-callback', label: 'Needs Callback', filters: { status: ['Busy', 'No Answer'] } },
];

interface SavedViewsProps {
  activeView: string;
  onViewChange: (view: SavedView) => void;
}

export const SavedViews: React.FC<SavedViewsProps> = ({ activeView, onViewChange }) => {
  return (
    <div className="lq-saved-views">
      {PRESET_VIEWS.map(view => (
        <button
          key={view.id}
          type="button"
          className={`lq-saved-view-btn ${activeView === view.id ? 'lq-saved-view-btn-active' : ''}`}
          onClick={() => onViewChange(view)}
        >
          {view.label}
        </button>
      ))}
    </div>
  );
};
