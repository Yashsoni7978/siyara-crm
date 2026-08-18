import { CallStatus, Category, Lead } from '../types/crm';

export const CALLERS = ['User 1', 'User 2'] as const;

export function formatWhatsAppNumber(phone?: string | null): string {
  if (!phone) return '';
  let digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('910')) {
    digits = '91' + digits.slice(3).replace(/^0+/, '');
  }
  digits = digits.replace(/^0+/, '');
  if (digits.length === 10) {
    digits = '91' + digits;
  }
  return digits;
}

export function formatWebsiteUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}


export const CATEGORIES: Category[] = [
  'Doctor',
  'Dentist',
  'Physiotherapist',
  'Event Manager',
  'Event Planner',
  'Event management company',
  'Wedding planner',
  'Event Designer',
  'Decorator',
  'Banquet hall',
  'Event venue',
  'Other',
];

export const STATUS_CONFIG: Record<
  CallStatus,
  { label: CallStatus; color: string; bg: string; border: string }
> = {
  'Not Called': {
    label: 'Not Called',
    color: 'var(--text-muted)',
    bg: '#f1f5f9',
    border: '#cbd5e1',
  },
  'Interested': {
    label: 'Interested',
    color: '#059669',
    bg: '#ecfdf5',
    border: '#a7f3d0',
  },
  'Busy': {
    label: 'Busy',
    color: '#d97706',
    bg: 'var(--warning)',
    border: '#fde68a',
  },
  'Wrong Number': {
    label: 'Wrong Number',
    color: '#9ca3af',
    bg: '#f3f4f6',
    border: '#e5e7eb',
  },
  'No Answer': {
    label: 'No Answer',
    color: '#64748b',
    bg: 'var(--bg-main)',
    border: '#e2e8f0',
  },
  'Converted': {
    label: 'Converted',
    color: '#047857',
    bg: '#d1fae5',
    border: '#6ee7b7',
  },
  'Lost': {
    label: 'Lost',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
  },
};

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-101',
    businessName: 'Apex Dental Care & Implant Center',
    phone: '+919820112345',
    email: 'contact@apexdental.com',
    website: 'https://apexdental.example.com',
    mapsLink: 'https://maps.google.com/?q=Apex+Dental+Care',
    reviewCount: 142,
    rating: 4.8,
    businessAge: '5 Years',
    address: 'Bandra West, Mumbai',
    businessStatus: 'Operational',
    openingHours: '9:00 AM - 8:00 PM',
    latestReview: 'Great service and very professional.',
    category: 'Dentist',
    cityArea: 'Bandra West, Mumbai',
    listName: 'Batch 1 – 28 Jul 2026',
    assignedToId: 'User 1',
    status: 'Interested',
    priority: 'High',
    notes: 'Dr. Mehta expressed interest in lead management software. Wants a callback on Thursday.',
    followUpDate: '2026-07-30',
    lastContact: '2026-07-28',
    remarksPreview: 'Positive response',
    createdAt: '2026-07-28T02:00:00.000Z',
    updatedAt: '2026-07-28T02:10:00.000Z',
  },
  {
    id: 'lead-102',
    businessName: 'Grand Horizon Event Management',
    phone: '+919876543210',
    email: 'info@grandhorizonevents.in',
    website: 'https://grandhorizonevents.in',
    mapsLink: 'https://maps.google.com/?q=Grand+Horizon+Events',
    reviewCount: 89,
    rating: 4.6,
    businessAge: '12 Years',
    category: 'Event Manager',
    cityArea: 'Andheri East, Mumbai',
    listName: 'Batch 1 – 28 Jul 2026',
    assignedToId: 'User 2',
    status: 'Interested',
    priority: 'High',
    notes: 'Spoke with CEO Rajesh. Demo scheduled for Friday 3 PM.',
    followUpDate: '2026-07-31',
    createdAt: '2026-07-28T02:00:00.000Z',
    updatedAt: '2026-07-28T02:15:00.000Z',
  },
  {
    id: 'lead-103',
    businessName: 'CureFit Physiotherapy Clinic',
    phone: '+919123456789',
    email: 'support@curefitphysio.com',
    website: '',
    mapsLink: 'https://maps.google.com/?q=CureFit+Physio',
    reviewCount: 56,
    rating: 4.5,
    category: 'Physiotherapist',
    cityArea: 'Juhu, Mumbai',
    listName: 'Batch 1 – 28 Jul 2026',
    assignedToId: 'User 1',
    status: 'Busy',
    priority: 'Medium',
    notes: 'Owner was busy with a patient. Asked to call back in the evening.',
    followUpDate: '2026-07-28',
    createdAt: '2026-07-28T02:00:00.000Z',
    updatedAt: '2026-07-28T02:05:00.000Z',
  },
  {
    id: 'lead-104',
    businessName: 'Royal Decorators & Stage Crafts',
    phone: '+919988776655',
    email: 'royaldecor.mumbai@gmail.com',
    website: 'https://royaldecor.com',
    mapsLink: 'https://maps.google.com/?q=Royal+Decorators',
    reviewCount: 210,
    rating: 4.9,
    category: 'Decorator',
    cityArea: 'Powai, Mumbai',
    listName: 'Batch 1 – 28 Jul 2026',
    assignedToId: 'User 2',
    status: 'Converted',
    priority: 'Low',
    notes: 'Closed client! Paid advance deposit for campaign package.',
    followUpDate: '',
    createdAt: '2026-07-28T02:00:00.000Z',
    updatedAt: '2026-07-28T02:20:00.000Z',
  },
  {
    id: 'lead-105',
    businessName: 'Starlight Emcee & Anchor Services',
    phone: '+919811223344',
    email: 'anchor.divya@example.com',
    website: '',
    mapsLink: 'https://maps.google.com/?q=Starlight+Anchor',
    reviewCount: 34,
    rating: 4.7,
    category: 'Anchor',
    cityArea: 'Lower Parel, Mumbai',
    listName: 'Batch 1 – 28 Jul 2026',
    assignedToId: 'User 1',
    status: 'Not Called',
    priority: 'None',
    notes: '',
    followUpDate: '',
    createdAt: '2026-07-28T02:00:00.000Z',
    updatedAt: '2026-07-28T02:00:00.000Z',
  },
  {
    id: 'lead-106',
    businessName: 'Vibrant Celebrations Event Planner',
    phone: '+919765432109',
    email: 'hello@vibrantcelebrations.in',
    website: 'https://vibrantcelebrations.in',
    mapsLink: 'https://maps.google.com/?q=Vibrant+Celebrations',
    reviewCount: 175,
    rating: 4.8,
    category: 'Event Planner',
    cityArea: 'Thane West',
    listName: 'Batch 1 – 28 Jul 2026',
    assignedToId: 'User 2',
    status: 'Lost',
    priority: 'None',
    notes: 'Already using a local software agency.',
    followUpDate: '',
    createdAt: '2026-07-28T02:00:00.000Z',
    updatedAt: '2026-07-28T02:18:00.000Z',
  },
  {
    id: 'lead-107',
    businessName: 'Skin Care & Dermatology Center',
    phone: '+919543210987',
    email: 'dr.sharma@skincareclinic.com',
    website: 'https://skincareclinic.com',
    mapsLink: 'https://maps.google.com/?q=Skin+Care+Clinic',
    reviewCount: 312,
    rating: 4.9,
    category: 'Doctor',
    cityArea: 'Worli, Mumbai',
    listName: 'Batch 1 – 28 Jul 2026',
    assignedToId: 'User 1',
    status: 'No Answer',
    priority: 'Medium',
    notes: 'Rang 5 times, no response. Will try again tomorrow.',
    followUpDate: '2026-07-29',
    createdAt: '2026-07-28T02:00:00.000Z',
    updatedAt: '2026-07-28T02:12:00.000Z',
  },
  {
    id: 'lead-108',
    businessName: 'Elegance Event Designers',
    phone: '+919432109876',
    email: 'contact@elegancedesigners.com',
    website: '',
    mapsLink: 'https://maps.google.com/?q=Elegance+Event+Designers',
    reviewCount: 98,
    rating: 4.4,
    category: 'Event Designer',
    cityArea: 'Malad West, Mumbai',
    listName: 'Batch 1 – 28 Jul 2026',
    assignedToId: 'User 2',
    status: 'Not Called',
    priority: 'None',
    notes: '',
    followUpDate: '',
    createdAt: '2026-07-28T02:00:00.000Z',
    updatedAt: '2026-07-28T02:00:00.000Z',
  },
];
