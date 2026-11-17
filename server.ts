import 'dotenv/config';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { and, desc, eq } from 'drizzle-orm';
import { createServer as createViteServer } from 'vite';
import { db } from './src/db/index.ts';
import {
  agricultureItems,
  chatConversations,
  chatMessages,
  contactMessages,
  farmerProfiles,
  recentlyViewedSchemes,
  schemes,
  users,
} from './src/db/schema.ts';
import { ensureSeeded } from './src/db/seed.ts';
import {
  AuthRequest,
  createSessionToken,
  optionalAuth,
  requireAdmin,
  requireAuth,
} from './src/middleware/auth.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '1mb' }));

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Helper for evaluating eligibility of a profile against a scheme
function evaluateSchemeEligibility(
  scheme: typeof schemes.$inferSelect,
  profile: {
    state?: string | null;
    farmerCategory?: string | null;
    landHoldingAcres?: string | null;
    mainCrop?: string | null;
    farmingType?: string | null;
  }
) {
  const rules = scheme.eligibilityRules;
  const missingFields: string[] = [];
  const reasons: string[] = [];
  let matchesAll = true;

  if (!profile.state?.trim()) missingFields.push('State');
  if (!profile.farmerCategory?.trim()) missingFields.push('Farmer Category');

  const landValue =
    profile.landHoldingAcres !== undefined &&
    profile.landHoldingAcres !== null &&
    profile.landHoldingAcres !== ''
      ? Number(profile.landHoldingAcres)
      : NaN;

  if (rules.minLandAcres !== undefined && Number.isNaN(landValue)) {
    missingFields.push('Land Holding (in acres)');
  }

  // State match
  if (rules.states && rules.states.length > 0 && !rules.states.includes('All India')) {
    if (profile.state?.trim()) {
      const stateMatch = rules.states.some(
        (s) => s.toLowerCase() === profile.state!.trim().toLowerCase()
      );
      if (stateMatch) {
        reasons.push(`State matches eligible region (${profile.state}).`);
      } else {
        matchesAll = false;
        reasons.push(
          `This scheme is applicable to ${rules.states.join(', ')}, while your profile state is ${profile.state}.`
        );
      }
    }
  } else {
    reasons.push('Available across All India (Central Government coverage).');
  }

  // Farmer category match
  if (
    rules.farmerCategories &&
    rules.farmerCategories.length > 0 &&
    profile.farmerCategory?.trim()
  ) {
    const catMatch = rules.farmerCategories.some(
      (c) => c.toLowerCase() === profile.farmerCategory!.trim().toLowerCase()
    );
    if (catMatch) {
      reasons.push(`Farmer category (${profile.farmerCategory}) falls within covered groups.`);
    } else {
      matchesAll = false;
      reasons.push(
        `Farmer category (${profile.farmerCategory}) is outside the primary listed categories (${rules.farmerCategories.join(', ')}).`
      );
    }
  }

  // Land holding check
  if (!Number.isNaN(landValue)) {
    if (rules.minLandAcres !== undefined && landValue < rules.minLandAcres) {
      matchesAll = false;
      reasons.push(
        `Listed landholding criterion requires cultivable land (at least ${rules.minLandAcres} acres); entered value is ${landValue} acres.`
      );
    } else if (rules.maxLandAcres !== undefined && landValue > rules.maxLandAcres) {
      matchesAll = false;
      reasons.push(
        `Maximum listed landholding limit is ${rules.maxLandAcres} acres; entered value is ${landValue} acres.`
      );
    } else if (rules.minLandAcres !== undefined || rules.maxLandAcres !== undefined) {
      reasons.push(`Entered landholding (${landValue} acres) fits the listed land criteria.`);
    }
  }

  let status: 'eligible' | 'not_eligible' | 'more_info';
  let headline: string;

  if (!matchesAll) {
    status = 'not_eligible';
    headline = 'You may not meet the listed criteria.';
  } else if (missingFields.length > 0) {
    status = 'more_info';
    headline = 'More information is required.';
  } else {
    status = 'eligible';
    headline = 'You may be eligible.';
  }

  return {
    schemeId: scheme.id,
    slug: scheme.slug,
    schemeName: scheme.name,
    shortName: scheme.shortName,
    officialUrl: scheme.officialUrl,
    status,
    headline,
    reasons,
    missingFields,
    notes: rules.notes || [],
    disclaimer:
      'Preliminary informational assessment only. Final eligibility is verified and determined solely by the concerned government department.',
  };
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Auth: Register with Email/Mobile/Password
app.post('/api/register', async (req, res) => {
  try {
    await ensureSeeded();
    const { fullName, email, mobileNumber, password, confirmPassword } = req.body ?? {};

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter a valid full name.' });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!mobileNumber || typeof mobileNumber !== 'string' || !/^[0-9+\-\s]{10,15}$/.test(mobileNumber.trim())) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Password and Confirm Password do not match.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const uid = `local_${crypto.randomUUID()}`;

    const [createdUser] = await db
      .insert(users)
      .values({
        uid,
        email: normalizedEmail,
        fullName: fullName.trim(),
        mobileNumber: mobileNumber.trim(),
        passwordHash,
        role: 'farmer',
      })
      .returning();

    const [createdProfile] = await db
      .insert(farmerProfiles)
      .values({
        userId: createdUser.id,
        fullName: createdUser.fullName,
      })
      .returning();

    const token = createSessionToken(createdUser.uid, createdUser.email);

    res.status(201).json({
      token,
      user: {
        id: createdUser.id,
        uid: createdUser.uid,
        email: createdUser.email,
        fullName: createdUser.fullName,
        mobileNumber: createdUser.mobileNumber,
        role: createdUser.role,
      },
      profile: createdProfile,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// Auth: Login with Email & Password
app.post('/api/login', async (req, res) => {
  try {
    await ensureSeeded();
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const found = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (found.length === 0 || !found[0].passwordHash) {
      return res.status(401).json({
        error: 'Invalid email or password. If you registered with Google, please use Google Sign-In.',
      });
    }

    const valid = await bcrypt.compare(String(password), found[0].passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const userRecord = found[0];
    const token = createSessionToken(userRecord.uid, userRecord.email);

    const profiles = await db
      .select()
      .from(farmerProfiles)
      .where(eq(farmerProfiles.userId, userRecord.id))
      .limit(1);

    res.json({
      token,
      user: {
        id: userRecord.id,
        uid: userRecord.uid,
        email: userRecord.email,
        fullName: userRecord.fullName,
        mobileNumber: userRecord.mobileNumber,
        role: userRecord.role,
      },
      profile: profiles[0] ?? null,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Auth: Forgot password
app.post('/api/forgot-password', async (req, res) => {
  try {
    await ensureSeeded();
    const { email } = req.body ?? {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Please provide your registered email address.' });
    }
    res.json({
      message:
        'If an account matches that email address, password recovery instructions have been recorded. For Google Sign-In accounts, manage your password via your Google Account.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Unable to process request right now.' });
  }
});

// Auth: Logout
app.post('/api/logout', (_req, res) => {
  res.json({ ok: true });
});

// Auth: Sync Firebase Google Sign-In user with PostgreSQL
app.post('/api/auth/firebase-sync', requireAuth, async (req: AuthRequest, res) => {
  try {
    await ensureSeeded();
    const dbUser = req.dbUser!;
    const profiles = await db
      .select()
      .from(farmerProfiles)
      .where(eq(farmerProfiles.userId, dbUser.id))
      .limit(1);

    let profile = profiles[0];
    if (!profile) {
      const [inserted] = await db
        .insert(farmerProfiles)
        .values({
          userId: dbUser.id,
          fullName: dbUser.fullName,
        })
        .returning();
      profile = inserted;
    }

    res.json({ user: dbUser, profile });
  } catch (error) {
    console.error('Firebase sync error:', error);
    res.status(500).json({ error: 'Failed to synchronize account profile.' });
  }
});

// Farmer Profile GET & PUT
app.get('/api/profile', requireAuth, async (req: AuthRequest, res) => {
  try {
    await ensureSeeded();
    const dbUser = req.dbUser!;
    const profiles = await db
      .select()
      .from(farmerProfiles)
      .where(eq(farmerProfiles.userId, dbUser.id))
      .limit(1);

    res.json({
      user: dbUser,
      profile: profiles[0] ?? null,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to load farmer profile.' });
  }
});

app.put('/api/profile', requireAuth, async (req: AuthRequest, res) => {
  try {
    await ensureSeeded();
    const dbUser = req.dbUser!;
    const {
      fullName,
      age,
      gender,
      state,
      district,
      village,
      farmerCategory,
      landHoldingAcres,
      mainCrop,
      irrigationAvailability,
      farmingType,
      mobileNumber,
    } = req.body ?? {};

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'Full Name is required.' });
    }

    const parsedAge =
      age !== undefined && age !== null && age !== '' ? Number(age) : null;
    if (parsedAge !== null && (Number.isNaN(parsedAge) || parsedAge < 18 || parsedAge > 110)) {
      return res.status(400).json({ error: 'Age must be between 18 and 110.' });
    }

    await db
      .update(users)
      .set({
        fullName: fullName.trim(),
        ...(mobileNumber ? { mobileNumber: String(mobileNumber).trim() } : {}),
      })
      .where(eq(users.id, dbUser.id));

    const existing = await db
      .select()
      .from(farmerProfiles)
      .where(eq(farmerProfiles.userId, dbUser.id))
      .limit(1);

    const payload = {
      fullName: fullName.trim(),
      age: parsedAge,
      gender: gender ? String(gender).trim() : null,
      state: state ? String(state).trim() : null,
      district: district ? String(district).trim() : null,
      village: village ? String(village).trim() : null,
      farmerCategory: farmerCategory ? String(farmerCategory).trim() : null,
      landHoldingAcres:
        landHoldingAcres !== undefined && landHoldingAcres !== null && landHoldingAcres !== ''
          ? String(landHoldingAcres).trim()
          : null,
      mainCrop: mainCrop ? String(mainCrop).trim() : null,
      irrigationAvailability: irrigationAvailability
        ? String(irrigationAvailability).trim()
        : null,
      farmingType: farmingType ? String(farmingType).trim() : null,
      updatedAt: new Date(),
    };

    let updatedProfile;
    if (existing.length > 0) {
      const [row] = await db
        .update(farmerProfiles)
        .set(payload)
        .where(eq(farmerProfiles.userId, dbUser.id))
        .returning();
      updatedProfile = row;
    } else {
      const [row] = await db
        .insert(farmerProfiles)
        .values({ userId: dbUser.id, ...payload })
        .returning();
      updatedProfile = row;
    }

    res.json({ profile: updatedProfile });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to save farmer profile.' });
  }
});

// Farmer Dashboard summary
app.get('/api/dashboard', requireAuth, async (req: AuthRequest, res) => {
  try {
    await ensureSeeded();
    const dbUser = req.dbUser!;
    const [profile] = await db
      .select()
      .from(farmerProfiles)
      .where(eq(farmerProfiles.userId, dbUser.id))
      .limit(1);

    const recentRows = await db
      .select({
        viewedAt: recentlyViewedSchemes.viewedAt,
        scheme: schemes,
      })
      .from(recentlyViewedSchemes)
      .innerJoin(schemes, eq(recentlyViewedSchemes.schemeId, schemes.id))
      .where(eq(recentlyViewedSchemes.userId, dbUser.id))
      .orderBy(desc(recentlyViewedSchemes.viewedAt))
      .limit(6);

    // Deduplicate recently viewed by scheme id
    const seen = new Set<number>();
    const recentlyViewed = recentRows
      .filter((r) => {
        if (seen.has(r.scheme.id)) return false;
        seen.add(r.scheme.id);
        return true;
      })
      .map((r) => r.scheme);

    const allSchemes = await db.select().from(schemes);
    const recommendations = buildRecommendations(allSchemes, profile ?? null);

    res.json({
      user: dbUser,
      profile: profile ?? null,
      recentlyViewed,
      recommendations,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard data.' });
  }
});

// Helper for recommendations
function buildRecommendations(
  allSchemes: (typeof schemes.$inferSelect)[],
  profile: typeof farmerProfiles.$inferSelect | null
) {
  return allSchemes
    .map((scheme) => {
      const reasons: string[] = [];
      let score = 0;

      if (!profile) {
        if (scheme.isPopular) {
          score += 2;
          reasons.push('Widely adopted foundational agricultural support scheme.');
        }
        return { scheme, score, reasons };
      }

      const state = profile.state?.trim() || '';
      const category = profile.farmerCategory?.trim() || '';
      const crop = profile.mainCrop?.trim().toLowerCase() || '';
      const irrigation = profile.irrigationAvailability?.trim().toLowerCase() || '';
      const farmingType = profile.farmingType?.trim().toLowerCase() || '';
      const landAcres = profile.landHoldingAcres ? Number(profile.landHoldingAcres) : NaN;

      // State relevance
      if (scheme.governmentLevel === 'Karnataka') {
        if (state.toLowerCase() === 'karnataka') {
          score += 5;
          reasons.push(`Tailored for Karnataka farmers (matches your state: ${state}).`);
        } else if (state) {
          score -= 10;
        }
      } else {
        score += 2;
        reasons.push('Available across India under Central Government agricultural guidelines.');
      }

      // Farmer category relevance
      if (category && scheme.targetCategories.includes(category)) {
        score += 3;
        reasons.push(`Prioritizes ${category} farmers.`);
      }

      // Land holding relevance
      if (!Number.isNaN(landAcres)) {
        if (landAcres > 0 && scheme.slug === 'pm-kisan') {
          score += 3;
          reasons.push(`Cultivable landholding (${landAcres} acres) aligns with landholder income support.`);
        }
        if (landAcres <= 5 && (scheme.slug === 'karnataka-krishi-yantradhare' || scheme.slug === 'kcc')) {
          score += 2;
          reasons.push('Designed to lower input and equipment costs for small & marginal holdings.');
        }
      }

      // Crop / Irrigation / Farming type relevance
      if (
        (irrigation.includes('rainfed') || irrigation.includes('none')) &&
        (scheme.slug === 'karnataka-krishi-bhagya' || scheme.slug === 'pmfby' || scheme.slug === 'pmksy-per-drop-more-crop')
      ) {
        score += 4;
        reasons.push('Supports rainfed water harvesting, micro-irrigation, and crop risk protection.');
      }
      if (
        (irrigation.includes('borewell') || irrigation.includes('pump') || irrigation.includes('drip')) &&
        (scheme.slug === 'pm-kusum' || scheme.slug === 'pmksy-per-drop-more-crop')
      ) {
        score += 4;
        reasons.push('Complements borewell/pump irrigation through solar power or micro-irrigation subsidies.');
      }
      if (crop && (scheme.slug === 'pmfby' || scheme.slug === 'soil-health-card' || scheme.slug === 'kcc')) {
        score += 2;
        reasons.push(`Supports seasonal cultivation, soil nutrient planning, and risk coverage for ${profile.mainCrop}.`);
      }
      if (farmingType.includes('organic') && scheme.slug === 'soil-health-card') {
        score += 2;
        reasons.push('Helps monitor organic carbon and soil fertility for organic cultivation.');
      }

      if (reasons.length === 0) {
        reasons.push('General agricultural support scheme worth reviewing.');
      }

      return { scheme, score, reasons };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

// Schemes API
app.get('/api/schemes', async (req, res) => {
  try {
    await ensureSeeded();
    const { search, level, category, state, farmerCategory, sort } = req.query;

    let rows = await db.select().from(schemes);

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.shortName.toLowerCase().includes(q) ||
          s.overview.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.benefits.toLowerCase().includes(q)
      );
    }
    if (level && typeof level === 'string' && level !== 'All') {
      rows = rows.filter((s) => s.governmentLevel.toLowerCase() === level.toLowerCase());
    }
    if (category && typeof category === 'string' && category !== 'All') {
      rows = rows.filter((s) => s.category.toLowerCase() === category.toLowerCase());
    }
    if (state && typeof state === 'string' && state !== 'All') {
      rows = rows.filter(
        (s) =>
          s.stateName.toLowerCase() === 'all india' ||
          s.stateName.toLowerCase() === state.toLowerCase()
      );
    }
    if (farmerCategory && typeof farmerCategory === 'string' && farmerCategory !== 'All') {
      rows = rows.filter((s) => s.targetCategories.includes(farmerCategory));
    }

    if (sort === 'name_asc') {
      rows.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name_desc') {
      rows.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      rows.sort((a, b) => Number(b.isPopular) - Number(a.isPopular) || a.id - b.id);
    }

    res.json({ schemes: rows });
  } catch (error) {
    console.error('List schemes error:', error);
    res.status(500).json({ error: 'Failed to load government schemes.' });
  }
});

app.get('/api/schemes/:idOrSlug', async (req, res) => {
  try {
    await ensureSeeded();
    const { idOrSlug } = req.params;
    const numericId = Number(idOrSlug);
    const rows =
      !Number.isNaN(numericId) && Number.isInteger(numericId)
        ? await db.select().from(schemes).where(eq(schemes.id, numericId)).limit(1)
        : await db.select().from(schemes).where(eq(schemes.slug, idOrSlug)).limit(1);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Scheme not found.' });
    }
    res.json({ scheme: rows[0] });
  } catch (error) {
    console.error('Get scheme error:', error);
    res.status(500).json({ error: 'Failed to load scheme details.' });
  }
});

app.post('/api/schemes/:id/view', requireAuth, async (req: AuthRequest, res) => {
  try {
    await ensureSeeded();
    const schemeId = Number(req.params.id);
    if (Number.isNaN(schemeId)) {
      return res.status(400).json({ error: 'Invalid scheme ID.' });
    }
    await db.insert(recentlyViewedSchemes).values({
      userId: req.dbUser!.id,
      schemeId,
    });
    res.json({ ok: true });
  } catch (error) {
    console.error('Track scheme view error:', error);
    res.status(500).json({ error: 'Failed to record scheme view.' });
  }
});

// Eligibility Checker
app.post('/api/eligibility/check', optionalAuth, async (req: AuthRequest, res) => {
  try {
    await ensureSeeded();
    const { schemeId, profileOverrides } = req.body ?? {};

    let profileData = {
      state: profileOverrides?.state ?? null,
      farmerCategory: profileOverrides?.farmerCategory ?? null,
      landHoldingAcres: profileOverrides?.landHoldingAcres ?? null,
      mainCrop: profileOverrides?.mainCrop ?? null,
      farmingType: profileOverrides?.farmingType ?? null,
    };

    if (req.dbUser && !profileOverrides) {
      const [stored] = await db
        .select()
        .from(farmerProfiles)
        .where(eq(farmerProfiles.userId, req.dbUser.id))
        .limit(1);
      if (stored) {
        profileData = {
          state: stored.state,
          farmerCategory: stored.farmerCategory,
          landHoldingAcres: stored.landHoldingAcres,
          mainCrop: stored.mainCrop,
          farmingType: stored.farmingType,
        };
      }
    }

    if (schemeId) {
      const [target] = await db
        .select()
        .from(schemes)
        .where(eq(schemes.id, Number(schemeId)))
        .limit(1);
      if (!target) {
        return res.status(404).json({ error: 'Scheme not found.' });
      }
      return res.json({
        results: [evaluateSchemeEligibility(target, profileData)],
      });
    }

    const allSchemes = await db.select().from(schemes);
    const results = allSchemes.map((s) => evaluateSchemeEligibility(s, profileData));
    res.json({ results });
  } catch (error) {
    console.error('Eligibility check error:', error);
    res.status(500).json({ error: 'Failed to evaluate preliminary eligibility.' });
  }
});

// Personalized Recommendations
app.get('/api/recommendations', requireAuth, async (req: AuthRequest, res) => {
  try {
    await ensureSeeded();
    const [profile] = await db
      .select()
      .from(farmerProfiles)
      .where(eq(farmerProfiles.userId, req.dbUser!.id))
      .limit(1);

    const allSchemes = await db.select().from(schemes);
    const recommendations = buildRecommendations(allSchemes, profile ?? null);

    res.json({
      profileComplete: Boolean(
        profile?.state && profile?.farmerCategory && profile?.mainCrop
      ),
      recommendations,
      disclaimer:
        'Recommendations are informational based on your profile details and do not guarantee scheme approval or benefit disbursement.',
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations.' });
  }
});

// Agriculture Information Module
app.get('/api/agriculture', async (req, res) => {
  try {
    await ensureSeeded();
    const { section } = req.query;
    const rows =
      section && typeof section === 'string' && section !== 'all'
        ? await db
            .select()
            .from(agricultureItems)
            .where(eq(agricultureItems.section, section))
        : await db.select().from(agricultureItems);
    res.json({ items: rows });
  } catch (error) {
    console.error('Agriculture items error:', error);
    res.status(500).json({ error: 'Failed to load agriculture information.' });
  }
});

// Contact Message
app.post('/api/contact', async (req, res) => {
  try {
    await ensureSeeded();
    const { name, email, phone, subject, message } = req.body ?? {};
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Name, email, subject, and message are required.' });
    }
    const [saved] = await db
      .insert(contactMessages)
      .values({
        name: String(name).trim(),
        email: String(email).trim(),
        phone: phone ? String(phone).trim() : null,
        subject: String(subject).trim(),
        message: String(message).trim(),
      })
      .returning();
    res.status(201).json({
      id: saved.id,
      message: 'Your inquiry has been recorded. Thank you for contacting the platform.',
    });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

// AI Chatbot History & Message
app.get('/api/chatbot/history', optionalAuth, async (req: AuthRequest, res) => {
  try {
    await ensureSeeded();
    const sessionKey = String(req.query.sessionKey || 'default');
    const convs = req.dbUser
      ? await db
          .select()
          .from(chatConversations)
          .where(eq(chatConversations.userId, req.dbUser.id))
          .orderBy(desc(chatConversations.createdAt))
          .limit(1)
      : await db
          .select()
          .from(chatConversations)
          .where(eq(chatConversations.sessionKey, sessionKey))
          .orderBy(desc(chatConversations.createdAt))
          .limit(1);

    if (convs.length === 0) {
      return res.json({ messages: [] });
    }

    const msgs = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, convs[0].id))
      .orderBy(chatMessages.id);

    res.json({ messages: msgs });
  } catch (error) {
    console.error('Chatbot history error:', error);
    res.status(500).json({ error: 'Failed to load conversation history.' });
  }
});

app.post('/api/chatbot/message', optionalAuth, async (req: AuthRequest, res) => {
  try {
    await ensureSeeded();
    const { message, language = 'en', sessionKey = 'default' } = req.body ?? {};
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error:
          'AI Assistant service is temporarily unavailable because GEMINI_API_KEY is not configured in the server environment.',
      });
    }

    // Find or create conversation
    let conversationId: number;
    const existingConvs = req.dbUser
      ? await db
          .select()
          .from(chatConversations)
          .where(eq(chatConversations.userId, req.dbUser.id))
          .orderBy(desc(chatConversations.createdAt))
          .limit(1)
      : await db
          .select()
          .from(chatConversations)
          .where(eq(chatConversations.sessionKey, String(sessionKey)))
          .orderBy(desc(chatConversations.createdAt))
          .limit(1);

    if (existingConvs.length > 0) {
      conversationId = existingConvs[0].id;
    } else {
      const [createdConv] = await db
        .insert(chatConversations)
        .values({
          userId: req.dbUser?.id ?? null,
          sessionKey: String(sessionKey),
          title: 'Farmer Assistant Chat',
        })
        .returning();
      conversationId = createdConv.id;
    }

    // Load recent conversation history for context
    const recentMsgs = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(desc(chatMessages.id))
      .limit(8);

    // Save user message
    await db.insert(chatMessages).values({
      conversationId,
      role: 'user',
      content: message.trim(),
    });

    // Build verified knowledge base context from PostgreSQL
    const [allSchemes, allAgri] = await Promise.all([
      db.select().from(schemes),
      db.select().from(agricultureItems),
    ]);

    const schemeContext = allSchemes
      .map(
        (s) =>
          `- ${s.name} (${s.governmentLevel}, ${s.stateName}, Category: ${s.category})\n  Benefits: ${s.benefits}\n  Eligibility: ${s.eligibilitySummary}\n  Documents: ${s.requiredDocuments.join(', ')}\n  Steps: ${s.applicationProcedure.join(' -> ')}\n  Official Portal: ${s.officialUrl}`
      )
      .join('\n');

    const agriContext = allAgri
      .map(
        (a) =>
          `- [${a.section.toUpperCase()}] ${a.title}: ${a.summary} Highlights: ${a.highlights.join('; ')}`
      )
      .join('\n');

    const langLabel =
      language === 'hi' ? 'Hindi' : language === 'kn' ? 'Kannada' : 'English';

    const historyText = recentMsgs
      .reverse()
      .map((m) => `${m.role === 'user' ? 'Farmer' : 'Assistant'}: ${m.content}`)
      .join('\n');

    const systemInstruction = `You are the verified Farmer Assistant for the independent educational "Farmer Scheme Assistance & Information Platform".
Answer the user's question in ${langLabel} using simple, respectful, clear farmer-friendly language.
STRICT GROUNDING RULES:
1. Rely ONLY on the VERIFIED KNOWLEDGE BASE below for government scheme benefits, eligibility, documents, and official links.
2. NEVER invent scheme amounts, deadlines, subsidy percentages, or portal URLs.
3. If a question asks about a scheme, deadline, state-specific subsidy amount, or detail NOT present in the VERIFIED KNOWLEDGE BASE, clearly state that you cannot verify that information from the platform's knowledge base and direct the farmer to check official government portals (such as myscheme.gov.in, pmkisan.gov.in, pmfby.gov.in, or raitamitra.karnataka.gov.in) or their nearest Raitha Samparka Kendra / CSC.
4. Always remind farmers when relevant that final eligibility is determined by the official government department.

VERIFIED SCHEMES KNOWLEDGE BASE:
${schemeContext}

VERIFIED AGRICULTURE INFORMATION KNOWLEDGE BASE:
${agriContext}`;

    const promptContent = historyText
      ? `Previous conversation:\n${historyText}\n\nFarmer: ${message.trim()}`
      : `Farmer: ${message.trim()}`;

    const response = await ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: promptContent,
      config: {
        systemInstruction,
      },
    });

    const replyText =
      response.text?.trim() ||
      'I could not generate a verified response right now. Please check official portals like myscheme.gov.in or try again.';

    await db.insert(chatMessages).values({
      conversationId,
      role: 'assistant',
      content: replyText,
    });

    res.json({ reply: replyText });
  } catch (error) {
    console.error('Chatbot message error:', error);
    res.status(500).json({
      error: 'Unable to reach the Farmer Assistant right now. Please try again in a moment.',
    });
  }
});

// Admin Protected Routes
app.get('/api/admin/overview', requireAuth, requireAdmin, async (_req, res) => {
  try {
    await ensureSeeded();
    const [farmerRows, schemeRows, agriRows, inquiryRows] = await Promise.all([
      db
        .select({
          id: users.id,
          email: users.email,
          fullName: users.fullName,
          mobileNumber: users.mobileNumber,
          role: users.role,
          createdAt: users.createdAt,
          state: farmerProfiles.state,
          district: farmerProfiles.district,
          farmerCategory: farmerProfiles.farmerCategory,
          mainCrop: farmerProfiles.mainCrop,
        })
        .from(users)
        .leftJoin(farmerProfiles, eq(users.id, farmerProfiles.userId))
        .orderBy(desc(users.createdAt)),
      db.select().from(schemes).orderBy(schemes.id),
      db.select().from(agricultureItems).orderBy(agricultureItems.id),
      db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt)).limit(25),
    ]);

    res.json({
      farmers: farmerRows,
      schemes: schemeRows,
      agricultureItems: agriRows,
      inquiries: inquiryRows,
    });
  } catch (error) {
    console.error('Admin overview error:', error);
    res.status(500).json({ error: 'Failed to load admin overview.' });
  }
});

app.post('/api/admin/schemes', requireAuth, requireAdmin, async (req, res) => {
  try {
    await ensureSeeded();
    const body = req.body ?? {};
    if (!body.name || !body.shortName || !body.governmentLevel || !body.category || !body.overview || !body.benefits || !body.officialUrl) {
      return res.status(400).json({ error: 'Missing required scheme fields.' });
    }
    const slug =
      body.slug ||
      String(body.shortName)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
        '-' +
        Date.now().toString().slice(-4);

    const [created] = await db
      .insert(schemes)
      .values({
        slug,
        name: String(body.name).trim(),
        shortName: String(body.shortName).trim(),
        governmentLevel: body.governmentLevel === 'Karnataka' ? 'Karnataka' : 'Central',
        stateName: String(body.stateName || (body.governmentLevel === 'Karnataka' ? 'Karnataka' : 'All India')).trim(),
        category: String(body.category).trim(),
        targetCategories: Array.isArray(body.targetCategories) && body.targetCategories.length > 0
          ? body.targetCategories
          : ['Marginal (< 1 ha)', 'Small (1-2 ha)'],
        overview: String(body.overview).trim(),
        objectives: Array.isArray(body.objectives) ? body.objectives : [String(body.overview).trim()],
        benefits: String(body.benefits).trim(),
        eligibilitySummary: String(body.eligibilitySummary || 'Refer to official portal guidelines.').trim(),
        eligibilityRules: body.eligibilityRules || {
          states: [body.governmentLevel === 'Karnataka' ? 'Karnataka' : 'All India'],
          notes: ['Verify official department criteria before applying.'],
        },
        requiredDocuments: Array.isArray(body.requiredDocuments)
          ? body.requiredDocuments
          : ['Aadhaar Card', 'Land Record', 'Bank Passbook'],
        applicationProcedure: Array.isArray(body.applicationProcedure)
          ? body.applicationProcedure
          : ['Visit the official government portal and follow registration steps.'],
        officialUrl: String(body.officialUrl).trim(),
        lastVerifiedDate: String(body.lastVerifiedDate || new Date().toISOString().slice(0, 10)),
        isPopular: Boolean(body.isPopular),
      })
      .returning();

    res.status(201).json({ scheme: created });
  } catch (error) {
    console.error('Admin create scheme error:', error);
    res.status(500).json({ error: 'Failed to create scheme.' });
  }
});

app.put('/api/admin/schemes/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid scheme ID.' });
    const body = req.body ?? {};
    const [updated] = await db
      .update(schemes)
      .set({
        ...(body.name ? { name: String(body.name).trim() } : {}),
        ...(body.shortName ? { shortName: String(body.shortName).trim() } : {}),
        ...(body.governmentLevel ? { governmentLevel: String(body.governmentLevel) } : {}),
        ...(body.stateName ? { stateName: String(body.stateName).trim() } : {}),
        ...(body.category ? { category: String(body.category).trim() } : {}),
        ...(body.overview ? { overview: String(body.overview).trim() } : {}),
        ...(body.benefits ? { benefits: String(body.benefits).trim() } : {}),
        ...(body.eligibilitySummary ? { eligibilitySummary: String(body.eligibilitySummary).trim() } : {}),
        ...(body.officialUrl ? { officialUrl: String(body.officialUrl).trim() } : {}),
        ...(body.lastVerifiedDate ? { lastVerifiedDate: String(body.lastVerifiedDate).trim() } : {}),
        ...(typeof body.isPopular === 'boolean' ? { isPopular: body.isPopular } : {}),
      })
      .where(eq(schemes.id, id))
      .returning();

    if (!updated) return res.status(404).json({ error: 'Scheme not found.' });
    res.json({ scheme: updated });
  } catch (error) {
    console.error('Admin update scheme error:', error);
    res.status(500).json({ error: 'Failed to update scheme.' });
  }
});

app.delete('/api/admin/schemes/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid scheme ID.' });
    await db.delete(schemes).where(eq(schemes.id, id));
    res.json({ ok: true });
  } catch (error) {
    console.error('Admin delete scheme error:', error);
    res.status(500).json({ error: 'Failed to delete scheme.' });
  }
});

