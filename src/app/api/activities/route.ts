import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get('leadId');
  const userId = searchParams.get('userId');

  if (!leadId && !userId) {
    return NextResponse.json({ error: 'leadId or userId is required' }, { status: 400 });
  }

  try {
    const whereClause = leadId ? { leadId } : { userId: userId! };
    const activities = await prisma.activity.findMany({
      where: whereClause,
      orderBy: { timestamp: 'desc' },
      include: { 
        user: { select: { name: true, role: true } },
        lead: { select: { businessName: true } } // Fetch lead name too
      }
    });

    return NextResponse.json(activities);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const activity = await prisma.activity.create({
      data: body,
      include: { user: { select: { name: true, role: true } } }
    });
    return NextResponse.json(activity, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
