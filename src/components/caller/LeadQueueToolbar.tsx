import React from 'react';
import { Search } from 'lucide-react';
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
  return (
    <div className="lq-toolbar">
      {/* Search */}
      <div className="lq-toolbar-search">
        <Search size={14} className="lq-toolbar-search-icon" />
        <input
          type="text"
          className="lq-toolbar-search-input"
          placeholder="Search leads..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filters Row */}
      <div className="lq-toolbar-filters">
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

      {/* Sort Row */}
      <div className="lq-toolbar-sort">
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
          aria-label={`Sort ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
          title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
        >
          {sortOrder === 'asc' ? '↑' : '↓'}
        </button>
      </div>
    </div>
  );
};
