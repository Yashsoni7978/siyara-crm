import React, { useRef, useEffect, useCallback } from 'react';
import { Lead } from '../../types/crm';
import { LeadQueueRow } from './LeadQueueRow';

interface LeadQueueProps {
  leads: Lead[];
  activeLeadId: string | null;
  focusedIndex: number;
  onSelectLead: (id: string) => void;
  onFocusChange: (index: number) => void;
  isLoading: boolean;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const LeadQueue: React.FC<LeadQueueProps> = ({
  leads,
  activeLeadId,
  focusedIndex,
  onSelectLead,
  onFocusChange,
  isLoading,
  total,
  page,
  totalPages,
  onPageChange,
}) => {
  const listRef = useRef<HTMLDivElement>(null);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-lead-id]');
      items[focusedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        onFocusChange(Math.min(focusedIndex + 1, leads.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        onFocusChange(Math.max(focusedIndex - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < leads.length) {
          onSelectLead(leads[focusedIndex].id);
        }
        break;
    }
  }, [focusedIndex, leads, onFocusChange, onSelectLead]);

  return (
    <div className="lq-queue" tabIndex={0} onKeyDown={handleKeyDown} role="listbox" aria-label="Lead Queue">
      {/* Queue Header */}
      <div className="lq-queue-header">
        <span className="lq-queue-count">{total} leads</span>
        {totalPages > 1 && (
          <div className="lq-queue-pagination">
            <button
              type="button"
              className="lq-queue-page-btn"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              aria-label="Previous page"
            >
              ‹
            </button>
            <span className="lq-queue-page-info">{page}/{totalPages}</span>
            <button
              type="button"
              className="lq-queue-page-btn"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Lead List */}
      <div ref={listRef} className="lq-queue-list">
        {isLoading ? (
          <div className="lq-queue-loading">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="lq-queue-empty">No leads match your filters.</div>
        ) : (
          leads.map((lead, idx) => (
            <LeadQueueRow
              key={lead.id}
              lead={lead}
              isActive={lead.id === activeLeadId}
              isFocused={idx === focusedIndex}
              onClick={() => onSelectLead(lead.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};
