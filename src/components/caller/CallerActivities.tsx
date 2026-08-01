import React, { useState, useEffect } from 'react';
import { Clock, StickyNote, Activity as ActivityIcon } from 'lucide-react';

interface CallerActivitiesProps {
  userId: string;
}

export const CallerActivities: React.FC<CallerActivitiesProps> = ({ userId }) => {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch(`/api/activities?userId=${userId}`);
        const json = await res.json();
        setActivities(json);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) fetchActivities();
  }, [userId]);

  return (
    <div style={{ padding: '24px', animation: 'fadeIn 0.3s', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>My Activity Log</h2>
        <p style={{ color: 'var(--text-muted)' }}>A complete history of your notes, status changes, and updates.</p>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        {isLoading ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>Loading activities...</div>
        ) : activities.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No activity found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {activities.map(act => (
              <div key={act.id} style={{ display: 'flex', gap: '16px' }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: act.type === 'Note' ? '#eff6ff' : '#ecfdf5',
                  color: act.type === 'Note' ? 'var(--primary)' : 'var(--success)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {act.type === 'Note' ? <StickyNote size={14} /> : <ActivityIcon size={14} />}
                </div>
                <div style={{ flex: 1, borderBottom: '1px solid var(--border-main)', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-main)' }}>
                      {act.type} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>on</span> {act.lead?.businessName || 'Unknown Lead'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={10} /> {new Date(act.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-main)', background: 'var(--bg-main)', padding: '12px', borderRadius: '8px', marginTop: '8px' }}>
                    {act.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
