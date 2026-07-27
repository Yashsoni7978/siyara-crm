export type CallStatus =
  | 'Not Called'
  | 'No Answer'
  | 'Not Interested'
  | 'Interested'
  | 'Follow-up Needed'
  | 'Meeting Booked'
  | 'Converted'
  | 'Dead';

export type Category =
  | 'Doctor'
  | 'Dentist'
  | 'Physiotherapist'
  | 'Event Manager'
  | 'Event Planner'
  | 'Event Designer'
  | 'Anchor'
  | 'Decorator'
  | 'Other';

export type CallerName = 'User 1' | 'User 2';
export type UserRole = 'Admin' | 'User 1' | 'User 2';

export interface Lead {
  id: string;
  business_name: string;
  phone: string;
  email?: string;
  website?: string;
  maps_link?: string;
  review_count?: number;
  rating?: number;
  category: string;
  city_area?: string;
  batch_label: string;
  assigned_to: CallerName;
  status: CallStatus;
  notes: string;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

export interface ImportSummary {
  pastedCount: number;
  duplicateCount: number;
  addedCount: number;
  batchLabel: string;
}
