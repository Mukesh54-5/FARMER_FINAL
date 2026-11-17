import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, HelpCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { checkEligibility, fetchSchemes } from '../services/api';
import type { EligibilityResult, Scheme } from '../types';

export const EligibilityPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { profile, token } = useAuth();

  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>(
    searchParams.get('schemeId') || 'all'
  );
  const [state, setState] = useState(profile?.state || 'Karnataka');
  const [farmerCategory, setFarmerCategory] = useState(
    profile?.farmerCategory || 'Small (1-2 ha)'
  );
  const [landHoldingAcres, setLandHoldingAcres] = useState(
    profile?.landHoldingAcres || '2.5'
  );
  const [mainCrop, setMainCrop] = useState(profile?.mainCrop || 'Ragi');
  const [farmingType, setFarmingType] = useState(
    profile?.farmingType || 'Traditional / Rainfed'
  );

  const [results, setResults] = useState<EligibilityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSchemes()
      .then(setSchemes)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (profile) {
      if (profile.state) setState(profile.state);
      if (profile.farmerCategory) setFarmerCategory(profile.farmerCategory);
      if (profile.landHoldingAcres) setLandHoldingAcres(profile.landHoldingAcres);
      if (profile.mainCrop) setMainCrop(profile.mainCrop);
      if (profile.farmingType) setFarmingType(profile.farmingType);
    }
  }, [profile]);

  const handleCheck = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await checkEligibility(
        {
          schemeId: selectedSchemeId !== 'all' ? Number(selectedSchemeId) : undefined,
          profileOverrides: {
            state,
            farmerCategory,
            landHoldingAcres,
            mainCrop,
            farmingType,
          },
        },
        token
      );
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to evaluate eligibility.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-[#F47721]">
          Preliminary Informational Assessment
        </span>
        <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#17613A]">
          Government Scheme Eligibility Checker
        </h1>
        <p className="mt-2 text-sm sm:text-base text-[#303030]/85 max-w-3xl">
          Compare your farming profile details against stored scheme rules. This provides a preliminary informational check; final eligibility is determined solely by the relevant government department.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleCheck}
        className="bg-white border border-[#E5E7EB] rounded-md p-6 mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#17613A] mb-1">
              Target Scheme
            </label>
            <select
              value={selectedSchemeId}
              onChange={(e) => setSelectedSchemeId(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded bg-white"
            >
              <option value="all">Check All Schemes</option>
              {schemes.map((s) => (
                <option key={s.id} value={String(s.id)}>
                  {s.shortName} — {s.governmentLevel}
                </option>
              ))}
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
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Other State">Other State (India)</option>
            </select>
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
              Cultivable Land Holding (Acres)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              value={landHoldingAcres}
              onChange={(e) => setLandHoldingAcres(e.target.value)}
              placeholder="e.g., 2.5 (enter 0 if landless)"
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
              placeholder="e.g., Ragi, Paddy, Wheat"
              className="w-full px-3 py-2 text-sm border border-[#E5E7EB] rounded"
            />
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

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-[#303030]/75">
            {profile
              ? 'Pre-filled from your saved Farmer Profile. You can adjust values to test scenarios.'
              : 'Tip: Sign in and complete your Farmer Profile to save your farm details automatically.'}
          </p>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#F47721] hover:bg-[#d96312] disabled:opacity-60 text-white text-sm font-semibold rounded transition-colors"
          >
            {loading ? 'Evaluating...' : 'Check Eligibility'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-[#17613A]">Preliminary Results</h2>

          {results.map((res) => {
            const isEligible = res.status === 'eligible';
            const isMoreInfo = res.status === 'more_info';

            return (
              <div
                key={res.schemeId}
                className="bg-white border border-[#E5E7EB] rounded-md p-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      {isEligible ? (
                        <CheckCircle2 className="w-5 h-5 text-[#207747] shrink-0" />
                      ) : isMoreInfo ? (
                        <HelpCircle className="w-5 h-5 text-[#F47721] shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                      )}
                      <span
                        className={`text-sm font-bold ${
                          isEligible
                            ? 'text-[#17613A]'
                            : isMoreInfo
                            ? 'text-[#F47721]'
                            : 'text-red-700'
                        }`}
                      >
                        {res.headline}
                      </span>
                    </div>
                    <h3 className="mt-1 text-lg font-bold text-[#303030]">
                      {res.schemeName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      to={`/schemes/${res.slug}`}
                      className="px-3.5 py-2 bg-[#17613A] hover:bg-[#207747] text-white text-xs font-semibold rounded"
                    >
                      View Scheme
                    </Link>
                    <a
                      href={res.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#F47721] hover:underline"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {res.reasons.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm text-[#303030] list-disc pl-5">
                    {res.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                )}

                {res.missingFields.length > 0 && (
                  <p className="mt-2 text-xs font-semibold text-[#F47721]">
                    Missing details: {res.missingFields.join(', ')}
                  </p>
                )}

                <p className="mt-3 pt-2.5 border-t border-[#E5E7EB] text-xs text-[#303030]/75">
                  {res.disclaimer}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
