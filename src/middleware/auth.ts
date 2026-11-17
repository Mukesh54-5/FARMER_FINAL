import crypto from 'crypto';
import type { NextFunction, Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { adminAuth, sessionSigningKey } from '../lib/firebase-admin.ts';
import { db } from '../db/index.ts';
import { users } from '../db/schema.ts';
import { getOrCreateFirebaseUser } from '../db/users.ts';

export interface AuthenticatedDbUser {
  id: number;
  uid: string;
  email: string;
  fullName: string;
  mobileNumber: string | null;
  role: string;
}

export interface AuthRequest extends Request {
  dbUser?: AuthenticatedDbUser;
}

interface SessionPayload {
  uid: string;
  email: string;
  exp: number;
}

export function createSessionToken(uid: string, email: string): string {
  const payload: SessionPayload = {
    uid,
    email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto
    .createHmac('sha256', sessionSigningKey)
    .update(encoded)
    .digest('base64url');
  return `local.${encoded}.${sig}`;
}

function verifyLocalSessionToken(token: string): SessionPayload | null {
  if (!token.startsWith('local.')) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [, encoded, sig] = parts;
  const expectedSig = crypto
    .createHmac('sha256', sessionSigningKey)
    .update(encoded)
    .digest('base64url');
  if (
    sig.length !== expectedSig.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))
  ) {
    return null;
  }
  try {
    const parsed = JSON.parse(
      Buffer.from(encoded, 'base64url').toString('utf8')
    ) as SessionPayload;
    if (!parsed.uid || !parsed.email || parsed.exp < Date.now()) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

async function resolveUserFromToken(
  token: string
): Promise<AuthenticatedDbUser | null> {
  if (token.startsWith('local.')) {
    const payload = verifyLocalSessionToken(token);
    if (!payload) return null;
    const rows = await db
      .select({
        id: users.id,
        uid: users.uid,
        email: users.email,
        fullName: users.fullName,
        mobileNumber: users.mobileNumber,
        role: users.role,
      })
      .from(users)
      .where(eq(users.uid, payload.uid))
      .limit(1);
    return rows[0] ?? null;
  }

  const decoded = await adminAuth.verifyIdToken(token);
  const email = decoded.email || `${decoded.uid}@farmer.local`;
  const userRecord = await getOrCreateFirebaseUser(
    decoded.uid,
    email,
    decoded.name || undefined
  );
  return {
    id: userRecord.id,
    uid: userRecord.uid,
    email: userRecord.email,
    fullName: userRecord.fullName,
    mobileNumber: userRecord.mobileNumber,
    role: userRecord.role,
  };
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please sign in.' });
  }
  const token = authHeader.slice('Bearer '.length).trim();
  try {
    const dbUser = await resolveUserFromToken(token);
    if (!dbUser) {
      return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
    }
    req.dbUser = dbUser;
    next();
  } catch (error) {
    console.error('Auth verification failed:', error);
    return res.status(401).json({ error: 'Invalid authentication token.' });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length).trim();
    try {
      const dbUser = await resolveUserFromToken(token);
      if (dbUser) {
        req.dbUser = dbUser;
      }
    } catch {
      // Proceed anonymously if optional token is invalid
    }
  }
  next();
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.dbUser) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  if (req.dbUser.role !== 'admin') {
    return res.status(403).json({ error: 'Admin permissions required for this action.' });
  }
  next();
};
