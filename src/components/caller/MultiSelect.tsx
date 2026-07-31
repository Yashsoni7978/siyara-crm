import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, Search, X, Check } from 'lucide-react';

interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  selected,
  onChange,
  placeholder = 'Select...',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [focusIndex, setFocusIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => options.filter(o => o.toLowerCase().includes(search.toLowerCase())),
    [options, search]
  );

  const allSelected = filtered.length > 0 && filtered.every(o => selected.includes(o));

  const toggle = useCallback((option: string) => {
    onChange(
      selected.includes(option)
        ? selected.filter(s => s !== option)
        : [...selected, option]
    );
  }, [selected, onChange]);

  const selectAll = useCallback(() => {
    if (allSelected) {
      onChange(selected.filter(s => !filtered.includes(s)));
    } else {
      const merged = new Set([...selected, ...filtered]);
      onChange(Array.from(merged));
    }
  }, [allSelected, selected, filtered, onChange]);

  const clearAll = useCallback(() => {
    onChange([]);
    setSearch('');
  }, [onChange]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
        setFocusIndex(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search when opened
  useEffect(() => {
    if (isOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusIndex(prev => Math.min(prev + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusIndex >= 0 && focusIndex < filtered.length) {
          toggle(filtered[focusIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearch('');
        setFocusIndex(-1);
        break;
    }
  }, [isOpen, focusIndex, filtered, toggle]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-ms-item]');
      items[focusIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusIndex]);

  const displayText = selected.length === 0
    ? placeholder
    : selected.length === 1
      ? selected[0]
      : `${selected.length} selected`;

  return (
    <div ref={containerRef} className="lq-multiselect" onKeyDown={handleKeyDown}>
      <label className="lq-multiselect-label">{label}</label>
      <button
        type="button"
        className="lq-multiselect-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`lq-multiselect-text ${selected.length === 0 ? 'lq-multiselect-placeholder' : ''}`}>
          {displayText}
        </span>
        <ChevronDown size={14} className={`lq-multiselect-chevron ${isOpen ? 'lq-multiselect-chevron-open' : ''}`} />
      </button>

      {isOpen && (
        <div className="lq-multiselect-dropdown" role="listbox" aria-multiselectable="true">
          {/* Search */}
          <div className="lq-multiselect-search-wrap">
            <Search size={13} className="lq-multiselect-search-icon" />
            <input
              ref={searchRef}
              type="text"
              className="lq-multiselect-search"
              placeholder="Search..."
              value={search}
              onChange={e => { setSearch(e.target.value); setFocusIndex(-1); }}
            />
          </div>

          {/* Actions */}
          <div className="lq-multiselect-actions">
            <button type="button" className="lq-multiselect-action" onClick={selectAll}>
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
            {selected.length > 0 && (
              <button type="button" className="lq-multiselect-action lq-multiselect-clear" onClick={clearAll}>
                Clear
              </button>
            )}
          </div>

          {/* Options */}
          <div ref={listRef} className="lq-multiselect-list">
            {filtered.map((option, idx) => {
              const isSelected = selected.includes(option);
              const isFocused = idx === focusIndex;
              return (
                <div
                  key={option}
                  data-ms-item
                  role="option"
                  aria-selected={isSelected}
                  className={`lq-multiselect-option ${isSelected ? 'lq-multiselect-option-selected' : ''} ${isFocused ? 'lq-multiselect-option-focused' : ''}`}
                  onClick={() => toggle(option)}
                >
                  <div className={`lq-multiselect-checkbox ${isSelected ? 'lq-multiselect-checkbox-checked' : ''}`}>
                    {isSelected && <Check size={10} />}
                  </div>
                  <span>{option}</span>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="lq-multiselect-empty">No results</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
