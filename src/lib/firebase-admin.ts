import { getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import firebaseConfig from '../../firebase-applet-config.json' with { type: 'json' };

if (!getApps().length) {
  initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

export const adminAuth = getAuth();
export const firebaseProjectId = firebaseConfig.projectId;
export const sessionSigningKey =
  process.env.SESSION_SECRET ||
  process.env.SQL_PASSWORD ||
  firebaseConfig.apiKey;
