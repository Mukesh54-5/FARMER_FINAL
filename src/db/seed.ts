import bcrypt from 'bcryptjs';
import { count, eq } from 'drizzle-orm';
import { db } from './index.ts';
import { agricultureItems, farmerProfiles, schemes, users } from './schema.ts';
import { INITIAL_AGRICULTURE_ITEMS, INITIAL_SCHEMES } from './seedData.ts';

let seedPromise: Promise<void> | null = null;
let seeded = false;

async function runSeed() {
  const [{ value: schemeCount }] = await db
    .select({ value: count() })
    .from(schemes);

  if (Number(schemeCount) === 0) {
    for (const item of INITIAL_SCHEMES) {
      await db
        .insert(schemes)
        .values({
          slug: item.slug,
          name: item.name,
          shortName: item.shortName,
          governmentLevel: item.governmentLevel,
          stateName: item.stateName,
          category: item.category,
          targetCategories: item.targetCategories,
          overview: item.overview,
          objectives: item.objectives,
          benefits: item.benefits,
          eligibilitySummary: item.eligibilitySummary,
          eligibilityRules: item.eligibilityRules,
          requiredDocuments: item.requiredDocuments,
          applicationProcedure: item.applicationProcedure,
          officialUrl: item.officialUrl,
          lastVerifiedDate: item.lastVerifiedDate,
          isPopular: item.isPopular,
        })
        .onConflictDoNothing({ target: schemes.slug });
    }
  }

  const [{ value: agriCount }] = await db
    .select({ value: count() })
    .from(agricultureItems);

  if (Number(agriCount) === 0) {
    for (const item of INITIAL_AGRICULTURE_ITEMS) {
      await db
        .insert(agricultureItems)
        .values({
          slug: item.slug,
          section: item.section,
          title: item.title,
          subtitle: item.subtitle,
          summary: item.summary,
          details: item.details,
          highlights: item.highlights,
        })
        .onConflictDoNothing({ target: agricultureItems.slug });
    }
  }

  // Ensure demo admin account exists for project evaluation
  const adminEmail = 'admin@farmerportal.edu';
  const existingAdmin = await db
    .select()
    .from(users)
    .where(eq(users.email, adminEmail))
    .limit(1);

  if (existingAdmin.length === 0) {
    const hash = await bcrypt.hash('Admin@2026', 10);
    const [insertedAdmin] = await db
      .insert(users)
      .values({
        uid: 'local_admin_portal',
        email: adminEmail,
        fullName: 'Portal Administrator',
        mobileNumber: '9000000000',
        passwordHash: hash,
        role: 'admin',
      })
      .onConflictDoNothing({ target: users.email })
      .returning();

    if (insertedAdmin) {
      await db
        .insert(farmerProfiles)
        .values({
          userId: insertedAdmin.id,
          fullName: insertedAdmin.fullName,
          state: 'Karnataka',
          district: 'Bengaluru Urban',
          farmerCategory: 'Small (1-2 ha)',
          landHoldingAcres: '3.5',
          mainCrop: 'Ragi',
          irrigationAvailability: 'Borewell / Drip',
          farmingType: 'Mixed (Organic & Modern)',
        })
        .onConflictDoNothing({ target: farmerProfiles.userId });
    }
  }

  seeded = true;
}

export async function ensureSeeded(): Promise<void> {
  if (seeded) return;
  if (!seedPromise) {
    seedPromise = runSeed().finally(() => {
      seedPromise = null;
    });
  }
  await seedPromise;
}
