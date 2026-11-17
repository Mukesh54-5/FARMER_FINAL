import type {
  AgricultureItem,
  ChatMessageItem,
  EligibilityResult,
  FarmerProfile,
  RecommendationItem,
  Scheme,
} from '../types';

function authHeaders(token?: string | null): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function fetchSchemes(params?: {
  search?: string;
  level?: string;
  category?: string;
  state?: string;
  farmerCategory?: string;
  sort?: string;
}): Promise<Scheme[]> {
  const qs = new URLSearchParams();
  if (params?.search) qs.set('search', params.search);
  if (params?.level && params.level !== 'All') qs.set('level', params.level);
  if (params?.category && params.category !== 'All') qs.set('category', params.category);
  if (params?.state && params.state !== 'All') qs.set('state', params.state);
  if (params?.farmerCategory && params.farmerCategory !== 'All')
    qs.set('farmerCategory', params.farmerCategory);
  if (params?.sort) qs.set('sort', params.sort);

  const res = await fetch(`/api/schemes?${qs.toString()}`);
  if (!res.ok) throw new Error('Failed to load government schemes');
  const data = await res.json();
  return data.schemes;
}

export async function fetchSchemeBySlugOrId(idOrSlug: string): Promise<Scheme> {
  const res = await fetch(`/api/schemes/${encodeURIComponent(idOrSlug)}`);
  if (!res.ok) throw new Error('Scheme not found');
  const data = await res.json();
  return data.scheme;
}

export async function recordSchemeView(schemeId: number, token: string): Promise<void> {
  await fetch(`/api/schemes/${schemeId}/view`, {
    method: 'POST',
    headers: authHeaders(token),
  }).catch(() => {});
}

export async function checkEligibility(
  payload: {
    schemeId?: number;
    profileOverrides?: {
      state?: string;
      farmerCategory?: string;
      landHoldingAcres?: string;
      mainCrop?: string;
      farmingType?: string;
    };
  },
  token?: string | null
): Promise<EligibilityResult[]> {
  const res = await fetch('/api/eligibility/check', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to evaluate eligibility');
  const data = await res.json();
  return data.results;
}

export async function fetchDashboard(token: string): Promise<{
  profile: FarmerProfile | null;
  recentlyViewed: Scheme[];
  recommendations: RecommendationItem[];
}> {
  const res = await fetch('/api/dashboard', {
    headers: authHeaders(token),
  });
  if (!res.ok) throw new Error('Failed to load dashboard');
  return res.json();
}

export async function updateFarmerProfile(
  profile: Partial<FarmerProfile> & { fullName: string; mobileNumber?: string },
  token: string
): Promise<FarmerProfile> {
  const res = await fetch('/api/profile', {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(profile),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update profile');
  return data.profile;
}

export async function fetchAgricultureItems(section = 'all'): Promise<AgricultureItem[]> {
  const res = await fetch(`/api/agriculture?section=${encodeURIComponent(section)}`);
  if (!res.ok) throw new Error('Failed to load agriculture information');
  const data = await res.json();
  return data.items;
}

export async function sendContactMessage(payload: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<{ message: string }> {
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to send message');
  return data;
}

export async function fetchChatHistory(
  sessionKey: string,
  token?: string | null
): Promise<ChatMessageItem[]> {
  const res = await fetch(`/api/chatbot/history?sessionKey=${encodeURIComponent(sessionKey)}`, {
    headers: authHeaders(token),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.messages || [];
}

export async function sendChatMessage(
  payload: { message: string; language: string; sessionKey: string },
  token?: string | null
): Promise<string> {
  const res = await fetch('/api/chatbot/message', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to get response');
  return data.reply;
}
