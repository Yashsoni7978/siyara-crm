import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PATCH(
  request: Request,
  context: any
) {
  try {
    const params = await context.params;
    const leadId = params?.id || context.params?.id;
    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const { status, priority, followUpDate, assignedToId, userId } = body;

    // We expect userId to be passed in the body so we know who made the change for the audit trail.
    // In a real app with auth, this would come from the session token.

    // 1. Fetch current lead
    const currentLead = await prisma.lead.findUnique({
      where: { id: leadId }
    });

    if (!currentLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // 2. Prepare Update Data
    const updateData: any = {};
    if (status !== undefined) updateData.status = status;
    if (priority !== undefined) updateData.priority = priority;
    if (followUpDate !== undefined) {
      updateData.followUpDate = followUpDate ? new Date(followUpDate) : null;
    }
    if (assignedToId !== undefined) updateData.assignedToId = assignedToId;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 422 });
    }

    // 3. Perform Update & Create Activities in a Transaction
    const activitiesToCreate = [];

    if (status !== undefined && status !== currentLead.status) {
      activitiesToCreate.push({
        leadId,
        userId: userId || null,
        type: 'StatusChange',
        oldValue: currentLead.status,
        newValue: status,
        description: `Changed status from ${currentLead.status} to ${status}`
      });
    }

    if (priority !== undefined && priority !== currentLead.priority) {
      activitiesToCreate.push({
        leadId,
        userId: userId || null,
        type: 'PriorityChange',
        oldValue: currentLead.priority,
        newValue: priority,
        description: `Changed priority from ${currentLead.priority || 'None'} to ${priority}`
      });
    }

    if (assignedToId !== undefined && assignedToId !== currentLead.assignedToId) {
      activitiesToCreate.push({
        leadId,
        userId: userId || null,
        type: 'Reassign',
        oldValue: currentLead.assignedToId || 'Unassigned',
        newValue: assignedToId || 'Unassigned',
        description: `Reassigned lead`
      });
    }

    // Using transaction to ensure both lead update and activity creation succeed or fail together
    const [updatedLead] = await prisma.$transaction([
      prisma.lead.update({
        where: { id: leadId },
        data: updateData,
        include: { assignedTo: true }
      }),
      ...(activitiesToCreate.length > 0
        ? [prisma.activity.createMany({ data: activitiesToCreate })]
        : [])
    ]);

    return NextResponse.json(updatedLead, { status: 200 });

  } catch (error: any) {
    console.error('PATCH /api/leads/[id] Error:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
