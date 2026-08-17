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
  | 'Decorator'
  | 'Other';

export type CallerName = 'User 1' | 'User 2';
export type UserRole = 'Admin' | 'User 1' | 'User 2';

export interface Lead {
  id: string;
  businessName: string;
  phone: string;
  email?: string;
  website?: string;
  mapsLink?: string;
  
  // Google Scraper Fields
  reviewCount?: number;
  rating?: number;
  businessAge?: string;
  address?: string;
  businessStatus?: string;
  openingHours?: string;
  latestReview?: string;
  
  category: string;
  cityArea?: string;
  listName?: string;
  assignedToId?: string;
  assignedTo?: { name: string };
  
  // CRM Workflow Fields
  status: CallStatus;
  priority?: 'High' | 'Medium' | 'Low' | 'None';
  notes: string;
  followUpDate?: string;
  lastContact?: string;
  remarksPreview?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface ImportSummary {
  pastedCount: number;
  duplicateCount: number;
  addedCount: number;
  batchLabel: string;
}
