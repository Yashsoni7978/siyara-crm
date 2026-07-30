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
    const user1 = await prisma.user.create({ data: { organizationId: org.id, name: 'User 1', email: 'user1@siyara.com', role: 'Caller' } });
    const user2 = await prisma.user.create({ data: { organizationId: org.id, name: 'User 2', email: 'user2@siyara.com', role: 'Caller' } });

    // 4. Map Initial Leads
    const leadsData = INITIAL_LEADS.map(lead => {
      let assignedUserId = null;
      if (lead.assigned_to === 'User 1') assignedUserId = user1.id;
      if (lead.assigned_to === 'User 2') assignedUserId = user2.id;

      return {
        organizationId: org.id,
        assignedToId: assignedUserId,
        businessName: lead.business_name,
        phone: lead.phone,
        website: lead.website || null,
        mapsLink: lead.maps_link || null,
        rating: lead.rating || null,
        reviewCount: lead.review_count || null,
        category: lead.category,
        address: lead.address || lead.city_area || null,
        businessAge: lead.business_age || null,
        openingHours: lead.opening_hours || null,
        latestReview: lead.latest_review || null,
        status: lead.status,
        priority: lead.priority || 'None',
        followUpDate: lead.follow_up_date ? new Date(lead.follow_up_date) : null
      };
    });

    // 5. Insert Leads
    await prisma.lead.createMany({ data: leadsData });

    return NextResponse.json({ message: 'Database seeded successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
