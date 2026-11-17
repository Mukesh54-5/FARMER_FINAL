export interface AuthUser {
  id: number;
  uid: string;
  email: string;
  fullName: string;
  mobileNumber?: string | null;
  role: string;
}

export interface FarmerProfile {
  id: number;
  userId: number;
  fullName: string;
  age?: number | null;
  gender?: string | null;
  state?: string | null;
  district?: string | null;
  village?: string | null;
  farmerCategory?: string | null;
  landHoldingAcres?: string | null;
  mainCrop?: string | null;
  irrigationAvailability?: string | null;
  farmingType?: string | null;
}

export interface EligibilityRules {
  states?: string[];
  farmerCategories?: string[];
  maxLandAcres?: number;
  minLandAcres?: number;
  farmingTypes?: string[];
  notes: string[];
}

export interface Scheme {
  id: number;
  slug: string;
  name: string;
  shortName: string;
  governmentLevel: 'Central' | 'Karnataka' | string;
  stateName: string;
  category: string;
  targetCategories: string[];
  overview: string;
  objectives: string[];
  benefits: string;
  eligibilitySummary: string;
  eligibilityRules: EligibilityRules;
  requiredDocuments: string[];
  applicationProcedure: string[];
  officialUrl: string;
  lastVerifiedDate: string;
  isPopular: boolean;
}

export interface AgricultureItem {
  id: number;
  slug: string;
  section: 'crop' | 'soil' | 'animal' | 'organic' | 'inorganic' | 'technology' | string;
  title: string;
  subtitle: string;
  summary: string;
  details: Record<string, string>;
  highlights: string[];
}

export interface EligibilityResult {
  schemeId: number;
  slug: string;
  schemeName: string;
  shortName: string;
  officialUrl: string;
  status: 'eligible' | 'not_eligible' | 'more_info';
  headline: string;
  reasons: string[];
  missingFields: string[];
  notes: string[];
  disclaimer: string;
}

export interface RecommendationItem {
  scheme: Scheme;
  score: number;
  reasons: string[];
}

export interface ChatMessageItem {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}
