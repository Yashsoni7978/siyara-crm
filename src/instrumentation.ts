/**
 * Next.js Instrumentation Hook
 * Runs once when the server starts (both locally and on Vercel).
 * Used to auto-seed the database with default users so the app
 * works correctly after every fresh deployment.
 */
export async function register() {
  // Only run on the Node.js runtime (not Edge runtime)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { seedIfEmpty } = await import('./lib/seed');
    await seedIfEmpty();
  }
}
