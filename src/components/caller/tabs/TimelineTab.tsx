import React, { useState, useEffect } from 'react';

interface Activity {
  id: string;
  type: string;
  description?: string;
  oldValue?: string;
  newValue?: string;
  timestamp: string;
  user?: { name: string; role: string };
}

interface TimelineTabProps {
  leadId: string;
  onAddNote: (note: string) => Promise<void>;
  onDirtyChange?: (isDirty: boolean) => void;
}

export const TimelineTab: React.FC<TimelineTabProps> = ({ leadId, onAddNote, onDirtyChange }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    onDirtyChange?.(newNote.trim().length > 0);
  }, [newNote, onDirtyChange]);

  useEffect(() => {
    let mounted = true;
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/activities?leadId=${leadId}`);
        const data = await res.json();
        if (mounted && Array.isArray(data)) {
          setActivities(data);
        }
      } catch (error) {
        console.error('Failed to load activities', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchActivities();
    return () => { mounted = false; };
  }, [leadId]);

  const handleSubmit = async () => {
    if (!newNote.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onAddNote(newNote);
      setNewNote('');
      // Optimistic refetch or append could happen here
      // For now we'll just reload the feed
      const res = await fetch(`/api/activities?leadId=${leadId}`);
      const data = await res.json();
      if (Array.isArray(data)) setActivities(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cw-tab-content cw-timeline-tab">
      <div className="cw-note-input-container">
        <textarea
          className="input-field cw-note-input"
          placeholder="Add a new note..."
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <div className="cw-note-actions">
          <span className="text-xs text-muted">Ctrl+Enter to save</span>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit} 
            disabled={!newNote.trim() || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Add Note'}
          </button>
        </div>
      </div>

      <div className="cw-timeline-feed">
        {loading ? (
          <div className="cw-timeline-loading" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="cw-timeline-item" style={{ opacity: 1 - (i * 0.2) }}>
                <div className="cw-timeline-icon" style={{ background: 'var(--bg-hover)', border: 'none', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
                <div className="cw-timeline-content" style={{ animation: 'pulse 1.5s infinite ease-in-out' }}>
                  <div style={{ height: '14px', width: '120px', background: 'var(--bg-hover)', borderRadius: '4px', marginBottom: '12px' }}></div>
                  <div style={{ height: '12px', width: '80%', background: 'var(--bg-hover)', borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="cw-timeline-empty" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '150px', 
            color: 'var(--text-muted)',
            textAlign: 'center',
            background: 'var(--bg-main)',
            borderRadius: '8px',
            border: '1px dashed var(--border-focus)'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📝</div>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>No History Yet</h3>
            <p style={{ fontSize: '0.8rem' }}>Leave a note or change a status to start the timeline.</p>
          </div>
        ) : (
          activities.map(activity => (
            <div key={activity.id} className="cw-timeline-item">
              <div className="cw-timeline-icon" data-type={activity.type}>
                {activity.type.charAt(0)}
              </div>
              <div className="cw-timeline-content">
                <div className="cw-timeline-header">
                  <span className="cw-timeline-user">{activity.user?.name || 'System'}</span>
                  <span className="cw-timeline-type">{activity.type}</span>
                  <span className="cw-timeline-date">
                    {new Date(activity.timestamp).toLocaleString('en-US', { 
                      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' 
                    })}
                  </span>
                </div>
                {activity.type === 'StatusChange' ? (
                  <div className="cw-timeline-body">
                    Changed status from <strong>{activity.oldValue || 'Unknown'}</strong> to <strong>{activity.newValue}</strong>
                  </div>
                ) : activity.type === 'Note' ? (
                  <div className="cw-timeline-body cw-timeline-note">
                    {activity.description}
                  </div>
                ) : (
                  <div className="cw-timeline-body">
                    {activity.description}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
