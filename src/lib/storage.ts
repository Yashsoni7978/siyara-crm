import { CallerName, ImportSummary, Lead } from '../types/crm';
import { INITIAL_LEADS } from './constants';

const STORAGE_KEY = 'siyara_crm_leads_v1';
const BATCH_COUNTER_KEY = 'siyara_crm_batch_count_v1';

export function getLeads(): Lead[] {
  if (typeof window === 'undefined') return INITIAL_LEADS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
      return INITIAL_LEADS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to parse leads from localStorage', err);
    return INITIAL_LEADS;
  }
}

export function saveLeads(leads: Lead[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}

export function resetToSampleData(): Lead[] {
  if (typeof window === 'undefined') return INITIAL_LEADS;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
  localStorage.setItem(BATCH_COUNTER_KEY, '1');
  return INITIAL_LEADS;
}

export function updateSingleLead(updatedLead: Lead): Lead[] {
  const leads = getLeads();
  const index = leads.findIndex((l) => l.id === updatedLead.id);
  if (index !== -1) {
    leads[index] = {
      ...updatedLead,
      updated_at: new Date().toISOString(),
    };
    saveLeads(leads);
  }
  return leads;
}

export function getNextBatchNumber(): number {
  if (typeof window === 'undefined') return 2;
  const raw = localStorage.getItem(BATCH_COUNTER_KEY);
  const current = raw ? parseInt(raw, 10) : 1;
  const next = current + 1;
  localStorage.setItem(BATCH_COUNTER_KEY, next.toString());
  return next;
}

export function normalizePhone(phone: string): string {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '').trim();
}

export function importPastedLeads(rawText: string): {
  summary: ImportSummary;
  updatedLeads: Lead[];
} {
  const currentLeads = getLeads();
  
  // Existing phone & maps_link sets for fast deduplication
  const existingPhones = new Set(
    currentLeads
      .map((l) => normalizePhone(l.phone))
      .filter((p) => p.length > 0)
  );
  const existingMapsLinks = new Set(
    currentLeads
      .map((l) => (l.maps_link || '').trim().toLowerCase())
      .filter((m) => m.length > 0)
  );

  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    return {
      summary: {
        pastedCount: 0,
        duplicateCount: 0,
        addedCount: 0,
        batchLabel: '',
      },
      updatedLeads: currentLeads,
    };
  }

  // Determine header if present
  const firstLine = lines[0];
  const isHeader =
    firstLine.toLowerCase().includes('name') ||
    firstLine.toLowerCase().includes('title') ||
    firstLine.toLowerCase().includes('phone') ||
    firstLine.toLowerCase().includes('business');

  const dataLines = isHeader ? lines.slice(1) : lines;
  const delimiter = firstLine.includes('\t') ? '\t' : ',';

  // Format today's date for batch label e.g., "Batch 2 – 28 Jul 2026"
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const batchNum = getNextBatchNumber();
  const batchLabel = `Batch ${batchNum} – ${dateStr}`;

  let duplicateCount = 0;
  const newLeadsToAdd: Lead[] = [];
  const callers: CallerName[] = ['User 1', 'User 2'];
  let callerToggleIndex = 0;

  for (let i = 0; i < dataLines.length; i++) {
    const rawLine = dataLines[i];
    const columns = parseCSVLine(rawLine, delimiter);
    if (columns.length === 0) continue;

    // Smart mapping based on position or headers
    let business_name = columns[0] || 'Unknown Business';
    let phone = '';
    let email = '';
    let website = '';
    let maps_link = '';
    let review_count: number | undefined = undefined;
    let rating: number | undefined = undefined;
    let category = 'Other';
    let city_area = '';

    // Extract columns intelligently
    for (let c = 0; c < columns.length; c++) {
      const val = columns[c].trim();
      if (!val) continue;

      if (val.startsWith('+') || (val.replace(/\D/g, '').length >= 8 && !phone)) {
        if (!phone) phone = val;
      } else if (val.includes('@') && !email) {
        email = val;
      } else if ((val.includes('http') || val.includes('www.')) && !website && !val.includes('maps')) {
        website = val;
      } else if (val.includes('maps.google') || val.includes('goo.gl/maps') || val.includes('g.co/maps')) {
        maps_link = val;
      } else if (!isNaN(Number(val)) && Number(val) <= 5 && Number(val) >= 1 && rating === undefined) {
        rating = Number(val);
      } else if (!isNaN(Number(val)) && Number(val) > 5 && review_count === undefined) {
        review_count = parseInt(val, 10);
      }
    }

    if (columns.length >= 2 && !phone && columns[1]) {
      phone = columns[1];
    }

    const normPhone = normalizePhone(phone);
    const normMaps = maps_link.trim().toLowerCase();

    // Deduplication check
    const isPhoneDup = normPhone && existingPhones.has(normPhone);
    const isMapsDup = normMaps && existingMapsLinks.has(normMaps);

    if (isPhoneDup || isMapsDup) {
      duplicateCount++;
      continue;
    }

    // Add to existing tracking set
    if (normPhone) existingPhones.add(normPhone);
    if (normMaps) existingMapsLinks.add(normMaps);

    // Auto-split assignment 50/50: odd rows -> User 1, even rows -> User 2
    const assigned_to = callers[callerToggleIndex % 2];
    callerToggleIndex++;

    const newLead: Lead = {
      id: `lead-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 6)}`,
      business_name: business_name.replace(/^"|"$/g, ''),
      phone: phone || 'N/A',
      email: email || undefined,
      website: website || undefined,
      maps_link: maps_link || undefined,
      review_count,
      rating,
      category: category,
      city_area: city_area || undefined,
      batch_label: batchLabel,
      assigned_to,
      status: 'Not Called',
      notes: '',
      follow_up_date: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    newLeadsToAdd.push(newLead);
  }

  const updatedLeads = [...newLeadsToAdd, ...currentLeads];
  saveLeads(updatedLeads);

  return {
    summary: {
      pastedCount: dataLines.length,
      duplicateCount,
      addedCount: newLeadsToAdd.length,
      batchLabel,
    },
    updatedLeads,
  };
}

function parseCSVLine(text: string, delimiter: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === delimiter && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += c;
    }
  }
  result.push(cur.trim());
  return result;
}
