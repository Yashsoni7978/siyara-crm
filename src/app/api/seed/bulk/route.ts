import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // 1. Ensure basic Organization and Users exist
    const org = await prisma.organization.upsert({
      where: { id: 'siyara-enterprise-id-1' },
      update: {},
      create: {
        id: 'siyara-enterprise-id-1',
        name: 'Siyara Enterprise Demo',
      }
    });

    const user1 = await prisma.user.upsert({
      where: { email: 'caller1@siyara.local' },
      update: {},
      create: {
        id: 'a76155cd-c641-42b0-8213-df91de466597',
        name: 'User 1',
        email: 'caller1@siyara.local',
        role: 'Caller',
        organizationId: org.id
      }
    });

    const user2 = await prisma.user.upsert({
      where: { email: 'caller2@siyara.local' },
      update: {},
      create: {
        id: 'c323e6bd-6235-4426-88bf-a8c5723e683e',
        name: 'User 2',
        email: 'caller2@siyara.local',
        role: 'Caller',
        organizationId: org.id
      }
    });

    const callers = [user1, user2];
    const leads: any[] = [];
    const dataFile = path.join(process.cwd(), 'data', 'polished_leads.csv');
    const LIST_NAME = 'Event Managers in Jaipur';

    if (!fs.existsSync(dataFile)) {
      return NextResponse.json({ error: 'Data file not found', path: dataFile }, { status: 404 });
    }

    await new Promise((resolve, reject) => {
      fs.createReadStream(dataFile)
        .pipe(csv())
        .on('data', (row) => leads.push(row))
        .on('end', resolve)
        .on('error', reject);
    });

    let assignedCount = 0;
    
    // We will use a transaction to bulk insert to speed it up and ensure atomicity,
    // but since they might already exist if hit multiple times, we can use createMany or loop.
    // Loop is safer for SQLite/Neon mixed compatibility with unique constraints if we had them.
    for (let i = 0; i < leads.length; i++) {
      const row = leads[i];
      const caller = callers[i % callers.length];
      
      await prisma.lead.create({
        data: {
          organizationId: org.id,
          assignedToId: caller.id,
          businessName: row['Business Name'] || 'Unknown Business',
          phone: row['Phone'] || '',
          website: row['Website'] || null,
          mapsLink: row['Maps Link'] || null,
          rating: row['Rating'] ? parseFloat(row['Rating']) : null,
          reviewCount: row['Review Count'] ? parseInt(row['Review Count'], 10) : null,
          category: row['Category'] || '',
          address: row['Address'] || null,
          openingHours: row['Opening Hours'] || null,
          status: 'Not Called',
          priority: 'None',
          listName: LIST_NAME
        }
      });
      assignedCount++;
    }

    return NextResponse.json({ 
      message: 'Database seeded successfully from CSV.', 
      count: assignedCount,
      listName: LIST_NAME
    }, { status: 200 });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
