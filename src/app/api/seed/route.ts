import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { INITIAL_LEADS } from '../../../lib/constants';

export async function GET() {
  try {
    // 1. Clear existing data
    await prisma.activity.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.user.deleteMany();
    await prisma.organization.deleteMany();

    // 2. Create Organization
    const org = await prisma.organization.create({
      data: { name: 'Siyara Enterprise Demo' }
    });

    // 3. Create Users
    const admin = await prisma.user.create({ data: { organizationId: org.id, name: 'Admin', email: 'admin@siyara.com', role: 'Admin' } });
    const user1 = await prisma.user.create({ data: { organizationId: org.id, name: 'Sneha', email: 'sneha@siyara.com', role: 'Caller' } });
    const user2 = await prisma.user.create({ data: { organizationId: org.id, name: 'Aditya', email: 'aditya@siyara.com', role: 'Caller' } });

    // 4. Map Initial Leads
    const leadsData = INITIAL_LEADS.map(lead => {
      let assignedUserId = null;
      if (lead.assignedToId === 'Sneha') assignedUserId = user1.id;
      if (lead.assignedToId === 'Aditya') assignedUserId = user2.id;

      return {
        organizationId: org.id,
        assignedToId: assignedUserId,
        businessName: lead.businessName,
        phone: lead.phone,
        website: lead.website || null,
        mapsLink: lead.mapsLink || null,
        rating: lead.rating || null,
        reviewCount: lead.reviewCount || null,
        category: lead.category,
        address: lead.address || lead.cityArea || null,
        businessAge: lead.businessAge || null,
        openingHours: lead.openingHours || null,
        latestReview: lead.latestReview || null,
        status: lead.status,
        priority: lead.priority || 'None',
        followUpDate: lead.followUpDate ? new Date(lead.followUpDate) : null
      };
    });

    // 5. Insert Leads
    await prisma.lead.createMany({ data: leadsData });

    return NextResponse.json({ message: 'Database seeded successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
