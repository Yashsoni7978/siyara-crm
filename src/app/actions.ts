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
