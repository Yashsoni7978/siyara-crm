'use server';

import { prisma } from '../lib/prisma';

export async function getUserIdByName(name: string): Promise<string | null> {
  try {
    const user = await prisma.user.findFirst({
      where: { name }
    });
    return user?.id || null;
  } catch (error) {
    console.error('Failed to get user by name', error);
    return null;
  }
}

// Helper to parse TSV/CSV from Instant Data Scraper
function parseScraperData(raw: string) {
  const lines = raw.split('\n').map(l => l.trim()).filter(l => l);
  if (lines.length < 2) return [];
  
  const headers = lines[0].split('\t').map(h => h.toLowerCase());
  const rows = [];
  
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split('\t');
    const row: any = {};
    headers.forEach((h, idx) => {
      if (h.includes('business name') || h.includes('title')) row.businessName = cols[idx] || '';
      else if (h.includes('phone')) row.phone = cols[idx] || '';
      else if (h.includes('email')) row.email = cols[idx] || '';
      else if (h.includes('website')) row.website = cols[idx] || '';
      else if (h.includes('maps link') || h.includes('url')) row.mapsLink = cols[idx] || '';
      else if (h.includes('rating')) row.rating = cols[idx] || '';
      else if (h.includes('review')) row.reviewCount = cols[idx] || '';
      else if (h.includes('category')) row.category = cols[idx] || 'General';
      else if (h.includes('address')) row.address = cols[idx] || '';
    });
    if (row.businessName || row.phone) rows.push(row);
  }
  return rows;
}

export async function validateImportBatch(rawText: string, organizationId: string) {
  try {
    const parsedRows = parseScraperData(rawText);
    
    // Extract all phones to check
    const phones = parsedRows.map(r => r.phone).filter(p => p && p.length > 5);
    
    // Find existing leads with these phones in the same org
    const existingLeads = await prisma.lead.findMany({
      where: {
        organizationId,
        phone: { in: phones }
      },
      select: { phone: true, website: true, businessName: true }
    });
    
    const existingPhones = new Set(existingLeads.map(l => l.phone));
    
    const previewRows = parsedRows.map(row => {
      const isInvalid = !row.businessName;
      let isDuplicate = false;
      let duplicateReason = '';
      
      if (row.phone && existingPhones.has(row.phone)) {
        isDuplicate = true;
        duplicateReason = 'Phone Number exists';
      }
      
      return {
        ...row,
        status: isInvalid ? 'Invalid' : isDuplicate ? 'Duplicate' : 'New',
        validationMessage: isInvalid ? 'Missing Business Name' : duplicateReason
      };
    });
    
    return previewRows;
  } catch (error: any) {
    console.error('Validation failed', error);
    throw new Error('Failed to validate import');
  }
}

export async function executeImportBatch(leads: any[], organizationId: string) {
  try {
    // Basic assignment logic: split between User 1 and User 2
    const users = await prisma.user.findMany({ where: { organizationId } });
    if (users.length === 0) throw new Error('No users found to assign leads to.');
    
    const validLeads = leads.filter(l => l.status === 'New');
    
    const dataToInsert = validLeads.map((row, idx) => ({
      organizationId,
      assignedToId: users[idx % users.length].id,
      businessName: row.businessName,
      phone: row.phone || '',
      website: row.website || null,
      mapsLink: row.mapsLink || null,
      rating: row.rating ? parseFloat(row.rating) : null,
      reviewCount: row.reviewCount ? parseInt(row.reviewCount, 10) : null,
      category: row.category || 'General',
      address: row.address || null,
      status: 'Not Called',
      priority: 'None'
    }));
    
    await prisma.lead.createMany({
      data: dataToInsert
    });
    
    return { addedCount: dataToInsert.length };
  } catch (error: any) {
    console.error('Execution failed', error);
    throw new Error('Failed to execute import');
  }
}
