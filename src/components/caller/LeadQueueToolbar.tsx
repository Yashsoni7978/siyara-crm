import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { MultiSelect } from './MultiSelect';

export type SortField = 'createdAt' | 'updatedAt' | 'followUpDate' | 'rating' | 'reviewCount' | 'priority';

interface LeadQueueToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string[];
  onStatusFilterChange: (values: string[]) => void;
  priorityFilter: string[];
  onPriorityFilterChange: (values: string[]) => void;
  categoryFilter: string[];
  onCategoryFilterChange: (values: string[]) => void;
  locationFilter: string[];
  onLocationFilterChange: (values: string[]) => void;
  sortBy: SortField;
  onSortByChange: (value: SortField) => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (value: 'asc' | 'desc') => void;
  statusOptions: string[];
  priorityOptions: string[];
  categoryOptions: string[];
  locationOptions: string[];
}

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'createdAt', label: 'Date Added' },
  { value: 'updatedAt', label: 'Last Updated' },
  { value: 'followUpDate', label: 'Follow-up Date' },
  { value: 'rating', label: 'Rating' },
  { value: 'reviewCount', label: 'Reviews' },
  { value: 'priority', label: 'Priority' },
];

export const LeadQueueToolbar: React.FC<LeadQueueToolbarProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  locationFilter,
  onLocationFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  statusOptions,
  priorityOptions,
  categoryOptions,
  locationOptions,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  
  const activeFiltersCount = statusFilter.length + priorityFilter.length + categoryFilter.length + locationFilter.length;

  return (
    <div className="lq-toolbar" style={{ padding: '12px 16px', gap: '12px' }}>
      
      {/* Top Row: Search, Sort & Toggle */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search */}
        <div className="lq-toolbar-search" style={{ flex: '1 1 200px' }}>
          <Search size={14} className="lq-toolbar-search-icon" />
          <input
            type="text"
            className="lq-toolbar-search-input"
            placeholder="Search leads..."
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {/* Sort */}
        <div className="lq-toolbar-sort" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <select
            className="lq-toolbar-sort-select"
            value={sortBy}
            onChange={e => onSortByChange(e.target.value as SortField)}
            aria-label="Sort by"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            type="button"
            className="lq-toolbar-sort-order"
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {/* Filter Toggle */}
        <button 
          onClick={() => setShowFilters(!showFilters)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '4px 10px', 
            fontSize: '12px', 
            fontWeight: 600,
            background: showFilters || activeFiltersCount > 0 ? 'var(--primary-light)' : 'var(--bg-card)',
            color: showFilters || activeFiltersCount > 0 ? 'var(--primary)' : 'var(--text-muted)',
            border: '1px solid',
            borderColor: showFilters || activeFiltersCount > 0 ? 'var(--primary)' : 'var(--border-main)',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <SlidersHorizontal size={14} /> 
          Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </button>
      </div>

      {/* Expandable Filters Row */}
      {showFilters && (
        <div className="lq-toolbar-filters" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
          gap: '8px',
          paddingTop: '8px',
          borderTop: '1px dashed var(--border-main)',
          animation: 'fadeIn 0.2s'
        }}>
          <MultiSelect
            label="Status"
            options={statusOptions}
            selected={statusFilter}
            onChange={onStatusFilterChange}
            placeholder="All Statuses"
          />
          <MultiSelect
            label="Priority"
            options={priorityOptions}
            selected={priorityFilter}
            onChange={onPriorityFilterChange}
            placeholder="All Priorities"
          />
          <MultiSelect
            label="Category"
            options={categoryOptions}
            selected={categoryFilter}
            onChange={onCategoryFilterChange}
            placeholder="All Categories"
          />
          <MultiSelect
            label="Location"
            options={locationOptions}
            selected={locationFilter}
            onChange={onLocationFilterChange}
            placeholder="All Locations"
          />
        </div>
      )}
    </div>
  );
};
