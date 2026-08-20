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
  | 'Event management company'
  | 'Wedding planner'
  | 'Event Designer'
  | 'Decorator'
  | 'Banquet hall'
  | 'Event venue'
  | 'Other';

export type CallerName = 'Sneha' | 'Aditya';
export type UserRole = 'Admin' | 'Sneha' | 'Aditya';

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
