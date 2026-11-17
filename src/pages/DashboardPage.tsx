import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UserCheck,
  Sparkles,
  History,
  CheckCircle2,
  Sprout,
  Bot,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchDashboard, updateFarmerProfile } from '../services/api';
import type { RecommendationItem, Scheme } from '../types';

export const DashboardPage: React.FC = () => {
  const { user, profile, token, loading: authLoading, setProfileState } = useAuth();

  const [tab, setTab] = useState<'overview' | 'profile' | 'recommendations'>('overview');
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Scheme[]>([]);
  const [loadingDash, setLoadingDash] = useState(true);

  // Profile Form State
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [state, setState] = useState('Karnataka');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [farmerCategory, setFarmerCategory] = useState('Small (1-2 ha)');
  const [landHoldingAcres, setLandHoldingAcres] = useState('');
  const [mainCrop, setMainCrop] = useState('');
  const [irrigationAvailability, setIrrigationAvailability] = useState('Rainfed');
  const [farmingType, setFarmingType] = useState('Traditional / Rainfed');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  const loadData = async (authToken: string) => {
    setLoadingDash(true);
    try {
      const data = await fetchDashboard(authToken);
      setRecommendations(data.recommendations || []);
      setRecentlyViewed(data.recentlyViewed || []);
      if (data.profile) {
        setProfileState(data.profile);
        setFullName(data.profile.fullName || '');
        setAge(data.profile.age ? String(data.profile.age) : '');
        setGender(data.profile.gender || '');
        setState(data.profile.state || 'Karnataka');
        setDistrict(data.profile.district || '');
        setVillage(data.profile.village || '');
        setFarmerCategory(data.profile.farmerCategory || 'Small (1-2 ha)');
        setLandHoldingAcres(data.profile.landHoldingAcres || '');
        setMainCrop(data.profile.mainCrop || '');
        setIrrigationAvailability(data.profile.irrigationAvailability || 'Rainfed');
        setFarmingType(data.profile.farmingType || 'Traditional / Rainfed');
      }
    } finally {
      setLoadingDash(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData(token);
    }
  }, [token]);

  useEffect(() => {
    if (profile && !fullName) {
      setFullName(profile.fullName || user?.fullName || '');
    }
  }, [profile, user, fullName]);

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-64 bg-white border border-[#E5E7EB] rounded-md animate-pulse" />
      </div>
    );
  }

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    setSaveErr(null);
    try {
      const updated = await updateFarmerProfile(
        {
          fullName,
          age: age ? Number(age) : null,
          gender,
          state,
          district,
          village,
          farmerCategory,
          landHoldingAcres,
          mainCrop,
          irrigationAvailability,
          farmingType,
        },
        token
      );
      setProfileState(updated);
      setSaveMsg('Farmer profile saved to PostgreSQL. Recommendations updated.');
      await loadData(token);
    } catch (err) {
      setSaveErr(err instanceof Error ? err.message : 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <aside className="lg:col-span-3">
          <div className="bg-white border border-[#E5E7EB] rounded-md p-4">
            <div className="pb-4 border-b border-[#E5E7EB]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#F47721]">
                Farmer Account
              </p>
              <h2 className="mt-1 text-lg font-bold text-[#17613A] truncate">
                {profile?.fullName || user.fullName}
              </h2>
              <p className="text-xs text-[#303030]/75 truncate">{user.email}</p>
            </div>

            <nav className="mt-4 flex flex-row lg:flex-col gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => setTab('overview')}
                className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded text-left whitespace-nowrap ${
                  tab === 'overview'
                    ? 'bg-[#17613A] text-white'
                    : 'text-[#303030] hover:bg-[#F5F8F5]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Dashboard Overview</span>
              </button>

              <button
                type="button"
                onClick={() => setTab('profile')}
                className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded text-left whitespace-nowrap ${
                  tab === 'profile'
                    ? 'bg-[#17613A] text-white'
                    : 'text-[#303030] hover:bg-[#F5F8F5]'
                }`}
              >
                <UserCheck className="w-4 h-4 shrink-0" />
                <span>Farmer Profile</span>
              </button>

              <button
                type="button"
                onClick={() => setTab('recommendations')}
                className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded text-left whitespace-nowrap ${
                  tab === 'recommendations'
                    ? 'bg-[#17613A] text-white'
                    : 'text-[#303030] hover:bg-[#F5F8F5]'
                }`}
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Recommendations</span>
              </button>

              <Link
                to="/eligibility"
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded text-[#303030] hover:bg-[#F5F8F5] whitespace-nowrap"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#207747]" />
                <span>Eligibility Checker</span>
              </Link>

              <Link
                to="/agriculture/crop"
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded text-[#303030] hover:bg-[#F5F8F5] whitespace-nowrap"
              >
                <Sprout className="w-4 h-4 shrink-0 text-[#207747]" />
                <span>Agriculture Guides</span>
              </Link>

              <Link
                to="/chatbot"
                className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium rounded text-[#303030] hover:bg-[#F5F8F5] whitespace-nowrap"
              >
                <Bot className="w-4 h-4 shrink-0 text-[#F47721]" />
                <span>AI Assistant</span>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">
          {tab === 'overview' && (
            <>
              <div className="bg-white border border-[#E5E7EB] rounded-md p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-[#17613A]">
                      Welcome, {profile?.fullName || user.fullName}
                    </h1>
                    <p className="mt-1 text-sm text-[#303030]/85">
                      {profile?.state && profile?.mainCrop
                        ? `${profile.state}${profile.district ? ` · ${profile.district}` : ''} · ${profile.farmerCategory || ''} · Main Crop: ${profile.mainCrop}`
                        : 'Complete your Farmer Profile to unlock tailored scheme recommendations and instant eligibility checks.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTab('profile')}
                    className="px-4 py-2 bg-[#F47721] hover:bg-[#d96312] text-white text-sm font-semibold rounded whitespace-nowrap"
                  >
                    {profile?.state ? 'Edit Profile' : 'Complete Farmer Profile'}
                  </button>
                </div>
              </div>

              {/* Recommended Schemes */}
              <div className="bg-white border border-[#E5E7EB] rounded-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#17613A]">
                    Recommended Schemes for You
                  </h2>
                  <button
                    type="button"
                    onClick={() => setTab('recommendations')}
                    className="text-xs font-bold text-[#F47721] hover:underline"
                  >
                    View All Recommendations
                  </button>
                </div>

                {loadingDash ? (
                  <div className="h-32 bg-[#F5F8F5] rounded animate-pulse" />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.slice(0, 4).map((rec) => (
                      <div
                        key={rec.scheme.id}
                        className="border border-[#E5E7EB] rounded p-4 bg-[#F5F8F5]"
                      >
                        <div className="text-xs font-semibold text-[#207747]">
                          {rec.scheme.governmentLevel} · {rec.scheme.category}
                        </div>
                        <h3 className="mt-1 text-base font-bold text-[#17613A]">
                          {rec.scheme.name}
                        </h3>
                        <ul className="mt-2 space-y-1 text-xs text-[#303030]/90 list-disc pl-4">
                          {rec.reasons.slice(0, 2).map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                        <div className="mt-3 flex items-center gap-3">
                          <Link
                            to={`/schemes/${rec.scheme.slug}`}
                            className="text-xs font-bold text-[#17613A] hover:underline"
                          >
                            View Details
                          </Link>
                          <a
                            href={rec.scheme.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#F47721] hover:underline"
                          >
                            <span>Official Site</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="mt-4 text-xs text-[#303030]/70">
                  Note: Recommendations are informational based on your profile and do not guarantee scheme approval.
                </p>
              </div>

              {/* Recently Viewed Schemes */}
              <div className="bg-white border border-[#E5E7EB] rounded-md p-6">
                <div className="flex items-center gap-2 mb-4">
                  <History className="w-4 h-4 text-[#17613A]" />
                  <h2 className="text-lg font-bold text-[#17613A]">
                    Recently Viewed Schemes
                  </h2>
                </div>
                {recentlyViewed.length === 0 ? (
                  <p className="text-sm text-[#303030]/75">
                    No schemes viewed yet.{' '}
                    <Link to="/schemes" className="text-[#F47721] font-semibold hover:underline">
                      Browse Government Schemes
                    </Link>
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {recentlyViewed.map((s) => (
                      <Link
                        key={s.id}
                        to={`/schemes/${s.slug}`}
                        className="border border-[#E5E7EB] hover:border-[#17613A] rounded p-3.5 transition-colors"
                      >
                        <div className="text-[11px] font-semibold text-[#207747]">
                          {s.governmentLevel}
                        </div>
                        <div className="mt-0.5 text-sm font-bold text-[#17613A] line-clamp-2">
                          {s.shortName}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {tab === 'profile' && (
            <form
              onSubmit={handleSaveProfile}
              className="bg-white border border-[#E5E7EB] rounded-md p-6"
            >
              <h2 className="text-xl font-extrabold text-[#17613A]">
                Farmer Profile Details
              </h2>
              <p className="mt-1 text-sm text-[#303030]/80">
                Only information needed for scheme recommendations and preliminary eligibility checking is collected.
              </p>

              {saveMsg && (
                <div className="mt-4 bg-[#F5F8F5] border border-[#207747]/40 text-[#17613A] text-xs rounded p-3">
                  {saveMsg}
                </div>
              )}
              {saveErr && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded p-3">
                  {saveErr}
                </div>
              )}

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17613A] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17613A] mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    min={18}
                    max={110}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g., 42"
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17613A] mb-1">
                    Gender (Optional)
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded bg-white"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17613A] mb-1">
                    State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded bg-white"
                  >
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Other State">Other State</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17613A] mb-1">
                    District
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="e.g., Mandya / Tumakuru"
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17613A] mb-1">
                    Village / Taluk
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g., Maddur"
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17613A] mb-1">
                    Farmer Category
                  </label>
                  <select
                    value={farmerCategory}
                    onChange={(e) => setFarmerCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded bg-white"
                  >
                    <option value="Marginal (< 1 ha)">Marginal (&lt; 1 ha)</option>
                    <option value="Small (1-2 ha)">Small (1-2 ha)</option>
                    <option value="Semi-Medium (2-4 ha)">Semi-Medium (2-4 ha)</option>
                    <option value="Medium (4-10 ha)">Medium (4-10 ha)</option>
                    <option value="Large (> 10 ha)">Large (&gt; 10 ha)</option>
                    <option value="Landless / Tenant">Landless / Tenant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17613A] mb-1">
                    Land Holding (Acres)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={landHoldingAcres}
                    onChange={(e) => setLandHoldingAcres(e.target.value)}
                    placeholder="e.g., 2.5"
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17613A] mb-1">
                    Main Crop
                  </label>
                  <input
                    type="text"
                    value={mainCrop}
                    onChange={(e) => setMainCrop(e.target.value)}
                    placeholder="e.g., Ragi, Paddy, Sugarcane"
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17613A] mb-1">
                    Irrigation Availability
                  </label>
                  <select
                    value={irrigationAvailability}
                    onChange={(e) => setIrrigationAvailability(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded bg-white"
                  >
                    <option value="Rainfed">Rainfed Only</option>
                    <option value="Borewell / Pump">Borewell / Pump</option>
                    <option value="Canal">Canal Irrigation</option>
                    <option value="Drip / Sprinkler">Drip / Sprinkler</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17613A] mb-1">
                    Farming Type
                  </label>
                  <select
                    value={farmingType}
                    onChange={(e) => setFarmingType(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded bg-white"
                  >
                    <option value="Traditional / Rainfed">Traditional / Rainfed</option>
                    <option value="Irrigated">Irrigated</option>
                    <option value="Organic">Organic</option>
                    <option value="Mixed (Organic & Modern)">Mixed (Organic &amp; Modern)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#17613A] hover:bg-[#207747] disabled:opacity-60 text-white text-sm font-semibold rounded"
                >
                  {saving ? 'Saving Profile...' : 'Save Farmer Profile'}
                </button>
              </div>
            </form>
          )}

          {tab === 'recommendations' && (
            <div className="bg-white border border-[#E5E7EB] rounded-md p-6">
              <h2 className="text-xl font-extrabold text-[#17613A]">
                Personalized Scheme Recommendations
              </h2>
              <p className="mt-1 text-sm text-[#303030]/80">
                Matched against your saved State, Farmer Category, Land Holding, Crop, and Irrigation details. Recommendations do not guarantee approval.
              </p>

              <div className="mt-5 space-y-4">
                {recommendations.map((rec) => (
                  <div
                    key={rec.scheme.id}
                    className="border border-[#E5E7EB] rounded p-5 bg-[#F5F8F5]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-semibold text-[#207747]">
                          {rec.scheme.governmentLevel} · {rec.scheme.category}
                        </span>
                        <h3 className="text-lg font-bold text-[#17613A]">
                          {rec.scheme.name}
                        </h3>
                      </div>
                      <Link
                        to={`/schemes/${rec.scheme.slug}`}
                        className="px-4 py-2 bg-[#17613A] text-white text-xs font-semibold rounded whitespace-nowrap self-start sm:self-center"
                      >
                        View Scheme Details
                      </Link>
                    </div>
                    <p className="mt-2 text-sm text-[#303030]">{rec.scheme.benefits}</p>
                    <div className="mt-3 pt-3 border-t border-[#E5E7EB]">
                      <p className="text-xs font-bold text-[#17613A]">Why recommended:</p>
                      <ul className="mt-1 space-y-1 text-xs text-[#303030]/90 list-disc pl-4">
                        {rec.reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
