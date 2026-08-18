import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const skip = (page - 1) * limit;

  // Search & Basic Filters
  const search = searchParams.get('search') || '';
  const assignedToId = searchParams.get('assignedToId') || '';
  
  // Array Filters (comma separated)
  const statusParam = searchParams.get('status') || '';
  const priorityParam = searchParams.get('priority') || '';
  const categoryParam = searchParams.get('category') || '';
  const cityAreaParam = searchParams.get('cityArea') || '';

  const statusArray = statusParam ? statusParam.split(',').filter(s => s && s !== 'ALL') : [];
  const priorityArray = priorityParam ? priorityParam.split(',').filter(p => p && p !== 'ALL') : [];
  const categoryArray = categoryParam ? categoryParam.split(',').filter(c => c && c !== 'ALL') : [];
  const cityAreaArray = cityAreaParam ? cityAreaParam.split(',').filter(a => a && a !== 'ALL') : [];

  // Sorting
  const sortBy = searchParams.get('sortBy') || 'updatedAt';
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

  const validSortFields = ['createdAt', 'updatedAt', 'followUpDate', 'priority', 'rating', 'reviewCount', 'businessName'];
  const finalSortBy = validSortFields.includes(sortBy) ? sortBy : 'updatedAt';

  const andConditions: Prisma.LeadWhereInput[] = [];

  if (search) {
    andConditions.push({
      OR: [
        { businessName: { contains: search } },
        { phone: { contains: search } },
        { website: { contains: search } },
        { address: { contains: search } },
        { category: { contains: search } },
      ]
    });
  }

  if (assignedToId && assignedToId !== 'ALL') {
    andConditions.push({
      OR: [
        { assignedToId: assignedToId },
        { assignedTo: { name: assignedToId } }
      ]
    });
  }

  if (statusArray.length > 0) {
    andConditions.push({ status: { in: statusArray } });
  }

  if (priorityArray.length > 0) {
    andConditions.push({ priority: { in: priorityArray } });
  }

  if (categoryArray.length > 0) {
    const categoryConditions: Prisma.LeadWhereInput[] = [];
    for (const cat of categoryArray) {
      categoryConditions.push(
        { category: { equals: cat } },
        { category: { contains: cat } }
      );

      const catLower = cat.toLowerCase();
      if (catLower.includes('doctor') || catLower.includes('dentist') || catLower.includes('physio')) {
        categoryConditions.push(
          { category: { contains: 'Doctor' } },
          { category: { contains: 'physician' } },
          { category: { contains: 'practitioner' } },
          { category: { contains: 'Dentist' } },
          { category: { contains: 'Physiotherapist' } }
        );
      }

      if (
        catLower.includes('event') || 
        catLower.includes('manager') || 
        catLower.includes('planner') || 
        catLower.includes('designer') || 
        catLower.includes('decor') ||
        catLower.includes('wedding')
      ) {
        categoryConditions.push(
          { category: { contains: 'Event' } },
          { category: { contains: 'Wedding' } },
          { category: { contains: 'Party' } },
          { category: { contains: 'Decor' } },
          { category: { contains: 'Banquet' } }
        );
      }
    }
    andConditions.push({ OR: categoryConditions });
  }

  if (cityAreaArray.length > 0) {
    andConditions.push({ cityArea: { in: cityAreaArray } });
  }

  const followUpDue = searchParams.get('followUpDue');
  if (followUpDue) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    if (followUpDue === 'today') {
      andConditions.push({
        followUpDate: { gte: startOfToday, lte: endOfToday }
      });
    } else if (followUpDue === 'overdue') {
      andConditions.push({
        followUpDate: { lt: startOfToday }
      });
    } else if (followUpDue === 'today_or_overdue') {
      andConditions.push({
        followUpDate: { lte: endOfToday }
      });
    }
  }

  const where: Prisma.LeadWhereInput = andConditions.length > 0 ? { AND: andConditions } : {};

  try {
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [finalSortBy]: sortOrder },
        include: { assignedTo: true }
      }),
      prisma.lead.count({ where })
    ]);

    return NextResponse.json({
      data: leads,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lead = await prisma.lead.create({
      data: body
    });
    return NextResponse.json(lead, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}
