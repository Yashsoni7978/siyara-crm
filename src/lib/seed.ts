import { prisma } from './prisma';

/**
 * Seeds the database with the default org and users IF they don't already exist.
 * Safe to call on every startup — uses upsert so it never overwrites existing data.
 */
export async function seedIfEmpty() {
  try {
    // 1. Ensure the organization exists
    let org = await prisma.organization.findFirst();
    if (!org) {
      org = await prisma.organization.create({
        data: { name: 'Siyara Enterprise' }
      });
      console.log('[seed] Created organization:', org.name);
    }

    // 2. Ensure the three user accounts exist
    const users = [
      { name: 'Admin',  email: 'admin@siyara.com',  role: 'Admin'  },
      { name: 'Sneha',  email: 'sneha@siyara.com',   role: 'Caller' },
      { name: 'Aditya', email: 'aditya@siyara.com',  role: 'Caller' },
    ];

    for (const u of users) {
      await prisma.user.upsert({
        where: { email: u.email },
        update: {},  // never overwrite existing user data
        create: { name: u.name, email: u.email, role: u.role, organizationId: org.id }
      });
    }

    console.log('[seed] Users OK (Admin, Sneha, Aditya)');
  } catch (err) {
    // Log but don't crash the server — the app can still serve other requests
    console.error('[seed] Auto-seed failed:', err);
  }
}
