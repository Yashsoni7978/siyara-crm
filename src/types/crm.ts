export type CallStatus =
  | 'Not Called'
  | 'Interested'
  | 'Busy'
  | 'Wrong Number'
  | 'No Answer'
  | 'Converted'
  | 'Lost';

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
  
  // Google Scraper Fields
  review_count?: number;
  rating?: number;
  business_age?: string;
  address?: string;
  business_status?: string;
  opening_hours?: string;
  latest_review?: string;
  
  category: string;
  city_area?: string;
  batch_label: string;
  assigned_to: CallerName;
  
  // CRM Workflow Fields
  status: CallStatus;
  priority?: 'High' | 'Medium' | 'Low' | 'None';
  notes: string;
  follow_up_date?: string;
  last_contact?: string;
  remarks_preview?: string;
  
  created_at: string;
  updated_at: string;
}

export interface ImportSummary {
  pastedCount: number;
  duplicateCount: number;
  addedCount: number;
  batchLabel: string;
}
