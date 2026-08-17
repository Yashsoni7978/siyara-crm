const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const dataFile = path.join(__dirname, '../data/polished_leads.csv');
const LIST_NAME = 'Event Managers in Jaipur';

async function run() {
  let org = await prisma.organization.findFirst({ where: { name: 'Siyara Enterprise Demo' } });
  if (!org) {
    org = await prisma.organization.create({ data: { name: 'Siyara Enterprise Demo' } });
  }

  let user1 = await prisma.user.findFirst({ where: { name: 'User 1' } });
  if (!user1) {
    user1 = await prisma.user.create({ data: { name: 'User 1', email: 'user1@siyara.com', role: 'Caller', organizationId: org.id } });
  }

  let user2 = await prisma.user.findFirst({ where: { name: 'User 2' } });
  if (!user2) {
    user2 = await prisma.user.create({ data: { name: 'User 2', email: 'user2@siyara.com', role: 'Caller', organizationId: org.id } });
  }

  const callers = [user1, user2].filter(Boolean);

  await prisma.activity.deleteMany({ where: { lead: { organizationId: org.id } } });
  await prisma.lead.deleteMany({ where: { organizationId: org.id } });

  const leads = [];

  return new Promise((resolve) => {
    fs.createReadStream(dataFile)
      .pipe(csv())
      .on('data', (row) => {
        leads.push(row);
      })
      .on('end', async () => {
        const dataToInsert = leads.map((row, i) => {
          const caller = callers[i % callers.length];
          const cat = row['Category'] || '';
          const catLower = cat.toLowerCase();
          let listName = 'Event Managers in Jaipur';
          if (catLower.includes('doctor') || catLower.includes('physio') || catLower.includes('dentist')) {
            listName = 'Doctors in Jaipur';
          } else if (catLower.includes('anchor') || catLower.includes('emcee')) {
            listName = 'Anchors';
          }

          return {
            organizationId: org.id,
            assignedToId: caller.id,
            businessName: row['Business Name'] || 'Unknown Business',
            phone: row['Phone'] || '',
            website: row['Website'] || null,
            mapsLink: row['Maps Link'] || null,
            rating: row['Rating'] ? parseFloat(row['Rating']) : null,
            reviewCount: row['Review Count'] ? parseInt(row['Review Count'], 10) : null,
            category: cat,
            address: row['Address'] || null,
            openingHours: row['Opening Hours'] || null,
            status: 'Not Called',
            priority: 'None',
            listName: listName
          };
        });

        await prisma.lead.createMany({ data: dataToInsert });

        console.log(`Successfully imported and assigned ${dataToInsert.length} leads.`);
        await prisma.$disconnect();
        resolve();
      });
  });
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