app.post('/api/admin/agriculture', requireAuth, requireAdmin, async (req, res) => {
  try {
    const body = req.body ?? {};
    if (!body.section || !body.title || !body.summary) {
      return res.status(400).json({ error: 'Section, title, and summary are required.' });
    }
    const slug =
      String(body.title)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now().toString().slice(-4);

    const [created] = await db
      .insert(agricultureItems)
      .values({
        slug,
        section: String(body.section),
        title: String(body.title).trim(),
        subtitle: String(body.subtitle || 'Agricultural Resource').trim(),
        summary: String(body.summary).trim(),
        details: body.details && typeof body.details === 'object' ? body.details : { Guidance: String(body.summary).trim() },
        highlights: Array.isArray(body.highlights) ? body.highlights : [],
      })
      .returning();
    res.status(201).json({ item: created });
  } catch (error) {
    console.error('Admin create agri item error:', error);
    res.status(500).json({ error: 'Failed to create agriculture item.' });
  }
});

app.delete('/api/admin/agriculture/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ error: 'Invalid ID.' });
    await db.delete(agricultureItems).where(eq(agricultureItems.id, id));
    res.json({ ok: true });
  } catch (error) {
    console.error('Admin delete agri item error:', error);
    res.status(500).json({ error: 'Failed to delete agriculture item.' });
  }
});

async function startServer() {
  const PORT = Number(process.env.PORT || 3000);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      const indexFile = path.join(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build not found');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
