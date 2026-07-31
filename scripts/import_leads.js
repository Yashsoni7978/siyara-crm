const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const dataFile = path.join(__dirname, '../data/polished_leads.csv');
const LIST_NAME = 'Event Managers in Jaipur';

async function run() {
  const org = await prisma.organization.findFirst({ where: { name: 'Siyara Enterprise Demo' }});
  if (!org) {
    console.error('Organization not found. Please run the seed endpoint first.');
    process.exit(1);
  }

  const user1 = await prisma.user.findFirst({ where: { name: 'User 1' }});
  const user2 = await prisma.user.findFirst({ where: { name: 'User 2' }});
  const callers = [user1, user2].filter(Boolean);

  if (callers.length === 0) {
    console.error('No callers found to assign leads.');
    process.exit(1);
  }

  const leads = [];

  return new Promise((resolve) => {
    fs.createReadStream(dataFile)
      .pipe(csv())
      .on('data', (row) => {
        leads.push(row);
      })
      .on('end', async () => {
        let assignedCount = 0;
        
        for (let i = 0; i < leads.length; i++) {
          const row = leads[i];
          const caller = callers[i % callers.length]; // Round robin assignment
          
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

        console.log(`Successfully imported and assigned ${assignedCount} leads to list "${LIST_NAME}".`);
        await prisma.$disconnect();
        resolve();
      });
  });
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
